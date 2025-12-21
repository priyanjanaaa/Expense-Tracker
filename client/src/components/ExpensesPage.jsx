import React from 'react'
import axios from 'axios'
import { useState,useEffect } from 'react'


const Expensespage = () => {
    const[expenses,setExpenses]=useState([]);
    const[error,setError]=useState('');

    const loadData=async()=>{
        try{
            const response=await axios.get('http://localhost:5001/expense',{
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
    },[]);

  return (
<>
      <div className=" p-6 rounded-xl shadow space-y-4">
        <h3 className="text-xl font-semibold">All Expenses</h3>

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
                      <span
                        className="px-2 py-1 text-xs rounded"
                        style={{ background: exp.category?.color }}
                      >
                        {exp.category?.name}
                      </span>
                    </td>

                    <td className="p-2">{exp.description}</td>
                    <td className="p-2 text-right text-red-400 font-semibold">
                      ₹{exp.amount}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-2 text-gray-500" colSpan="4">
                    No expenses yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {error && <p>{error}</p>}
    </>
    
  )
}

export default Expensespage;