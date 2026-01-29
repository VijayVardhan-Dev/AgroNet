import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../routing/routes';
import { Leaf, ArrowRight } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col">

            {/* --- Navbar --- */}
            <nav className="w-full max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="bg-green-100 p-2 rounded-lg">
                        <Leaf className="w-6 h-6 text-green-700" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-green-900">AgroNet</span>
                </div>

                <div className="flex items-center gap-6">
                    <Link to={ROUTES.LOGIN} className="text-sm font-medium text-gray-600 hover:text-green-700 transition-colors">
                        Log In
                    </Link>
                    <Link
                        to={ROUTES.REGISTER}
                        className="px-5 py-2.5 bg-green-700 text-white text-sm font-medium rounded-full hover:bg-green-800 transition-all shadow-sm hover:shadow-md"
                    >
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* --- Hero Section --- */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-4 mt-8 mb-16 max-w-4xl mx-auto">
                <span className="inline-block py-1 px-3 rounded-full bg-green-50 text-green-700 text-xs font-bold tracking-wide mb-6 border border-green-100">
                    DIRECT FARM-TO-MARKET
                </span>

                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                    Sell your harvest. <br />
                    <span className="text-green-700">Buy in bulk.</span>
                </h1>

                <p className="text-lg text-gray-500 mb-10 max-w-2xl leading-relaxed">
                    AgroNet connects farmers directly with bulk buyers, eliminating middlemen.
                    Get the best market rates for your crops or source fresh produce efficiently.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-16">
                    <Link
                        to={ROUTES.REGISTER}
                        className="px-8 py-4 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-200"
                    >
                        I'm a Farmer
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                        to={ROUTES.REGISTER}
                        className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold hover:border-green-600 hover:text-green-700 transition-all flex items-center justify-center"
                    >
                        I'm a Buyer
                    </Link>
                </div>


            </main>


        </div>
    );
};

export default LandingPage;
