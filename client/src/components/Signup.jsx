import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import Login from './Login';
import Passwordfeild from './Passwordfeild';

const Signup = () => {
    const navigate=useNavigate();
    const[name,setName]=useState('');
    const[email,setEmail]=useState('');
    const[password,setPassword]=useState('');
    const[confirmPassword,setConfirmPassword]=useState('');
    const[error,setError]=useState('');

    const handleSignup=async(e)=>{
        e.preventDefault();
        try{
            const response=await axios.post('http://localhost:5001/users',{name,email,password,confirmPassword});
            navigate('/login');
            

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
      <form onSubmit={handleSignup} className="bg-white p-6 rounded-xl shadow-md w-80 space-y-3">
        <h2 className="text-2xl font-semibold text-center">Signup</h2>

        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input type="text" placeholder="Enter your name" value={name} onChange={(e)=>setName(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-0 focus:ring-2 focus:ring-blue-400"/>
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input type="email" placeholder="Enter your mail" value={email} onChange={(e)=>setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-0 focus:ring-2 focus:ring-blue-400"/>
        </div>

        <div>
          <label className="block mb-1 font-medium">Password</label>
          <Passwordfeild type="password" placeholder="Enter your password" value={password} onChange={(e)=>setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-0 focus:ring-2 focus:ring-blue-400"/>
        </div>

        <div>
          <label className="block mb-1 font-medium">Confirm Password</label>
          <Passwordfeild type="password" placeholder="Enter your password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-0 focus:ring-2 focus:ring-blue-400"/>
        </div>

        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600" type='submit'>
          Signup
        </button>

        <p className="text-center text-sm mt-2">
          Already have an account?
        </p>
        <Link to='/login' className="block w-full border py-2 rounded hover:bg-gray-100 text-center">
          Login
        </Link>
        {error && (
        <p>{error}</p>
      )}
      </form>
      
    </div>
  )
}

export default Signup