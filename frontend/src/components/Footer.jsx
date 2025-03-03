import React from 'react';
import { FaFacebook, FaInstagramSquare, FaTwitterSquare } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-700 text-white lg:px-16 px-8 lg:pt-12 pb-8">
      

        <div className="flex flex-wrap justify-between items-start gap-10 lg:flex-nowrap">
            <div className="flex flex-col items-start">
                <h2 className="text-3xl font-bold mb-4 text-indigo-400">Baby Bliss</h2>
                <p className="text-sm text-gray-300 max-w-xs">
                Your one-stop destination for high-quality baby products. We’re here to bring joy to you and your little ones.
                </p>
                <div className="flex items-center gap-4 mt-6 ">
                
                    <FaFacebook className="text-white text-lg w-10 h-10 transition-transform duration-300 hover:scale-110 " />
                
                    <FaInstagramSquare className="text-white text-lg w-10 h-10 transition-transform duration-300 hover:scale-110 " />
                
                    <FaTwitterSquare className="text-white text-lg w-10 h-10 transition-transform duration-300 hover:scale-110 " />
                
                </div>
            </div>

          
            <div className="flex flex-col lg:flex-row flex-wrap lg:space-x-12 w-full lg:w-auto">
            
                <div className="mb-6 lg:mb-0">
                    <h4 className="text-xl font-semibold mb-4 text-indigo-400">
                        Collections
                    </h4>
                    <ul className="space-y-2">
                        <Link to="/products">
                        <li className="text-gray-300 hover:text-indigo-400 transition-colors cursor-pointer">
                            Shop
                        </li>
                        </Link>
                        <Link to="/category/girls">
                        <li className="text-gray-300 hover:text-indigo-400 transition-colors cursor-pointer">
                            Girls
                        </li>
                        </Link>
                        <Link to="/category/boys">
                        <li className="text-gray-300 hover:text-indigo-400 transition-colors cursor-pointer">
                            Boys
                        </li>
                        </Link>
                        <Link to="/category/toys">
                        <li className="text-gray-300 hover:text-indigo-400 transition-colors cursor-pointer">
                            Toys
                        </li>
                        </Link>
                        <Link to="/category/footwear">
                        <li className="text-gray-300 hover:text-indigo-400 transition-colors cursor-pointer">
                            Footwear
                        </li>
                        </Link>
                    </ul>
                </div>

            
                <div className="mb-6 lg:mb-0">
                    <h4 className="text-xl font-semibold mb-4 text-indigo-400">
                        Customer Care
                    </h4>
                    <ul className="space-y-2">
                        <li className="text-gray-300">Timing: 10 AM - 7 PM (Mon - Sat)</li>
                        <li className="text-gray-300">Email: BabyBliss@gmail.com</li>
                        <li className="text-gray-300">Call/WhatsApp: +91 9400112833</li>
                    </ul>
                </div>
          </div>
        </div>

        
        <div className="mt-10 border-t border-gray-600 pt-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Baby Bliss. All rights reserved.
        </div>
      
    </footer>
  );
}

export default Footer;
