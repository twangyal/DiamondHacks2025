import React from 'react';

function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800 text-white px-10 py-4 flex items-center shadow-md">
            <div className="text-2xl font-bold">PriceRight</div>
            <nav className="flex-1 flex justify-end space-x-28 text-lg">
                <a href="#features" className="hover:underline">Features</a>
                <a href="#faq" className="hover:underline">FAQs</a>
                <a href="#contact" className="hover:underline">Contact</a>
            </nav>
        </header>
    );
}

export default Header;
