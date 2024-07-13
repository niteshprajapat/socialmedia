import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { UserData } from './context/UserContext';
import Account from './pages/Account';



const App = () => {
    const { user, isAuth, loading } = UserData();



    return (
        <>
            {

                loading ? (
                    <span>loading</span>
                ) : (
                    <Router>
                        <Routes>
                            <Route path='/register' element={!isAuth ? <Register /> : <Home />} />
                            <Route path='/' element={isAuth ? <Home /> : <Login />} />


                            <Route path='/login' element={!isAuth ? <Login /> : <Home />} />
                            <Route path='/account' element={isAuth ? <Account /> : <Login />} />
                        </Routes>
                    </Router >
                )
            }
        </>

    )
}

export default App