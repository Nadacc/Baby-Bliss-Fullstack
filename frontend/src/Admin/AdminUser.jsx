import React, { useEffect, useState ,useCallback} from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';
import { IoMdClose } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { blockUser, getAllUsers,getUserOrder } from '../Slice/AdminSlice';

function AdminUser() {
    //const [users, setUsers] = useState([]);
    //const [userdetails, setUserdetails] = useState(null);
    const { user,loading:userLoading,error:userError,totalPages,currentPage,userOrder} = useSelector((state) => state.admin)
    const dispatch = useDispatch();
    const [orderList, setOrderList] = useState(false);
    const [page, setPage] = useState(1);




    useEffect(() => {
        dispatch(getAllUsers({page}))
    }, [dispatch,page]);

    const handleStatus = (id) => {
        if (
            window.confirm(
              "Are you sure you want to change this user's block status?"
            )
          ) {
            dispatch(blockUser(id))
              .unwrap()
              .then((response) => {
                dispatch(getAllUsers({}));
              });
          }
    };
    


    const handleUserDetails = async(id) =>{
        const selectedUser = user.find((u) => u._id === id);
        if (selectedUser) {
            setOrderList({
              name: selectedUser.name,
              email: selectedUser.email,
              username: selectedUser.username,
            }); // Set user details in orderList state
        }

        try {
            const response = await dispatch(getUserOrder(id)).unwrap();
            console.log("Fetched user order:", response);
          } catch (error) {
            console.error("Error fetching user order:", error);
          }
    };
      
        if (userLoading) {
          return (
            <div className="flex justify-center items-center py-4">Loading...</div>
          );
        }
      
        if (userError) {
          return (
            <div className="text-red-500 text-center py-4">
              Error: {userError ? userError : orderError}
            </div>
          );
        }
    
    
    return (
        <div className="flex min-h-screen bg-gray-100">
            <AdminNavbar />
            <div className="w-full pt-10  px-6 overflow-x-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center sm:text-left lg:text-4xl">Users</h1>
            <div className="hidden lg:block">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="text-left py-3 px-6 font-medium text-gray-700 border-b">Name</th>
                                <th className="text-left py-3 px-6 font-medium text-gray-700 border-b">Username</th>
                                <th className="text-left py-3 px-6 font-medium text-gray-700 border-b">Email</th>
                                <th className="text-left py-3 px-6 font-medium text-gray-700 border-b">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {user.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50" onClick={() => handleUserDetails(user._id)}>
                                    <td className="py-3 px-6 border-b">{user.name}</td>
                                    <td className="py-3 px-6 border-b">{user.username}</td>
                                    <td className="py-3 px-6 border-b">{user.email}</td>
                                    <td className="py-3 px-6 border-b">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleStatus(user._id);
                                            }}
                                            className={`py-1 px-4 rounded text-white font-medium ${
                                                user.isBlock ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                                            }`}
                                        >
                                            {user.isBlock ? 'Unblock' : 'Block'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Card View for Small Screens */}
                <div className="lg:hidden grid gap-6 sm:grid-cols-2">
                    {user.map((user) => (
                        <div key={user._id} className="bg-white p-4 shadow-md rounded-lg" >
                            <h2 className="text-lg font-semibold">{user.name}</h2>
                            <p className="text-gray-600 text-sm mt-1"><strong>Username:</strong> {user.username}</p>
                            <p className="text-gray-600 text-sm"><strong>Email:</strong> {user.email}</p>
                            <div className="flex justify-between items-center mt-4">
                                <button
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                                    onClick={() => handleUserDetails(user._id)}
                                >
                                    View Orders
                                </button>
                                <button
                                    className={`px-4 py-2 rounded text-white font-medium ${
                                        user.isBlock ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                                    }`}
                                    onClick={() => handleStatus(user._id)}
                                >
                                    {user.isBlock ? 'Unblock' : 'Block'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {orderList && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white w-11/12 sm:w-1/2 md:w-1/3 lg:w-1/3 p-6 rounded-lg shadow-lg max-h-[90%] overflow-y-auto relative">
                            <IoMdClose
                                size={24}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 cursor-pointer"
                                onClick={() => setOrderList(null)}
                            />
                            <div className="text-center mb-4">
                                <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
                            </div>
                            <div className="space-y-2 mb-6">
                                 <p>
                                    <strong className="text-gray-700">name:</strong> {orderList.name}
                                </p>
                                <p>
                                    <strong className="text-gray-700">Username:</strong> {orderList.username}
                                </p>
                                <p>
                                    <strong className="text-gray-700">Email:</strong> {orderList.email}
                                </p>
                            </div>
                            {userOrder.length === 0 ? (
                                <h3 className="text-center text-lg text-gray-500">No Orders Placed</h3>
                            ) : (
                                <div className='bg-gray-200 p-6 space-y-4 rounded-lg '>
                                    <h3 className="text-lg font-semibold  text-gray-700 mb-4">Order Details</h3>
                                    {userOrder.map((order, index) => (
                                        <div key={order._id} className="border rounded-lg p-4  shadow-sm bg-white space-y-4">
                                            <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                                                Order {index + 1}
                                            </h4>
                                            {order.items.map((item) => (
                                                <div key={item.productId._id} className="flex justify-between text-gray-600 mb-2">
                                                    <span>{item.productId.name}</span>
                                                    <span>x{item.quantity} </span>
                                                    <span>₹{item.productId.price}</span>
                                                </div>
                                            ))}
                                            <div className="flex justify-between font-semibold text-gray-800 mt-3 border-t pt-2 text-sm sm:text-base">
                                                <span>Total:</span>
                                                <span>₹{order.total}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminUser;
