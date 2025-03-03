import React, { useContext, useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';
import { useDispatch, useSelector } from 'react-redux';
import { FetchProducts } from '../Slice/AdminSlice';

function AdminHome() {
    const dispatch = useDispatch()
    const productList = useSelector(state => state.admin.product)
    const [userCount, setUserCount] = useState([]);
    const [statusCount, setStatusCount] = useState([]);

    useEffect(() => {
        dispatch(FetchProducts())
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/users');
                setUserCount(response.data);
                setStatusCount(response.data.filter((item) => item.status === false));
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchUsers();
    }, []);

    const salePrice = userCount.reduce(
        (acc, cur) =>
            acc + cur.order.reduce((orderAcc, order) => orderAcc + order.total, 0),
        0
    );

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <AdminNavbar />

            <div className="flex-1 py-8 px-4 sm:px-6">
                <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center sm:text-left lg:text-4xl">Admin Dashboard</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white shadow-md rounded-lg p-4 text-center h-36 sm:h-40 flex flex-col justify-center">
                        <Link to="/adminuser">
                            <h2 className="text-lg font-semibold text-gray-700 sm:text-base lg:text-xl">Total Users</h2>
                            <p className="text-xl font-bold text-gray-900 sm:text-lg lg:text-2xl">{userCount.length}</p>
                        </Link>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-4 text-center h-36 sm:h-40 flex flex-col justify-center">
                        <Link to="/adminproduct">
                            <h2 className="text-lg font-semibold text-gray-700 sm:text-base lg:text-xl">Total Products</h2>
                            <p className="text-xl font-bold text-gray-900 sm:text-lg lg:text-2xl">{productList.length}</p>
                        </Link>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-4 text-center h-36 sm:h-40 flex flex-col justify-center">
                        <Link to="/adminuser">
                            <h2 className="text-lg font-semibold text-gray-700 sm:text-base lg:text-xl">Blocked</h2>
                            <p className="text-xl font-bold text-gray-900 sm:text-lg lg:text-2xl">{statusCount.length}</p>
                        </Link>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-4 text-center h-36 sm:h-40 flex flex-col justify-center">
                        <h2 className="text-lg font-semibold text-gray-700 sm:text-base lg:text-xl">Total Sales</h2>
                        <p className="text-xl font-bold text-gray-900 sm:text-lg lg:text-2xl">₹ {salePrice}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminHome;
