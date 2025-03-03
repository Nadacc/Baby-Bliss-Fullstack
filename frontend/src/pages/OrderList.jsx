import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

function OrderList() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const id = localStorage.getItem('id');
            try {
                const response = await axios.get(`http://localhost:5000/users/${id}`);
                const userOrders = response.data.order || [];
                setOrders(userOrders);
            } catch (error) {
                console.log('Error fetching orders:', error.message);
            }
        };
        fetchOrders();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="p-6 sm:p-10 md:p-20 pt-16">
                <h1 className="text-2xl font-bold text-center mt-6">Order List</h1>
                {orders.length === 0 ? (
                    <p className="text-center text-lg">No orders found.</p>
                ) : (
                    orders.map((order, index) => {
                        const totalprice = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
                        return (
                            <div key={index} className="max-w-6xl mx-auto p-6 sm:p-8 bg-white rounded-lg shadow-lg mt-6">
                                <p className="text-lg font-semibold mb-2">Order {index + 1}</p>
                                <div className="grid grid-cols-1  gap-4 mt-2">
                                    {order.items.map((product) => (
                                        <div key={product.id} className="flex flex-col sm:flex-row items-start border-b py-4">
                                            <img
                                                src={product.url}
                                                className="w-24 h-24 object-cover rounded-md sm:mr-4"
                                                alt={product.name}
                                            />
                                            <div className="ml-4 w-full">
                                                <p className="font-semibold">{product.name}</p>
                                                <p className="text-gray-600">{product.description}</p>
                                                <div className="flex justify-between text-gray-600 mt-2">
                                                    <p>₹{product.price}</p>
                                                    <p>x{product.quantity}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 text-right">
                                    <p className="font-bold text-lg">Order Total: ₹{totalprice}</p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default OrderList;
