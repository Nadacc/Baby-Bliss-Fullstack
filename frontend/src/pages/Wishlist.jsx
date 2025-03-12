import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import { getWishlist, removeFromWishlist, addToCart } from '../Slice/ShopSlice';

function Wishlist() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const wishlist = useSelector(state => state.shop.wishlist);
    //const cart = useSelector(state => state.shop.cart);

    // Fetch wishlist from backend when component loads
    useEffect(() => {
        dispatch(getWishlist());
    }, [dispatch]);

    const handleRemoveFromWishlist = (productId) => {
        
        dispatch(removeFromWishlist(productId))
            .unwrap()
            .then(() => toast.success("Item removed from wishlist"))
            .catch(() => toast.error("Failed to remove item"));
    };

    const handleMoveToCart = (item) => {
        
        dispatch(addToCart(item._id))
            .then(() => dispatch(removeFromWishlist(item._id))) // Remove from wishlist after adding to cart
            .then(() => toast.success("Item moved to cart"))
            .catch(() => toast.error("Error moving item to cart"));
    };

    return (
        <div>
            <Navbar />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6 text-center">Your Wishlist</h1>
                {wishlist.length === 0 ? (
                    <div className="text-center">
                        <h2>Your wishlist is empty.</h2>
                        <button onClick={() => navigate('/')} className="bg-blue-500 text-white px-6 py-2 rounded-xl">
                            Add Products
                        </button>
                    </div>
                ) : (
                    wishlist.map((item) => (
                        <div key={item._id} className="flex justify-between items-center border-b pb-4 mb-4">
                            <img src={item.url} alt={item.name} className="w-24 h-24 object-cover" />
                            <div className="flex-grow ml-4">
                                <h2 className="text-lg font-semibold">{item.name}</h2>
                                <p className="text-gray-600">₹ {item.price}</p>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => handleRemoveFromWishlist(item._id)} className="text-red-500">Remove</button>
                                <button onClick={() => handleMoveToCart(item)} className="bg-green-500 text-white px-4 py-2 rounded">Move to Cart</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Wishlist;
