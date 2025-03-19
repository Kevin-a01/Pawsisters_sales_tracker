import { useEffect, useState } from "react";
import Header from "./components/Header";
import { Link } from "react-router-dom";
import DetailCard from "./components/DetailCard";

function HomePage(){

    const [products, setProducts] = useState([]);
    const [conTitle, setConTitle] = useState("");
    const [conId, setConId] = useState(null);
    const [isStoring, setIsStoring] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const API_URL = process.env.REACT_APP_API_URL;
      fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products", err));


    }, []);
    
      
    useEffect(() => {
        const API_URL = process.env.REACT_APP_API_URL;
        fetch(`${API_URL}/api/cons/latest`)
        .then((res) => res.json())
        .then((data) => {
            setConTitle(data.title);
            setConId(data.conId);
            localStorage.setItem("conId", data.conId);

        })
        .catch((err) => console.error("Error fetching conventions", err));
    }, []);

    const storedProducts = async () => {
        console.log("Storing products with conId:", conId);
        console.log("Products to store:", products);

        if(!conId) {
            alert("There is not active con to store products for!");
            return;
        }

        if(products.length === 0) {

            alert("No products to store!");
            return;

        }

        setIsStoring(true);

        

        try{
            console.log("Storing product:");
            const API_URL = process.env.REACT_APP_API_URL;
            const response = await fetch(`${API_URL}/api/stored_products/store`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    conId,
                    title: conTitle,
                    date: new Date().toISOString(),
                    products: products.map(p => ({productId: p.id, 
                    price: p.price,
                    payment: p.payment
                    }))

                })

                });


                if(!response.ok){
                    alert(`Failed to store products: ${product.product} (ID: ${product.id}`);
                    
                }
                alert("All products stored successfully!"),

                setRefreshTrigger((prev) => prev + 1);

                setProducts([]);

                setConTitle("");

                setConId(null);
                localStorage.removeItem("conId")
                
                    
                
            
            
             }catch(error){
            console.error("Error storing products", error);
            alert("An error occured");
             }finally{
                setIsStoring(false);
             }
    };

return(
    <>
    <Header/>
    <div className="p-2">

        <div className="flex justify-between items-center pb-8">
            <button className="border border-transparent p-2 bg-pink-300 font-medium rounded-xl shadow-2xl cursor-pointer" onClick={storedProducts}>
                Store Products
            </button>
            <Link to="/add-product" className="border border-transparent p-2 bg-pink-300 font-medium rounded-xl shadow-2xl " >
                Lägg till produkt
            </Link>
            
        </div>
        <h1 className="text-center text-3xl font-bold mb-3" >{conTitle}</h1>
        <h2 className="text-center text-2xl font-bold">Dagens försäljning.</h2>
        <table className="w-full border-collapse border border-pink-300 mt-5">
            <thead className="">
                <tr>
                    <th className="border-2 border-pink-300 p-2 text-xl">Produkt</th>
                    <th className="border-2 border-pink-300 p-2 text-xl">Pris</th>
                    <th className="border-2 border-pink-300 p-2 text-xl w-fit">Betalning</th>
                </tr>
            </thead>
            <tbody>
                {products.length > 0 ? (
                    products.map((product) =>(
                        <tr key={product.id}>
                            <td className="border-2 border-pink-300 p-2 text-center text-md font-medium">
                                {product.product}
                            </td>

                            <td className="border-2 border-pink-300 p-2 text-center text-md font-medium">
                                {product.price}kr
                            </td>

                            <td className="border-2 border-pink-300 p-2 text-center text-md font-medium">
                                {product.payment}
                            </td>
                        </tr>


                    ))
                ) : (
                    <tr>
                        <td colSpan="3" className="border-2 border-pink-300 p-2 text-center">
                        No sales yet.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>

    </div>
        <DetailCard refreshTrigger={refreshTrigger}/>
    </>
)
}

export default HomePage;