import React, { useState } from 'react';
import styles from '../styles/Message.module.css';
import ContextMenu from './ContextMenu';

const Message = ({ message, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const isSent = message.sender === localStorage.getItem('username');

  const handleRightClick = (event) => {
    event.preventDefault();
    setShowMenu(true);
    setMenuPosition({ x: event.clientX, y: event.clientY });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.message);
    setShowMenu(false);
  };

  const handleDelete = () => {
    onDelete(message.id);
    setShowMenu(false);
  };

  return (
    <div onContextMenu={handleRightClick} className={isSent ? styles.sent : styles.received}>
      <p><strong>{message.sender}:</strong> {message.message}</p>
      <p className={styles.timestamp}>{new Date(message.timestamp).toLocaleTimeString()}</p>
      {showMenu && <ContextMenu position={menuPosition} onCopy={handleCopy} onDelete={handleDelete} />}
    </div>
  );
};

export default Message;
