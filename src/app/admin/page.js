'use client'
import { useState } from "react";
import { useRouter } from 'next/navigation'
import axios from "@/services/axiosInstance";
const AdminPage=() =>{
  const[employeeNumber, setEmployeeNumber] = useState('');
  const[errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  async function generateSHA256() {
    const encoder = new TextEncoder();
    const data = encoder.encode(employeeNumber);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }
  const adminLogin=async()=>{
      setErrorMessage('');
      if(employeeNumber.substring(0,2).toUpperCase() !== 'DF'){
        setErrorMessage('Invalid employee number!');
        return;
      }
      try{
        const sessionToken = await generateSHA256(employeeNumber);
        await axios.get('/api/users', { params: { employeeNumber: employeeNumber } }).then((response)=>{
          sessionStorage.setItem('fullName', `${response.data.surname} ${response.data.otherName}`);
          sessionStorage.setItem('token', `${sessionToken}`);
          sessionStorage.setItem('role', `${response.data.Role}`);
          console.log('user role',response.data)
          if(response.data.Role === 'Admin' || response.data.Role === 'HR'){
            router.replace('/admin/dashboard');
          } else{
            setErrorMessage('Unauthorized!')
          }
        });

      }catch(error){
        const message = error.response?.data?.message || 'An error occurred. Please try again.';
        console.log('Invalid employee', message);
        setErrorMessage(message);
      }
  }
    return (
      <div className="flex flex-col justify-center dark:bg-white items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div className="flex flex-col gap-2  border p-4 shadow">
          <span className="text-lg text-blue-900 font-semibold">DFCU Human Resource Management System</span>
          <span className="text-sm text-black">Enter your employee number to login</span>
          <div className=" flex flex-col mt-4 gap-4 ">
          {errorMessage && <div className="text-red-500 text-xs">{errorMessage}</div>}
            <div className='border border-blue-900 mt-1'>
              <div className="relative">
                <input type="text" id="floating_outlined1" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={employeeNumber} onChange={(e)=>setEmployeeNumber(e.target.value)}/>
                <label htmlFor="floating_outlined1" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Employee number</label>
              </div>
            </div>
              <button className="p-1 px-4 text-sm rounded-sm shadow-md font-semibold bg-blue-900 text-white hover:bg-white hover:text-blue-900 border-blue-900 border w-fit" onClick={adminLogin}>Login</button>
          </div>

        </div>
    </div>
    );
  }
export default AdminPage;