import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate checking credentials
    if (email === 'user@example.com' && password === 'password123') {
      // If credentials are correct, proceed to the Accounts page
      // The Link will handle the redirect to "/accounts"
    } else {
      alert('Invalid credentials!');
    }
  };

  return (
    <div>
      <h2>Login Page</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        {/* Use Link to navigate to Accounts page if credentials are correct */}
        <Link to="/accounts">
          <button type="submit">Login</button>
        </Link>
      </form>
      
      {/* Back to Home button */}
      <Link to="/">
        <button className="button">Back to Home</button>
      </Link>
    </div>
  );
};

export default Login;
