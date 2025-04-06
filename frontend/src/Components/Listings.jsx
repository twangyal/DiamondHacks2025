import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';

const Listings = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [listings, setListings] = useState([]); // State to hold the explore data
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
                const response = await axios.get('http://localhost:8000/listings', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setListings(response.data); // Assuming you want to set some state with the response data
                console.log('Listings fetched:', response.data); // Log the fetched listings for debugging
            } catch (error) {
                setError('Error fetching items');
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const handleEdit = (id) => {
        if (!id) {
            console.error('No ID provided for edit');
            return;
        }
        navigate(`/edit/${id}`); // Fix for the template literal
    };

    const handleCreate = () => {
        navigate('/create'); // Navigate to the "Create Listing" page
    };

    const handleOptimizePricing = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError('User not authenticated');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/optimize_pricing', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                alert('Pricing optimized successfully!');
                setTimeout(() => {
                    // Redirect to listings page or any other page after successful delete
                    window.location.href = '/listings';
                }, 500);
                
            } else {
                setError('Error optimizing pricing');
            }
        } catch (error) {
            setError('Error optimizing pricing');
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 relative">
            {/* Centered Title */}
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">My Listed Items</h1>
    
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    
            {/* Sidebar Toggle Button */}
            <button
                className={`fixed top-4 right-4 text-2xl text-gray-600 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'opacity-0' : 'opacity-100'}`}
                onClick={toggleSidebar}
            >
                &#9776;
            </button>

            {/* Create New Listing Button */}
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded-full mb-6 hover:bg-blue-700 transition duration-300"
                onClick={handleCreate}
            >
                Create New Listing
            </button>
            <div></div>
            {/* Optimize Pricing Button */}
            <button
                className="bg-green-500 text-white px-4 py-2 rounded-full mb-6 hover:bg-green-700 transition duration-300"
                onClick={handleOptimizePricing}
            >
                Optimize Pricing
            </button>
    
            {/* Table with Listings */}
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2">Name</th>
                        <th className="py-2">Sold</th>
                        <th className="py-2">Saves</th>
                        <th className="py-2">Quantity</th>
                        <th className="py-2">Price</th>
                        <th className="py-2">Last Update</th>
                        <th className="py-2" style={{ width: '150px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {listings.length > 0 ? (
                        listings.map((item) => (
                            <tr key={item.id}>
                                <td className="border-t px-6 py-4">{item.name}</td>
                                <td className="border-t px-6 py-4">{item.sold_quantity}</td>
                                <td className="border-t px-6 py-4">{item.saved_quantity}</td>
                                <td className="border-t px-6 py-4">{item.quantity}</td>
                                <td className="border-t px-6 py-4">${item.current_price}</td>
                                <td className="border-t px-6 py-4">
                                    {item.updated_at ? new Date(item.updated_at).toLocaleString() : 'N/A'}
                                </td>
                                <td className="border-t px-6 py-4">
                                    <button
                                        className="text-blue-500 hover:text-blue-700"
                                        onClick={() => handleEdit(item.id)}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="border-t px-6 py-4 text-center">No Items Found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Listings;
