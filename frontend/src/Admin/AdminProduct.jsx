import React, { useContext, useEffect, useState } from 'react';
import { HiFolderAdd } from 'react-icons/hi';
import { addData,deleteProduct,editData,FetchProducts } from '../Slice/AdminSlice';
import { IoMdClose } from 'react-icons/io';
import { ErrorMessage, Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import AdminNavbar from './AdminNavbar';
import { useDispatch, useSelector } from 'react-redux';

function AdminProduct() {
   
    const dispatch = useDispatch()
    const pro = useSelector((state) => state.admin.product)
    console.log("Products from Redux:", pro);
    const cat= useSelector(state => state.admin.categories)
    console.log("Categories from Redux:", cat);

    const [addProduct, setAddProduct] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [filterProduct, setFilterProduct] = useState([]);
    const [filtercategories, setFilterCategories] = useState([]);
    const [selectedCategory, setSelectedcategory] = useState('All');

    const initialValues = {
        name: '',
        price: '',
        quantity: '',
        description: '',
        category: '',
        url: ''
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        price: Yup.number().required('Price is required'),
        quantity: Yup.number().required('Quantity is required'),
        category: Yup.string().required('Category is required'),
        description: Yup.string().required('Description is required'),
        url: Yup.string().required('Image is required')
    });

    const onSubmit = (values, { resetForm }) => {
        dispatch(addData(values));
        resetForm();
        setAddProduct(false);
    };

    const editSubmit = (values, { resetForm }) => {
        dispatch(editData(values));
        resetForm();
        setEditProduct(null);
    };

    useEffect(() => {
        dispatch(FetchProducts());
    }, [dispatch]);

    useEffect(() => {
        setFilterCategories(['All', ...cat]);
        setFilterProduct(pro);
    }, [pro,cat]);

    const handleCategory = (e) => {
        const value = e.target.value;
        setSelectedcategory(value);
        if (value === 'All') {
            setFilterProduct(pro);
        } else {
            setFilterProduct(pro.filter((item) => item.category === value));
        }
    };

    return (
        <div className="bg-gray-100 flex  min-h-screen">
        <AdminNavbar />
    <div className=" bg-gray-100 w-full pt-10  px-6 overflow-x-auto">
    <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center sm:text-left lg:text-4xl">Products</h1>
        <div className="mb-6 flex justify-between items-center space-x-4">
            <select
                onChange={handleCategory}
                value={selectedCategory}
                className="p-2 rounded-md border border-gray-300 bg-white shadow-sm text-gray-700 focus:outline-none w-48"
            >
                {filtercategories.map((item, index) => (
                    <option key={index} value={item} className="bg-white text-gray-700 hover:bg-blue-100">
                        {item}
                    </option>
                ))}
            </select>
            <HiFolderAdd
                className="text-5xl cursor-pointer hover:text-blue-800 transition duration-200"
                onClick={() => setAddProduct(true)}
            />
        </div>

        <div className="overflow-x-auto bg-white shadow-md rounded-lg w-full mb-10 ">
            <table className="min-w-full table-auto ">
                <thead>
                    <tr className="bg-gray-200 text-left text-sm font-semibold text-gray-700">
                        <th className="px-6 py-3">Product Name</th>
                        <th className="px-6 py-3">Quantity</th>
                        <th className="px-6 py-3">Price</th>
                        <th className="px-6 py-3">Description</th>
                        <th className="px-6 py-3">Category</th>
                        <th className="px-6 py-3">Image</th>
                        <th className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filterProduct.map((product) => (
                        <tr key={product.id} className="border-b hover:bg-gray-100">
                            <td className="px-6 py-4 text-sm text-gray-800">{product.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-800">{product.quantity}</td>
                            <td className="px-6 py-4 text-sm text-gray-800">₹ {product.price}</td>
                            <td className="px-6 py-4 text-sm text-gray-800">{product.description}</td>
                            <td className="px-6 py-4 text-sm text-gray-800">{product.category}</td>
                            <td className=" py-4">
                                <img
                                    className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-cover rounded"
                                    src={product.url}
                                    alt={product.name}
                                />
                            </td>
                            <td className="px-6 py-4 text-sm">
                                <div className="flex space-x-4">
                                    <button
                                        className="text-white bg-blue-600 hover:bg-blue-700 transition duration-200 font-semibold py-2 px-4 rounded-md text-sm w-20 focus:outline-none"
                                        onClick={() => setEditProduct(product)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="text-white bg-red-600 hover:bg-red-700 transition duration-200 font-semibold py-2 px-4 rounded-md text-sm w-20 focus:outline-none"
                                        onClick={() => dispatch(deleteProduct(product.id))}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        
                {addProduct && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-xl w-full  sm:max-w-md mx-4 max-h-[90%] sm:max-wd-md overflow-y-auto ">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg sm:text-xl font-semibold">Add New Product</h2>
                                <IoMdClose
                                    className="text-2xl cursor-pointer text-gray-600 hover:text-gray-800"
                                    onClick={() => setAddProduct(false)}
                                />
                            </div>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={onSubmit}
                            >
                                <Form>
                                    <div className="mb-4">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            Product Name
                                        </label>
                                        <Field
                                            name="name"
                                            type="text"
                                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                        />
                                        <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                            Price
                                        </label>
                                        <Field
                                            name="price"
                                            type="number"
                                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                        />
                                        <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                                            Quantity
                                        </label>
                                        <Field
                                            name="quantity"
                                            type="number"
                                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                        />
                                        <ErrorMessage name="quantity" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                            Description
                                        </label>
                                        <Field
                                            name="description"
                                            type="text"
                                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                        />
                                        <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                            Category
                                        </label>
                                        <Field
                                            name="category"
                                            type="text"
                                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                        />
                                        <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                                            Image URL
                                        </label>
                                        <Field
                                            name="url"
                                            type="text"
                                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                        />
                                        <ErrorMessage name="url" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>
                                    <div className="flex justify-center">
                                        <button
                                            type="submit"
                                            className="w-full bg-blue-500 text-white py-2 rounded-md shadow-md hover:bg-blue-600"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </Form>
                            </Formik>
                        </div>
                    </div>
                )}

                
                {editProduct && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-xl w-full  sm:max-w-md mx-4 max-h-[90%] sm:max-wd-md overflow-y-auto ">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Edit Product</h2>
                                <IoMdClose
                                    className="text-2xl cursor-pointer text-gray-600 hover:text-gray-800"
                                    onClick={() => setEditProduct(null)}
                                />
                            </div>

                            <Formik
                                initialValues={{
                                    id: editProduct.id,
                                    name: editProduct.name,
                                    price: editProduct.price,
                                    quantity: editProduct.quantity,
                                    description: editProduct.description,
                                    category: editProduct.category,
                                    url: editProduct.url
                                }}
                                validationSchema={validationSchema}
                                onSubmit={editSubmit}
                            >
                                <Form>
                                    <div className="mb-4">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            Product Name
                                        </label>
                                        <Field name="name" type="text" className="mt-1 p-2 w-full border border-gray-300 rounded-md" />
                                        <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                            Price
                                        </label>
                                        <Field name="price" type="number" className="mt-1 p-2 w-full border border-gray-300 rounded-md" />
                                        <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                                            Quantity
                                        </label>
                                        <Field name="quantity" type="number" className="mt-1 p-2 w-full border border-gray-300 rounded-md" />
                                        <ErrorMessage name="quantity" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                            Description
                                        </label>
                                        <Field name="description" type="text" className="mt-1 p-2 w-full border border-gray-300 rounded-md" />
                                        <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                            Category
                                        </label>
                                        <Field name="category" type="text" className="mt-1 p-2 w-full border border-gray-300 rounded-md" />
                                        <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                                            Image URL
                                        </label>
                                        <Field name="url" type="text" className="mt-1 p-2 w-full border border-gray-300 rounded-md" />
                                        <ErrorMessage name="url" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    <div className="flex justify-center">
                                        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md shadow-md hover:bg-blue-600">
                                            Submit
                                        </button>
                                    </div>
                                </Form>
                            </Formik>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminProduct;
