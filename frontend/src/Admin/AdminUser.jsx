import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';
import { IoMdClose } from 'react-icons/io';

function AdminUser() {
    const [users, setUsers] = useState([]);
    const [userdetails, setUserdetails] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/users');
                setUsers(response.data);
            } catch (err) {
                console.log(err.message);
            }
        };
        fetchUsers();
    }, []);

    const handleStatus = (id, status,event) => {
        event.stopPropagation();
        axios.patch(`http://localhost:5000/users/${id}`, { status: !status });
        setUsers(users.map((user) => (user.id === id ? { ...user, status: !status } : { ...user })));
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <AdminNavbar />
            <div className="w-full pt-10  px-6 overflow-x-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center sm:text-left lg:text-4xl">Users</h1>
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg ">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="text-left py-3 px-6 font-medium text-gray-700 border-b">Username</th>
                            <th className="text-left py-3 px-6 font-medium text-gray-700 border-b">Email</th>
                            <th className="text-left py-3 px-6 font-medium text-gray-700 border-b">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50" onClick={() => setUserdetails(user)}>
                                <td className="py-3 px-6 border-b">{user.username}</td>
                                <td className="py-3 px-6 border-b">{user.email}</td>
                                <td className="py-3 px-6 border-b">
                                    <button
                                        onClick={(event) => handleStatus(user.id, user.status,event)}
                                        className={`py-1 px-4 rounded text-white font-medium ${
                                            user.status ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                                        }`}
                                    >
                                        {user.status ? 'Block' : 'Unblock'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {userdetails && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white w-11/12 sm:w-1/2 md:w-1/3 lg:w-1/3 p-6 rounded-lg shadow-lg max-h-[90%] overflow-y-auto relative">
                            <IoMdClose
                                size={24}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 cursor-pointer"
                                onClick={() => setUserdetails(null)}
                            />
                            <div className="text-center mb-4">
                                <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
                            </div>
                            <div className="space-y-2 mb-6">
                                <p>
                                    <strong className="text-gray-700">Username:</strong> {userdetails.username}
                                </p>
                                <p>
                                    <strong className="text-gray-700">Email:</strong> {userdetails.email}
                                </p>
                            </div>
                            {userdetails.order.length === 0 ? (
                                <h3 className="text-center text-lg text-gray-500">No Orders Placed</h3>
                            ) : (
                                <div className='bg-gray-200 p-6 space-y-4 rounded-lg '>
                                    <h3 className="text-lg font-semibold  text-gray-700 mb-4">Order Details</h3>
                                    {userdetails.order.map((order, index) => (
                                        <div key={index} className="border rounded-lg p-4  shadow-sm bg-white space-y-4">
                                            <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                                                Order {index + 1}
                                            </h4>
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between text-gray-600 mb-2">
                                                    <span>{item.name}</span>
                                                    <span>x{item.quantity} </span>
                                                    <span>₹{item.price}</span>
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
