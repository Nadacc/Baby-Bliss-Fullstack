import React, {  useEffect, useState } from 'react';
import { HiFolderAdd } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { IoMdClose } from 'react-icons/io';
import { ErrorMessage, Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import AdminNavbar from './AdminNavbar';
import { useDispatch, useSelector } from 'react-redux';
import { addproduct, updateProduct,FetchProducts ,deleteProduct} from '../Slice/ProductSlice';

function AdminProduct() {
   
    const dispatch = useDispatch()
    const {products,pagination,loading,error,categories} = useSelector((state) => state.product)
    console.log("Products from Redux:", products);
    const [addProduct, setAddProduct] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [selectedCategory, setSelectedcategory] = useState('All');
    const [search,setSearch] = useState("")
    const [page,setPage] = useState(1)
   


    const initialValues = {
        name: '',
        price: '',
        quantity: '',
        description: '',
        category: '',
        url: null
    };


    useEffect(() => {
        dispatch(FetchProducts({category:selectedCategory,page,search}));
    }, [dispatch,page,search,selectedCategory]);

    useEffect(() => {
            setPage(1); // Reset page when category changes
        }, [selectedCategory]);

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        price: Yup.number().required('Price is required'),
        quantity: Yup.number().required('Quantity is required'),
        category: Yup.string().required('Category is required'),
        description: Yup.string().required('Description is required'),
        url: Yup.mixed().required('Image is required')
    });

    const onSubmit = async (values, { resetForm }) => {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('price', values.price);
        formData.append('quantity', values.quantity);
        formData.append('category', values.category);
        formData.append('description', values.description);
        formData.append('url', values.url); // File is appended here
    
        dispatch(addproduct(formData));
    
        resetForm();
        setAddProduct(false);
    };
    

    const editSubmit = (values, { resetForm }) => {
        const formData = new FormData();
        if (!values._id) {
            console.error("Product ID is missing!");
            return; // Stop execution if _id is undefined
        }
    
        //formData.append("_id", values._id);
        
        formData.append("name", values.name);
        formData.append("price", values.price);
        formData.append("quantity", values.quantity);
        formData.append("category", values.category);
        formData.append("description", values.description);
        // if (values.url instanceof File) {
        //     formData.append("url", values.url); // Append new file
        // } else {
        //     formData.append("existingUrl", values.url); // Append existing URL if no new file selected
        // }

        if(values.url instanceof File){
            formData.append("url",values.url)
        }
        
        

    
        dispatch(updateProduct({data:formData,id:editProduct._id}))
            .unwrap()
            .then(() => {
                dispatch(FetchProducts({ category:selectedCategory, page, search })); // Refetch updated products
            });
    
        toast.success(' product edited successfully')
        resetForm();
        setEditProduct(null);
    };
    
    
    
    

    const handleCategory = (e) => {
        const value = e.target.value;
        setSelectedcategory(value);
        
        setPage(1);
        dispatch(FetchProducts({ page: 1, category: value, search }));
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= pagination.totalPages) {
          setPage(newPage);
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
                {/* {filtercategories.map((item, index) => (
                    <option key={index} value={item} className="bg-white text-gray-700 hover:bg-blue-100">
                        {item}
                    </option>
                ))} */}

            <option value="All">All</option>
            <option value="Girls">Girl</option>
            <option value="Boys">Boy</option>
            <option value="Toys">Toy</option>
            <option value="Footwear">Footwear</option>
            {categories.length > 0 &&
                categories.map((category, index) => (
                <option key={index} value={category}>
                    {category}
                </option>
                ))}
            </select>
            <input
                value={search}
                type="text"
                placeholder="Search product name"
                onChange={(e) => setSearch(e.target.value)}
                className="w-[200px] sm:w-[200px] group-hover:w-[300px] transition-all duration-300 rounded-full border border-gray px-2 py-1 focus:outline-none focus:border-1 focus:border-primary active:border-1 active:border-primary"
            />
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
                    {products.slice().reverse().map((product) => (
                        <tr key={product._id} className="border-b hover:bg-gray-100">
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
                                        onClick={() => dispatch(deleteProduct(product._id))}
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


        <div className="flex justify-center items-center mt-10 space-x-4">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className={`py-2 px-4 rounded bg-gray-500 text-white ${
            page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-600"
          }`}
        >
          Previous
        </button>
        {[...Array(pagination.totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`py-2 px-4 rounded ${
              page === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === pagination.totalPages}
          className={`py-2 px-4 rounded bg-gray-500 text-white ${
            page === pagination.totalPages
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-600"
          }`}
        >
          Next
        </button>
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
                                {({ setFieldValue }) => (
                                <Form className="space-y-4">
                                    <div>
                                        <label className="block">Name</label>
                                        <Field type="text" name="name" className="border p-2 w-full" />
                                        <ErrorMessage name="name" component="div" className="text-red-500" />
                                    </div>

                                    <div>
                                        <label className="block">Price</label>
                                        <Field type="number" name="price" className="border p-2 w-full" />
                                        <ErrorMessage name="price" component="div" className="text-red-500" />
                                    </div>

                                    <div>
                                        <label className="block">Quantity</label>
                                        <Field type="number" name="quantity" className="border p-2 w-full" />
                                        <ErrorMessage name="quantity" component="div" className="text-red-500" />
                                    </div>

                                    <div>
                                        <label className="block">Category</label>
                                        <Field type="text" name="category" className="border p-2 w-full" />
                                        <ErrorMessage name="category" component="div" className="text-red-500" />
                                    </div>

                                    <div>
                                        <label className="block">Description</label>
                                        <Field as="textarea" name="description" className="border p-2 w-full" />
                                        <ErrorMessage name="description" component="div" className="text-red-500" />
                                    </div>

                                    <div>
                                        <label className="block">Image</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(event) =>
                                                setFieldValue("url", event.currentTarget.files[0])
                                            }
                                            className="border p-2 w-full"
                                        />
                                        <ErrorMessage name="url" component="div" className="text-red-500" />
                                    </div>

                                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                                        Add Product
                                    </button>
                                </Form>
                            )}
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
                                    _id: editProduct._id,
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
                                {({setFieldValue}) => (
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
                                            Image 
                                        </label>
                                        <input
                                            
                                            type="file"
                                            accept="image/*"
                                            onChange={(event) => {
                                                const file = event.currentTarget.files[0]; // Get the selected file
                                                setFieldValue("url", file); // Use Formik's setFieldValue
                                            }}
                                            />
                                        <ErrorMessage name="url" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    <div className="flex justify-center">
                                        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md shadow-md hover:bg-blue-600">
                                            Submit
                                        </button>
                                    </div>
                                </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminProduct;                                                                                                                                                     