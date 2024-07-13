import React, { useContext, useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import { UserData } from '../context/UserContext';


const Login = () => {
    const navigate = useNavigate();
    const { isAuth, setIsAuth, setUser, setToken } = UserData();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');



    const login = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://127.0.0.1:5000/api/v1/auth/login', {
                email,
                password,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
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

            navigate('/');

        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    }


    return (
        <div>
            <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-lg">

                    <form
                        onSubmit={login}
                        className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8">
                        <p className="text-center text-lg font-medium">Login</p>


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

                        <button className='w-full bg-black text-white rounded-md py-2 px-3 text-center'>
                            Login
                        </button>






                        <p className="text-center text-sm text-gray-500">
                            Dont have an account?
                            <Link to={'/register'}>Register</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;
