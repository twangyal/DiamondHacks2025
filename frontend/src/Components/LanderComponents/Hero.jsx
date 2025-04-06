import React from 'react';
import { useNavigate } from 'react-router-dom';

function Hero() {
    const navigate = useNavigate();

    return (
        <section
            className="relative text-center py-48 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('/StockImage.jpg')` }}
        >
            <div className="absolute inset-0 bg-black/70"></div>
            <div className="relative z-10 max-w-4xl mx-auto px-6">
                <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg">
                    Price Your Stores in Real-time
                </h1>
                <p className="text-xl md:text-2xl text-white mb-10 drop-shadow-md">
                    Find great deals for both buyer and seller
                </p>
                <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium py-3 px-8 rounded-full transition duration-300"
                        onClick={() => navigate('/login')}
                    >
                        Start Shopping
                    </button>
                    
                </div>
            </div>
        </section>
    );
}

export default Hero;
