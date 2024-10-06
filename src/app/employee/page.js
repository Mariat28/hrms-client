'use client'
import { useState } from 'react';
import axios from '@/services/axiosInstance';
import Link from 'next/link';
const EmployeePage=() =>{
    const [step, setStep] = useState(1);
    const [email,setEmail] = useState('');
    const [OTP,setOTP] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [imgErrorMessage, setImgerrorMessage] = useState('');
    const [base64Image, setBase64Image] = useState(null);
    const [birthDate,setBirthDate] = useState('');
    const [surname,setSurname] = useState('');
    const [otherName,setOtherName] = useState('');
    const [employeeNumber,setEmployeeNumber] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
          const allowedTypes = ['image/jpeg', 'image/png']; 
          const fileSize = file.size;
          const fileType = file.type;
      
          // Validate file type
          if (!allowedTypes.includes(fileType)) {
            setImgerrorMessage('Invalid file type. Please upload a .jpg or .png image.');
            event.target.value = ''; // Clear the file input
            return;
          }
      
          // Validate file size
          if (fileSize > maxSizeInBytes) {
            setImgerrorMessage('File size exceeds 1MB. Please upload a smaller file.');
            event.target.value = ''; // Clear the file input
            return;
          }
      
          setImgerrorMessage(''); // Clear error message if file is valid
      
          // Convert file to base64
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result; // Keep the MIME type
            setBase64Image(base64String); // Store the full base64 string (including MIME type)
          };
      
          reader.readAsDataURL(file); // Start reading the file
        }
      };
      
  const  validateOTP =async()=>{
    if(!email || !OTP){
        setErrorMessage('Email Address and OTP are mandatory');
    }else if(!email.includes('gmail')){
        setErrorMessage('Only gmail accounts are accepted');
    }else if(OTP.length !==10){
        setErrorMessage('OTP must be 10 characters long');
    }else{
        setErrorMessage('')
        const dataObj={
            userEmail: email,
            userOtp: OTP
        }
        await axios.post('/api/validate-otp',dataObj).then((response)=>{
            console.log("otp validated", response);
            step<2 ? setStep(step + 1) : setStep(step - 1);
        }).catch((error)=>{
            console.log("otp validation error", error.response.data.message);
            setErrorMessage(error.response.data.message)
        })

    }
  }
  const registerEmployee= async()=>{
    if(!surname || !otherName || !birthDate){
        setErrorMessage('All fields are mandatory!');
    }else{
        setErrorMessage('')
        const requestObject={
            "surname": surname,
            "otherName": otherName,
            "dateOfBirth": birthDate,
            "photo": base64Image,
            "userOtp": OTP,
            "roleId": 3
        }
        console.log('regestering', requestObject)
        axios.post('/api/users',requestObject).then((response)=>{
            step===2 ? setStep(step + 1) : setStep(step - 1);
            setEmployeeNumber(response.data.employeeNumber);
        }).catch((error)=>{
            console.log("saving error",error)
        })
    }
  }
  
    const prevStep = () => {
      if (step > 1) {
        setStep(step - 1);
      }
    };
    return (
        <div className="flex flex-col dark:bg-white justify-center items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <div className=' flex flex-col gap-2 p-2 w-1/3'>
                <div className="flex justify-between mb-4">
                    <div className={`flex-1 p-2  rounded-sm flex items-center ${step === 1 ? ' bg-blue-900 text-slate-200' : 'bg-slate-300 text-black'}`}>OTP Validation</div>
                    <div className={`flex-1 p-2  rounded-sm flex items-center ${step === 2 ? 'bg-blue-900 text-slate-200' : 'bg-slate-300 text-black'}`}>Register</div>
                    <div className={`flex-1 p-2  rounded-sm flex items-center ${step === 3 ? 'bg-blue-900 text-slate-200' : 'bg-slate-300 text-black'}`}>Confirmation</div>
                </div>
    
            <div className="p-4 border border-gray-300 rounded">
                {step === 1 && (
                    <>
                        <span className='text-sm dark:text-black'>Please enter your email and self onboarding OTP below</span>
                        {errorMessage && <div className="text-red-500 text-xs mt-2">{errorMessage}</div>}
                        <div className='border border-blue-900 mt-2'>
                                <div className="relative">
                                    <input type="email" id="floating_outlined" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={email} onChange={(e)=>setEmail(e.target.value)}/>
                                    <label htmlFor="floating_outlined" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Email address</label>
                                </div>
                        </div>
                        <div className='border border-blue-900 mt-2'>
                                <div className="relative">
                                    <input type="number" id="floating_outlined5" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={OTP} onChange={(e)=>setOTP(e.target.value)}/>
                                    <label htmlFor="floating_outlined" className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">OTP</label>
                                </div>
                        </div>
                    </>
                )}
            
                {step === 2 && (
                    <div className='flex flex-col gap-2'>
                        <span className="text-sm dark:text-black">Enter the details below to complete registration</span>
                        {errorMessage && <div className="text-red-500 text-xs mt-2">{errorMessage}</div>}
                        <div className='border border-blue-900 mt-1'>
                                <div className="relative">
                                    <input type="text" id="floating_outlined1" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={surname} onChange={(e)=>setSurname(e.target.value)}/>
                                    <label htmlFor="floating_outlined1" className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Surname</label>
                                </div>
                        </div>
                        <div className='border border-blue-900 mt-1'>
                                <div className="relative">
                                    <input type="text" id="floating_outlined2" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={otherName} onChange={(e)=>setOtherName(e.target.value)}/>
                                    <label htmlFor="floating_outlined2" className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">OtherName(s)</label>
                                </div>
                        </div>
                        <div className='border border-blue-900 mt-1'>
                                <div className="relative">
                                    <input max="2006-12-31" type="date" id="floating_outlined3" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={birthDate} onChange={(e)=>setBirthDate(e.target.value)}/>
                                    <label htmlFor="floating_outlined3" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Birthdate</label>
                                </div>
                        </div>
                        <div className="mt-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="file-upload">Upload a photo</label>
                            <input
                                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                                id="file-upload"
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                onChange={handleFileChange}
                            />
                            <p className="mt-1 text-sm text-gray-500">Only .jpg or .png formats are allowed. Max size: 1MB.</p>
                            {imgErrorMessage && <div className="text-red-500 text-sm mt-2">{imgErrorMessage}</div>}
                        </div>
                    </div>
                )}
                {step === 3 && (
                    <div className='flex flex-col gap-2 text-black'>
                        <span className='text-xl italic'>Welcome aboard {otherName}!</span>
                        <div className='flex items-center gap-3'>
                            <span className='text-sm'>Your employee number is: </span>
                            <span className='text-lg font-semibold'>{employeeNumber}</span>
                        </div>

                    </div>
                )}
            </div>
            <div className="flex justify-between mt-4">
                {step === 2 && (
                        <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded" onClick={prevStep}>Back</button>
                )}
                {step < 2 && (
                <button className="bg-blue-900 text-white px-4 py-2 rounded" onClick={validateOTP}>Next</button>
                )}
                {step === 2 && (
                <button className="bg-green-900 text-white px-4 py-2 rounded" onClick={registerEmployee}>Submit</button>
                )}
                {step === 3 && (
                    <Link href='/'>
                        <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded">Close</button>
                    </Link>
                )}
            </div>
            </div>

        </div>
      );
  }
  export default EmployeePage;
  