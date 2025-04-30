import { useState } from "react";
import {Menu, X} from "lucide-react";
import { Link } from 'react-router-dom'




export default function BurgerMenu() {

    const [isOpen, setIsOpen] = useState(false);

    return(
        <nav className="bg-pink-300 shadow-sm shadow-pink-600/70 p-2 pb-4">
            <div className="max-w-7xl">

            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
                {isOpen ? <X size={32}/> : <Menu size={32}/>}
                </button> 
            <div className="">
                <h1 className="text-6xl font-bold text-pink-500 text-center ">
                    Pawsisters
                </h1>
            </div>
                
            </div>

            {isOpen && (
                <ul className="md:hidden mt-4 text-pink-600 text-xl p-2 w-fit">
                    <div className="flex flex-col gap-1 p-2">
                    <Link className="">
                        Schedule
                    </Link>
                   <Link>
                         SalesTracker
                   </Link>

                   <Link>
                        Inventory
                   </Link>

                    </div>
                    
                    <li></li>
                    

                </ul>

            )}

        </nav>

    )
    

}