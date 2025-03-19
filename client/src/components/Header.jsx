import { Link } from "react-router-dom";

function Header() {

  return(
    <div className="w-full mx-auto p-6 bg-pink-300 shadow-md flex justify-center items-center">
    <Link to="/" className="">
    <h1 className="text-4xl font-bold mb-6 text-center mt-1 hover:text-pink-600 hover:ease-in hover:duration-200 ">Pawsisters Sales Tracker</h1>
    </Link>
    </div>


  )

}

export default Header;