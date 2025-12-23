import React from 'react'
import axios from 'axios'
import { useState,useEffect } from 'react'
import { Link } from 'react-router-dom'
import Expensespage from './Expensespage'
import Home from './Home'
import SettingsPage from './SettingsPage'

const BudgetPage = () => {
    const[totalBudget,setTotalBudget]=useState(0);
    const[categoryBudget,setCategoryBudget]=useState([]);
    const[error,setError]=useState();
    const[expenses,setExpenses]=useState([]);
    const now=new Date();
    const month=now.getMonth()+1;
    const year=now.getFullYear();

    const getMonthlyData=async()=>{
      try{
        const response=await axios.get(`http://localhost:5001/budget?month=${month}&year=${year}`,{
          headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
          }
        });
        setTotalBudget(response.data.totalBudget);
        setCategoryBudget(response.data.categoryBudget);


      }catch(e){
        if(e.response && e.response.data){
          setError(e.response.data);
        }
        else{
          setError("Something went wrong");
        }
      }
    }

    const getExpenses=async()=>{
        try{
            const response=await axios.get('http://localhost:5001/expense',{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}`
                }
            });
            setExpenses(response.data);

        }catch(e){
            if(e.response && e.response.data){
                setError(e.response.data)
                
            }else{
                setError("Something went wrong.")
            }

        }
    }


    useEffect(()=>{
      getMonthlyData();
      getExpenses();

    },[]);
    const totalSpent=expenses.reduce((sum,exp)=>sum+Number(exp.amount),0);
    const remaining=totalBudget-totalSpent;

    const spentMap={};
    expenses.forEach(exp=>{
        const id=exp.category?._id;
        spentMap[id]=(spentMap[id]||0)+Number(exp.amount);
})

 return (
  <div className="flex min-h-screen bg-[#121212] text-white">
          <aside className="w-60 bg-[#1A1A1A] p-6 space-y-6">
                  <h1 className="text-2xl font-bold mb-6 ">Expense Tracker</h1>
                  <nav className="space-y-32 text-gray-300 mb-100 text-center">
                      <p><Link to='/home' className="hover:text-white cursor-pointer">🏠 Dashboard</Link></p>
                      <p><Link to='/expenses' className="hover:text-white cursor-pointer">📄 Expenses</Link></p>
                      <p><Link to='/budget' className="hover:text-white cursor-pointer">💰 Budgets</Link></p>
                      <p><Link to='/settings' className="hover:text-white cursor-pointer">⚙ Settings</Link></p>
                      <p className="hover:text-red-400 cursor-pointer">🚪 Logout</p>
                  </nav>
          </aside>

    {/* ===== Sidebar (optional if you already included) ===== */}
    <aside className="w-60 bg-[#1A1A1A] p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Expense Tracker</h1>
    </aside>

    {/* ================= MAIN CONTENT ================= */}
    <main className="flex-1 p-10 space-y-10">

      {/* ---------- OVERALL BUDGET SUMMARY ----------- */}
      <div className="bg-[#1E1E1E] p-6 rounded-xl space-y-3 shadow">
        <h2 className="text-xl font-semibold mb-2">Monthly Budget Summary</h2>

        <div className="flex justify-between">
          <span>Total Budget</span>
          <span className="text-green-400 font-semibold">₹{totalBudget}</span>
        </div>

        <div className="flex justify-between">
          <span>Spent</span>
          <span className="text-red-400 font-semibold">₹{totalSpent}</span>
        </div>

        <div className="flex justify-between">
          <span>Remaining</span>
          <span className="text-yellow-300 font-semibold">
            ₹{remaining}
          </span>
        </div>
      </div>


      {/* ---------- CATEGORY WISE BUDGET ----------- */}
      <div className="bg-[#1E1E1E] p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-semibold">Category Wise Budget</h2>

        {categoryBudget?.length > 0 ? (
  categoryBudget.map(c => {
    
    const spentAmount = spentMap[c.categoryId?._id] || 0;

    return (
      <div key={c.categoryId?._id}
        className="bg-[#2A2A2A] p-4 rounded-lg flex justify-between items-center">

        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded"
            style={{ background: c.categoryId?.color }}>
          </span>

          <span className="font-medium">
            {c.categoryId?.name}
          </span>
        </div>

        <div className="text-sm text-gray-300">
          <p>Budget: ₹{c.limit}</p>
          <p>Spent: ₹{spentAmount}</p>

          <p className={spentAmount > c.limit ? "text-red-400" : "text-green-400"}>
            Remaining: ₹{c.limit - spentAmount}
          </p>
        </div>

      </div>
    );
  })
) : (
  <p className="text-gray-400">No category budgets set yet.</p>
)}
      </div>

    </main>
  </div>
);
}

export default BudgetPage;