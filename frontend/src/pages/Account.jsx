import React from 'react'
import { UserData } from '../context/UserContext';
import axios from 'axios';


const Account = () => {
    const { user, handleLogout } = UserData()
    console.log("UserData()", user);

    const imgUrl = 'https://res.cloudinary.com/deksfjwhh/image/upload/v1719847987/qo7gloagdgyekv2rq0wr.jpg'




    return (
        <>
            {
                user && (
                    <div className='bg-gray-100 min-h-screen flex flex-col gap-4 items-center justify-center  pt-3 pb-14'>
                        <div className='flex justify-between gap-4 bg-white p-8 rounded-lg shadow-md max-w-md'>
                            <div className='flex flex-col justify-between mb-4 gap-4'>
                                {/* <img src={user?.profilePic?.url ? user?.profilePic?.url : imgUrl} alt="profile" className='w-[180px] h-[180px] rounded-full' /> */}
                                <img src={imgUrl} alt="profile" className='w-[180px] h-[180px] rounded-full' />
                            </div>
                            <div className='flex flex-col gap-3'>
                                <p className='text-gray-800 font-semibold'>{user?.name}</p>
                                <p className='text-sm text-gray-800 font-500'>{user?.email}</p>
                                <p className='text-sm text-gray-800 font-500'>{user?.gender}</p>
                                <p className='text-sm text-gray-800 font-500'>{user?.followers?.length} followers</p>
                                <p className='text-sm text-gray-800 font-500'>{user?.following?.length} following</p>

                                <button onClick={handleLogout} className='bg-red-600 py-1 px-3 rounded-md text-white w-fit'>Logout</button>

                            </div>


                        </div>
                    </div>
                )
            }
        </>


    )
}

export default Account