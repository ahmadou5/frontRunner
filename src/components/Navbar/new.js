'use client'
import { IoMenu,IoLogoGithub,  } from "react-icons/io5";
import { motion } from 'framer-motion';
import { GlobalContext } from "@/context/context";
import { useState } from "react";
import { formatAddress } from "@/config/format";
export const Navbar2 = () => {
    const [isActive, setisActive] = useState()
    const { setIsConnectModal, address:userAddress } = GlobalContext()
    const Menu = [
      
    ]
    return(
        
    <>
    <nav className="w-full px-6 z-0 mt-8  fixed inset-x-0 top-2 flex justify-center items-center">
        <div className="w-full backdrop-blur-lg bg-clip-padding bg-opacity-60 md:w-880 bg-navBar p-4 rounded-full flex items-center">
          <p className="text-lg text-slate-200 ml-10 mr-20 font-medium">BRC 420 Front Runner</p>

          <div className="hidden md:flex items-center gap-6 ml-6 flex-1">
            {
                Menu && Menu.map((menu,i) => (
                    <>
                    <a key={i} className="text-textBase font-medium hover:text-slate-100 cursor-pointer duration-100 ease-in-out">{menu.name}</a>
                    </>
                ))
            }
           {
            userAddress ? <p className="ml-auto text-base text-textBase font-medium hover:text-slate-100 cursor-pointer border border-textBase px-2 py-1 rounded-xl hover:border-gray-100 duration-100 ease-in-out">{userAddress !== '' && formatAddress(userAddress.toString())}</p> : <a onClick={() => setIsConnectModal?.(true)} className="ml-auto text-base text-textBase font-medium hover:text-slate-100 cursor-pointer border border-textBase px-2 py-1 rounded-xl hover:border-gray-100 duration-100 ease-in-out">Connect Wallet</a>
           }
            
          </div>
          <div className="block md:hidden ml-auto cursor-pointer" onClick={()=> setisActive(!isActive)}>
            <IoMenu className="text-2xl text-textBase" />
          </div>

          {isActive && (
            <div className="p-4 w-275 bg-navBar rounded-lg fixed top-24 right-16 flex flex-col items-center justify-evenly gap-6">
              <a href="#home" onClick={() => setisActive(false)} className="text-textBase font-medium hover:text-slate-100 cursor-pointer duration-100 ease-in-out">Home</a>
              <a href="#about" onClick={() => setisActive(false)} className="text-textBase font-medium hover:text-slate-100 cursor-pointer duration-100 ease-in-out">About</a>
              <a href="#projects" onClick={() => setisActive(false)} className="text-textBase font-medium hover:text-slate-100 cursor-pointer duration-100 ease-in-out">Projects</a>
              <a href="#contact" onClick={() => setisActive(false)} className="text-textBase font-medium hover:text-slate-100 cursor-pointer duration-100 ease-in-out">Contact</a>
              <a href="#mint" onClick={() => setisActive(false)} className="text-textBase font-medium hover:text-slate-100 cursor-pointer duration-100 ease-in-out">Mint</a>
              <a href="#home" onClick={() => setisActive(false)} className="text-base text-textBase font-medium hover:text-slate-100 cursor-pointer border bg-ye border-textBase px-2 py-1 rounded-xl hover:border-gray-100 duration-100 ease-in-out">Connect Wallet</a>

            </div>
          )}
        </div>
      </nav>
    </>
    )
}