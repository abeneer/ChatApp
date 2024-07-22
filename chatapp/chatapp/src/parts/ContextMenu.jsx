import React from 'react';
import styles from '../styles/ContextMenu.module.css';

const ContextMenu = ({ position, onCopy, onDelete }) => {
  return (
    <div className={styles.contextMenu} style={{ top: position.y, left: position.x }}>
      <button onClick={onCopy}>Copy</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
};

export default ContextMenu;
