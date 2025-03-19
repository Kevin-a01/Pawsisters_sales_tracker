import { useState, useEffect } from "react";
import { Link } from "react-router-dom";


function DetailCard( {refreshTrigger}){

  const [cons, setCons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoredCons = async () => {
      try{
        const response = await fetch("http://localhost:5000/api/stored_products")

        if(!response){
          throw new Error("Failed to fetch stored Con title and date.")
        }
        const data = await response.json();

        const uniqueCons = Array.from(
          new Map(data.map(con => [con.conId, con])).values()
        )

        setCons(uniqueCons);

      }catch (error){
        console.error("Error fetching stored cons:", error);
      }finally{
        setLoading(false);
      }
    };

    fetchStoredCons();
  }, [refreshTrigger]);

  return(
    <>
          <h1 className="text-2xl text-center mt-5">
            Föregående Cons!
          </h1>
          {loading ? (
            <p className="text-center text-lg mt-5">🔄 Laddar tidigare Cons...</p>
            ) : cons.length === 0 ? (
             <p className="text-center text-lg mt-5">❌ Inga tidigare Cons hittades.</p>
            ) : (
          <div className="grid grid-cols-2 justify-center items-center px-5 p-5 gap-5 ">
            {cons.map((con) => (
              <div key={con.conId} className="border border-transparent w-full rounded-xl hover:border-purple-500 bg-pink-300">
              <Link to={`/sales-details/${con.conId}`} className="text-lg">
              <h2 className="text-center font-medium text-2xl">{con.date}</h2>
              <h2 className="text-center text-xl pb-2">{con.title}</h2>
              </Link>
            </div>
          ))}
      </div>
      )}
    
    </>


  )

}

export default DetailCard;