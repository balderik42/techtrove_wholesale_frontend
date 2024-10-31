import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../UserLogin/UserLogin.css';
import AddUser from '../../CustomButtons/addUser';

const URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const UserLogin = ({ onUserLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [addUser, setAddUser] = useState(false); // State to control AddUser modal

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    if (!email || !password) {
      setErrorMessage('Please fill in both fields.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${URL}/retailuserlogin`, { email, password });
      if (response.data.success) {
        localStorage.setItem('isUserAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(response.data.user));
        onUserLogin(response.data.user);
        navigate("/");
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      setErrorMessage('Login failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src="/LOGO2.png" alt="Logo" className="login-logo" />
        <h1>Welcome to TechTrove</h1>
        <p>Experience the best shopping with us. Login to continue!</p>
      </div>
      <div className="login-right">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <button type="submit" disabled={loading} className="login-submit-button">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <button onClick={() => setAddUser(true)} className="signup-button">
          Sign Up
        </button>
      </div>
      
      {/* Conditionally render AddUser modal */}
      <AddUser addUser={addUser} setAddUser={setAddUser} />
    </div>
  );
};

export default UserLogin;
