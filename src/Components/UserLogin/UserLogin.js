import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios'; // Import Axios for API requests
import '../UserLogin/UserLogin.css' // Import custom CSS for styling

const URL =  process.env.REACT_APP_API_URL || 'http://localhost:8000'
const UserLogin = ({ onUserLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message
    setLoading(true); // Set loading state

    // Basic validation
    if (!email || !password) {
      setErrorMessage('Please fill in both fields.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${URL}/userlogin`, {
        email,
        password,
      });

      if (response.data.success) {
        // Store user info in localStorage
        localStorage.setItem('isUserAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user info
      
        console.log('User data saved:', response.data.user); // Check the saved user data
        onUserLogin(response.data.user);
        navigate("/"); // Redirect to home page on successful login
      } else {
        setErrorMessage(response.data.message); // Set error message
      }
    } catch (error) {
      setErrorMessage('Login failed: ' + error.message); // Set error message
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src="/LOGO2.png" alt="Logo" className="login-logo" /> {/* Logo */}
        <h1>Welcome to Entrevo</h1> {/* Catchy Text */}
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
          {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Display error message */}
          <button type="submit" disabled={loading} className="login-submit-button">
            {loading ? 'Logging in...' : 'Login'}
          </button> {/* Disable button when loading */}
        </form>
      </div>
    </div>
  );
};

export default UserLogin;
