import { useState } from "react";
import {Menu, X} from "lucide-react";
import { Link } from 'react-router-dom'




export default function BurgerMenu() {

    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);


    const handleClosingMenu =  () => {
        setIsClosing(true)
        setTimeout(() => {
            setIsOpen(false)
            setIsClosing(false)
        }, 300);

    }

    return(
        <nav className="bg-[#FEF2F6]">
            <div className="max-w-7xl">

            <button onClick={() => setIsOpen(true)} className="md:hidden ml-1 cursor-pointer text-[#F277B2] ">
                <Menu size={32}/>
                </button> 
            <div className="flex justify-center md:justify-center">
                <Link to="/" className="text-6xl font-bold text-[#F277B2] w-full">
                    <img src="\Narcon_Banner_2025.png" alt="" className="rounded-t-lg" />
                </Link>
            </div>
        <div className="mt-3">
            <div className=" hidden md:flex justify-between w-screen gap-3 p-1 text-xl text-[#F277B2]">
                <div className="md:flex gap-3">
                    <Link to="/" className="">
                        Schedule
                    </Link>
                   <Link to="/sales-tracker">
                         SalesTracker
                   </Link>

                   <Link to="/inventory">
                        Inventory
                   </Link>

                </div>
            
                   <div className= "flex gap-7 mr-5 ">
                    <div className="">
                        <a href="https://www.instagram.com/pawsisters.shop" target="_blank" className="text-3xl">
                        <i className="fa-brands fa-instagram"></i>
                        </a>
                        
                    </div>

                    <div>
                        <a href="https://www.tiktok.com/@pawsisters.shop" target="_blank" className="text-3xl"> 
                        <i className="fa-brands fa-tiktok"></i>
                        </a>
                    </div>
                
                
                </div>
            </div>
            


        </div>
            
                
            </div>

            <div className={`fixed inset-0 backdrop-blur-xl z-50 transition-opacity duration-300 
              ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={() => setIsOpen(false)}>

            </div>

            
            <div className={`fixed top-0 left-0 h-full w-64 bg-[#FEF2F6] shadow-md p-6 z-[60] transition-transform duration-250 ease-in-out rounded-r-3xl
                ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <button onClick={handleClosingMenu} className={`absolute top-4 right-4 text-[#F4538B] cursor-pointer transition-transform duration-300 ${isClosing ? "rotate-90 scale-0" : ""}`}>
                    <X size={32} />
                    </button>
                    <img src="\Narcon_foto.png" className="text-3xl text-pink-500 font-medium w-5/12 rounded-full border border-[#F4538B]">    
                    </img>

                <ul className="md:hidden mt-4 text-[#F4538B] text-xl p-2 w-fit">
                    <div className="flex flex-col gap-3 justify-center mt-3">
                    <Link to="/" className="">
                        Schedule
                    </Link>
                   <Link to="/sales-tracker">
                         SalesTracker
                   </Link>

                   <Link to="/inventory">
                        Inventory
                   </Link>

                    </div>
                </ul>
                <div className="absolute bottom-2 p-1 flex gap-35 text-[#F4538B]">
                    <div className="flex ">
                        <a href="https://www.instagram.com/pawsisters.shop" target="_blank" className="text-4xl">
                        <i className="fa-brands fa-instagram"></i>
                        </a>
                        
                    </div>

                    <div>
                        <a href="https://www.tiktok.com/@pawsisters.shop" target="_blank" className="text-4xl"> 
                        <i className="fa-brands fa-tiktok"></i>
                        </a>
                    </div>
                
                
                </div>
            </div>

           

        </nav>

    )
    

}