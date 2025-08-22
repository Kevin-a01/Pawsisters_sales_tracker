import { useState } from "react";
import BurgerMenu from "../components/BurgerMenu";
import { useNavigate, useParams } from "react-router-dom";

export default function AddTask() {

  const API_BASE_URL = import.meta.env.PROD 
    ? "https://pawsisterssalestracker-production-529b.up.railway.app"
    : "http://localhost:5000";

  const [task, setTask] = useState("");
  const [message, setMessage] = useState("");
  const {date} = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!task){
      setMessage("Uppgiften får inte vara tom!");
    }

    try{
      console.log({task, date});
      
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({task, date})
      });

      const data = await response.json()

      if(response.ok){
        setMessage("Uppgift sparad");
        setTask("");

      }else{
        setMessage(data.error || "Något gick fel");
      }

    }catch(err){
      console.error("Fel vid sparande av uppgift", err);
      setMessage("Serverfel. Försök igen senare.")
      

    }
    navigate(`/calendar/${date}`)
  }

  return(
    <>
    <BurgerMenu/>
    <div>
      <h1 className="text-center text-2xl">Lägg till en uppgift att göra!</h1>

      <form onSubmit={handleSubmit} className="flex flex-col">
        <label htmlFor="task" className="text-center pt-5 text-xl p-3">
        Uppgift
      </label>
      <input type="text"
      id="task"
      value={task}
      onChange={(e) => setTask(e.target.value)}
      className="border p-2 w-1/2 mx-auto rounded-xl border-purple-500 focus:outline-none"
      placeholder="Uppgift..." />

      <button type="submit" className="border border-pink-300 w-fit mx-auto mt-7 p-2 bg-pink-400 rounded-xl">
        Lägg till uppgift
      </button>
      </form>

      
    </div>
    </>
  )

}