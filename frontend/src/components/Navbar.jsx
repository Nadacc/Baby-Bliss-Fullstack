import React, {  useEffect, useState } from 'react';
import { FaSearch, FaUser, FaShoppingBasket, FaHeart, FaBars, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import { fetchUserDetails } from '../Slice/authSlice';

function Navbar() {
  
  const [search, setSearch] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn,setIsloggedIn]=useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  //const username = localStorage.getItem('username');
  const cartCount = useSelector(state => state.shop.cartCount)

  useEffect(() => {
    dispatch(fetchUserDetails());

  },[dispatch])
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = () => {
    navigate('/search', { state: { result: search } });
  };

  const handleOrders = () => {
    navigate('/orders');
  };

  const handleLogIn = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('id');
    localStorage.removeItem('username');
    // setCartCount(0);
    setIsloggedIn(false);
    setIsMenuOpen(false)
    navigate('/'); 
  };

  return (
    <div>
      <nav className="bg-white shadow-md h-16 flex items-center justify-between px-6 lg:px-8 fixed w-full z-50">
        
        <h1
          className="font-bold text-2xl lg:text-3xl text-indigo-600 cursor-pointer hover:text-indigo-700 transition duration-300"
          onClick={() => navigate('/')}
        >
          Baby Bliss
        </h1>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <FaBars
            className="text-2xl cursor-pointer text-gray-600"
            onClick={() => setIsMenuOpen(true)}
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex gap-8 items-center text-xl text-gray-600">
          
          <div className="relative flex items-center border rounded-full px-2 py-1 bg-gray-100">
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search..."
              className="outline-none bg-transparent px-2 py-1 flex-grow text-gray-700"
            />
            <FaSearch
              onClick={handleSearchSubmit}
              className="text-gray-500 cursor-pointer hover:text-gray-700 transition duration-300"
            />
          </div>

          
          <FaHeart
            className="cursor-pointer hover:text-red-600"
            onClick={() => navigate('/wishlist')}
          />

          
          <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
            <FaShoppingBasket />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-sm w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </div>

          
          <div className="relative">
            <div
              className="flex items-center cursor-pointer hover:text-indigo-600 transition duration-300"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="flex items-center bg-gray-200 p-2 rounded-full">
                <FaUser className="text-xl" />
                {user && <span className="ml-2 text-lg text-gray-700">{user?.username}</span>}
              </div>
            </div>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg w-40 z-50">
                <ul>
                  <li
                    className="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-200"
                    onClick={handleOrders}
                  >
                    Orders
                  </li>
                  <li
                    className="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-200"
                    onClick={handleLogout}
                  >
                    Logout
                  </li>
                  <li
                    className="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-200"
                    onClick={handleLogIn}
                  >
                    Log In
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-0 left-0 w-full h-screen bg-white z-50">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-2xl font-bold text-indigo-600">Menu</h2>
              <FaTimes
                className="text-2xl cursor-pointer text-gray-600"
                onClick={() => setIsMenuOpen(false)}
              />
            </div>

            <div className="flex flex-col items-start px-6 py-4 gap-4 text-lg text-gray-700">
              <div className="flex items-center w-full">
                <input
                  type="text"
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search..."
                  className="flex-grow outline-none border-b"
                />
                <button
                  onClick={handleSearchSubmit}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-r-full hover:bg-indigo-700 transition duration-300"
                >
                  <FaSearch />
                </button>
              </div>
              <button onClick={() => navigate('/wishlist')} className="flex items-center w-full">
                <FaHeart className="mr-2" /> Wishlist
              </button>
              <button onClick={() => navigate('/cart')} className="flex items-center w-full">
                <FaShoppingBasket className="mr-2" /> Cart ({cartCount})
              </button>
              <button onClick={handleOrders} className="flex items-center w-full">
                <FaUser className="mr-2" /> Orders
              </button>
              <button onClick={handleLogout} className="flex items-center w-full">
                <FaUser className="mr-2" /> Logout
              </button>
              <button onClick={handleLogIn} className="flex items-center w-full">
                <FaUser className="mr-2" /> Log In
              </button>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
