import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { toast } from "react-toastify";
import { IoMdClose } from 'react-icons/io';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { FetchProducts } from '../Slice/ProductSlice';
import { addToCart, addToWishlist, removeFromWishlist } from '../Slice/ShopSlice';
import { fetchUserDetails } from '../Slice/authSlice';

function Products() {
    const dispatch = useDispatch();
    const { products, loading, pagination, error } = useSelector(state => state.product);
    const wishlist = useSelector(state => state.shop.wishlist);
    const { user } = useSelector(state => state.auth);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [page, setPage] = useState(1);
    const [wishlistItems, setWishlistItems] = useState([]);


    const openModal = (product) => setSelectedProduct(product);
    const closeModal = () => setSelectedProduct(null);
    
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= pagination.totalPages) {
            setPage(newPage);
        }
    };

    useEffect(() => {
        console.log("Dispatching FetchProducts...");
        dispatch(FetchProducts({ page }));
        dispatch(fetchUserDetails());
    }, [dispatch, page]);

    useEffect(() => {
        setWishlistItems(wishlist.map(item => item._id)); // Store only product IDs
    }, [wishlist]);
    

    const handleAddToCart = (product) => {
        if (user) {
            dispatch(addToCart(product._id));
            toast.success("Added to cart successfully");
            
        } else {
            toast.error("Please login");
        }
    };

    const handleWishlist = (product) => {
        if(!user){
            toast.error("Please login")
            return;
        }
        const isInWishlist = wishlistItems.includes(product._id);

    if (isInWishlist) {
        setWishlistItems(prev => prev.filter(id => id !== product._id)); 
        dispatch(removeFromWishlist(product._id))
            .then(() => toast.success("Removed from wishlist"))
            .catch(() => toast.error("Failed to remove"));
    } else {
        setWishlistItems(prev => [...prev, product._id]);
        dispatch(addToWishlist(product._id))
            .then(() => toast.success("Added to wishlist"))
            .catch(() => toast.error("Failed to add"));
    }
    }

    return (
        <div className="bg-pink-50 min-h-screen">
            <Navbar />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-24 pb-10 px-6">
                {loading ? (
                    <p>Loading products...</p>
                ) : (
                    products.map((product) => {
                        //const isInWishlist = wishlist.some(item => item.id === product.id);
                        return (
                            <div
                                key={product.id}
                                className="bg-white border rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                                onClick={() => openModal(product)}
                            >
                                <img src={product.url} alt={product.name} className="w-60 h-60 object-cover mx-auto mt-4 rounded-t-lg" />
                                <div className="text-center p-4">
                                    <h1 className="mt-2 text-base sm:text-lg font-semibold">{product.name}</h1>
                                    <p className="mt-1 text-gray-700">₹ {product.price}</p>
                                </div>
                                <div className="flex items-center justify-center mb-4 gap-4 px-4">
                                    <button
                                        className="bg-green-500 text-white px-4 sm:px-6 py-2 rounded-lg shadow-md hover:bg-green-600 text-sm sm:text-base"
                                        onClick={(e) => {
                                            e.stopPropagation();  
                                            handleAddToCart(product);
                                        }}
                                    >
                                        Add to Cart
                                    </button>
                                    {wishlistItems.includes(product._id) ? (
                                        <AiFillHeart
                                            className="w-6 h-6 text-red-500 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();  // Prevent modal from opening
                                                handleWishlist(product)
                                            }}
                                        />
                                    ) : (
                                        <AiOutlineHeart
                                            className="w-6 h-6 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();  // Prevent modal from opening
                                                handleWishlist(product)
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
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

            {selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-4 sm:p-6 max-w-sm sm:max-w-md w-full relative flex flex-col items-center text-center"
                    onClick={(e) => e.stopPropagation()}>
                        <IoMdClose 
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 cursor-pointer size-6"
                        />
                        <img
                            src={selectedProduct.url}
                            alt={selectedProduct.name}
                            className="w-40 h-40 object-cover rounded-lg mb-4"
                        />
                        <h1 className="text-xl sm:text-2xl font-bold mb-4">{selectedProduct.name}</h1>
                        <p className="text-gray-700 mb-2">₹ {selectedProduct.price}</p>
                        <p className="text-gray-600 mb-4">
                            {selectedProduct.description || "No description available."}
                        </p>
                        <div className="flex items-center justify-center mb-4 gap-4 px-4">
                            <button
                                className="bg-green-500 text-white px-4 sm:px-6 py-2 rounded-lg shadow-md hover:bg-green-600 text-sm sm:text-base"
                                onClick={(e) => {
                                    e.stopPropagation();  
                                    handleAddToCart(selectedProduct);
                                    //closeModal();
                                }}
                            >
                                Add to Cart
                            </button>
                            {wishlistItems.includes(selectedProduct._id) ? (
                                <AiFillHeart
                                    className="w-6 h-6 text-red-500 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleWishlist(selectedProduct);
                                        //closeModal();
                                    }}
                                />
                            ) : (
                                <AiOutlineHeart
                                    className="w-6 h-6 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleWishlist(selectedProduct);
                                        //closeModal();
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>            
            )}
        </div>
    );
}

export default Products;
