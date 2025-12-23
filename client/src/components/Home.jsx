import React from "react";
import { useState,useEffect } from "react";
import{Link} from 'react-router-dom'
import axios from "axios";
import Expensespage from "./Expensespage";
import{
  Chart as ChartJS,
  Tooltip,
  ArcElement,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement

} from 'chart.js'
import {Pie,Bar,Line} from 'react-chartjs-2';
ChartJS.register(Tooltip,ArcElement,Legend,CategoryScale,LinearScale,PointElement,LineElement,BarElement);
const Home = () => {
    
    const[addExpenses,setAddExpenses]=useState(false);
    const[addCategory,setAddCategory]=useState(false);
    const[addBudget,setAddBudget]=useState(false);
    const[error,setError]=useState('');
    const[date,setDate]=useState("");
    const[category,setCategory]=useState('');
    const[description,setDescription]=useState('');
    const[amount,setAmount]=useState("");
    const[expenses,setExpenses]=useState([]);
    const[categoryName,setCategoryName]=useState('');
    const[categoryColor,setCategoryColor]=useState('');
    const presetColors = ["#FF5733","#33FF57","#3357FF","#FF33B8","#FFC300","#00C9FF","#8E44AD"];
    const[categoryList,setCategoryList]=useState([]);
    const [totalBudget,setTotalBudget] = useState({
  totalBudget: 0,
  categoryBudget: []
});
    const[categoryBudget,setCategoryBudget]=useState({});
    const now=new Date();
    const month=now.getMonth()+1
    const year=now.getFullYear();
    const [spent,setSpent]=useState(0);
    const[recentExpenses,setRecentExpenses]=useState([]);


    const categoriesTotal={};
    const CategoryColors={};

    expenses.forEach(exp=>{
      const name=exp.category?.name||"Others";
      categoriesTotal[name]=(categoriesTotal[name]||0)+Number(exp.amount);
      CategoryColors[name]=exp.category.color;
    })

    const pieData={
      labels:Object.keys(categoriesTotal),
      datasets:[{
        data:Object.values(categoriesTotal),
        backgroundColor:Object.keys(categoriesTotal).map(name=>CategoryColors[name])
      }]
    }

    const budgetMap={};
    totalBudget?.categoryBudget?.forEach(c=>{
      budgetMap[c.categoryId]=c.limit
    })

    const spentMap={}
    expenses.forEach(exp=>{
      const id=exp.category?._id
      spentMap[id]=(spentMap[id]||0)+Number(exp.amount);
    })

    const barLabels=categoryList.map(c=>c.name);
    const barBudget=categoryList.map(c=>(
      budgetMap[c._id]||0
    ))
    const barSpent=categoryList.map(c=>(
      spentMap[c._id]||0
    ))

    const barData={
      labels:barLabels,
      datasets:[{
        label:"Budget",
        data:barBudget,
        backgroundColor:"rgba(54, 162, 235, 0.7)"
      },{
        label:"spent",
        data:barSpent,
        backgroundColor:"rgba(255, 99, 132, 0.7)"

      }]

    }

    const dailyTotals={}
    expenses.forEach(exp=>{
      const day=new Date(exp.date).toLocaleDateString();
      dailyTotals[day]=(dailyTotals[day]||0)+Number(exp.amount);

    })
   
    const lineData={
      labels:Object.keys(dailyTotals),
      datasets:[{
        label:"Spending over Time",
        data:Object.values(dailyTotals),
        borderColor: "cyan",
        backgroundColor: "rgba(0,255,255,0.2)",
        tension: 0.3
      }]
    }

    



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
        const totalSpent=response.data.reduce((sum,exp)=>
          sum+Number(exp.amount),0
        )
        setSpent(totalSpent);
        const recent=await axios.get('http://localhost:5001/expense?limit=4',{
          headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
          }
        })
        setRecentExpenses(recent.data);

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
        loadCategories();

      }catch(e){
        if(e.response && e.response.data){
          setError(e.response.data);
        }
        else{
          setError("Something went wrong");
        }
      }
    }

    const loadCategories=async()=>{
      try{
        const response=await axios.get('http://localhost:5001/category',{
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`
        }
      });
      setCategoryList(response.data);

      }catch(e){
        if(e.response && e.response.data){
          setError(e.response.data);
        }
        else{
          setError("Something went wrong")
        }
      }
      


    }
    useEffect(()=>{
      loadCategories();
    },[])


    const handleSaveBudget=async()=>{
      try{
      const formattedCategory = Object.entries(categoryBudget).map(([id, limit]) => ({
        categoryId: id,
        limit: Number(limit),
      }));
        const response=await axios.post('http://localhost:5001/budget',{totalBudget,categoryBudget:formattedCategory,month,year},{
          headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
          }
        });
        setAddBudget(false);
        setTotalBudget('');
        setCategoryBudget('');
        getMonthlyData();
        

      }catch(e){
        if(e.resposne && e.response.data){
          setError(e.response.data);
        }
        else{
          setError("Something went wrong");
        }
      }
    }

    const getMonthlyData=async()=>{
      try{
        const response=await axios.get(`http://localhost:5001/budget?month=${month}&year=${year}`,{
          headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
          }
        });
        setTotalBudget(response.data);


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
      getMonthlyData();
    },[]);


  return (
    
    <div className="flex min-h-screen bg-[#121212] text-white">
       
      {/* ================= SIDEBAR ================= */}
      <aside className="w-60 bg-[#1A1A1A] p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-6 ">Expense Tracker</h1>

        <nav className="space-y-32 text-gray-300 mb-100 text-center">
          <p className="hover:text-white cursor-pointer">🏠 Dashboard</p>
          <p><Link to='/expenses' className="hover:text-white cursor-pointer">📄 Expenses</Link></p>
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
                <span className="text-green-400 font-semibold">{totalBudget.totalBudget}</span>
              </div>
              <div className="flex justify-between bg-[#2A2A2A] p-3 rounded-lg">
                <span>Used</span>
                <span className="text-red-400 font-semibold">{spent}</span>
              </div>
              <div className="flex justify-between bg-[#2A2A2A] p-3 rounded-lg">
                <span>Remaining</span>
                <span className="text-yellow-300 font-semibold">{totalBudget.totalBudget-spent}</span>
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
                  {recentExpenses.length > 0 ? (
                    recentExpenses.map((exp, index) => (
                      <tr key={index} className="hover:bg-[#2A2A2A] transition">
                        <td className="p-2">{new Date(exp.date).toLocaleDateString()}</td>
                        <td className="p-2">
                          <span
                            className="px-2 py-1 text-xs rounded"
                            style={{ background: exp.category?.color }}
                          >
                            {exp.category?.name}
                          </span>
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
            <button className="bg-[#2A2A2A] hover:bg-[#333] p-4 rounded-lg text-center border border-gray-700 transition font-semibold" onClick={()=>setAddBudget(true)}>
              + Set Budget
            </button>
          </div>
        </div>
        
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">

        <div className="lg:col-span-2 bg-[#1E1E1E] p-6 rounded-l shadow">
          <h3 className="text-xl font-semibold mb-4">Spending Trend</h3>
          <Line data={lineData} height={50}/>
        </div>


        <div className="bg-[#1E1E1E] p-4 rounded-l shadow">
          <h3 className="text-xl font-semibold mb-4">Category Breakdown</h3>
          <div className="flex justify-center items-center">
            <div className="w-[320px] h-[320px]">
            <Pie data={pieData} />
          </div>

          </div>
          
          
         </div>


        <div className="bg-[#1E1E1E] p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-4">Budget vs Spent</h3>
          <Bar data={barData}/>
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
            <select 
              value={category}
              onChange={(e)=>setCategory(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Category</option>

              {categoryList.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
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

{addBudget && (
  <div className="absolute top-10 left-72 bg-white text-black p-6 rounded-xl w-96 border shadow-xl z-50">

    <h2 className="text-lg font-semibold mb-4">Set Budget</h2>

    <div className="space-y-4">
      {/* Total Monthly Budget */}
      <div>
        <label className="block mb-1 font-medium">Total Monthly Budget</label>
        <input 
          type="number"
          placeholder="Enter total budget"
          className="w-full border p-2 rounded"
          value={totalBudget.totalBudget}
          onChange={(e) => setTotalBudget(e.target.value)}
        />
      </div>

      {/* Category-wise Budgets */}
      <div>
        <p className="font-medium mb-2">Category-wise Limits (optional)</p>

        <div className="space-y-3 max-h-48 overflow-y-auto pr-1">

          {categoryList.map(cat => (
            <div key={cat._id} className="flex items-center justify-between">
              
              {/* Category label with color badge */}
              <div className="flex items-center gap-2">
                <span 
                  className="w-4 h-4 rounded"
                  style={{ background: cat.color }}
                ></span>
                <p>{cat.name}</p>
              </div>

              {/* Input for limit */}
              <input 
                type="number"
                placeholder="₹"
                className="border p-1 w-24 rounded"
                value={categoryBudget[cat._id] || ""}
                onChange={(e) =>
                  setCategoryBudget(prev => ({
                    ...prev,
                    [cat._id]: e.target.value
                  }))
                }
              />
            </div>
          ))}

        </div>
      </div>
    </div>

    {/* Buttons */}
    <div className="flex gap-3 mt-5">
      <button 
        onClick={handleSaveBudget}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Save
      </button>

      <button 
        className="w-full border py-2 rounded hover:bg-gray-200"
        onClick={() => setAddBudget(false)}
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
