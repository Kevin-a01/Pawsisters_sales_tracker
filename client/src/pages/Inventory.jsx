import BurgerMenu from "../components/BurgerMenu";
import { data, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'

const options = ["Alla", "Virkat", "Stickers", "Pins", "Övrigt"]


export default function Inventory () {

  const [selected, setSelected] = useState(options[0])
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [editingProductId, setEditingProductId] = useState(null);

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

    const handleDelete = async (id) => {

      try{
        const res = await fetch(`${API_BASE_URL}/api/inventory/${id}`, {
          method: "DELETE",
        })

        if(!res.ok){
          const err = await res.json();
          throw new Error ("Failed to delete product: ", err);
        }

        setProducts(prev => prev.filter(p => p.id !== id));

        alert("Inventerings Föremål Borttagen!");

      }catch(err){
        console.error("Error deleting inventory product");
      }

    };

    const handleSaveQuantity = async (id) => {

      const paresedQuantity = parseInt(newQuantity);

      if(isNaN(paresedQuantity)){
        alert("Skriv in ett giltigt antal");
        return
      }

      try{
        const res = await fetch(`${API_BASE_URL}/api/inventory/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type" : "application/json",
          },
          body: JSON.stringify({quantity: Number(paresedQuantity)}),
        });
        if(!res.ok) throw new Error("Misslyckades att uppdatera antalet");

        const updated = await res.json();

        if(!updated.product){
          throw new Error("Produktdata saknas i svaret");
        }

        setProducts((prev) => 
        prev.map((p) => (p.id === id ? {...p, quantity: updated.product.quantity} : p)));

        setEditingProductId(null);
        alert("Antal uppdaterat.");


      }catch(err){
        console.error(err);
        alert("Kunde inte uppdatera produktens antal");
      }

    }
  
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
    <input className="border w-45 pl-1 rounded-xl h-9 focus:outline-none border-purple-500" type="text" placeholder="Sök Produkt..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

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

                <div className="flex justify-between w-full mb-3">
                  <button onClick={() => handleDelete(product.id)} className="text-xl">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <button className="text-xl mr-1" onClick={() => {
                    setEditingProductId(product.id);
                    setNewQuantity(product.quantity);
                  }}>
                    <i className="fa-solid fa-pen"></i>
                  </button>
                </div>

              
                <h2 className="text-2xl p-1 leading-snug font-medium ">
                  {product.name}
                </h2>
                {editingProductId === product.id ? (
                  <div className="flex items-center  gap-2">
                    <input 
                    type="tel" 
                    inputMode="numeric" 
                    min="0"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    className="w-20 border-pink-400 border focus:outline-none rounded p-1 text-center"
                     />
                     <button
                     onClick={() => handleSaveQuantity(product.id)}
                     className="bg-green-500 text-white px-2 py-0.5 mt-1 rounded">
                      Spara
                     </button>
                     <button onClick={() => setEditingProductId(null)}
                     className="bg-red-500 text-white px-2 py-0.5 mt-1 rounded">
                      Avbryt
                     </button>
                  </div>
                ) : (
                  <p className="text-lg p-1 font-medium ">
                  Antal: {product.quantity}
                  </p>
                )}

                


                <img className="w-15 mx-2 ml-auto -mt-20 " src={product.image} alt={product.name} /> 
              
              
            </div>

            
          ))

        )}

      
        
        

    </div>
    </>
    
    
  )
  

}