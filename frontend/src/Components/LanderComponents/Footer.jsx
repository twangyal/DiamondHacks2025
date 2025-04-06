import React from 'react';

function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-8">
            <div className="flex flex-wrap justify-around text-center">
                <div className="mb-6 md:mb-0">
                    <h4 className="text-lg font-semibold">PriceRight</h4>
                    <p>Maximize your profits with our real-time pricing optimization system.</p>
                </div>
                <div>
                    <h4 className="text-lg font-semibold">Stay Connected</h4>
                    <div className="mt-4">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="p-2 rounded-l-md text-gray-800"
                        />
                        <button className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
            <div className="text-center mt-6 pt-4 border-t border-gray-600">
                © 2024 PaperTradeSim. Built by Tsering Wangyal & Tommy Tran.
            </div>
        </footer>
    );
}

export default Footer;
