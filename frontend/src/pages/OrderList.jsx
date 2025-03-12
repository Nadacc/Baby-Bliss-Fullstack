import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { showOrders } from '../Slice/orderSlice';

function OrderList() {
    const dispatch = useDispatch();
    const { order, loading, error } = useSelector((state) => state.order);

    console.log("Orders in Component:", order);


    useEffect(() => {
        if(order.length===0){
            console.log("fetching orders.....");
            
            dispatch(showOrders());
        }
        
    }, [dispatch]);


    if (loading) {
        return (
          <div className="flex justify-center py-4">
            <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
          </div>
        );
      }
    
      if (error) {
        return <div className="text-red-500 text-center py-4">Error: {error}</div>;
      }



    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="p-6 sm:p-10 md:p-20 pt-16">
                <h1 className="text-2xl font-bold text-center mt-6">Order List</h1>
                {order.length === 0 ? (
                    <p className="text-center text-lg">No orders found.</p>
                ) : (
                    order.map((order, index) => {
                        console.log("Rendering Order:", order);
                        const totalprice = order.items.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);
                        return (
                            <div key={index} className="max-w-6xl mx-auto p-6 sm:p-8 bg-white rounded-lg shadow-lg mt-6">
                                <p className="text-lg font-semibold mb-2">Order {index + 1}</p>
                                <p className="text-lg font-semibold mb-2">Order {order._id}</p>
                                <p className="text-md mb-2">Full name: {order.name}</p>
                                <p className="text-md mb-2">Order Status: {order.status}</p>
                                <p className="text-md mb-2">Payment Status: {order.razorpayPaymentStatus}</p>
                                <div className="grid grid-cols-1 gap-4 mt-2">
                                    {order.items.map((product) => (
                                        <div key={product.productId._id} className="flex flex-col sm:flex-row items-start border-b py-4">
                                            <img
                                                src={product.productId.url}
                                                className="w-24 h-24 object-cover rounded-md sm:mr-4"
                                                alt={product.productId.name}
                                            />
                                            <div className="ml-4 w-full">
                                                <p className="font-semibold">{product.productId.name}</p>
                                                <p className="text-gray-600">{product.productId.description}</p>
                                                <div className="flex justify-between text-gray-600 mt-2">
                                                    <p>₹{product.productId.price}</p>
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