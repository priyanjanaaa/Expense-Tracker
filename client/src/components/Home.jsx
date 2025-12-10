import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";

const Home = () => {
    const[addExpenses,setAddExpenses]=useState(false);
    const[addCategory,setAddCategory]=useState('');
    const[budget,setBudget]=useState(null);
    const[error,setError]=useState('');
    const[date,setDate]=useState("");
    const[category,setCategory]=useState('');
    const[description,setDescription]=useState('');
    const[amount,setAmount]=useState("");
    const[expenses,setExpenses]=useState([]);
    const[categoryName,setCategoryName]=useState('');
    const[categoryColor,setCategoryColor]=useState('');
    const presetColors = ["#FF5733","#33FF57","#3357FF","#FF33B8","#FFC300","#00C9FF","#8E44AD"];


    const handleSubmitExpense=async(e)=>{
      e.preventDefault();
      try{
        const response=await axios.post('http://localhost:5001/expense',{
          date,category,description,amount
        },{
          headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
          }
        });
        setError(response.data.message);
        setAddExpenses(false);
        loadData();
        setDate("");
        setCategory("");
        setDescription("");
        setAmount("");


      }catch(e){
        if(e.response && e.response.data){
          setError(e.response.data);
        }
        else{
          setError("Something went wrong");
        }
      }

    }

    const loadData=async()=>{
      try{
        const response=await axios.get("http://localhost:5001/expense",{
          headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
          }
        });
        setExpenses(response.data);

      }catch(e){
        if(e.response && e.response.data){
          setError(e.response.data);
        }
        else{
          setError("Something went wrong");
        }
      }
    }

    useEffect(()=>{
      loadData();
    },[])

    const handleAddCategory=async()=>{
      try{
        const response=await axios.post('http://localhost:5001/category',{name:categoryName,color:categoryColor},{
          headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
          }
        });
        setError(response.data.message);
        setAddCategory(false);
        setCategoryName('');
        setCategoryColor('');

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
    
    <div className="flex min-h-screen bg-[#121212] text-white">
       
      {/* ================= SIDEBAR ================= */}
      <aside className="w-60 bg-[#1A1A1A] p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-6 ">Expense Tracker</h1>

        <nav className="space-y-32 text-gray-300 mb-100 text-center">
          <p className="hover:text-white cursor-pointer">🏠 Dashboard</p>
          <p className="hover:text-white cursor-pointer">📄 Expenses</p>
          <p className="hover:text-white cursor-pointer">🏷 Categories</p>
          <p className="hover:text-white cursor-pointer">💰 Budgets</p>
          <p className="hover:text-white cursor-pointer">⚙ Settings</p>
          <p className="hover:text-red-400 cursor-pointer">🚪 Logout</p>
        </nav>
      </aside>
      

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-10 space-y-8">

        {/* ======== TOP: Left & Right Boxes ======== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* ========== LEFT: Monthly Overview Card ========== */}
          <div className="bg-[#1E1E1E] p-6 rounded-xl shadow space-y-4">
            <h3 className="text-xl font-semibold">Monthly Overview</h3>

            <div className="space-y-3">
              <div className="flex justify-between bg-[#2A2A2A] p-3 rounded-lg">
                <span>Monthly Budget</span>
                <span className="text-green-400 font-semibold">₹ 10,000</span>
              </div>
              <div className="flex justify-between bg-[#2A2A2A] p-3 rounded-lg">
                <span>Used</span>
                <span className="text-red-400 font-semibold">₹ 6,400</span>
              </div>
              <div className="flex justify-between bg-[#2A2A2A] p-3 rounded-lg">
                <span>Remaining</span>
                <span className="text-yellow-300 font-semibold">₹ 3,600</span>
              </div>
              <div className="flex justify-between bg-[#2A2A2A] p-3 rounded-lg">
                <span>Recurring Expenses</span>
                <span className="text-blue-400 font-semibold">₹ 1,200</span>
              </div>
            </div>
          </div>

          {/* ========== RIGHT: Recent Expenses Card ========== */}
          <div className="bg-[#1E1E1E] p-6 rounded-xl shadow space-y-4">
            <h3 className="text-xl font-semibold">Recent Expenses</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 text-sm border-b border-gray-700">
                    <th className="p-2">Date</th>
                    <th className="p-2">Category</th>
                    <th className="p-2">Description</th>
                    <th className="p-2 text-right">Amount</th>
                  </tr>
                </thead>

                <tbody className="text-sm">
                  {expenses.length > 0 ? (
                    expenses.map((exp, index) => (
                      <tr key={index} className="hover:bg-[#2A2A2A] transition">
                        <td className="p-2">{new Date(exp.date).toLocaleDateString()}</td>
                        <td className="p-2">
                          <span className="bg-purple-600 px-2 py-1 text-xs rounded">{exp.category}</span>
                        </td>
                        <td className="p-2">{exp.description}</td>
                        <td className="p-2 text-right text-red-400 font-semibold">₹{exp.amount}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td className="p-2 text-gray-500" colSpan="4">No expenses yet</td></tr>
                  )}

                </tbody>

              </table>
            </div>
          </div>
        </div>

        {/* ================= QUICK ACTION BOX ================= */}
        <div className="bg-[#1E1E1E] p-6 rounded-xl shadow space-y-4 w-full">
          <h3 className="text-xl font-semibold">Quick Actions</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button className="bg-[#2A2A2A] hover:bg-[#333] p-4 rounded-lg text-center border border-gray-700 transition font-semibold " onClick={()=>setAddExpenses(true)}>
              + Add Expense
            </button>
            <button className="bg-[#2A2A2A] hover:bg-[#333] p-4 rounded-lg text-center border border-gray-700 transition font-semibold" onClick={()=>setAddCategory(true)}>
              + Add Category
            </button>
            <button className="bg-[#2A2A2A] hover:bg-[#333] p-4 rounded-lg text-center border border-gray-700 transition font-semibold">
              + Set Budget
            </button>
          </div>
        </div>
      </main>

      {addExpenses && (
        <div className="absolute top-10 left-72 bg-white text-black p-6 rounded-xl shadow-xl border border-gray-300 w-80 z-50">

            <h2 className="text-lg font-semibold mb-4">Add Expense</h2>

            <form className="space-y-4" onSubmit={handleSubmitExpense}>

            {/* Date */}
            <input 
                type="date"
                className="w-full border p-2 rounded"
                value={date}
                onChange={(e)=>setDate(e.target.value)}
            />

            {/* Category */}
            <select className="w-full border p-2 rounded" value={category} onChange={(e)=>setCategory(e.target.value)}>
                <option>Select Category</option>
                <option value="food">Food</option>
                <option value="transport">Transport</option>
                <option value="shopping">Shopping</option>
                <option value="bills">Bills</option>
            </select>

            {/* Description */}
            <textarea 
                placeholder="Enter description"
                className="w-full border p-2 rounded resize-none"
                rows="3"
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
            ></textarea>

            {/* Amount */}
            <input 
                type="number"
                placeholder="Enter amount spent"
                className="w-full border p-2 rounded"
                value={amount}
                onChange={(e)=>setAmount(e.target.value)}
            />

            {/* Buttons */}
            <div className="flex gap-3 mt-3">
                <button 
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                Submit
                </button>

                <button 
                type="button" 
                onClick={()=>setAddExpenses(false)}
                className="flex-1 border py-2 rounded hover:bg-gray-200"
                >
                Cancel
                </button>
            </div>

            </form>
        </div>
    )}

  {addCategory && (
  <div className="absolute top-10 left-72 bg-white text-black p-6 rounded-xl w-80 border shadow-xl z-50">

    <h2 className="text-lg font-semibold mb-4">Add Category</h2>

    {/* Category Name */}
    <input 
      placeholder="Category Name"
      value={categoryName}
      onChange={(e)=>setCategoryName(e.target.value)}
      className="w-full border p-2 rounded mb-4"
    />

    {/* Color Selection */}
    <div className="mb-4">
      <p className="text-sm mb-2 font-medium">Choose color:</p>
      <div className="flex gap-2 flex-wrap">
        {presetColors.map(c => (
          <div
            key={c}
            className={`w-8 h-8 rounded cursor-pointer border ${categoryColor === c ? "border-4 border-black":"border-gray-300"}`}
            style={{background:c}}
            onClick={()=>setCategoryColor(c)}
          ></div>
        ))}
      </div>
    </div>

    <div className="flex gap-3">
      <button 
        onClick={handleAddCategory}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Save
      </button>

      <button 
        className="w-full border py-2 rounded hover:bg-gray-200"
        onClick={()=>setAddCategory(false)}
      >
        Cancel
      </button>
    </div>
  </div>
)}
{error && (
  <p>{error}</p>
)}


</div>
    
  );
};

export default Home;
