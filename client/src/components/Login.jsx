import React from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Signup from './Signup';

const Login = () => {
  const navigate=useNavigate();
    const[email,setEmail]=useState('');
    const[password,setPassword]=useState('');
    const[error,setError]=useState('');

    const handleLogin=async(e)=>{
        e.preventDefault();
        try{
            const response=await axios.post('http://localhost:5001/login',{email,password});
            setError(response.data.message);
            localStorage.setItem("token",response.data.token);
            
            

        }catch(e){
            if(e.response && e.response.data){
                setError(e.response.data);
            }
            else{
                setError("Something went wrong");
            }
        }

    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-xl shadow-md w-80 space-y-3">
        <h2 className="text-2xl font-semibold text-center">Login</h2>


        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input type="email" placeholder="Enter your mail" value={email} onChange={(e)=>setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-0 focus:ring-2 focus:ring-blue-400"/>
        </div>

        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input type="password" placeholder="Enter your password" value={password} onChange={(e)=>setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-0 focus:ring-2 focus:ring-blue-400"/>
        </div>

        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600" type='submit'>
          Login
        </button>

        <p className="text-center text-sm mt-2">
          Dont have an account?
        </p>
        <Link
            to='/'
            className="block w-full border py-2 rounded hover:bg-gray-100 text-center"
            >
            SignUp
        </Link>
        {error && (
        <p>{error}</p>
      )}
      </form>
      
    </div>
  )
}

export default Login