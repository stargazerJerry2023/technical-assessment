import React, { useState } from 'react';
import axios from 'axios';
import './Community.css';

const Community = ({ onMemberAdded }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const backend_Server = import.meta.env.VITE_API_backend_Server;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name && email) {
      try {
        const response = await axios.post(backend_Server, { name, email });
        onMemberAdded(response.data);
        setName('');
        setEmail('');
      } catch (error) {
        console.error('Error adding member:', error);
      }
    }
  };

  return (
    <div className="community-container">
      <h2>Join the Community</h2>
      <form onSubmit={handleSubmit} className="community-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">Join</button>
      </form>
    </div>
  );
};

export default Community;