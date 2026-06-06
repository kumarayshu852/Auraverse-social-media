import React from "react";
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom'
import { Menu, X } from "lucide-react";
import { dummyUserData } from "../assets/assets";
import Loading from '../components/Loading';
import { useState } from 'react'

const Layout = () => {
    const user = dummyUserData
    const [sidebarOpen, setSidebarOpen] = useState(true)

   return user ? (
    <div className='w-full flex h-screen'>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
        
        <div className='flex-1 bg-slate-50 overflow-auto relative'>
            <Outlet/>
            {/* Toggle Button — content ke andar */}
            {sidebarOpen ?
                <X className="fixed top-3 right-3 p-2 z-[10] bg-white rounded-md shadow w-10 h-10 text-gray-600 cursor-pointer"
                onClick={() => setSidebarOpen(false)}/>
                :
                <Menu className="fixed top-3 right-3 p-2 z-[10] bg-white rounded-md shadow w-10 h-10 text-gray-600 cursor-pointer"
                onClick={() => setSidebarOpen(true)}/>
            }
        </div>
    </div>
) : (
    <Loading/>
)
}
export default Layout;