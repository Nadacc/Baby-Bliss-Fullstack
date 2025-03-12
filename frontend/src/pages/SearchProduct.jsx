import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FetchProducts } from '../Slice/ProductSlice';
import { addToCart, addToWishlist, removeFromWishlist } from '../Slice/ShopSlice';
import Navbar from '../components/Navbar';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { IoMdClose } from 'react-icons/io';
import { toast } from 'react-toastify';
import { fetchUserDetails } from '../Slice/authSlice';



function SearchProduct() {
    const location = useLocation();
    const result = location.state?.result || "";

    const dispatch = useDispatch();
    const { loading, products } = useSelector(state => state.product);
    const wishlist = useSelector(state => state.shop.wishlist);

    const [filtered, setFiltered] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [wishlistItems, setWishlistItems] = useState([]);

    const openModal = (product) => setSelectedProduct(product);
    const closeModal = () => setSelectedProduct(null);

    const { user } = useSelector(state => state.auth);
    useEffect(() => {
        dispatch(FetchProducts({page:1,search:result}));
        dispatch(fetchUserDetails())
    }, [dispatch,result]);

    useEffect(() => {
        if (products.length > 0) {
            const filteredProducts = products.filter(product =>
                product.name.toLowerCase().includes(result.toLowerCase()) ||
                product.category.toLowerCase().includes(result.toLowerCase())
            );
            setFiltered(filteredProducts);
        }
    }, [products, result]);

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
        <div className="bg-blue-50 min-h-screen">
            <Navbar />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-24 pb-10 px-6">
                {loading ? (
                    <p>Loading products...</p>
                ) : (
                    filtered.map((product) => {
                        const isInWishlist = wishlist.some(item => item.id === product.id);
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
                                            handleAddToCart(product)
                                        }}
                                    >
                                        Add to Cart
                                    </button>
                                    {wishlistItems.includes(product._id) ? (
                                        <AiFillHeart
                                            className="w-6 h-6 text-red-500 cursor-pointer"
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

export default SearchProduct;
