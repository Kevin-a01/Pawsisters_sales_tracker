import { Link, useParams } from "react-router-dom"
import BurgerMenu from "../components/BurgerMenu";
import { useState } from "react";
import dayjs from "dayjs";
import { formats } from "dayjs/locale/sv";
export default function CalendarDetailPage() {

  /* const API_BASE_URL = import.meta.env.PROD 
    ? "https://pawsisterssalestracker-production-529b.up.railway.app"
    : "http://localhost:5000";
  */
    const {date} = useParams();

 
    return(
      <>
      <BurgerMenu/>
    <div className="w-full">
      <div className="flex justify-end">
      <Link to={`/calendar/${date}/add-event`} className="text-2xl m-2 bg-pink-400 w-10 flex justify-center h-10 items-center text-white rounded-full ">
      <i className="fa-solid fa-plus"></i>
      </Link>
    </div>
  </div>
    </>
    )
    

}