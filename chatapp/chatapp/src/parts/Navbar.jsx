import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../asset/logo/logo.png';
import styles from '../styles/Navbar.module.css'
import { logout } from './Utils';

const Navbar = ({username}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(navigate)
  }
  return(
    <div className={styles.navbar}>
      <img className={styles.logo} src={logo} alt="Logo" />
      <span className={styles.username}>{username}</span>
      <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
    </div>

  )
}

export default Navbar;
