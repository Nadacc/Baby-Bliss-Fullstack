import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import axiosInstance from '../api/axiosInstance';
import { setUser } from '../Slice/authSlice';

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const initialValues = {
        email: '',
        password: '',
    };

    const onSubmit = async (values, { resetForm }) => {
        try {
            const response = await axiosInstance.post('/users/login', values);

            if (!response.data || !response.data.user) {
                throw new Error("Invalid response structure. No user data received.");
            }

            setUser(response.data.user.name);
            console.log(response.data, "data");

            const userRole = response.data.user.isAdmin ? 'admin' : 'user';
            console.log(userRole);

            navigate(userRole === 'admin' ? '/admin' : '/');
            resetForm();
            toast.success(response.data.message);
        } catch (error) {
            console.error("Login error:", error.response?.data || error);
            const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again';
            toast.error(errorMessage);
        }
    };

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string()
            .required('Password is required')
            .min(8, 'Password must be at least 8 characters long')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
            .matches(/[0-9]/, 'Password must contain at least one number')
            .matches(/[!@#$%^&*_(),.?":{}|<>]/, 'Password must contain at least one special character (!@#$%^&*)'),
    });

    return (
        <div
            className="flex items-center justify-start min-h-screen bg-cover bg-center pl-16"
            style={{ backgroundImage: "url('login.jpg')" }}
        >
            <div className="bg-white bg-opacity-40 p-8 rounded-lg shadow-lg w-full max-w-md">
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                    <Form>
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>

                        <div className="mb-4">
                            <label className="font-bold flex mb-2">E-mail</label>
                            <Field
                                type="email"
                                id="email"
                                name="email"
                                className="block w-full py-2 px-3 text-gray-800 bg-white border-2 rounded"
                            />
                            <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div className="mb-4">
                            <label className="font-bold flex mb-2">Password</label>
                            <Field
                                type="password"
                                id="password"
                                name="password"
                                className="block w-full py-2 px-3 text-gray-800 bg-white border-2 rounded"
                            />
                            <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-blue-500 text-white rounded mt-4 hover:bg-blue-600 transition duration-300"
                        >
                            Sign In
                        </button>

                        <p className="mt-4 text-center">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-green-600 font-bold">
                                Register
                            </Link>
                        </p>
                    </Form>
                </Formik>
            </div>
        </div>
    );
}

export default Login;
