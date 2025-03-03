import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import { removeFromWishlist, addToCart } from '../Slice/ShopSlice';
import { useDispatch, useSelector } from 'react-redux';

function Wishlist() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const wishlist = useSelector(state => state.shop.wishlist);
    const cart = useSelector(state => state.shop.cart);
    
    const userId = localStorage.getItem("id"); // Get user ID from localStorage

    const handleMoveToCart = (item) => {
        if (!userId) {
            toast.error("User not logged in.");
            return;
        }

        try {
            const isInCart = cart.some((cartItem) => cartItem.id === item.id);
            if (isInCart) {
                toast.info("Item is already in the cart");
                dispatch(removeFromWishlist({ productId: item.id, userId }));
            } else {
                dispatch(addToCart({ product: item, userId }));
                dispatch(removeFromWishlist({ productId: item.id, userId }));
            }
        } catch (error) {
            console.error("Error in handleMoveToCart:", error);
            toast.error("An error occurred while moving the item to the cart.");
        }
    };

    if (wishlist.length === 0) {
        return (
            <div>
                <Navbar />
                <div className="flex flex-col items-center justify-center h-full p-6 sm:p-10">
                    <h1 className="text-xl sm:text-2xl text-center mb-4 pt-16">Your wishlist is empty.</h1>
                    <button 
                        onClick={() => navigate('/')} 
                        className="bg-blue-500 text-white px-6 py-2 rounded-xl text-sm sm:text-lg">
                        Add Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="p-6 sm:p-10">
                <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center pt-12">Your Wishlist</h1>
                <div>
                    {wishlist.map((item) => (
                        <div key={item.id} className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b pb-4">
                            <img 
                                src={item.url} 
                                alt={item.name} 
                                className="w-24 h-24 sm:w-32 sm:h-32 object-cover mb-4 sm:mb-0"
                            />
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:ml-6 w-full">
                                <div className="text-center sm:text-left mb-4 sm:mb-0">
                                    <h2 className="text-lg sm:text-xl font-semibold">{item.name}</h2>
                                    <p className="text-gray-600">₹ {item.price}</p>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto gap-3 sm:gap-6">
                                    <button
                                        className="text-red-500 hover:underline sm:w-auto"
                                        onClick={() => dispatch(removeFromWishlist({ productId: item.id, userId }))}
                                    >
                                        Remove
                                    </button>
                                    <button 
                                        onClick={() => handleMoveToCart(item)}
                                        className="bg-green-500 text-white px-6 py-2 rounded-xl text-sm sm:text-lg w-full sm:w-auto">
                                        Move To Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Wishlist;
