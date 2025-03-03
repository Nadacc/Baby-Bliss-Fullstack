import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoMdClose } from 'react-icons/io';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import Navbar from '../components/Navbar';
import { FetchProducts } from '../Slice/ProductSlice';
import { addToCart, addToWishlist, removeFromWishlist } from '../Slice/ShopSlice';

function CategoriesList({ categoryName }) {
    const dispatch = useDispatch();
    const productList = useSelector(state => state.product.products);
    const wishlist = useSelector(state => state.shop.wishlist);
    const id = localStorage.getItem("id");

    useEffect(() => {
        dispatch(FetchProducts());
    }, [dispatch]);

    const data = productList.filter((item) => item.category.toLowerCase() === categoryName.toLowerCase());

    const [selectedProduct, setSelectedProduct] = useState(null);
    
    const openModal = (product) => setSelectedProduct(product);
    const closeModal = () => setSelectedProduct(null);

    return (
        <div>
            <Navbar />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-24 pb-10 pl-6 pr-6">
                {data.map((product) => {
                    const isInWishlist = wishlist.some((item) => item.id === product.id);
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
                                        dispatch(addToCart({ product, userId: id }));
                                    }}
                                >
                                    Add to Cart
                                </button>
                                {isInWishlist ? (
                                    <AiFillHeart
                                        className="w-6 h-6 text-red-500 bg-white cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            dispatch(removeFromWishlist({ productId: product.id, userId: id }));
                                        }}
                                    />
                                ) : (
                                    <AiOutlineHeart
                                        className="w-6 h-6 cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            dispatch(addToWishlist({ product, userId: id }));
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
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
                                onClick={() => {
                                    dispatch(addToCart({ product: selectedProduct, userId: id }));
                                    closeModal();
                                }}
                            >
                                Add to Cart
                            </button>
                            {wishlist.some((item) => item.id === selectedProduct.id) ? (
                                <AiFillHeart
                                    className="w-6 h-6 text-red-500 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        dispatch(removeFromWishlist({ productId: selectedProduct.id, userId: id }));
                                        closeModal();
                                    }}
                                />
                            ) : (
                                <AiOutlineHeart
                                    className="w-6 h-6 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        dispatch(addToWishlist({ product: selectedProduct, userId: id }));
                                        closeModal();
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
