import React, { useState } from 'react'
import {FaEye,FaEyeSlash} from 'react-icons/fa'

const Passwordfeild = ({placeholder="Enter your password",value,onChange}) => {
    const[showPassword,setShowPassword]=useState(false);
    

  return (
     <div className="relative w-full">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border rounded px-3 py-2 w-full focus:outline-0 focus:ring-2 focus:ring-blue-400"
      />

      <span
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-3 cursor-pointer text-gray-600"
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </span>
    </div>
  )
}

export default Passwordfeild