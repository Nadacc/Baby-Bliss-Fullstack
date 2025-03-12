import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoMdClose } from 'react-icons/io';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import Navbar from '../components/Navbar';
import { FetchProducts } from '../Slice/ProductSlice';
import { addToCart, addToWishlist, removeFromWishlist } from '../Slice/ShopSlice';
import { fetchUserDetails } from '../Slice/authSlice';
import { toast } from 'react-toastify';

function CategoriesList({ categoryName }) {
    const dispatch = useDispatch();
    const { products, pagination } = useSelector(state => state.product);
    const wishlist = useSelector(state => state.shop.wishlist);
    
    const { user } = useSelector(state => state.auth);

    const [page, setPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [wishlistItems, setWishlistItems] = useState([]);

    useEffect(() => {
        setPage(1); // Reset page when category changes
    }, [categoryName]);

    useEffect(() => {
        dispatch(FetchProducts({ category: categoryName, page, limit: 10 }));
        dispatch(fetchUserDetails());
    }, [dispatch, categoryName, page]);


    useEffect(() => {
        setWishlistItems(wishlist.map(item => item._id)); // Store only product IDs
    }, [wishlist]);

    const openModal = (product) => setSelectedProduct(product);
    const closeModal = () => setSelectedProduct(null);

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
        <div>
            <Navbar />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-24 pb-10 pl-6 pr-6">
                {products.length === 0 ? (
                    // Skeleton Loader
                    [...Array(6)].map((_, index) => (
                        <div
                            key={index}
                            className="border rounded-lg shadow-lg p-4 animate-pulse bg-gray-200"
                        >
                            <div className="w-60 h-60 bg-gray-300 rounded-md mx-auto"></div>
                            <div className="mt-4 h-4 w-3/4 bg-gray-300 rounded mx-auto"></div>
                            <div className="mt-2 h-4 w-1/2 bg-gray-300 rounded mx-auto"></div>
                            <div className="flex justify-center gap-4 mt-4">
                                <div className="h-8 w-24 bg-gray-300 rounded"></div>
                                <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                            </div>
                        </div>
                    ))
                ) : (
                    products.map((product) => {
                        const isInWishlist = wishlist.some((item) => item.productId === product.id);
                        return (
                            <div
                                key={product.id}
                                className="border rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                                onClick={() => openModal(product)}
                            >
                                <img
                                    src={product.url}
                                    alt={product.name}
                                    className="w-60 h-60 object-cover mx-auto mt-4 cursor-pointer rounded-t-lg"
                                />
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
                                            className="w-6 h-6 text-red-500 bg-white cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleWishlist(product)
                                            }}
                                        />
                                    ) : (
                                        <AiOutlineHeart
                                            className="w-6 h-6 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
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

            {/* Pagination Controls */}
            <div className="flex justify-center mt-6">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="px-4 py-2">Page {page}</span>
                <button
                    disabled={products.length < 10} // Disable if less than 10 products (last page)
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            {/* Product Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-4 sm:p-6 max-w-sm sm:max-w-md w-full relative flex flex-col items-center text-center">
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
                                    closeModal();
                                }}
                            >
                                Add to Cart
                            </button>
                            {wishlistItems.includes(selectedProduct._id) ? (
                                <AiFillHeart
                                    className="w-6 h-6 text-red-500 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleWishlist(selectedProduct)
                                        //closeModal();
                                    }}
                                />
                            ) : (
                                <AiOutlineHeart
                                    className="w-6 h-6 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleWishlist(selectedProduct)
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

export default CategoriesList;
