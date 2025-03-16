import { useEffect, useState } from "react";
import Header from "./components/Header";
import { Link } from "react-router-dom";

function HomePage(){

    const [products, setProducts] = useState([]);
    const [conTitle, setConTitle] = useState("");

    useEffect(() => {
      fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products", err));


    }, [])

    useEffect(() => {
        fetch("http://localhost:5000/api/cons/latest")
        .then((res) => res.json())
        .then((data) => setConTitle(data.title))
        .catch((err) => console.error("Error fetching conventions", err));
    }, [])

return(
    <>
    <Header/>
    <div className="p-2">

        <div className="flex justify-end items-center pb-8">
            <Link to="/add-product" className="border border-pink-400 p-2 bg-pink-400 text-white rounded-xl shadow-2xl" >
                Add New Product
            </Link>
        </div>
        <h1 className="text-center text-3xl font-bold mb-3" >{conTitle}</h1>
        <h2 className="text-center text-2xl font-bold">Today's Sales</h2>
        <table className="w-full border-collapse border border-pink-400 mt-5">
            <thead className="">
                <tr>
                    <th className="border-2 border-pink-400 p-2 text-xl">Product</th>
                    <th className="border-2 border-pink-400 p-2 text-xl">Price</th>
                    <th className="border-2 border-pink-400 p-2 text-xl">Payment</th>
                </tr>
            </thead>
            <tbody>
                {products.length > 0 ? (
                    products.map((product) =>(
                        <tr>
                            <td className="border-2 border-pink-400 p-2 text-center text-md font-medium">
                                {product.product}
                            </td>

                            <td className="border-2 border-pink-400 p-2 text-center text-md font-medium">
                                {product.price}kr
                            </td>

                            <td className="border-2 border-pink-400 p-2 text-center text-md font-medium">
                                {product.payment}
                            </td>
                        </tr>


                    ))
                ) : (
                    <tr>
                        <td colSpan="3" className="border-2 border-pink-400 p-2 text-center">
                        No sales yet.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>

    </div>

    </>
)
}

export default HomePage;