'use client'
import { useEffect, useState } from "react";
import { MdOutlineMailOutline } from "react-icons/md";
import Link from "next/link";
import axios from "@/services/axiosInstance";
import Users from "./users";
import Requests from "./requests";
import { useRouter } from "next/navigation";
import EditUser from "./editUser";
const Dashboard=()=>{
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const router = useRouter();
    const [tab, setTab] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isUserEdit,setIsUserEdit] = useState(false);
    const [selectedEmployee,setSelectedEmployee] = useState('');
    const [selectedRole,setSelectedRole] = useState('');
    const [refresh,setRefresh]=useState(false);


    const generateOTP = async()=>{
        setErrorMessage('')
        setSuccessMessage('')
        if(!email){
            setErrorMessage('Email field is mandatory');
        }else if(!email.includes('gmail')){
            setErrorMessage('Only gmail accounts are accepted');
        }else{
            await axios.post('/api/generate-otp',{userEmail:email}).then((response)=>{
                console.log('success message', response);
                setEmail('');
                setSuccessMessage(response.data.message);
            }).catch((error)=>{
                setErrorMessage(error.response.data.message);
            })
        }
    }
    const logoutHandler=()=>{
        sessionStorage.clear();
        router.replace('/');
    }
    const showEdit=(employeeNo,selectedRole)=>{
        if(employeeNo) setSelectedEmployee(employeeNo);
        if(selectedRole) setSelectedRole(selectedRole);
        setIsUserEdit((previousValue)=>!previousValue)
    }
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const storedFullName = sessionStorage.getItem('fullName');
        if (token && storedFullName) {
          setFullName(storedFullName); 
        } else {
          router.replace('/');
        }

    const handleBackButton = () => {
        // Clear sessionStorage to log out the user
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('fullName');
        router.replace('/admin');
      };
      // Add event listener for back button
      window.addEventListener('popstate', handleBackButton);
      return () => {
        window.removeEventListener('popstate', handleBackButton);
      };
    }, [router]);
return(
    <div className="flex flex-col dark:bg-blue-50   min-h-screen  font-[family-name:var(--font-geist-sans)] overflow-hidden h-screen">
        <div className=" bg-blue-900 flex justify-between items-center p-4 px-2">
            <span className="text-xl font-semibold">DHRMS</span>
            <Link href="/">
                <span className="cursor-pointer hover:underline" onClick={logoutHandler}>Logout</span>
            </Link>
        </div>
        {/* sub nav */}
        <div className="p-2 flex dark:text-black  justify-between w-full">
            <div className="flex flex-col  w-1/2">
                <span className="text-blue-900 text-lg">Welcome, {fullName || 'User'}</span>
                <span className="text-sm">Here's what's happening in HR today</span>
            </div>
            <div className="mx-auto flex flex-col  justify-center  w-1/2">
                <div className="relative w-full flex items-center pl-2 border border-slate-300">
                    <MdOutlineMailOutline className="text-gray-400"/>
                    <div className="relative w-full">
                        <input type="search" autoComplete="off" id="employee-search" className="block p-2.5 w-full z-20 text-sm  rounded-e-lg  focus:ring-blue-500 focus:border-blue-500 text-slate-700    outline-0  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:border-blue-500 bg-blue-50" placeholder="Enter email address" required value={email} onChange={(e)=>setEmail(e.target.value)}/>
                        <button type="submit" className="absolute  top-0 end-0 h-full p-2.5 text-sm font-medium text-white bg-blue-900   border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-900 dark:hover:bg-blue-900 dark:focus:ring-blue-800" onClick={generateOTP}>
                         Generate OTP
                        </button>
                    </div>
                </div>
                {errorMessage && <div className="text-red-500 text-xs mt-2">{errorMessage}</div>}
                {successMessage && <div className="text-green-600 text-xs mt-2">{successMessage}</div>}
            </div>
        </div>
        {/* sub nav 2  */}
        <div className="p-2 mt-5">
            <div className="flex  p-1 text-base">
                <div className={`  text-black cursor-pointer  py-2 px-4 rounded-tl-md ${tab===1 ? "bg-blue-100 border-b-2 border-blue-900":"bg-slate-100"}`} onClick={()=>setTab(1)}>Employees</div>
                <div className={`  text-black cursor-pointer py-2 px-4  ${tab===2 ? "bg-blue-100 border-b-2 border-blue-900":"bg-slate-100"}`} onClick={()=>setTab(2)}>API requests</div>
            </div>
            <div className="border border-t-0 h-[73vh]">
                {tab===1 && <Users onUserEdit={showEdit} refresh={refresh}></Users>}
                {tab===2 && <Requests></Requests>}

            </div>
        </div>
        {isUserEdit &&<EditUser onUserEdit={showEdit} selectedEmployee={selectedEmployee} selectedRole={selectedRole} onDataRefresh={()=>setRefresh(true)}></EditUser>}
    </div>
)
}
export default Dashboard;