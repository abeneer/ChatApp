// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import logo from '../asset/logo/logo.png';
// import backgroundVideo from '../asset/video/bg.mp4';
// import styles from '../styles/Register.module.css';

// const Register = () => {
//   const navigate = useNavigate();

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const form = event.target;
//     const name = form.elements.name?.value;
//     const email = form.elements.email?.value;
//     const password = form.elements.password?.value;
//     const confirmPassword = form.elements.confirmPassword?.value;

//     if (!name || !email || !password || !confirmPassword) {
//       alert("All fields are required");
//       return;
//     }

//     if (password !== confirmPassword) {
//       alert("Passwords do not match");
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:5000/api/register', { name, email, password });
//       console.log('Registration successful', response.data);

//       const token = response.data.token;
//       const username = response.data.name;

//       localStorage.setItem('token', token);
//       localStorage.setItem('username', username);

//       navigate('/login');
//     } catch (error) {
//       console.error('Registration failed', error.response?.data?.message || error.message);
//       alert(error.response?.data?.message || 'Registration failed');
//     }
//   };

import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../asset/logo/logo.png';
import backgroundVideo from '../asset/video/bg.mp4';
import styles from '../styles/Register.module.css';

const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const name = form.elements.name?.value;
    const email = form.elements.email?.value;
    const password = form.elements.password?.value;
    const confirmPassword = form.elements.confirmPassword?.value;

    if (!name || !email || !password || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/register', { name, email, password });
      console.log('Registration successful', response.data);
      const token = response.data.token;
      const username = response.data.name;

      localStorage.setItem('token', token);
      localStorage.setItem('username', username);

      // Verify the stored username
      console.log('Stored username:', localStorage.getItem('username'));

      // Navigate to login
      navigate('/login');
    } catch (error) {
      console.error('Registration failed', error.response?.data?.message || error.message);
      alert(error.response?.data?.message || 'Registration failed');
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
        <h2>Register Here</h2>
        <p>To create an account</p>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Name" required />
          <input type="email" name="email" placeholder="Enter Mail" required />
          <input type="password" name="password" placeholder="Enter Password" required />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" required />
          <button type="submit">Sign Up</button>
          <p>Already have an account? <a href="/login">Login In</a></p>
        </form>
      </div>
    </div>
  );
};

export default Register;


