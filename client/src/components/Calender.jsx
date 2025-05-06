import React, { useEffect, useState } from "react";
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

  const [currentWeekStart, setCurrentWeekStart] = useState(dayjs().startOf("issoWeek"));
  const [events, setEvents] = useState([]);
  const [montlyNote, setMonthlyNote] = useState("");

  const daysofWeek = Array.from(
    {length: 7}, (_, i) => 
      currentWeekStart.add(i, "day")
  );

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
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
          <button onClick={() => handleChangeWeek(-1)} className="bg-pink-500 text-white px-3 py-1 rounded-xl hover:bg-pink-600/50">
          <i className="fa-solid fa-arrow-left"></i>
          </button>
          <h2 className="text-2xl font-medium text-center">
            {weekText}
          </h2>
          <button onClick={() => handleChangeWeek(1)} className="bg-pink-500 text-white px-3 py-1 rounded-xl hover:bg-pink-600/50">
          <i className="fa-solid fa-arrow-right"></i>
          </button>
      </div>
    </div>

    <div className="mb-6 p-4 m-3 bg-purple-400 border border-pink-300 rounded-xl shadow-sm shadow-red-500">
      <h3 className="font-medium text-xl pb-2 ">Månadsnotis</h3>
      <p className="font-medium">{montlyNote || "Ingen notering denna månad."}</p>
    </div>

    <div className=" hidden sm:grid grid-cols-7 gap-1 text-md font-medium text-center m-3 bg-pink-300 ">
      {["Mån", "Tis", "Ons", "Tors", "Fre", "Lör", "Sön"].map((d) => (
        <div key={d}>{d}</div>
      ))}
    </div>

  <div className="overflow-x-auto m-3">
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
        <div key={day.format("YYYY-MM-DD")} className={`p-2 w-45 shrink-0 border rounded-xl flex flex-row justify-evenly sm:justify-start  cursor-pointer h-36 
        ${isToday ? "bg-white" : "bg-gray-100 text-gray-400"}
        ${isEventDay ? "border-blue-500" : "border-gray-200"} hover:bg-blue-50`}>
          <span className="text-md font-semibold">
            {dayName} - {formattedDate}</span>
            {isEventDay && (
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-auto mb-1"></span>
            )}
        </div>
        </Link>
      )

      })}
    </div>
  </div>

    </>
  )

} 