import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, totalRevenue } from '../Slice/AdminSlice';
import { FetchProducts } from '../Slice/ProductSlice';
import AdminNavbar from './AdminNavbar';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

function AdminHome() {
    const dispatch = useDispatch();
    
    const { user, totalRevenues, totalProducts } = useSelector((state) => state.admin);
    const { totalProduct } = useSelector((state) => state.product);

    useEffect(() => {
        dispatch(FetchProducts({}));
        dispatch(getAllUsers({}));
        dispatch(totalRevenue());
    }, [dispatch]);

    const blockedUsers = user.filter(u => u.isBlock);
    const activeUsers = user.length - blockedUsers.length;

    // Pie chart data (Blocked vs Active Users)
    const userData = [
        { name: 'Active Users', value: activeUsers },
        { name: 'Blocked Users', value: blockedUsers.length }
    ];

    const COLORS = ['#00C49F', '#FF4D4D'];

    // Bar chart data (Total Sales & Purchased Products)
    const salesData = [
        { name: 'Sales', value: totalRevenues },
        { name: 'Purchased Products', value: totalProducts }
    ];

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <AdminNavbar />

            <div className="flex-1 py-8 px-4 sm:px-6">
                <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center sm:text-left lg:text-4xl">Admin Dashboard</h1>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white shadow-md rounded-lg p-4 text-center h-36 sm:h-40 flex flex-col justify-center">
                        <Link to="/adminuser">
                            <h2 className="text-lg font-semibold text-gray-700 sm:text-base lg:text-xl">Total Users</h2>
                            <p className="text-xl font-bold text-gray-900 sm:text-lg lg:text-2xl">{user.length}</p>
                        </Link>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-4 text-center h-36 sm:h-40 flex flex-col justify-center">
                        <Link to="/adminproduct">
                            <h2 className="text-lg font-semibold text-gray-700 sm:text-base lg:text-xl">Total Products</h2>
                            <p className="text-xl font-bold text-gray-900 sm:text-lg lg:text-2xl">{totalProduct}</p>
                        </Link>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-4 text-center h-36 sm:h-40 flex flex-col justify-center">
                        <Link to="/adminuser">
                            <h2 className="text-lg font-semibold text-gray-700 sm:text-base lg:text-xl">Blocked Users</h2>
                            <p className="text-xl font-bold text-gray-900 sm:text-lg lg:text-2xl">{blockedUsers.length}</p>
                        </Link>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-4 text-center h-36 sm:h-40 flex flex-col justify-center">
                        <h2 className="text-lg font-semibold text-gray-700 sm:text-base lg:text-xl">Total Sales</h2>
                        <p className="text-xl font-bold text-gray-900 sm:text-lg lg:text-2xl">₹ {totalRevenues}</p>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-4 text-center h-36 sm:h-40 flex flex-col justify-center">
                        <h2 className="text-lg font-semibold text-gray-700 sm:text-base lg:text-xl">Total Purchased Products</h2>
                        <p className="text-xl font-bold text-gray-900 sm:text-lg lg:text-2xl"> {totalProducts}</p>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                    {/* Pie Chart: Active vs Blocked Users */}
                    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">User Distribution</h2>
                        <PieChart width={300} height={300}>
                            <Pie
                                data={userData}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                label
                            >
                                {userData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend />
                            <Tooltip />
                        </PieChart>
                    </div>

                    {/* Bar Chart: Sales & Purchased Products */}
                    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Sales Overview</h2>
                        <BarChart width={350} height={300} data={salesData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminHome;
