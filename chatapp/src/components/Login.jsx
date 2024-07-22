

import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../asset/logo/logo.png';
import backgroundVideo from '../asset/video/bg.mp4';
import styles from '../styles/Register.module.css';

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.elements.email.value;
    const password = form.elements.password.value;

    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      console.log('Login successful', response.data);
      const token = response.data.token;
      const username = response.data.name;

      localStorage.setItem('token', token);
      localStorage.setItem('username', username);

      // Verify the stored username
      console.log('Stored username:', localStorage.getItem('username'));

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed', error.response?.data?.message || error.message);
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className={styles.parentContainer}>
      <video className={styles.backgroundVideo} autoPlay muted loop>
        <source src={backgroundVideo} type="video/mp4" />
      </video>
      <div className={styles.container}>
        <h1>Hey Chatt</h1>
        <img className={styles.applogo} src={logo} alt="hey chat" />
        <h2>Sign In</h2>
        <p>To access your account</p>
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Enter Mail" required />
          <input type="password" name="password" placeholder="Enter Password" required />
          <button type="submit">Sign In</button>
          <p>Don't have an account? <a href="/">Register Here</a></p>
          <p><a href="/forgot-password">Forgot Password?</a></p>

      </form>
    </div>
    </div >
  );
};

export default Login;


