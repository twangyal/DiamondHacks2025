import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
        onClose();
    };
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        navigate('/login');
    };

    return (
        <div className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}>
            <div className="p-6">
                <button className="absolute top-4 right-4 text-xl" onClick={onClose}>X</button>
                <div className="mt-8">
                    <button onClick={() => handleNavigate('/home')} className="block w-full text-left py-2 px-4 hover:bg-gray-200">Home</button>
                    <button onClick={() => handleNavigate('/profile')} className="block w-full text-left py-2 px-4 hover:bg-gray-200">Profile</button>
                    <button onClick={() => handleNavigate('/saved')} className="block w-full text-left py-2 px-4 hover:bg-gray-200">Saved</button>
                    <button onClick={() => handleNavigate('/listings')} className="block w-full text-left py-2 px-4 hover:bg-gray-200">Listings</button>
                    <button onClick={() => handleLogout()} className="block w-full text-left py-2 px-4 hover:bg-gray-200">Log Out</button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
