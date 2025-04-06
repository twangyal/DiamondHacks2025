import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const CreateListing = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startprice: 0,
        quantity: 1,
        min_price: 0,
        max_price: 0,
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Frontend Validation
        if (!formData.name) {
            setError('Product name cannot be empty');
            return;
        }
        if (formData.quantity < 1) {
            setError('Product quantity must be at least 1');
            return;
        }
        if (formData.min_price && formData.max_price && formData.min_price > formData.max_price) {
            setError('Minimum price cannot be greater than maximum price');
            return;
        }
        if (formData.startprice <= 0) {
            setError('Start price must be greater than zero');
            return;
        }
    
        // Proceed with the API call if validation passes
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError('User not authenticated');
            return;
        }
    
        console.log('Form Data:', formData); // Log the form data to check its structure
    
        try {
            const response = await axios.post('http://localhost:8000/create_product', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.status === 201) {
                setSuccess('Listing created successfully!');
                navigate('/listings');
            }
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response.data); // Log the response data
                setError('Error creating listing. Please try again.');
            } else {
                console.error('Error:', error.message); // Log the error message
                setError('Error creating listing. Please try again.');
            }
        }
    };
    
    

    return (
        <div className="min-h-screen bg-gray-100 p-6 relative">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            {/* Sidebar Toggle Button */}
            <button 
                className={`fixed top-4 right-4 text-2xl text-gray-600 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'opacity-0' : 'opacity-100'}`} 
                onClick={toggleSidebar}
            >&#9776;</button>
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Create a New Listing</h1>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {success && <p className="text-green-500 text-center mb-4">{success}</p>}

            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="name">
                        Name:
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="description">
                        Description:
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md"
                    ></textarea>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="startprice">
                        Starting Price:
                    </label>
                    <input
                        type="number"
                        id="startprice"
                        name="startprice"
                        value={formData.startprice}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="quantity">
                        Quantity:
                    </label>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="min_price">
                        Minimum Price:
                    </label>
                    <input
                        type="number"
                        id="min_price"
                        name="min_price"
                        value={formData.min_price}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="max_price">
                        Maximum Price:
                    </label>
                    <input
                        type="number"
                        id="max_price"
                        name="max_price"
                        value={formData.max_price}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md"
                    />
                </div>

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-full w-full hover:bg-blue-700 transition duration-300">
                    Create Listing
                </button>
            </form>
        </div>
    );
};

export default CreateListing;
