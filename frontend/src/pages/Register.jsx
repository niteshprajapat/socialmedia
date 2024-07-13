import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('');
    const [file, setFile] = useState('');
    const [filePreview, setFilePreview] = useState('');



    const handleFileChange = (e) => {
        const file = e.target.files[0];

        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onloadend = () => {
            setFilePreview(reader.result);
            setFile(file);
        }
    }


    const register = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://127.0.0.1:5000/api/v1/auth/register', {
                name,
                email,
                password,
                gender,
                file,
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });

            const data = await response.data;
            console.log("data -> ", data);
            toast.success(data?.message);
            // setToken(data?.token);


            localStorage.setItem("user", JSON.stringify(data?.user));
            localStorage.setItem("token", data?.token);


            setUser(JSON.parse(localStorage.getItem("user")));
            setToken(localStorage.getItem("token"));
            setIsAuth(true);

            navigate('/login');

        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    }




    return (
        <div>
            <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-lg">

                    <h1 className="text-center text-lg font-medium text-[30px]">Register</h1>
                    <form
                        onSubmit={register}
                        className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8">

                        <div className="">
                            <div className='w-full flex justify-center items-center'>

                                {
                                    filePreview && <img src={filePreview} alt="avatar" className='w-[80px] h-[80px] rounded-full self-center' />
                                }
                            </div>

                            <input
                                onChange={handleFileChange}
                                type="file"
                                required
                                accept='image/*'
                                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                            />
                        </div>
                        <div className="">
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                type="text"
                                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                                placeholder="Enter Name"
                            />
                        </div>

                        <div className="">
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                                placeholder="Enter Email"
                            />
                        </div>

                        <div className="">
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                                placeholder="Enter Password"
                            />
                        </div>




                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className='w-full'>
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="femalle">Female</option>
                        </select>

                        <button type='submit' className='w-full bg-black text-white rounded-md py-2 px-3 text-center'>
                            Register
                        </button>

                        <p className="text-center text-sm text-gray-500">
                            Alread have an account?
                            <Link to={'/login'}>Login</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register