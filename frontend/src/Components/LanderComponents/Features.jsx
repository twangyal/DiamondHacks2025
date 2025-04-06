import React from 'react';

function Features() {
    return (
        <section id="features" className="py-24 bg-gray-100">
            <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
                        <h3 className="text-2xl font-semibold mb-4 text-green-700">Dynamic Pricing Insights</h3>
                        <p className="text-gray-600">Optimize your product pricing with AI-powered predictions tailored to market conditions.</p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
                        <h3 className="text-2xl font-semibold mb-4 text-green-700">Real-Time Market Analytics</h3>
                        <p className="text-gray-600">Access live data and trends to make informed decisions about your assets and trades.</p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
                        <h3 className="text-2xl font-semibold mb-4 text-green-700">Comprehensive Asset Management</h3>
                        <p className="text-gray-600">Track and manage your products, bookings, and sales, all in one easy-to-use platform.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Features;
