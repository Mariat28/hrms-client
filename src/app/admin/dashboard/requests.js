import axios from "@/services/axiosInstance";
import { useEffect, useState } from "react";

const Requests=()=>{
    const [logs, setLogs] = useState([]);
    const [errorMessage, setErrorMessage] = useState('No system logs');
    const [failedCount,setFailedCount] =useState(0)
    const [successCount,setSuccessCount] =useState(0)

    const fetchRequests = async () => {
        try {
            const response = await axios.get('/api/logs');
            const loggedData = [...response.data];
            
            setLogs(loggedData);
    
            setFailedCount(loggedData.filter(log => log.responseStatus !== 200).length);
            setSuccessCount(loggedData.filter(log => log.responseStatus === 200).length);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "An error occurred while fetching logs");
        }
    };
    useEffect(()=>{
        fetchRequests();
    },[])
    const apiLogs=logs.map((log,i)=>{
        return(
            <div className="grid grid-cols-7 items-center border p-3 text-sm" key={i}>
            <div className="col-span-1">{log.id}</div>
            <div className="col-span-1">{log.type}</div>
            <div className="col-span-1">{log.url}</div>
            <div className="col-span-1">{log.responseStatus}</div>
            <div className="col-span-1 capitalize">{log.method}</div>
            <div className="col-span-1">{log.timestamp}</div>
        </div>
        )

    })
    return(
        <div className="dark:text-black mt-4 ">
            <div className="flex gap-8 mb-2">
                <span className="font-semibold">Total: <span className="text-blue-900">{apiLogs.length} requests</span></span>
                <span className="font-semibold">Successful : <span className="text-green-700"> {successCount} requests</span> </span>
               <span className="font-semibold"> Failed : <span className="text-red-700">{failedCount} requests</span></span>
            </div>
        {/* table header  */}
        <div className="grid grid-cols-7 items-center bg-slate-100 p-3 shadow mt-2">
            <div className="col-span-1">Log Id</div>
            <div className="col-span-1">Type</div>
            <div className="col-span-1">Url</div>
            <div className="col-span-1">Response Status</div>
            <div className="col-span-1">Method</div>
            <div className="col-span-1">Timestamp</div>
        </div>
        {/* table content  */}
        <div className="h-[60vh] overflow-y-auto">
            {apiLogs.length>0&&apiLogs}
            {(apiLogs.length===0 && errorMessage) &&<div className="flex flex-col h-full items-center justify-center">
                <img src="/images/noLogs.svg" alt="noLogs" className="h-[300px] w-[300px]"/>
                <span className="text-blue-900">{errorMessage}!</span>
            </div>}
        </div>

    </div>
    )
    } 
export default Requests;