import { useState } from "react";
import {Menu, X} from "lucide-react";
import { Link } from 'react-router-dom'




export default function BurgerMenu() {

    const [isOpen, setIsOpen] = useState(false);

    return(
        <nav className="bg-pink-300 shadow-sm shadow-pink-600/70 p-2 pb-4">
            <div className="max-w-7xl">

            <button onClick={() => setIsOpen(true)} className="md:hidden cursor-pointer text-white">
                <Menu size={32}/>
                </button> 
            <div className="flex justify-center md:justify-start">
                <Link to="/" className="text-6xl font-bold text-pink-500 h-fit">
                    Pawsisters
                </Link>
            </div>
        <div className="mt-3">
            <div className=" hidden md:flex justify-between w-screen gap-3 p-1 text-xl text-pink-600">
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
                        <a href="" target="_blank" className="text-3xl">
                        <i className="fa-brands fa-instagram"></i>
                        </a>
                        
                    </div>

                    <div>
                        <a href="" target="_blank" className="text-3xl"> 
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

            
            <div className={`fixed top-0 left-0 h-full w-64 bg-pink-200 shadow-md p-6 z-[60] transition-transform duration-250 ease-in-out rounded-r-3xl
                ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-white cursor-pointer">
                    <X size={32} />
                    </button>
                    <h2 className="text-3xl text-pink-500 font-medium">
                        Pawsisters
                    </h2>

                <ul className="md:hidden mt-4 text-pink-600 text-xl p-2 w-fit">
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
                <div className="absolute bottom-2 p-1 flex gap-35 text-pink-600">
                    <div className="flex ">
                        <a href="" target="_blank" className="text-4xl">
                        <i className="fa-brands fa-instagram"></i>
                        </a>
                        
                    </div>

                    <div>
                        <a href="" target="_blank" className="text-4xl"> 
                        <i className="fa-brands fa-tiktok"></i>
                        </a>
                    </div>
                
                
                </div>
            </div>

           

        </nav>

    )
    

}