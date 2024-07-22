import React from 'react';
import styles from '../styles/Chat.module.css';
import Message from './Message';

const Chat = ({ messages, onDelete }) => {
  return (
    <div className={styles.chatContainer}>
      {messages.map((msg, index) => (
        <Message key={index} message={msg} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default Chat;
