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
      <Link to={`/calendar/${date}/add-event`} className="text-2xl mr-2 bg-[#F4538B] w-10 flex justify-center h-10  items-center text-white rounded-full ">
      <i className="fa-solid fa-plus"></i>
      </Link>
    </div>
  </div>
      {/* Details section */}
    <div>
      <h1 className="text-2xl text-center">
        Detaljer för {dayjs(date).format("DD MMMM YYYY")}
      </h1>
      {Array.isArray(details) && details.map((event) => (
        <>
      <div key={event.id} className="flex flex-col p-5 gap-3 justify-center items-center">
      <h2 className=" text-xl">
        Kommande Event:
      </h2>
      <p className="text-xl">{event.title}</p>
      </div>
      <div className="flex justify-center items-center flex-col">
        <h2 className="text-xl">Beskrivning för: </h2>
        <h3> {event.description} </h3>
      </div>
      </>

      ))}
        
    </div>

    </>
    )
    

}