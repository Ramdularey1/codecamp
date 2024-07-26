import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function Login() {
    const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        
    const response = await fetch("http://localhost:8000/api/v1/users/login", {
        method : "POST",
        credentials : "include",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(formData)
    });

      const data = await response.json();
     
     console.log(data);

      if(200 <= response.status < 300){
        localStorage.setItem("user", JSON.stringify(data));
      const locla = localStorage.getItem("user")
      console.log(locla)
        navigate("/")
      }
      
    
      console.log(response.status);
    } catch (error) {
      console.log("Error while logging in", error);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-black p-4 sm:p-10'>
      <form onSubmit={handleSubmit} className='bg-slate-500 w-full max-w-md p-6 rounded-lg shadow-md'>
        <div className='mb-4'>
          <label className='block text-white text-sm font-bold mb-2' htmlFor='email'>Email</label>
          <input
            type="email"
            name='email'
            value={email}
            onChange={handleChange}
            required
            className='w-full px-3 py-2 text-black leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
          />
        </div>
        <div className='mb-6'>
          <label className='block text-white text-sm font-bold mb-2' htmlFor='password'>Password</label>
          <input
            type="password"
            name='password'
            value={password}
            onChange={handleChange}
            required
            className='w-full px-3 py-2 text-black leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
          />
        </div>
        <div className='flex items-center justify-between'>
          <button
            type='submit'
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          >
            Login
          </button>
        </div>
        {/* <div className='mt-4'>
          <p>Don't have an account? <span className='text-blue-400 cursor-pointer' >Sign up</span></p>
        </div> */}
      </form>
    </div>
  );
}

export default Login;
