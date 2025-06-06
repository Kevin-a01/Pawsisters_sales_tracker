import { Link, useParams } from "react-router-dom"
import BurgerMenu from "../components/BurgerMenu";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { formats } from "dayjs/locale/sv";
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


 
    return(
      <>
      <BurgerMenu/>
    <div className="w-full ">
      <div className="flex justify-end">
      <Link to={`/calendar/${date}/add-event`} className="text-2xl mr-2 bg-[#F4538B] w-10 flex justify-center h-10  items-center text-white rounded-full md:mt-3 md:mr-3 ">
      <i className="fa-solid fa-plus"></i>
      </Link>
    </div>
  </div>
      {/* Details section */}
    <div>
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

      <div className="flex justify-center items-center flex-col text-[#F4548B] bg-[#FEF2F6]  rounded-xl shadow-md p-4  mx-10 mt-5 mb-2">
        <h2 className="text-xl">Beskrivning för {event.title}: </h2>
        <h3> {event.description} </h3>
      </div>

      <div className="bg-fuchsia-400 rounded-xl  mx-10 mt-10 p-10 relative">
        <div className="w-full">
        <Link to="/add-task" className="p-2 absolute top-[-6px] right-[-1px] text-2xl rounded-xl ">
            <i class="fa-solid fa-circle-plus"></i>
        </Link>
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg">Checklista: </h2>
        <ul className="list-disc list-inside space-y-1">

          <li>

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