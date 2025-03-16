import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function SalesDetail() {
    const {conId} = useParams();
    const [conTitle, setConTitle] = useState("");
    const [sales, setSales] = useState([]);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/cons/${conId}`);
                const data = await response.json();
                setConTitle(data.title);
                setSales(data.products);
            }catch(error){
                console.error("Error fetching sales data", error);
            }
        };

        fetchSales();
    }, [conId])

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.price, 0);

    return(
        <div className="p-3">
        <h1 className="text-xl text-center font-bold">Sales for {conTitle}</h1>
        <ul>
            {sales.map((sale) =>(
                <li key={sale.id} className="border p-2 my-2">
                    {sale.product} - {sale.price} SEK ({sale.payment})
                </li>
            ))}
            
        </ul>
        <h2 className="text-lg font-bold mt-4">
            Total Revenue: {totalRevenue} SEK
        </h2>


        </div>
    )



}

export default SalesDetail;