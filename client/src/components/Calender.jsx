import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import isoWeek from "dayjs/plugin/isoWeek";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { Link } from "react-router-dom";


dayjs.extend(weekday);
dayjs.extend(isoWeek);
dayjs.extend(localizedFormat);

import 'dayjs/locale/sv';


dayjs.locale('Sv')

export default function Calender() {

  const API_BASE_URL = import.meta.env.PROD 
  ? "https://pawsisterssalestracker-production-529b.up.railway.app"
  : "http://localhost:5000";

  const [currentWeekStart, setCurrentWeekStart] = useState(dayjs().startOf("isoWeek"));
  const [events, setEvents] = useState([]);
  const [montlyNote, setMonthlyNote] = useState("");

  const daysofWeek = Array.from(
    {length: 7}, (_, i) => 
      currentWeekStart.add(i, "day")
  );

  const scrollRef = useRef();

  useEffect(() => {

    if(scrollRef.current){
      scrollRef.current.scrollLeft = 0
    }

  }, [currentWeekStart]);

  useEffect(() => {
    const start = currentWeekStart.format("YYYY-MM-DD");
    const end = currentWeekStart.add(6, "day").format("YYYY-MM-DD");

    const fetchEvents = async () => {
      const res = await fetch(`${API_BASE_URL}/api/calendar/events?start=${start}&end=${end}`);
      const data = await res.json();
      setEvents(data);
    };

    const fetchMonthlyNote = async () => {
      const res = await fetch(`${API_BASE_URL}/api/calendar/monthly-notes?year=${currentWeekStart.year()}&month=${currentWeekStart.month() + 1}`);
      const data = await res.json();
      setMonthlyNote(data?.note || "");
    }

    fetchEvents();
    fetchMonthlyNote();

  }, [currentWeekStart]);

  const handleChangeWeek = (direction) => {
    setCurrentWeekStart(currentWeekStart.add(direction, "week"));
  };

  const weekNumber = currentWeekStart.isoWeek();
  const monthName = currentWeekStart.format("MMMM")
  const weekText = `V. ${weekNumber}  ${monthName} - ${currentWeekStart.format("YYYY")}`;

  return(
    <>
    <div className="max-w-4xl mx-auto px-4 py-5">
      <div className="flex items-center justify-between mb-4">
          <button onClick={() => handleChangeWeek(-1)} className="bg-[#F4538B] text-white px-3 py-1 rounded-xl hover:bg-pink-600/50">
          <i className="fa-solid fa-arrow-left"></i>
          </button>
          <h2 className="text-2xl font-medium text-center">
            {weekText}
          </h2>
          <button onClick={() => handleChangeWeek(1)} className="bg-[#F4538B] text-white px-3 py-1 rounded-xl hover:bg-pink-600/50">
          <i className="fa-solid fa-arrow-right"></i>
          </button>
      </div>
    </div>

    <div className="mb-4 p-4 m-3 bg-[#FCD4DF] border border-pink-300 rounded-xl shadow-sm shadow-[#F4538B]">
      <div className="flex flex-row-reverse justify-between">
        <Link to="/add-monthly-note" className="text-2xl -mt-3 -mr-1">
        <i class="fa-solid fa-pen-to-square"></i>
        </Link>
         <h3 className="font-bold text-xl pb-2 ">Månadsnotis</h3>
      </div>
      
     
      <p className="font-medium">{montlyNote || "Ingen notering denna månad."}</p>
    <ul className="mt-3 list-disc list-inside text-[#F4538B] font-medium">
      <h3>Cons:</h3>
      {events.filter((event) => dayjs(event.date).isSame(currentWeekStart, "month"))
      .map((event) => (
        <li key={event.id}>
          {event.title}
        </li>
      ))}
    </ul>

    </div>

  <div ref={scrollRef} className="overflow-x-auto m-3">
    <div className="flex gap-2 min-w-[700px]  m-2 p-2">
      {daysofWeek.map((day) => {
        const isToday = day.isSame(dayjs(), "day");
        const isEventDay = events.some((event) => 
        dayjs(event.date).isSame(day, "day")
      );
      const dayName = day.format("ddd").charAt(0).toUpperCase() + day.format("ddd").slice(1);
      const formattedDate = day.format("D MMMM");

      return(
        <Link to={`/calendar/${day.format('YYYY-MM-DD')}`}>
        
        <div key={day.format("YYYY-MM-DD")} className={`p-2 w-45 shrink-0 border rounded-xl flex flex-col justify-between sm:justify-start  cursor-pointer h-36 realtive
        ${isToday ? "bg-[#F4538B]" : "bg-[#FCD4DF] text-gray-400"}
        ${isEventDay ? "border-[#F4538B]" : "border-gray-200"}`}>

          <span className="text-md font-semibold text-center">
            {dayName} - {formattedDate}</span>
            <div className="">
            {events
            .filter((event) => dayjs(event.date).isSame(day, "day"))
            .map((event) => (
              <>
              <div key={event.id} className="text-md">
                Event: {event.title}
                <p className="text-sm">
                  {event.description}
                </p>
              </div>

              

              
              </>

            ))}

            </div>
        </div>
        </Link>
        
      )

      })}
    </div>
  </div>

    </>
  )

} 