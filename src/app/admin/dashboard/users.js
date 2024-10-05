import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HiUserCircle } from "react-icons/hi";
import axios from "@/services/axiosInstance"; 
const Users = (props) => {
    const [employees, setEmployees] = useState([]);
    const [imageUrls, setImageUrls] = useState({});
    const router = useRouter();

    const fetchEmployees = async () => {
        await axios.get('/api/users').then((response) => {
            setEmployees(response.data);
        }).catch((error) => {
            console.log('employees', error);
        });
    };

    const convertBase64ToImage = (base64String) => {
        const byteString = atob(base64String.split(',')[1]); // Decode base64
        const mimeString = base64String.split(',')[0].split(':')[1].split(';')[0]; // Extract MIME type
        
        // Convert byteString to an ArrayBuffer
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uintArray = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
            uintArray[i] = byteString.charCodeAt(i);
        }

        // Create a Blob from the ArrayBuffer
        const blob = new Blob([uintArray], { type: mimeString });
        return URL.createObjectURL(blob); // Return the URL
    };

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            fetchEmployees();
        } else {
            router.replace('/');
        }
    }, [props.refresh]);

    useEffect(() => {
        const urls = {};
        employees.forEach((employee) => {
            if (employee.photo) {
                urls[employee.employeeNumber] = convertBase64ToImage(employee.photo);
            }
        });
        setImageUrls(urls); // Store all image URLs in state
    }, [employees]);

    const employeeData = employees.map((user, i) => {
        return (
            <div className="grid grid-cols-5 items-center border py-6 px-1 text-sm hover:shadow" key={i}>
                <div className="flex items-center  gap-2">
                    {imageUrls[user.employeeNumber] ? (
                        <div className="rounded-full border-gray-500 ">
                            <img src={imageUrls[user.employeeNumber]} alt="Decoded" className="rounded-full border-gray-500 border h-12 w-12"/>
                        </div>
                    ) : <div className="rounded-full border-gray-500  h-10 w-10"><HiUserCircle className="h-full w-full text-blue-200" /></div>}
                    {user.surname} {user.otherName}
                </div>
                <div>{user.employeeNumber}</div>
                <div>{user.dateOfBirth}</div>
                <div>{user.roleName}</div>
                <div className="hover:underline cursor-pointer" onClick={()=>props.onUserEdit(user.employeeNumber,user.roleName,user.role_id)}>Edit</div>
            </div>
        );
    });

    return (
        <div className="dark:text-black mt-4 lg:w-5/6 w-full">
            {/* table header */}
            <div className="grid grid-cols-5 items-center bg-slate-100 p-3 shadow">
                <div>Employee Name</div>
                <div>Employee Number</div>
                <div>Date Of Birth</div>
                <div>Role</div>
                <div>Action</div>
            </div>
            {/* table content */}
            <div className="h-[68vh] overflow-y-auto">
                {employeeData}
            </div>
        </div>
    );
}

export default Users;
