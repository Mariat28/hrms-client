import { TfiClose } from "react-icons/tfi";
import { useEffect, useState, useRef } from "react";
import axios from "@/services/axiosInstance";

const EditUser = (props) => {
    const [birthDate, setBirthDate] = useState('');
    const [base64Image, setBase64Image] = useState(null);
    const [imgErrorMessage, setImgerrorMessage] = useState('');
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(props.selectedRole);
    const [selectedRoleId, setSelectedRoleId] = useState(props.selectedRoleId);
    const [isRoles, setIsRoles] = useState(false);
    const roleDropdownRef = useRef(null);
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
            const allowedTypes = ['image/jpeg', 'image/png'];
            const fileSize = file.size;
            const fileType = file.type;

            setImgerrorMessage('');
            if (!allowedTypes.includes(fileType)) {
                setImgerrorMessage('Invalid file type. Please upload a .jpg or .png image.');
                event.target.value = '';
                return;
            }
            if (fileSize > maxSizeInBytes) {
                setImgerrorMessage('File size exceeds 1MB. Please upload a smaller file.');
                event.target.value = '';
                return;
            }
            setImgerrorMessage('');
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setBase64Image(base64String);
            };

            reader.readAsDataURL(file);
        }
    };

    const updateUser = async () => {
        if (!birthDate && !base64Image && selectedRoleId === props.selectedRoleId) {
            return setImgerrorMessage('At least one field is required for update');
        }
        setImgerrorMessage('');
        const requestObject = {
            dateOfBirth: birthDate || null,
            photo: base64Image || null,
            employeeNumber: props.selectedEmployee,
            roleId: selectedRoleId
        };
        await axios.patch('/api/user', requestObject).then((response) => {
            console.log(response);
            props.onDataRefresh();
            props.onUserEdit(null, null, null);
        }).catch((error) => {
            console.log(error);
        });
    };

    const fetchRoles = async () => {
        await axios.get('/api/roles').then((response) => {
            setRoles(response.data);
            console.log('roles', response.data);
        }).catch((error) => {
            console.log(error);
        });
    };

    const showRoles = () => {
        setIsRoles(true);
    };

    const selectRole = (role) => {
        setSelectedRole(role.role_name);
        setSelectedRoleId(role.role_id);
        setIsRoles(false);
    };

    const handleClickOutside = (event) => {
        if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target)) {
            setIsRoles(false);
        }
    };

    useEffect(() => {
        fetchRoles();
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="h-screen absolute bg-black/80 w-full overflow-hidden">
            <div className="h-full flex justify-center items-center">
                <div className="bg-blue-50 text-black shadow-lg h-[400px] w-[450px] flex flex-col justify-evenly">
                    <div className="shadow h-10 px-1 flex items-center justify-between bg-blue-100 text-sm font-semibold text-blue-900">
                        Update user details
                        <TfiClose className="cursor-pointer hover:text-blue-700 text-sm" onClick={() => props.onUserEdit(null, null, null)}></TfiClose>
                    </div>
                    <div className="flex flex-col flex-1 justify-between p-3">
                        {imgErrorMessage && <div className="text-red-500 text-xs mt-0">{imgErrorMessage}</div>}
                        <div className='border border-blue-900 mt-1'>
                            <div className="relative">
                                <input type="text" disabled defaultValue={props.selectedEmployee} id="floating_outlined1" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-gray-100 rounded-lg border-1 border-gray-300 appearance-none dark:border-gray-100 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" />
                                <label htmlFor="floating_outlined" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-blue-50 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4">Employee Number</label>
                            </div>
                        </div>
                        {/* Roles */}
                        <div className="relative">
                            <div className='border border-blue-900 mt-1'>
                                <div className="relative">
                                    <input type="text" value={selectedRole} id="floating_outlined1" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-gray-100 rounded-lg border-1 border-gray-300 appearance-none dark:border-gray-100 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" readOnly placeholder="" onFocus={showRoles} />
                                    <label htmlFor="floating_outlined" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-blue-50 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4">Role</label>
                                </div>
                            </div>
                            {/* Dropdown */}
                            {isRoles && (
                                <div ref={roleDropdownRef} className="h-24 absolute z-20 shadow-md rounded-b-sm border bg-blue-100 w-48 mt-1">
                                    {roles.length > 0 ? roles.map((role, i) => (
                                        <div key={i} className="p-2 hover:bg-blue-200 cursor-pointer border-b border-blue-200 text-sm" onClick={() => selectRole(role)}>
                                            {role.role_name !== selectedRole && role.role_name}
                                        </div>
                                    )) : (
                                        <div className="p-2 text-sm text-gray-500">No roles available</div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className='border border-blue-900 mt-1 z-10'>
                            <div className="relative">
                                <input type="date" max="2006-12-31" id="floating_outlined1" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:border-gray-100 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
                                <label htmlFor="floating_outlined1" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-blue-50 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4">Date of birth</label>
                            </div>
                        </div>
                        <div className="mt-0 flex flex-col">
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="file-upload">Update Photo</label>
                            <input
                                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-blue-50 focus:outline-none"
                                id="file-upload"
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                onChange={handleFileChange}
                            />
                            <p className="mt-1 text-xs text-gray-500">Only .jpg or .png formats are allowed. Max size: 1MB.</p>
                        </div>
                        <div className="flex justify-end mt-3">
                            <button type="submit" className="top-0 end-0 h-full py-2 px-4 text-sm font-medium text-white bg-blue-900 border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-900 dark:hover:bg-blue-900 dark:focus:ring-blue-800" onClick={updateUser}>Update</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditUser;
