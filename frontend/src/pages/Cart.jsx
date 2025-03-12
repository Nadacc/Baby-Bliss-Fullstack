import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { updateCartItemQuantity, removeFromCart, getCart, clearCart } from '../Slice/ShopSlice';

function Cart() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector(state => state.shop.cart);
    const loading = useSelector(state => state.shop.loading);

    useEffect(() => {
        dispatch(getCart());
    }, [dispatch]);


    const handleRemove = async (id) => {
        await dispatch(removeFromCart(id));
        await dispatch(getCart()); // Fetch updated cart data after removal
        toast.success('Item removed');
    };
    

    const handleQuantityChange = async (productId, quantity, action) => {
        if (action === "decrement" && quantity === 1) {
            await dispatch(removeFromCart(productId)); 
        } else {
            await dispatch(updateCartItemQuantity({ productId, action }));
        }
        dispatch(getCart()); // Refresh cart data
    };
    
    

    if (loading) {
        return <p>Loading cart...</p>;  
    }

    

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />
            <div className="p-4 sm:p-10">
                <h1 className="text-xl sm:text-3xl font-bold mb-6 text-center pt-16">Your Cart</h1>
                
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-6 sm:p-10">
                        <h1 className="text-xl sm:text-2xl text-center mb-4 pt-16">Your cart is currently empty.</h1>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-blue-500 text-white px-6 py-2 rounded-xl text-sm sm:text-lg">
                            Shop Now
                        </button>
                    </div>
                ) : (
                    cart.map((item) => (
                        <div key={item.id} className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
                            <img src={item.url} alt={item.name} className="w-32 h-32 object-cover mx-auto rounded-md" />

                            <div className="text-center mt-4">
                                <h2 className="text-lg sm:text-xl font-semibold">{item.name}</h2>
                                <p className="text-gray-600">₹ {item.price}</p>
                            </div>

                            <div className="flex items-center justify-center gap-2 mt-4">
                                <button
                                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                                    onClick={() => handleQuantityChange(item.id,item.quantity, "decrement")}
                                >
                                    -
                                </button>
                                <span className="font-semibold">{item.quantity}</span>
                                <button
                                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                                    onClick={() => handleQuantityChange(item.id,item.quantity, "increment")}
                                >
                                    +
                                </button>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <button
                                    className="text-red-500 hover:underline text-sm"
                                    onClick={() => handleRemove(item.id)}
                                >
                                    <b>Remove</b>
                                </button>
                                <p className="font-bold text-lg sm:text-xl">
                                    ₹ {item.price * item.quantity}
                                </p>
                            </div>
                        </div>
                    ))
                )}

                </div>

                <div className="mt-10 flex flex-col sm:flex-row justify-center sm:justify-between items-center">
                    <button
                        onClick={() => {
                            navigate('/payment')
                        }}
                        className="bg-green-500 text-white px-6 py-2 rounded-xl text-sm sm:text-lg mb-4 sm:mb-0 shadow-md hover:bg-green-600">
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
