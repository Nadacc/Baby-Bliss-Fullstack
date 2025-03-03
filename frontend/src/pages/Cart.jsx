import React, { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { FetchUsers,updateCartItemQuantity,removeFromCart } from '../Slice/ShopSlice';

function Cart() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector(state => state.shop.cart)
    const cartCount = useSelector(state => state.shop.cartCount);
    const loading = useSelector(state => state.shop.loading);

    const userId = localStorage.getItem("id");
    useEffect(() => {

        if (userId) {
            dispatch(FetchUsers(userId));  // Fetch the user data, including their cart
        }
    }, [dispatch,userId]);


    if (loading) {
        return <p>Loading cart...</p>;  // Show loading state while fetching
    }
    

    if (cartCount === 0) {
        return (
            <div>
                <Navbar />
                <div className="flex flex-col items-center justify-center h-full p-6 sm:p-10">
                    <h1 className="text-xl sm:text-2xl text-center mb-4 pt-16">Your cart is currently empty.</h1>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-500 text-white px-6 py-2 rounded-xl text-sm sm:text-lg">
                        Shop Now
                    </button>
                </div>
            </div>
        );
    }

    
    return (
        <div>
            <Navbar />
            <div className="p-4 sm:p-10">
                <h1 className="text-xl sm:text-3xl font-bold mb-6 text-center pt-16">Your Cart</h1>
                <div>
                    {cart.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-col sm:grid sm:grid-cols-6 items-center gap-4 sm:gap-6 border-b pb-4 sm:pb-6 mb-6"
                        >
                            
                            <img
                                src={item.url}
                                alt={item.name}
                                className="w-20 h-20 sm:w-32 sm:h-32 object-cover mx-auto"
                            />

                            
                            <div className="text-center sm:col-span-2 sm:text-left">
                                <h2 className="text-lg sm:text-xl font-semibold">{item.name}</h2>
                                <p className="text-gray-600">₹ {item.price}</p>
                            </div>

                            
                            <div className="flex items-center justify-center gap-2">
                                <button
                                    className="px-3 py-1 bg-gray-200 rounded"
                                    onClick={() => dispatch(updateCartItemQuantity({productId:item.id,newQuantity: item.quantity - 1,userId,cart}))}
                                >
                                    -
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                    className="px-3 py-1 bg-gray-200 rounded"
                                    onClick={() => dispatch(updateCartItemQuantity({productId:item.id,newQuantity: item.quantity + 1,userId,cart}))}
                                >
                                    +
                                </button>
                            </div>

                            
                            <button
                                className="text-red-500 hover:underline text-center"
                                onClick={() => dispatch(removeFromCart({productId:item.id,cart,userId}))}
                            >
                                Remove
                            </button>

                           
                            <p className="font-bold text-lg sm:text-xl text-center sm:text-right">
                                ₹ {item.price * item.quantity}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="mt-6 flex flex-col sm:flex-row justify-center sm:justify-between items-center">
                    <button
                        onClick={() => {
                            const userId = localStorage.getItem('id');
                            if (userId) {
                                navigate('/payment');
                            } else {
                                navigate('/login');
                                toast.info("You need to login first.");
                            }
                        }}
                        className="bg-green-500 text-white px-6 py-2 rounded-xl text-sm sm:text-lg mb-4 sm:mb-0">
                        PLACE YOUR ORDER
                    </button>
                    <p className="font-bold text-lg sm:text-xl">
                        Total: ₹ {cart.reduce((total, item) => total + item.price * item.quantity, 0)}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Cart;
