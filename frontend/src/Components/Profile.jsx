import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';

const ProfilePage = () => {
    const [activeSection, setActiveSection] = useState('personalInfo');  // Track active section
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [listings, setListings] = useState([]);
    const [transactions, setTransactions] = useState([]); 
    const [error, setError] = useState('');

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
                const response = await axios.get('http://localhost:8000/transactions', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setTransactions(response.data); // Assuming you want to set some state with the response data
            } catch (error) {
                setError('Error fetching items');
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const user = {
        username: "JohnDoe",
        email: "john.doe@example.com",
        profilePic: "https://www.w3schools.com/w3images/avatar2.png", // Add a URL to your profile picture
        listings: listings.length > 0 ? listings : [],
        transactions: transactions.length > 0 ? transactions : []
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'personalInfo':
                return <PersonalInformation user={user} />;
            case 'transactions':
                return <Transactions transactions={user.transactions} />;
            case 'paymentMethod':
                return <PaymentMethod />;
            case 'settings':
                return <Settings />;
            default:
                return <PersonalInformation user={user} />;
        }
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar 
                isOpen={sidebarOpen} 
                onClose={() => setSidebarOpen(false)} 
                user={user} // Pass user data to the sidebar if needed
            />
            {/* Sidebar Toggle Button */}
            <button 
                className={`fixed top-4 right-4 text-2xl text-gray-600 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'opacity-0' : 'opacity-100'}`} 
                onClick={toggleSidebar}
            >
                &#9776;
            </button>
            
            <div className="w-64 bg-gray-800 text-white p-6 flex flex-col justify-between">
                {/* User Info at the top */}
                <div className="flex items-center space-x-4 mb-8">
                    <img src={user.profilePic} alt="User Profile" className="w-16 h-16 rounded-full" />
                    <div>
                        <h2 className="text-xl font-semibold">{user.username}</h2>
                    </div>
                </div>
                {/* Navigation */}
                <nav className="flex h-screen flex-col space-y-10">
                    <button
                        className="block py-2 px-4 hover:bg-gray-700 rounded" // Ensure the first button has no margin-top
                        onClick={() => setActiveSection('personalInfo')}
                    >
                        Personal Information
                    </button>
                    <button
                        className="block py-2 px-4 hover:bg-gray-700 rounded"
                        onClick={() => setActiveSection('transactions')} // Change to 'transactions' to match the section
                    >
                        Transactions
                    </button>
                    <button
                        className="block py-2 px-4 hover:bg-gray-700 rounded"
                        onClick={() => setActiveSection('paymentMethod')}
                    >
                        Payment Method
                    </button>
                    <button
                        className="block py-2 px-4 hover:bg-gray-700 rounded"
                        onClick={() => setActiveSection('settings')}
                    >
                        Settings
                    </button>
                </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 overflow-y-auto">
                {renderSection()}
            </div>
        </div>
    );
};

// Personal Information Section
const PersonalInformation = ({ user }) => (
    <div>
        <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
        <div className="space-y-4">
            <div>
                <strong>Username:</strong> {user.username}
            </div>
            <div>
                <strong>Email:</strong> {user.email}
            </div>
        </div>
    </div>
);


// Transactions Section
const Transactions = ({ transactions }) => (
    <div>
        <h2 className="text-2xl font-semibold mb-4">Transactions</h2>
        <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2">Name</th>
                                <th className="py-2">Quantity</th>
                                <th className="py-2">Price</th>
                                <th className="py-2">Total</th>
                                <th className="py-2">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length > 0 ? (
                                transactions.map((item) => (
                                    <tr key={item.id}>
                                        <td className="border-t px-6 py-4">{item.name}</td>
                                        <td className="border-t px-6 py-4">{item.quantity_sold}</td>
                                        <td className="border-t px-6 py-4">{item.price}</td>
                                        <td className="border-t px-6 py-4">{item.total}</td>
                                        <td className="border-t px-6 py-4">{new Date(item.sold_at).toLocaleString()}</td>
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

// Payment Method Section
const PaymentMethod = () => (
    <div>
        <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
        <div>Payment method details go here.</div>
    </div>
);

// Settings Section
const Settings = () => (
    <div>
        <h2 className="text-2xl font-semibold mb-4">Settings</h2>
        <div>Settings options go here.</div>
    </div>
);

export default ProfilePage;