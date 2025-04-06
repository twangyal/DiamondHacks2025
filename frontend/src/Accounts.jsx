import React from 'react';
import { Link } from 'react-router-dom';

const Accounts = () => {
  return (
    <div className="accounts-page">
      <h2>Your Accounts</h2>
      
      <div className="columns">
        <div className="column">
          <h3>Account 1</h3>
          <p>Some details about Account 1.</p>
          <Link to="/account1">
            <button className="button">Go to Account 1</button>
          </Link>
        </div>
        
        <div className="column">
          <h3>Account 2</h3>
          <p>Some details about Account 2.</p>
          <Link to="/account2">
            <button className="button">Go to Account 2</button>
          </Link>
        </div>
        
        <div className="column">
          <h3>Account 3</h3>
          <p>Some details about Account 3.</p>
          <Link to="/account3">
            <button className="button">Go to Account 3</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Accounts;
