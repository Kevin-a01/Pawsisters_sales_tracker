import { Link, useParams } from "react-router-dom"
import BurgerMenu from "../components/BurgerMenu";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import dayjs from "dayjs";
export default function CalendarDetailPage() {

   const API_BASE_URL = import.meta.env.PROD 
    ? "https://pawsisterssalestracker-production-529b.up.railway.app"
    : "http://localhost:5000";
  
    const {date} = useParams();

    const [details, setDetails] = useState(null);
    const [task, setTask] = useState(null);

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

    useEffect(() => {

      const fetchTasks = async (date) => {

        try{
          const res = await fetch(`${API_BASE_URL}/api/tasks/${date}`);
          const data = await res.json();
          console.log("Task API response:", data);
          
          setTask(data.task || []);
        }catch(err){
          console.error("Error fetching tasks", err);
        }
      }

      fetchTasks(date);


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

        const deleteTask = await fetch(`${API_BASE_URL}/api/tasks/date/${date}`, {
          method: "DELETE"
        });

        if(!deleteTask.ok){
          console.warn("Event raderat men inte checklistan");
          
        }

          setDetails(prev => prev.filter(event => event.id!== id)) 
          setTask([]);

      }else{
        alert("Något gick fel vid raderingen av event")

      }


      
    }catch(err){
      console.error("Fel vid borttagning", err);
      

    }

    navigate('/')

  }

    const toggleTask = async (taskItem) => {
      try{
        const res = await fetch(`${API_BASE_URL}/api/tasks/${taskItem.task_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({completed: !taskItem.completed})
        });

        if(res.ok){
          const updatedTask = await res.json();
          setTask((prev) => 
          prev.map((t) => (t.task_id === taskItem.task_id ? updatedTask.task: t))
        );
        }else{
          console.error("Misslyckades att uppdatera uppgift");
        }

      }catch(err){
        console.error("Fel vid uppdatering av task", err);
      }

    };


    const deleteTasks = async (taskItem) => {

      const confirmed = confirm("Är du säker att du vill ta bort denna uppgift");

      if(!confirmed){
        return;
      }

      try{
        const res = await fetch(`${API_BASE_URL}/api/tasks/${taskItem.task_id}`, {
          method: "DELETE",
          headers: {
            "Content-Type" : "application/json"
          },
        });

        if(!res.ok){
          throw new Error("Något gick fel vid radering av uppgift.");
        }

        console.log("Uppgift togs bort!");
        
        setTask(prev => prev.filter(t => t.task_id !== taskItem.task_id)); 

      }catch(err){
        console.error("Fel vid radering", err);
      }
      

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
      
      {Array.isArray(details) && details.map((event) => (
        <React.Fragment key={event.id}>

        <h1 className="text-2xl text-center mb-5">
        Detaljer för {dayjs(date).format("DD MMMM YYYY")}
      </h1>
      <div key={event.id} className="bg-[#FEF2F6] rounded-xl shadow-md p-4 mx-10 mt-3 flex justify-center items-center flex-col gap-1 text-[#F4538B]">
      <h2 className="">
        Event detta datum:
      </h2>
      <p className="text-xl">{event.title}</p>
      </div>


      <div className="bg-[#FEF2F6] rounded-xl shadow-md p-4 mx-10 mb-10 mt-3 flex flex-col gap-1 text-[#F4538B] relative">

     
        <div className="w-full">
        <Link to={`/add-task/${date}`} className="p-2 absolute top-[-6px] right-[-1px] text-2xl rounded-xl ">
            <i class="fa-solid fa-circle-plus"></i>
        </Link>
        </div>

        <h2 className="text-lg">Checklista: </h2>
         <div className="flex flex-col justify-center items-center ">
        
        {Array.isArray(task) && task.length > 0 ? (
          task.map((taskItem) => (
            <ul key={taskItem.task_id} className="list-disc list-inside space-y-1">
          <li className={`text-lg cursor-pointer flex items-center gap-2 ${taskItem.completed ? ' text-gray-400' : ''}`}
          onClick={() => toggleTask(taskItem)}>
            {taskItem.completed && <span>✅</span> }
            {taskItem.task}

            {!taskItem.completed && (
              <button onClick={() => {
              deleteTasks(taskItem);
            }}>
                <i className="fa-solid fa-trash"></i>
            </button>

            )}
            
            

          </li>
        </ul>
          ))
        ) : (
          <p>Inga uppgifter är tillaga ännu.</p>

        )}
         
          
        
        
        </div>
        
      </div>

      </React.Fragment>

      ))}
        
    </div>

    </>
    )
    

}