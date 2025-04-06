import React from 'react';

function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">How It Works</h2>
                <div className="space-y-10">
                    <div className="flex items-start justify-start space-x-6">
                        <div className="w-16 h-16 bg-green-700 text-white flex items-center justify-center rounded-full shadow-md">
                            <span className="text-2xl font-semibold">1</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold text-green-700 mb-4">Create an Account</h3>
                            <p className="text-gray-600">Sign up in seconds to get started with buying and selling assets.</p>
                        </div>
                    </div>
                    <div className="flex items-start justify-start space-x-6">
                        <div className="w-16 h-16 bg-green-700 text-white flex items-center justify-center rounded-full shadow-md">
                            <span className="text-2xl font-semibold">2</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold text-green-700 mb-4">Sell Items & Find Best Prices</h3>
                            <p className="text-gray-600">List your items and use AI-powered tools to determine the best prices.</p>
                        </div>
                    </div>
                    <div className="flex items-start justify-start space-x-6">
                        <div className="w-16 h-16 bg-green-700 text-white flex items-center justify-center rounded-full shadow-md">
                            <span className="text-2xl font-semibold">3</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold text-green-700 mb-4">Explore Other Items & Place on Hold</h3>
                            <p className="text-gray-600">Browse through other items and place them on hold for up to a week.</p>
                        </div>
                    </div>
                    <div className="flex items-start justify-start space-x-6">
                        <div className="w-16 h-16 bg-green-700 text-white flex items-center justify-center rounded-full shadow-md">
                            <span className="text-2xl font-semibold">4</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold text-green-700 mb-4">Buy It & Have Fun!</h3>
                            <p className="text-gray-600">Complete the purchase and enjoy your assets!</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;
