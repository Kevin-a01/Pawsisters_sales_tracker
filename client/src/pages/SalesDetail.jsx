import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";

function SalesDetail() {
    const {conId} = useParams();
    const navigate = useNavigate();
    const [conTitle, setConTitle] = useState("");
    const [sales, setSales] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [filterPayment, setFilterPayment] = useState("");

    const API_BASE_URL = import.meta.env.PROD 
    ? "https://pawsisterssalestracker-production-529b.up.railway.app"
    : "";

    useEffect(() => {
        const fetchSales = async () => {
            try {
               
                const response = await fetch(`${API_BASE_URL}/api/stored_products/${conId}`);
                if(!response.ok){
                    throw new Error("Failed to fetch sales data");

                }
                const data = await response.json();

                setConTitle(data.title);
                setSales(data.products);

                const total = data.products.reduce((sum, sale) => sum + sale.price, 0);
                setTotalRevenue(total);

            }catch(error){
                console.error("Error fetching sales data", error);
            }
        };

        fetchSales();
    }, [conId])

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Är du säker att du vill ta bort all försäljningsdata?");
        if (!confirmDelete) return;

        try {

           
            
            const response = await fetch(`${API_BASE_URL}/api/stored_products/${conId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete sales data");
            }

            alert("Försäljningsdata borttagen!");
            setSales([]); // Clear the UI
            setTotalRevenue(0);
            navigate("/"); // Navigate back after deletion (optional)
        } catch (error) {
            console.error("Error deleting sales data:", error);
            alert("Misslyckades att ta bort försäljningsdata.");
        }
    };

        const filteredSales = filterPayment
            ? sales.filter(sale => sale.payment.toLowerCase() === filterPayment.toLowerCase())
            : sales;

    

    return(
        <>
        <Header/>
        <div className="p-3">
        <h1 className="text-xl text-center font-bold font-mono">Försäljning för {conTitle}</h1>
        <div className="flex justify-center mt-4">
            <label className="mr-2 font-bold mt-1 text-xl">Filtrera efter betalning.</label>
            <select 
            className="border-2 p-2 focus:outline-none focus:ring-0 focus:border-pink-300 appearance-none rounded-xl border-pink-300"
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value)}
            >
                <option value="" >Alla betalningar</option>
                <option value="Swish"  >Swish</option>
                <option value="Kort"  >Kort</option>
                <option value="Kontant"  >Kontant</option>
            </select>
        </div>
        {filteredSales.length === 0 ? (
            <p className="text-xl text-center py-5">
                Inga produkter matchar!
            </p>

        ): (

            <>
                <table className="w-full border-collapse mt-4">
                    <thead>
                        <tr>
                            <th className=" border-2 border-pink-300 p-2">
                                Produkt
                            </th>

                            <th className="border-2 border-pink-300 p-2"> 
                                Pris 
                            </th>
                                
                            <th className="border-2 border-pink-300 p-2">
                                Betalning
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSales.map((sale) =>(
                            <tr key={`${sale.id}`}>
                                <td className="border-2 border-pink-300 p-2 text-center">{sale.product}</td>
                                <td className="border-2 border-pink-300 p-2 text-center">{sale.price} kr</td>
                                <td className="border-2 border-pink-300 p-2 text-center">{sale.payment}</td>
                            </tr>


                        ))}
                    </tbody>
                </table>
            
            </>



            
        )}

        
        <div className="flex flex-col">
        <h2 className="text-lg font-medium mt-4">
            Totalen för dagen: {filteredSales.reduce((sum, sale) => sum + sale.price, 0)} KR
        </h2>

        {sales.length > 0 && (

            <button className="text-md w-5/12 font-bold mt-2 border p-2 rounded-xl border-pink-400 bg-pink-400" onClick={handleDelete}>
                Ta bort Detalj Data
            </button>

        )}

        </div>
        


        </div>
        </>
    )



}

export default SalesDetail;