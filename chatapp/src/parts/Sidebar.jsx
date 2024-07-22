import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Sidebar.module.css';
import Search from './Search';

const Sidebar = ({ username, onSelectUser,onSearch }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        const otherUsers = response.data.filter(user => user.name !== username);
        setUsers(otherUsers);
      } catch (error) {
        console.error('Error fetching users:', error.response?.data?.message || error.message);
        alert('Failed to fetch users');
      }
    };

    fetchUsers();
  }, [username]);

  return (
    <div className={styles.Sidebar}>
      <h2>Chats</h2>
      <Search onSearch={onSearch}/>
      <ul>
        {users.map(user => (
          <li key={user.email} onClick={() => onSelectUser(user.name)} className={styles.userItem}>
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
