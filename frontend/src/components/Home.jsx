import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

function Home() {
    const navigate = useNavigate();

    function Shopclick() {
        navigate('/products');
    }

    const categories = ['Girls', 'Boys', 'Toys', 'Footwear'];
    const paths = ['/category/girls', '/category/boys', '/category/toys', '/category/footwear'];

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            
            <div className="bg-gray-200 py-6 shadow-md pt-12">
                <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-4 sm:gap-8 text-sm sm:text-lg text-gray-700 mt-8">
                    {categories.map((category, index) => (
                        <Link
                            key={index}
                            to={paths[index]}
                            className="hover:text-indigo-600 transition duration-300 font-semibold"
                        >
                            {category}
                        </Link>
                    ))}
                </div>
            </div>

            
            <div
                className="relative h-[80vh] sm:h-screen bg-cover bg-center flex items-center justify-center sm:justify-end px-4 sm:px-12"
                style={{ backgroundImage: "url('backgroundimage.jpg')" }}
            >
                {/* Overlay for subtle effect */}
                <div className="absolute inset-0 bg-white opacity-10"></div>

                {/* Content Wrapper */}
                <div className="relative z-10 text-center sm:text-right text-white max-w-xs sm:max-w-md md:max-w-lg">
                    <h1 className="text-lg sm:text-3xl md:text-4xl font-extrabold mb-3 sm:mb-4 text-white leading-tight">
                        Discover the Best <br className="hidden sm:block" /> Baby Products!
                    </h1>
                    <p className="text-xs sm:text-lg md:text-xl mb-4 sm:mb-6 text-pink-900">
                        <strong>Shop affordable & high-quality products for your little one.</strong>
                    </p>
                    <button
                        className="bg-pink-600 py-2 px-6 sm:py-3 sm:px-8 rounded-lg text-sm sm:text-lg shadow-lg hover:bg-pink-700 transition-transform transform hover:scale-105"
                        onClick={Shopclick}
                    >
                        Shop Now
                    </button>
                </div>
            </div>


            
            <div className="max-w-7xl mx-auto mt-16 text-center pb-14 px-4">
                <h1 className="text-xl sm:text-3xl font-bold mb-8 text-gray-800">Explore Our Collection</h1>
                <div className="flex justify-center flex-wrap gap-6 sm:gap-12">
                    
                    <div className="flex flex-col items-center">
                        <img
                            src="https://www.menmoms.in/cdn/shop/files/Mask_Group_22_2x_4f3c5b4c-0dda-448a-9732-a8f2fc6f0d85.webp?v=1711540655&width=400"
                            alt="Girls"
                            className="w-28 h-28 sm:w-40 sm:h-40 rounded-full object-cover shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                            onClick={() => navigate('/category/girls')}
                        />
                        <p className="mt-4 font-semibold text-sm sm:text-lg">Girls</p>
                    </div>

                    
                    <div className="flex flex-col items-center">
                        <img
                            src="https://www.menmoms.in/cdn/shop/files/Mask_Group_23.webp?v=1711540655&width=400"
                            alt="Boys"
                            className="w-28 h-28 sm:w-40 sm:h-40 rounded-full object-cover shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                            onClick={() => navigate('/category/boys')}
                        />
                        <p className="mt-4 font-semibold text-sm sm:text-lg">Boys</p>
                    </div>

                    
                    <div className="flex flex-col items-center">
                        <img
                            src="https://www.menmoms.in/cdn/shop/files/Shop-By-Category-TOYS-01.png?v=1727785740&width=400"
                            alt="Toys"
                            className="w-28 h-28 sm:w-40 sm:h-40 rounded-full object-cover shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                            onClick={() => navigate('/category/toys')}
                        />
                        <p className="mt-4 font-semibold text-sm sm:text-lg">Toys</p>
                    </div>

                    
                    <div className="flex flex-col items-center">
                        <img
                            src="https://cdn.fcglcdn.com/brainbees/images/products/300x364/16420585a.webp"
                            alt="Footwear"
                            className="w-28 h-28 sm:w-40 sm:h-40 rounded-full object-cover shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                            onClick={() => navigate('/category/footwear')}
                        />
                        <p className="mt-4 font-semibold text-sm sm:text-lg">Footwear</p>
                    </div>
                </div>
            </div>

            
            <Footer />
        </div>
    );
}

export default Home;
