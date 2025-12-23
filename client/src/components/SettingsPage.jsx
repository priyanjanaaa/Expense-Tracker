import React from 'react'
import Expensespage from './Expensespage'
import Home from './Home'
import BudgetPage from './BudgetPage'
import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const SettingsPage = () => {
    const[name,setName]=useState('');
    const[email,setEmail]=useState('');
    const[password,setPassword]=useState('');
    const[error,setError]=useState('');
    const[oldPassword,setOldPassword]=useState('');
    const[newPassword,setNewPassword]=useState('');

    const handleProfileUpdate=async()=>{
        try{
            const response=await axios.put('http://localhost:5001/settings/profile',{name,email,password},{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}`
                }
            });
            setError(response.data.message); 
        }catch(e){
            if(e.response && e.response.data){
                setError(e.response.data);
            }
            else{
                setError("Something went wrong")
            }
        }
    }

    const handlePasswordUpdate=async()=>{
        try{
            const response=await axios.put('http://localhost:5001/settings/password',{oldPassword,newPassword},{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}`
                }
            });
            setError(response.data.message)

        }catch(e){
            if(e.response && e.response.data){
                setError(e.response.data);
            }
            else{
                setError("Something went wrong")
            }
        }
    }

  return (
     <div className="flex min-h-screen bg-[#121212] text-white">
        <aside className="w-60 bg-[#1A1A1A] p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-6 ">Expense Tracker</h1>
        <nav className="space-y-32 text-gray-300 mb-100 text-center">
            <p><Link to='/home' className="hover:text-white cursor-pointer">🏠 Dashboard</Link></p>
            <p><Link to='/expenses' className="hover:text-white cursor-pointer">📄 Expenses</Link></p>
            <p><Link to='/budget' className="hover:text-white cursor-pointer">💰 Budgets</Link></p>
            <p className="hover:text-white cursor-pointer">⚙ Settings</p>
            <p className="hover:text-red-400 cursor-pointer">🚪 Logout</p>
        </nav>
      </aside>
      <main className="flex-1 p-10 space-y-8">
        <div className='bg-[#1E1E1E] p-6 rounded-xl'>
            <h3 className="text-lg font-semibold mb-3">Update Profile</h3>
            <input
            placeholder='Enter your new Username'
            className='w-full p-2 mb-2 rounded'
            value={name}
            onChange={(e)=>setName(e.target.value)}>
            </input>

            <input
            placeholder='Enter your new email'
            className='w-full p-2 mb-2 rounded'
            value={email}
            onChange={(e)=>setEmail(e.target.value)}>
            </input>

            <input
            placeholder='Confirm your password'
            className='w-full p-2 mb-2 rounded'
            type='password'
            value={password}
            onChange={(e)=>setPassword(e.target.value)}>
            </input>

            <button
            className='bg-blue-600 px-4 py-2 rounded'
            onClick={handleProfileUpdate}>
                submit
            </button>
        </div>

        <div className="bg-[#1E1E1E] p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-3">Update Password</h3>
            <input
            placeholder='Enter your old password'
            className='w-full p-2 mb-2 rounded'
            type='password'
            value={oldPassword}
            onChange={(e)=>setOldPassword(e.target.value)}></input>

            <input
            placeholder='Enter your new password'
            className='w-full p-2 mb-2 rounded'
            type='password'
            value={newPassword}
            onChange={(e)=>setNewPassword(e.target.value)}></input>

            <button
            className='bg-blue-600 px-4 py-2 rounded'
            onClick={handlePasswordUpdate}>
                submit
            </button>
           

        </div>
        {error && (
            <p className="text-yellow-400">{error}</p>
        )}

      </main>

     </div>

  )
}

export default SettingsPage