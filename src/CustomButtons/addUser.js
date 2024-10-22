import React, { useState } from 'react';

import '../CustomButtons/addUser.css'; 
import { authenticateSignup } from '../services/api';

const AddUser =({addUser,setAddUser })=>{

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: ''
      });
      const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFormData(prevData => ({
          ...prevData,
          [id]: value
        }));
      };

      const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Basic form validation
        if (formData.lastName.length < 5) {
          alert('Last Name must be at least 5 characters long.');
          return;
        }
        
        try {
          const response = await authenticateSignup(formData);
          if (response) {
            console.log('Signup successful:', response);
            setAddUser(false); // Close the modal
          } else {
            console.log('Signup failed: No response from server');
            alert('Signup failed! Check console for more details.');
          }
        } catch (error) {
          console.error('Error during signup:', error);
          alert('Signup failed due to a server error. Please try again.');
        }
      };

    const handleClose = ()=>{
        setAddUser(false);
    }

    if (!addUser) return null; 
    
    return(
        <div className="add-user-modal">
        <div className="modal-content">
          <h2>Add User</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="firstName">First Name:</label>
              <input id="firstName" type="text" value={formData.firstName} onChange={handleInputChange} placeholder="Enter First Name" />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name:</label>
              <input id="lastName" type="text" value={formData.lastName} onChange={handleInputChange} placeholder="Enter Last Name" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Enter Email" />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number:</label>
              <input id="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="Enter Phone Number" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input id="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="Enter Password" />
            </div>
            <button type="submit" className="submit-button">Submit</button>
          </form>
          <button className="close-button" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    )

}

export default AddUser