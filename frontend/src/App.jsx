
import './App.css'
import Home from './components/Home';
import Login from './pages/Login';
import Registration from './pages/RegistrationForm';
import './index.css';
import { Route,Routes, useParams} from 'react-router-dom';
import Products from './pages/Products';

import Cart from './pages/Cart';
import SearchProduct from './pages/SearchProduct';
import Order from './pages/Order';
import OrderList from './pages/OrderList';
import Wishlist from './pages/Wishlist';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CategoriesList from './pages/CategoriesList';

import AdminHome from './Admin/AdminHome';
import AdminProduct from './Admin/AdminProduct';
import AdminUser from './Admin/AdminUser';
import AdminProtected from './Admin/AdminProtected';

function App() {

  return (
    <>
      <ToastContainer/>
      
      
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/products" element={<Products />} />
          <Route path="/category/:categoryName" element={<Category/>}/>
          <Route path="/cart" element={<Cart />} />
          <Route path='/search' element={<SearchProduct/>}/>
          <Route path='/payment' element={<Order/>}/>
          <Route path='/orders' element={<OrderList/>}/>
          <Route path='/wishlist' element={<Wishlist/>}/>



          {/* <Route path='/admin' element={<AdminProtected><AdminHome/></AdminProtected>}/>
          <Route path='/adminproduct' element={<AdminProtected><AdminProduct/></AdminProtected>}/>
          <Route path='/adminuser' element={<AdminProtected><AdminUser/></AdminProtected>}/> */}


          <Route path='/admin' element={<AdminHome/>}/>
          <Route path='/adminproduct' element={<AdminProduct/>}/>
          <Route path='/adminuser' element={<AdminUser/>}/>

        </Routes>
      
    
    </>
  )
}
const Category=() => {
  const {categoryName} = useParams();
  return <CategoriesList categoryName={categoryName}/>
}


export default App
