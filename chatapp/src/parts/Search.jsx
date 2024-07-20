import React from 'react';
import styles from '../styles/Search.module.css';

const Search = ({ onSearch }) => {
  return (
    <div className={styles.search}>
      <input
        type="text"
        placeholder="Search..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default Search;
