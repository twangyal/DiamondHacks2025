import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';

const Home = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [explore, setExplore] = useState([]); // State to hold the explore data
    const [error, setError] = useState(''); // State to hold error messages

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
                const response = await axios.get('http://localhost:8000/explore');
                setExplore(response.data); // Assuming you want to set some state with the response data
            } catch (error) {
                setError('Error fetching items');
                console.error(error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6 relative">
            {/* Centered Title */}
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
                Explore Items
            </h1>   
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Sidebar Toggle Button */}
            <button 
                className={`fixed top-4 right-4 text-2xl text-gray-600 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'opacity-0' : 'opacity-100'}`} 
                onClick={toggleSidebar}
            >
                &#9776;
            </button>
            <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2">Name</th>
                                <th className="py-2">Description</th>
                                <th className="py-2">Saved</th>
                                <th className="py-2">Quantity</th>
                                <th className="py-2">Price</th>
                                <th className="py-2">Last Update</th>
                            </tr>
                        </thead>
                        <tbody>
                            {explore.length > 0 ? (
                                explore.map((item) => (
                                    <tr key={item.id}>
                                        <td className="border-t px-6 py-4">{item.name}</td>
                                        <td className="border-t px-6 py-4">{item.description}</td>
                                        <td className="border-t px-6 py-4">{item.saved_quantity}</td>
                                        <td className="border-t px-6 py-4">{item.quantity}</td>
                                        <td className="border-t px-6 py-4">${item.current_price}</td>
                                        <td className="border-t px-6 py-4">{new Date(item.updated_at).toLocaleString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="border-t px-6 py-4 text-center">No Items Found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
        </div>
    );
};


export default Home;