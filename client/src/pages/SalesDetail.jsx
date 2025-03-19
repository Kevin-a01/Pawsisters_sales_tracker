import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";

function SalesDetail() {
    const {conId} = useParams();
    const [conTitle, setConTitle] = useState("");
    const [sales, setSales] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/stored_products/${conId}`);
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

    

    return(
        <>
        <Header/>
        <div className="p-3">
        <h1 className="text-xl text-center font-bold">Försäljning för {conTitle}</h1>
        {sales.length === 0 ? (
            <p className="text-center text-2xl">No sales data available for this Con! </p>
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
                        {sales.map((sale) =>(
                            <tr key={sale.productId}>
                                <td className="border-2 border-pink-300 p-2 text-center">{sale.product}</td>
                                <td className="border-2 border-pink-300 p-2 text-center">{sale.price} kr</td>
                                <td className="border-2 border-pink-300 p-2 text-center">{sale.payment}</td>
                            </tr>


                        ))}
                    </tbody>
                </table>
            
            </>


        )}
        <h2 className="text-lg font-bold mt-4">
            Totalen för dagen: {totalRevenue} KR
        </h2>


        </div>
        </>
    )



}

export default SalesDetail;