import BurgerMenu from "../components/BurgerMenu";
import { data, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'

const options = ["Alla", "Virkat", "Stickers", "Pins", "Övrigt"]


export default function Inventory () {

  const [selected, setSelected] = useState(options[0])
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const API_BASE_URL = import.meta.env.PROD 
    ? "https://pawsisterssalestracker-production-529b.up.railway.app"
    : "http://localhost:5000";

    useEffect(() => {

      async function fetchProducts() {
          try{
            const res = await fetch(`${API_BASE_URL}/api/inventory`)
            if(!res.ok) throw new Error("Failed to fetch products")

            const data = await res.json();

            setProducts(data);

          }catch(err){
            console.error("Failed fetching products", err);
          }
      }
      fetchProducts();
    }, []);

    const filteredProducts = products.filter(p => {

       // Kontrollera om produktens kategori matchar den valda kategorin
      const matchesCategory = selected === "Alla" || p.category === selected
      
      // Kontrollera om produktens namn innehåller sökordet (case-insensitive)
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());

      //Returnerar true bara om båda matchar.
      return matchesCategory && matchesSearch;

    });
  
  return(
   
    <>
    <BurgerMenu/>
    <div className="flex pl-2 gap-1 w-full">
      <div className="p-1 text-lg">
        <i class="fa-solid fa-box"></i>
      </div>
      <h2 className="p-1 text-lg">Pawsisters Inventory</h2>
      <Link to="/add-new-item" className="text-lg p-1 ml-auto bg-pink-400 w-20 flex items-center justify-center mr-2 rounded-xl md:mt-2"> 
        Add
      </Link>
       
    </div>

    <div className="py-3 pl-3 flex justify-between w-full ">
    <input className="border w-45 pl-1 rounded-xl focus:outline-none border-purple-500" type="text" placeholder="Sök Produkt..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

      <div className="p-2 relative w-22 mr-1">
        <Listbox value={selected} onChange={setSelected}>
        <ListboxButton className="w-full bg-pink-700 text-white  rounded-lg shadow hover:bg-pink-800 transition focus:outline-none p-1">{selected}</ListboxButton>
        <ListboxOptions anchor="bottom" className="absolute mt-1 bg-white w-20 text-center rounded-xl font-medium">
        {options.map((option) => (
          <ListboxOption value={option} className="data-focus:bg-[#FCD4DF] cursor-pointer border-none">
            {option}
          </ListboxOption>
        ))}
        </ListboxOptions>
        </Listbox>
      </div>
    </div>

    <div className="p-4 space-y-4">
        {filteredProducts.length === 0 ? (
          <p className="text-center text-xl">😭 Inga produkter hittades!</p>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.product_code} className="p-2 bg-[#FCD4DF] rounded-2xl flex flex-col items-start">
              
                <h2 className="text-2xl p-1 leading-snug font-medium ">
                  {product.name}
                </h2>

                <p className="text-lg p-1 font-medium ">
                  Antal: {product.quantity}
                </p>


                <img className="w-15 mx-4 ml-auto -mt-20" src={product.image} alt={product.name} /> 
              
              
            </div>

            
          ))

        )}

      
        
        

    </div>
    </>
    
    
  )
  

}