import React from 'react'
import { Formik ,Form,Field,ErrorMessage} from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { ToastContainer,toast } from 'react-toastify'
import axiosInstance from '../api/axiosInstance'




function Registration() {

  const navigate=useNavigate();
  const initialValues =  {
    name:'',
    username:'',
    email:'',
    password:'',
    confirmpassword:'',
    
}



const validationSchema = Yup.object({
    username:Yup.string()
    .required('username is required!'),
    email:Yup.string()
    .email('Invalid email format')
    .required('email is required'),
    password:Yup.string()
    .required('password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*_(),.?":{}|<>]/, 'Password must contain at least one special character (!@#$%^&*)'),
    confirmpassword:Yup.string()
    .oneOf([Yup.ref('password')],'password must match')
    .required('please confirm your password')
});


const RegisterSubmit = async (values,{resetForm}) => {
  console.log(values);
  
  try{
    // const existingUsername= await axios.get('http://localhost:5000/users',{
    //   params:{username :values.username}
    //  });
    // if(existingUsername.data.length>0){
    //   toast.error('Username already exists');
    //   return;
    // }
    // const existingEmail= await axios.get('http://localhost:5000/users',{
    //   params:{email :values.email}
    // })
    // if(existingEmail.data.length>0){
    //     toast.error('Email already exists.Please choose another one');
    //     return;
    // }



    const response = await axiosInstance.post('/users/register',values);
    console.log(('Registration success',response.data));
    toast.success(response.data.message)
    resetForm();
    navigate('/login')
  }
  catch(error){
    console.log("registration failed",error)
    toast.error('registration failed')
    
  }
}
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Formik  
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={RegisterSubmit}>
            <Form 
                className="p-6 bg-white rounded shadow-lg">

                <div className='mb-2'>
                    <label className='font-bold flex mb-5'>Name</label>
                    <Field 
                    type='text' 
                    id='name' 
                    name='name'  

                    className="block w-full py-1.5 px-3 text-xl text-gray-800 bg-white border-2 rounded "
                    /><br/>
                    <ErrorMessage name='name' component='div' className="text-red-500  text-sm"/>
                </div>
                <div className='mb-2'>
                    <label className='font-bold flex mb-5'>Username</label>
                    <Field 
                    type='text' 
                    id='username' 
                    name='username'  

                    className="block w-full py-1.5 px-3 text-xl text-gray-800 bg-white border-2 rounded "
                    /><br/>
                    <ErrorMessage name='username' component='div' className="text-red-500  text-sm"/>
                </div>



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
                <ErrorMessage name='password' component='div' className="text-red-500  text-sm"/>
                </div>

                <div className='mb-2'>
                    <label  className='font-bold flex mb-5'>Confirm Password</label>
                    <Field 
                    type='password' 
                    id='confirmpassword' 
                    name='confirmpassword' 
                    
                    className="block w-full py-1.5 px-3 text-xl text-gray-800 bg-white border-2 rounded "
                    /><br/>
                <ErrorMessage name='confirmpassword' component='div' className="text-red-500  text-sm"/>
                </div>


                <button type="submit"
                className="w-full py-2 px-4 bg-blue-500 text-white rounded mt-4 hover:bg-blue-600">Sign Up</button>

                
                
            </Form>
        </Formik>
        
    </div>
  )
}

export default Registration