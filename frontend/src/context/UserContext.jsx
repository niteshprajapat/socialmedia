import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const UserContext = createContext({});


export const UserContextProvider = ({ children }) => {
    const [isAuth, setIsAuth] = useState(false);
    const [token, setToken] = useState('');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    console.log("token", token);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token")
        if (user != null && token != null) {
            setIsAuth(true);
            setUser(JSON.parse(localStorage.getItem("user")))
            setToken(localStorage.getItem("token"));

            setLoading(false)
        }
        else setLoading(false)
    }, []);


    console.log("user", user);

    const fetchUser = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/v1/users/me', {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            const data = await response.data;
            console.log("Profiledata -> ", data);

            setUser(data?.user);
            setIsAuth(true);
            setLoading(false);
            toast.success(data?.message);
        } catch (error) {
            setIsAuth(false);
            setLoading(false);
            toast.error(error?.response?.data?.message);
        }
    }



    const handleLogout = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.get('http://127.0.0.1:5000/api/v1/auth/logout', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
                withCredentials: true,
            });

            const data = await response.data;
            console.log("data", data);

            setUser(null);
            setToken('')
            setIsAuth(false);
        } catch (error) {
            toast.error(error?.response.data.message)
        }
    }

    useEffect(() => {
        // fetchUser();
    }, [token]);

    return (
        <UserContext.Provider value={{
            isAuth, setIsAuth,
            token, setToken,
            user, setUser,
            loading, setLoading,
            handleLogout
        }}>
            {children}
        </UserContext.Provider>
    )
}



export const UserData = () => useContext(UserContext);
