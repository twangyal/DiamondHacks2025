import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div>
      <h2>Register Page</h2>
      <form>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Register</button>
      </form>
      
      {/* Back to Home button */}
      <Link to="/">
        <button className="button">Back to Home</button>
      </Link>
    </div>
  );
};

export default Register;
