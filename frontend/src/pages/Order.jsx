import React from 'react'

import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { Form,ErrorMessage, Field, Formik } from "formik";
import * as Yup from 'yup';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../Slice/ShopSlice';

function Order() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector(state => state.shop.cart);
    
    const initialValues = {
      name:'',
      address:''
    }
    const validationSchema = Yup.object({
      name:Yup.string()
      .required('Name is required'),
      address:Yup.string()
      .required('Address is required')
    })

    const totalprice = cart.reduce((acc, item) => acc + (item.quantity * item.price), 0);

    const onSubmit = async (values) => {
      const userId = localStorage.getItem('id');
      console.log("User ID from localStorage:", userId);
      const order = {
          ...values,
          items: cart,
          total: totalprice,
      };
      // console.log("Order Data:", order);
      
      try {
          const response = await axios.get(`http://localhost:5000/users/${userId}`);
          const oldOrders = response.data.order || []; // Use an empty array if undefined
  
          
          await axios.patch(`http://localhost:5000/users/${userId}`, {
              order: [...oldOrders, order], // Append new order to existing ones
              cart: [], 
          });
          
          
          toast.success('Order placed successfully');
          dispatch(clearCart())
          
          setTimeout(() => {
            toast.dismiss();
            navigate('/'); 
        }, 1000); 
          
      } catch (error) {
          console.error('Order submission failed:', error);
          toast.error('Failed to place order');
      }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar/>
        <Formik 
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}>
        <Form className="max-w-2xl mx-auto  bg-white rounded-lg shadow-lg space-y-8 p-20 ">
        <h1 className="text-center text-2xl font-semibold mb-6">ORDER PAGE</h1>
            <div className="mb-4">
                <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">Name</label>
                <Field 
                    type="text" 
                    id="name" 
                    name="name" 
                    className=" w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your name"
                />
                <ErrorMessage name="name" component='div' className="text-red-500 mt-1 text-sm"></ErrorMessage>
            </div>

            
            <div className="mb-4">
                <label htmlFor="address" className="block text-lg font-medium text-gray-700 mb-2">Address</label>
                <Field
                    as='textarea' 
                    id="address" 
                    name="address" 
                    rows="4" 
                    className="flex justify-center w-full  p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your address"
                />
                <ErrorMessage name="address" component="div" className="text-red-500 text-sm "></ErrorMessage>
            </div>
            <div className='bg-gray-200 p-4 rounded-lg'>
              <label className="block text-blue-600 text-sm font-semibold mb-2">Cart Order Items:</label>
                <div className="space-y-4">
                  {cart.map((cartitem) => (
                    <div key={cartitem.id} className="flex justify-between items-center text-sm font-medium text-gray-700">
                      <p>{cartitem.name}</p>
                      <p>₹{cartitem.price}</p>
                      <p>x{cartitem.quantity}</p>
                      <p>₹{cartitem.price * cartitem.quantity}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 font-semibold text-xl text-gray-800">
                  <span>Total: ₹{totalprice}</span>
                </div>
            </div>
            <div>
              
            </div>
            

            <div className="flex justify-center mt-6">
                <button type='submit' className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Submit Order</button>
            </div>
            </Form>
            </Formik>
            

        </div>
  )
}

export default Order