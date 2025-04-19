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

    const API_BASE_URL = import.meta.env.PROD 
    ? "https://pawsisterssalestracker-production-529b.up.railway.app"
    : "http://localhost:5000";

    useEffect(() => {
       
      fetch(`${API_BASE_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products", err));


    }, []);
    
      
    useEffect(() => {
      
        fetch(`${API_BASE_URL}/api/cons/latest`)
        .then((res) => res.json())
        .then((data) => {
            setConTitle(data.title);
            setConId(data.conId);
            localStorage.setItem("conId", data.conId);

        })
        .catch((err) => console.error("Error fetching conventions", err));
    }, []);

    useEffect(() => {
        document.title = "PawSisters Sale Tracker"

    })

    const deleteProduct = async (id) => {

        console.log("Attempting to delete product with ID:", id); 

        if(!window.confirm("Vill du verkligen ta bort denna produkt?")) return;
        try{
            const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {method: "DELETE"});

            if(!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to delete product: ${errorText}`)

            }

            setProducts(products.filter((product) => product.id !== id));
            alert("Produkt Borttagen!");

        }catch(error){
            console.error("Error deleting product:");
            alert("Error deleting product.")
        }

    };

    const storedProducts = async () => {
        console.log("Storing products with conId:", conId);
        console.log("Products to store:", products);

        if(!conId) {
            alert("Det finns inga produkter att lagra!");
            return;
        }

        if(products.length === 0) {

            alert("No products to store!");
            return;

        }

        setIsStoring(true);

        

        try{
            console.log("Storing product:");
           
            const response = await fetch(`${API_BASE_URL}/api/stored_products/store`, {
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
                    alert(`Failed to store products`);
                    
                }
                alert("Alla produkter är lagrade!"),

                setRefreshTrigger((prev) => prev + 1 );

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
    <div className="p-2 lg:flex lg:flex-col lg:justify-center">

        <div className="flex justify-between items-center pb-8">
            <button className="border border-transparent p-2 bg-pink-300 font-medium rounded-xl shadow-2xl cursor-pointer" onClick={storedProducts}>
                Lagra Produkter
            </button>
            <Link to="/add-product" className="border border-transparent p-2 bg-pink-300 font-medium rounded-xl shadow-2xl " >
                Lägg till produkt
            </Link>
            
        </div>
        <h1 className="text-center text-4xl font-bold mb-4 text-pink-300" >{conTitle}</h1>
        <h2 className="text-center text-2xl font-bold font-mono">Dagens försäljning.</h2>
        <table className="w-full border-collapse border border-pink-300 mt-5 lg:w-4/5 lg:mx-auto">
            <thead className="">
                <tr className="w-screen">
                    <th className="border-2 border-pink-300 p-1 text-lg">Produkt</th>
                    <th className="border-2 border-pink-300 p-1 text-lg"
                    >Pris</th>
                     <th className="border-2 border-pink-300 p-1 text-lg w-fit">Maker</th>
                    <th className="border-2 border-pink-300 p-1 text-lg w-fit">Betalning</th>
                    <th className="border-2 border-pink-300 p-1 text-lg w-fit">Action</th>
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
                                {product.maker}
                            </td>

                            <td className="border-2 border-pink-300 p-2 text-center text-md font-medium">
                                {product.payment}
                            </td>

                            <td className="border-2 border-pink-300 p-2 text-center text-md font-medium bg-pink-400 ">
                                <button className="cursor-pointer w-full" onClick={() => {
                                    console.log("Delete button clicked for ID:", product.id);
                                    deleteProduct(product.id)}}>
                                    Ta bort
                                </button>
                            </td>
                        </tr>


                    ))
                ) : (
                    <tr>
                        <td colSpan="3" className="border-2 border-pink-300 p-2 text-center">
                        Inga sålda produkter.
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