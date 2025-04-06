import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';

const Dashboard = () => {
    
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setError('User not authenticated');
                return;
            }
            try {
                // Fetch user data
                const response = await axios.get('http://localhost:8000/user_data', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUser(response.data.username);
                setBalance(response.data.balance);
                setShortLiability(response.data.short_liability);
                setNetValue(response.data.networth);
                console.log(response.data);
            } catch (error) {
                setError('Error fetching user data');
                console.error(error);
            }
            try {
                const response = await axios.get('http://localhost:8000/portfolio', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setPortfolio(response.data);
                console.log(response.data);
            } catch (error) {
                setError('Error fetching portfolio');
                console.error(error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6 relative">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Sidebar Toggle Button */}
            <button 
                className={`fixed top-4 right-4 text-2xl text-gray-600 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'opacity-0' : 'opacity-100'}`} 
                onClick={toggleSidebar}
            >
                &#9776;
            </button>
        </div>
    );
};


export default Dashboard;