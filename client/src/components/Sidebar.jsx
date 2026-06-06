import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets, dummyUserData } from '../assets/assets';
import MenuItems from './MenuItems';
import { CirclePlus, X, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserButton, useClerk } from '@clerk/clerk-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const navigation = useNavigate();
    const { signOut } = useClerk();
    const user = dummyUserData;

    return (
        <div className={`w-60 xl:w-72 bg-white border-r border-gray-200 flex flex-col justify-between h-screen z-20 shrink-0
${sidebarOpen ? 'flex' : 'hidden'} 
transition-all duration-300`}>

            <div className='w-full'>
                {/* Logo + X Button */}
                <div className='flex items-center justify-between pr-4 ml-5 my-3'>
                    <div className='flex items-center gap-2 cursor-pointer' onClick={() => navigation('/')}>
                        <img src={assets.auraverse} className='h-9 object-contain' alt="logo"/>
                        <div>
                            <p className='text-sm font-bold text-indigo-900 leading-tight'>Auraverse</p>
                            <p className='text-xs text-indigo-400'>Connect. Explore. Inspire.</p>
                        </div>
                    </div>
                     </div>

                <hr className='border-gray-300 mb-8' />

                <MenuItems setSidebarOpen={setSidebarOpen}/>

                <Link to='/create-post' className='flex items-center justify-center gap-2 py-2.5 mt-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition text-white cursor-pointer'>
                    <CirclePlus className='w-5 h-5'/>
                    Create Post
                </Link>
            </div>

            <div className='w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between'>
                <div className='flex gap-2 items-center cursor-pointer'>
                    <UserButton/>
                    <div>
                        <h1 className='text-sm font-medium'>{user.full_name}</h1>
                        <p className="text-xs text-gray-500">@{user.username}</p>
                    </div>
                </div>
                <LogOut onClick={() => signOut()} className='w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer'/>
            </div>
        </div>
    );
};

export default Sidebar;