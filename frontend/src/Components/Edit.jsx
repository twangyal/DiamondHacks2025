import { useParams } from 'react-router-dom'; // Import useParams
import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';

function Edit() {
    const { id } = useParams(); // Get the 'id' from the URL
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [info, setInfo] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
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
                const response = await axios.get(`http://localhost:8000/item/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setInfo(response.data); // Assuming you want to set some state with the response data
                console.log(response.data); // For debugging purposes, log the fetched data
            } catch (error) {
                setError('Error fetching items');
                console.error(error);
            }
        };
        fetchData();
    }, [id]);

    const handleDelete = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError('User not authenticated');
            return;
        }

        try {
            const response = await axios.delete(`http://localhost:8000/item/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setSuccess('Listing deleted successfully!');
                setTimeout(() => {
                    // Redirect to listings page or any other page after successful delete
                    window.location.href = '/listings';
                }, 500);
            }
        } catch (error) {
            setError('Error deleting item');
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Frontend Validation
        if (!info.name) {
            setError('Product name cannot be empty');
            return;
        }
        if (info.quantity < 1) {
            setError('Product quantity must be at least 1');
            return;
        }
        if (info.min_price && info.max_price && info.min_price > info.max_price) {
            setError('Minimum price cannot be greater than maximum price');
            return;
        }
        if (info.startprice <= 0) {
            setError('Start price must be greater than zero');
            return;
        }

        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError('User not authenticated');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:8000/item/${id}`, info, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                setSuccess('Listing updated successfully!');
                setTimeout(() => {
                    // Redirect to listings page or any other page after successful delete
                    window.location.href = '/listings';
                }, 500);
            }
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response.data);
                setError(error.response.data.message || 'Error updating listing');
            } else {
                console.error('Error:', error);
                setError('An unexpected error occurred');
            }
        }
    }

    return (
        <div>
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            {/* Sidebar Toggle Button */}
            <button 
                className={`fixed top-4 right-4 text-2xl text-gray-600 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'opacity-0' : 'opacity-100'}`} 
                onClick={toggleSidebar}>
                &#9776;
            </button>
        <div className="edit-container max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-semibold mb-6">Edit Listing</h1>
    
            {error && <p className="text-red-600 mb-4">{error}</p>}
            {success && <p className="text-green-600 mb-4">{success}</p>}
    
            {info ? (
                <form className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title:</label>
                        <input
                            id="title"
                            type="text"
                            value={info.name}
                            onChange={(e) => setInfo({ ...info, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
    
                    <div className="space-y-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description:</label>
                        <textarea
                            id="description"
                            value={info.description || ""}
                            onChange={(e) => setInfo({ ...info, description: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                        />
                    </div>
    
                    <div className="space-y-2">
                        <label htmlFor="startprice" className="block text-sm font-medium text-gray-700">Starting Price:</label>
                        <input
                            id="startprice"
                            type="number"
                            value={info.startprice}
                            onChange={(e) => setInfo({ ...info, startprice: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
    
                    <div className="space-y-2">
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity:</label>
                        <input
                            id="quantity"
                            type="number"
                            value={info.quantity}
                            onChange={(e) => setInfo({ ...info, quantity: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
    
                    <div className="space-y-2">
                        <label htmlFor="min_price" className="block text-sm font-medium text-gray-700">Minimum Price:</label>
                        <input
                            id="min_price"
                            type="number"
                            value={info.min_price}
                            onChange={(e) => setInfo({ ...info, min_price: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
    
                    <div className="space-y-2">
                        <label htmlFor="max_price" className="block text-sm font-medium text-gray-700">Maximum Price:</label>
                        <input
                            id="max_price"
                            type="number"
                            value={info.max_price}
                            onChange={(e) => setInfo({ ...info, max_price: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
    
                    <button onClick={handleSubmit}
                        type="submit"
                        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
                    >
                        Save Changes
                    </button>
                </form>
                
            ) : (
                <p>Loading...</p>
            )}
            {/* Delete Listing Button */}
            <div className="mt-6 text-center">
                <button 
                onClick={handleDelete}
                className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                Delete Listing
                </button>
            </div>
            <div className="stats-container mt-8 p-4 bg-gray-50 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Statistics</h2>
                {info && (
                    <ul className="space-y-2">
                        <li><strong>Saved Quantity:</strong> {info.saved_quantity}</li>
                        <li><strong>Sold Quantity:</strong> {info.sold_quantity}</li>
                        <li><strong>Volume:</strong> {info.volume}</li>
                        <li><strong>Current Price:</strong> ${info.current_price}</li>
                        <li><strong>Created At:</strong> {new Date(info.created_at).toLocaleString()}</li>
                        <li><strong>Updated At:</strong> {new Date(info.updated_at).toLocaleString()}</li>
                    </ul>
                )}
            </div>

            
        </div>
        </div>
    );
}

export default Edit;
