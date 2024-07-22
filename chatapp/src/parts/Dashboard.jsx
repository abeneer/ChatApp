import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import io from 'socket.io-client';
import styles from '../styles/Dashboard.module.css';
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Chats from "./Chats";
import Chat from "./Chat";
import Input from "./Input";
import Search from "./Search";

const socket = io('http://localhost:5000');

const Dashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    console.log('Retrieved username:', storedUsername);

    if (!token || !storedUsername) {
      navigate('/login');
    } else {
      setUsername(storedUsername);
    }

    socket.on('message', (message) => {
      if ((message.sender === username && message.receiver === currentChat) || 
          (message.sender === currentChat && message.receiver === username)) {
        setMessages(prevMessages => [...prevMessages, message]);
      }
    });

    return () => {
      socket.off('message');
    };
  }, [navigate, username, currentChat]);

  const handleSendMessage = async (message) => {
    const token = localStorage.getItem('token');

    if (!message.trim() || !currentChat) {
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/messages',
        { sender: username, receiver: currentChat, message },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setMessages([...messages, response.data]);
      setSearchResults([]);

    } catch (error) {
      console.error('Error sending message:', error.response?.data?.message || error.message);
      alert('Failed to send message');
    }
  };

  const handleDeleteMessage = async (id) => {
    const token = localStorage.getItem('token');
    
    try {
      await axios.delete(`http://localhost:5000/api/messages/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setMessages(messages.filter(msg => msg.id !== id));
      setSearchResults(searchResults.filter(msg => msg.id !== id));

    } catch (error) {
      console.error('Error deleting message:', error.response?.data?.message || error.message);
      alert('Failed to delete message');
    }
  };

  const handleSearch = (query) => {
    console.log('Searching for:', query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const filteredMessages = messages.filter(msg =>
      msg.message.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(filteredMessages);
  };

  const handleSelectUser = async (user) => {
    setCurrentChat(user);
    await loadMessages(user);
  };

  const loadMessages = async (user) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/messages/${username}/${user}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading messages:', error.response?.data?.message || error.message);
      alert('Failed to load messages');
    }
  };

  return (
    <div className={styles.dashboard}>
      <Navbar username={username} />
      <div className={styles.container}>
        <Sidebar username={username} onSelectUser={handleSelectUser} onSearch={handleSearch} />
        <div className={styles.main}>
          <Search onSearch={handleSearch} />
          {/* <Chats /> */}
          <Chat messages={searchResults.length > 0 ? searchResults : messages} onDelete={handleDeleteMessage} />
          <Input onSend={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
