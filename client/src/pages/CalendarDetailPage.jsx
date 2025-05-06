import { Link, useParams } from "react-router-dom"
import BurgerMenu from "../components/BurgerMenu";
import { useState } from "react";

export default function CalendarDetailPage() {

  const API_BASE_URL = import.meta.env.PROD 
    ? "https://pawsisterssalestracker-production-529b.up.railway.app"
    : "http://localhost:5000";

  const {date} = useParams();
  const [eventTitle, setEventTitle] = useState("");
  const [eventText, setEventText] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      const result = await fetch(`${API_BASE_URL}/api/calendar/events`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({date, title: eventText}),
      });

      if(result.ok){
        setSuccessMessage("Event Sparat!");
        setEventTitle("");
        setEventText("");
      }else{
        console.error("Error saving event.");
      }

    }catch(err){
      console.error(err);
    }

  }

  return(
    <>
    <BurgerMenu/>
     <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-medium text-center">Nytt event för: {date}</h1>

      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input type="text"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            className="border border-purple-500 rounded-xl p-2 focus:outline-none mt-5"
            placeholder="Event Titel"
          />

          <textarea 
          rows={6}
          id="eventText"
          value={eventText}
          placeholder="Event Beskrivning"
          onChange={(e) => setEventText(e.target.value)}
           className="h-32 border border-purple-500 rounded-xl focus:outline-none p-2" />

          <div className="flex justify-center">
            <button className="border w-1/2 h-13 rounded-2xl bg-pink-500 border-none shadow-lg text-lg " type="submit">
              Spara event
            </button>
          </div>
           

      </form>
    </div>
    </>
  )

}