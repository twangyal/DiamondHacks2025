import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Login from './Login'; // Import Login component
import Register from './Register'; // Import Register component

const App = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          {/* Display title and description only on the landing page */}
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <h1>Dynamic Pricing Optimizer</h1>
                  <p>
                    Welcome to the Dynamic Pricing Optimizer! This platform helps optimize product prices
                    based on various factors to maximize your profits.
                  </p>
                  <div className="buttons">
                    <Link to="/login">
                      <button className="button">Login</button>
                    </Link>
                    <Link to="/register">
                      <button className="button">Register</button>
                    </Link>
                  </div>
                </>
              }
            />
          </Routes>
        </header>

        {/* Routes for Login and Register Pages */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
