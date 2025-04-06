import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';

const Saved = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [bookings, setBookings] = useState([]); // State to hold the explore data
    const [error, setError] = useState(''); // State to hold error messages

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleDelete = async ({booking_id}) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError('User not authenticated');
            return;
        }
        console.log('Deleting booking with ID:', booking_id); // Log the booking_id for debugging
        console.log(bookings)
        try {
            const response = await axios.delete(`http://localhost:8000/book/${booking_id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setSuccess('Booking deleted successfully!');
                setTimeout(() => {
                    // Redirect to listings page or any other page after successful delete
                    navigate('/saved');
                }, 500);
            }
        } catch (error) {
            setError('Error deleting item');
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setError('User not authenticated');
                return;
            }
            try {
                const response = await axios.get('http://localhost:8000/booked', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setBookings(response.data); // Assuming you want to set some state with the response data
                console.log('Bookings fetched:', response.data); // Log the fetched bookings for debugging
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
                My Booked Items
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
                                <th className="py-2">Locked Price</th>
                                <th className="py-2">Current Price</th>
                                <th className="py-2">Items Remaining</th>
                                <th className="py-2">Date Booked</th>
                                <th className="py-2">Days Till Expiry</th>
                                <th className="py-2" style={{ width: '150px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.length > 0 ? (
                                bookings.map((item) => (
                                    <tr key={item.booking_id}>
                                        <td className="border-t px-6 py-4">{item.name}</td>
                                        <td className="border-t px-6 py-4">{item.locked_price}</td>
                                        <td className="border-t px-6 py-4">{item.current_price}</td>
                                        <td className="border-t px-6 py-4">{item.quantity}</td>
                                        <td className="border-t px-6 py-4">{new Date(item.bookingdate).toLocaleString()}</td>
                                        <td className="border-t px-6 py-4">
                                            {
                                                // Calculate days till expiry (expires in 7 days from booking date)
                                                (() => {
                                                    const bookingDate = new Date(item.bookingdate);
                                                    const expiryDate = new Date(bookingDate);
                                                    expiryDate.setDate(expiryDate.getDate() + 6); // Assuming 7 days expiry
                                                    const diffTime = Math.abs(expiryDate - new Date());
                                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                                    return diffDays > 0 ? diffDays : 'Expired';
                                                })()
                                            }
                                        </td>
                                        <td className="border-t px-6 py-4">
                                        <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(item.booking_id)}>Delete</button>
                                        </td>
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


export default Saved;