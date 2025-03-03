import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTimes, FaBars } from 'react-icons/fa';

function AdminNavbar() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        console.log('User logged out');
        navigate('/');
    };

    return (
        <div className="h-screen w-50 bg-blue-300 text-white sticky top-0 left-0 shadow-md md:w-60 sm:w-44 text-center">
            <nav className="flex flex-col h-full py-6 relative">
                
                <div className="p-4 md:hidden">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-3xl text-blue-700 focus:outline-none"
                    >
                        {isMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                
                <div
                    className={`flex flex-col flex-1 transition-all duration-300 ${
                        isMenuOpen ? 'block' : 'hidden'
                    } md:block`}
                >
                    
                    {isMenuOpen ? (
                        <h1 className="text-2xl text-blue-700 font-bold mb-5 sm:text-xl">
                            <strong>BABY BLISS</strong>
                        </h1>
                    ) : (
                        <h1 className="hidden md:block text-2xl text-blue-700 font-bold mb-8 sm:text-xl">
                            <strong>BABY BLISS</strong>
                        </h1>
                    )}

                    
                    <div className="px-6">
                        <ul className="space-y-4">
                            <Link to="/admin">
                                <li className="hover:bg-blue-700 px-4 py-2 rounded cursor-pointer text-sm sm:text-lg">
                                    DASHBOARD
                                </li>
                            </Link>
                            <Link to="/adminuser">
                                <li className="hover:bg-blue-700 px-4 py-2 rounded cursor-pointer text-sm sm:text-lg">
                                    USER
                                </li>
                            </Link>
                            <Link to="/adminproduct">
                                <li className="hover:bg-blue-700 px-4 py-2 rounded cursor-pointer text-sm sm:text-lg">
                                    PRODUCT
                                </li>
                            </Link>
                        </ul>
                    </div>
                </div>

                
                <div className={`mt-auto px-6 ${isMenuOpen ? 'block' : 'hidden'} md:block`}>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-700 w-full text-white font-bold py-2 px-4 rounded text-md sm:text-md"
                    >
                        LogOut
                    </button>
                </div>
            </nav>
        </div>
    );
}

export default AdminNavbar;
