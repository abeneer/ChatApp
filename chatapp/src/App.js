
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Register from "./components/Register";
import Login from "./components/Login";
import './styles/Register.module.css';
import Dashboard from './parts/Dashboard';
import ForgotPassword from "./components/ForgotPassword"
import ResetPassword from './components/ResetPassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={ <Login />} />
        <Route path="/" element={ <Register />} />
        <Route path="/dashboard" element={ <Dashboard />} /> 
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password/:token" component={ResetPassword} />
        <Route path="/" exact component={Login} />
      </Routes>
    </Router>
  );
}

export default App;
