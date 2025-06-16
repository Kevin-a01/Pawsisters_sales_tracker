import { Link, useParams } from "react-router-dom"
import BurgerMenu from "../components/BurgerMenu";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
export default function CalendarDetailPage() {

   const API_BASE_URL = import.meta.env.PROD 
    ? "https://pawsisterssalestracker-production-529b.up.railway.app"
    : "http://localhost:5000";
  
    const {date} = useParams();

    const [details, setDetails] = useState(null);

    useEffect(() => {
      if(!date) return;

      const fetchDetails = async () => {

        try{
           const res = await fetch (`${API_BASE_URL}/api/calendar/details?date=${date}`);
           const data = await res.json();
           setDetails(data);

        }catch(error){
          console.error(`Error fetching details for ${date}`);
        }
    
      }

      fetchDetails();

    },[date]);

    const navigate = useNavigate();

    const handleDelete = async ( id ) => {
       console.log("Details i handleDelete:", details);

      if(!details || !Array.isArray(details) ||details.length === 0){
        alert("Inga detaljer att ta bort!")
        return;
      }

    const confirmed = confirm("Är du säker att du vill ta bort detta event?");

    if(!confirmed) return;

    try{
      const res = await fetch(`${API_BASE_URL}/api/calendar/${id}`, {
        method: "DELETE"
      });

      if(res.ok){
        alert("Event borttaget")
        setDetails(prev => prev.filter(event => event.id !== id))
      }else{
        alert("Något gick fel vid raderingen");
      }
      
    }catch(err){
      console.error("Fel vid borttagning", err);
      

    }

    navigate('/')

  }


 
    return(
      <>
      <BurgerMenu/>
    <div className="w-full ">
      <div className="flex justify-between">
      <button onClick={() => handleDelete(details[0]?.id)} className="text-2xl ml-2 bg-[#F4538B] w-10 flex justify-center h-10  items-center text-white rounded-full md:mt-3 md:mr-3">
        <i class="fa-solid fa-trash"></i>
      </button>

      <Link to={`/calendar/${date}/add-event`} className="text-2xl mr-2 bg-[#F4538B] w-10 flex justify-center h-10  items-center text-white rounded-full md:mt-3 md:ml-3 ">
      <i className="fa-solid fa-plus"></i>
      </Link>
      
    </div>
  </div>
      {/* Details section */}
    <div className="md:w-10/12 mx-auto">
      <h1 className="text-2xl text-center mb-5">
        Detaljer för {dayjs(date).format("DD MMMM YYYY")}
      </h1>
      {Array.isArray(details) && details.map((event) => (
        <>
      <div key={event.id} className="bg-[#FEF2F6] rounded-xl shadow-md p-4 mx-10 mt-3 flex justify-center items-center flex-col gap-1 text-[#F4538B]">
      <h2 className="">
        Event detta datum:
      </h2>
      <p className="text-xl">{event.title}</p>
      </div>

      <div className="bg-[#FEF2F6] rounded-xl shadow-md p-4 mx-10 mt-3 flex justify-center items-center flex-col gap-1 text-[#F4538B] relative mb-5">
        <div className="w-full">
        <Link to="/add-task" className="p-2 absolute top-[-6px] right-[-1px] text-2xl rounded-xl ">
            <i class="fa-solid fa-circle-plus"></i>
        </Link>
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg">Checklista: </h2>
        <ul className="list-disc list-inside space-y-1">

          <li>
              test
          </li>

        </ul>

        </div>
        
      </div>

      </>

      ))}
        
    </div>

    </>
    )
    

}