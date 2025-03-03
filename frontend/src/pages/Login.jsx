import React from 'react'
import { Formik ,Form,Field,ErrorMessage} from 'formik'
import * as Yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import { toast,ToastContainer } from 'react-toastify';
import axios from 'axios';
//import { setLoggedIn } from '../Slice/AdminSlice';
import { useDispatch } from 'react-redux';
import axiosInstance from '../api/axiosInstance';
import { setUser } from '../Slice/authSlice';

function Login() {
    const navigate=useNavigate();
    const dispatch = useDispatch();
    const initialValues =  {
    
        email:'',
        password:''
        
    }
    
    // const onSubmit = async(values) =>{
    //     // console.log("form data",values);
    
    //     try{
    //         if(values.email ==='ccnada15@gmail.com' && values.password ==='N_ada_15'){
    //           dispatch(setLoggedIn(true));
    //           navigate('/admin');
    //         }
    //         else{
    //           const response=await axios.get('http://localhost:5000/users')
    //         console.log(response);
            
    //         const user = response.data.find(
    //             (u) => u.email === values.email && u.password === values.password
    //           );
            
    //         if(user) {
    //           if(!user.status){
    //             toast.error("You are blocked")
    //             return;
    //           }
    //             toast.success('Login successful!');
    //             localStorage.setItem("id",user.id);
    //             localStorage.setItem("username",user.username)
    //             navigate('/'); 
    //           } 
    //           else {
    //             toast.error('Invalid email or password. Please try again.');
    //           }
            
    //         }
    //       }
    //     catch(error){
    //         console.log('login error',error)
    //         toast.error('An error occur.Please try again')
    //       }
        
    // }




    const onSubmit = async (values,{resetForm}) => {
      try{
        const response=await axiosInstance.post('/users/login',values)
   
        if (!response.data || !response.data.user) {
          throw new Error("Invalid response structure. No user data received.");
        }
    
        setUser(response.data.user.name);
        console.log(response.data,"data")
        const userRole=response.data.user.isAdmin ?'admin':'user'
        console.log(userRole)


    //     localStorage.setItem("token", response.data.token);  // Store token for authentication
    // localStorage.setItem("user", JSON.stringify(response.data.user));
  
        // localStorage.setItem('user',JSON.stringify(response.data.user))
        navigate(userRole==='admin'?'/admin':'/')
        resetForm()
        toast.success(response.data.message)
      }
      catch(error){
        console.error("Login error:", error.response?.data || error);
        const errorMessage=error.response?.data?.message ||'Something went wrong.Please try again'
        toast.error(errorMessage)
      }
    };
    
    const validationSchema = Yup.object({
        
        email:Yup.string()
        .email('Invalid email format')
        .required('email is required'),
        password:Yup.string()
        .required('password is required')
        .min(8, 'Password must be at least 8 characters long')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[!@#$%^&*_(),.?":{}|<>]/, 'Password must contain at least one special character (!@#$%^&*)')
    })
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Formik  
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}>
            <Form 
                className="p-6 bg-white rounded shadow-lg">

                


                <div className='mb-2'>
                    <label  className='font-bold flex mb-5'>E-mail</label>
                    <Field 
                    type='email' 
                    id='email' 
                    name='email' 
                    className="block w-full py-1.5 px-3 text-xl text-gray-800 bg-white border-2 rounded "
                    /><br/>
                    <ErrorMessage name='email' component='div' className="text-red-500  text-sm"/>
                </div>

                <div className='mb-2'>
                    <label  className='font-bold flex mb-5'>Password</label>
                    <Field 
                    type='password' 
                    id='password' 
                    name='password' 
                    
                    className="block w-full py-1.5 px-3 text-xl text-gray-800 bg-white border-2 rounded "
                    /><br/>
                    <ErrorMessage name='password' component='div' className="text-red-500 mt-1 text-sm"/>
                </div>


                <button type="submit"
                className="w-full py-2 px-4 bg-blue-500 text-white rounded mt-4 hover:bg-blue-600">Sign In</button>

                <p>Don't have an account?
                <Link to='/register' className='text-green-600'><strong>Register</strong></Link>
                </p>
                
            </Form>
        </Formik>
        
    </div>
  )
}

export default Login