import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import BurgerMenu from "../components/BurgerMenu";

function SalesDetail() {
     

    const { conId } = useParams();
    const navigate = useNavigate();
    const [conTitle, setConTitle] = useState("");
    const [sales, setSales] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [filterMaker, setFilterMaker] = useState("");
    const [filterPayment, setFilterPayment] = useState("");

    const API_BASE_URL = import.meta.env.PROD
        ? "https://pawsisterssalestracker-production-529b.up.railway.app"
        : "http://localhost:5000";

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/stored_products/${conId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch sales data");
                }
                const data = await response.json();

                setSales(data);

                if (data.length > 0) {
                    setConTitle(data[0].title);
                }

                const total = data.reduce((sum, sale) => sum + Number(sale.price), 0);
                setTotalRevenue(total);

            } catch (error) {
                console.error("Error fetching sales data", error);
            }
        };

        fetchSales();
    }, [conId]);

        useEffect(() => {
            document.title = `Detaljer för ${conTitle}` 

        })

    const handleDelete = async () => {
        /* const password = prompt("Ange lösenord för att ta bort försäljningsdata:");

        if(!password) {
            alert("Lösenord krävs.")
            return;
        } */


        const confirmDelete = window.confirm("Är du säker att du vill ta bort all försäljningsdata?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/stored_products/${conId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",

                },
                /* body: JSON.stringify({password}), */
            });

            if (!response.ok) {
                throw new Error("Failed to delete sales data");
            }

            alert("Försäljningsdata borttagen!");
            setSales([]);
            setTotalRevenue(0);
            navigate("/sales-tracker");
        } catch (error) {
            console.error("Error deleting sales data:", error);
            alert("Misslyckades att ta bort försäljningsdata.");
        }
    };

    const filteredSales = sales.filter((sale) => {

        const pay = sale.payment?.toLowerCase() ?? "";
        const maker = sale.maker?.toLowerCase() ?? "";


        const payMatch = filterPayment
        ? pay === filterPayment.toLowerCase()
        : true;

        const makerMatch = filterMaker
        ? maker === filterMaker.toLowerCase()
        : true

        return payMatch && makerMatch;
    });

    return (
        <>
            <BurgerMenu/>
            <div className="p-3">
                <h1 className="text-2xl lg:text-3xl text-center font-bold font-mono text-pink-300">
                    Försäljning för {conTitle}
                </h1>
                <div className="flex justify-center mt-4">
                    <label className="mr-2 font-medium mt-1 text-xl">Filtrera efter betalning.</label>
                    <select
                        className="border-2 p-2 focus:outline-none focus:ring-0 focus:border-pink-300 appearance-none rounded-xl border-pink-300"
                        value={filterPayment}
                        onChange={(e) => setFilterPayment(e.target.value)}
                    >
                        <option value="">Alla betalningar</option>
                        <option value="Swish">Swish</option>
                        <option value="Kort">Kort</option>
                        <option value="Kontant">Kontant</option>
                    </select>

                    
                </div>

                

                <div className="flex justify-center mt-4">
                    <label className="mr-2 font-medium mt-1 text-xl">Filtrera efter skapare.</label>

                    <select  className="border-2 p-2 focus:outline-none focus:ring-0 focus:border-pink-300 appearance-none rounded-xl border-pink-300 " 
                    onChange={(e) => setFilterMaker(e.target.value)}
                    value={filterMaker}>

                        <option value="">Alla</option>
                        
                        <option value="T">T</option>
                        
                        <option value="M">M</option>

                        <option value="T-M">T-M</option>
            
                    </select>

                </div>

                <h2 className="text-2xl font-medium mt-4 mb-1 text-pink-400">
                        Totalen för dagen: {filteredSales.reduce((sum, sale) => sum + Number(sale.price), 0)}kr
                    </h2>

               

                {filteredSales.length === 0 ? (
                    <p className="text-xl text-center py-5 font-medium">
                        Ingen matchingar!
                    </p>
                ) : (
                    <>
                        <table className="w-full border-collapse mt-4">
                            <thead>
                                <tr>
                                    <th className=" border-2 border-pink-300 p-2">
                                        Produkt
                                    </th>

                                    <th className="border-2 border-pink-300 p-2">
                                        Maker
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
                                {filteredSales.map((sale) => (
                                    <tr key={`${sale.id}`}>
                                        <td className="border-2 border-pink-300 p-2 text-center">{sale.product}</td>

                                        <td className="border-2 border-pink-300 p-2 text-center">{sale.maker}</td>

                                        <td className="border-2 border-pink-300 p-2 text-center">{sale.price} kr</td>
                                        <td className="border-2 border-pink-300 p-2 text-center">{sale.payment}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}

                <div className="flex flex-col">                   
                    {sales.length > 0 && (
                        <button
                            className="text-md w-5/12 lg:w-1/6 font-bold mt-2 border p-2 rounded-xl border-pink-400 bg-pink-400 hidden"
                            onClick={handleDelete}
                        >
                            Ta bort Detalj Data
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}

export default SalesDetail;
