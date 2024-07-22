import React, { useState } from 'react';
import styles from '../styles/Input.module.css';

const Input = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.inputForm}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
        className={styles.inputField}
      />
      <button type="submit" className={styles.sendButton}>Send</button>
    </form>
  );
};

export default Input;
