import React from 'react';

function FAQ() {
    return (
        <section id="faq" className="py-24 bg-gray-100">
            <div className="max-w-5xl mx-auto px-6">
                <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Frequently Asked Questions</h2>
                <div className="space-y-12">
                    <div className="flex flex-col md:flex-row items-start justify-start space-y-4 md:space-y-0 md:space-x-6">
                        <div className="w-1/4 md:w-1/5 bg-green-700 text-white text-xl font-semibold flex items-center justify-center rounded-full h-12 mb-2 md:mb-0">Q1</div>
                        <div>
                            <h4 className="text-2xl font-semibold text-green-700 mb-3">What is the purpose of this platform?</h4>
                            <p className="text-gray-600">This platform allows users to buy and sell items in a marketplace, using AI to predict the best pricing for each item.</p>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-start justify-start space-y-4 md:space-y-0 md:space-x-6">
                        <div className="w-1/4 md:w-1/5 bg-green-700 text-white text-xl font-semibold flex items-center justify-center rounded-full h-12 mb-2 md:mb-0">Q2</div>
                        <div>
                            <h4 className="text-2xl font-semibold text-green-700 mb-3">How does the AI-driven pricing work?</h4>
                            <p className="text-gray-600">The AI model analyzes historical data and other factors to predict the optimal price for an item. It ensures you get the best price when listing or buying products.</p>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-start justify-start space-y-4 md:space-y-0 md:space-x-6">
                        <div className="w-1/4 md:w-1/5 bg-green-700 text-white text-xl font-semibold flex items-center justify-center rounded-full h-12 mb-2 md:mb-0">Q3</div>
                        <div>
                            <h4 className="text-2xl font-semibold text-green-700 mb-3">Is the platform free to use?</h4>
                            <p className="text-gray-600">Yes! It is completely free to sign up, list items, and access AI-driven pricing insights.</p>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-start justify-start space-y-4 md:space-y-0 md:space-x-6">
                        <div className="w-1/4 md:w-1/5 bg-green-700 text-white text-xl font-semibold flex items-center justify-center rounded-full h-12 mb-2 md:mb-0">Q4</div>
                        <div>
                            <h4 className="text-2xl font-semibold text-green-700 mb-3">Can I place items on hold?</h4>
                            <p className="text-gray-600">Yes! You can place items on hold for up to one week, giving you time to decide before finalizing the purchase.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default FAQ;
