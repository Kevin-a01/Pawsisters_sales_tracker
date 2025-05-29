import { useState } from "react";
import BurgerMenu from "../components/BurgerMenu";
import { useNavigate } from "react-router-dom";

export default function(){

  const [formData, setFormData] = useState({
    product_code: "",
    name: "",
    quantity: "",
    category: "",
    image: ""

  })

  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.PROD 
    ? "https://pawsisterssalestracker-production-529b.up.railway.app"
    : "http://localhost:5000";


    const handleChange = (e) =>  {
      const {name, value, type, files} = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "file" ? files[0] : value
      }));

    }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("product_code", formData.product_code);
    data.append("name", formData.name)
    data.append("quantity", formData.quantity)
    data.append("image", formData.image)
    data.append("category", formData.category)

    try{
      const res = await fetch(`${API_BASE_URL}/api/inventory`, {
        method: "POST",
        body: data,
      });

      if(!res.ok){
        const err = await res.json()
        alert("Error:" + err.error)
      }else{
        setFormData({
          product_code: "",
          name: "",
          quantity: "",
          category: "",
          image: ""
        });

      }

    }catch(err){
      console.error("Något gick fel:", err);
      

    }
    navigate('/inventory')
  }

  return(
    <>
    <BurgerMenu/>
    <div className="">
      <form onSubmit={handleSubmit}>
      <h1 className="text-center text-xl font-medium mb-5">Lägg till ny produkt</h1>
      <div className="flex flex-col mx-auto w-fit gap-1">
        <label htmlFor="product-name" className="">Produkt namn <span className="text-red-500"> *</span></label>

        <input type="text" name="name" value={formData.name} className="border w-85 p-2 rounded-lg border-pink-300 focus:outline-none" onChange={handleChange} />
      </div>

        <div className="flex flex-col mx-auto w-fit gap-1 mt-4">
        <label htmlFor="product-category" className="">Produkt Kategori <span className="text-red-500"> *</span></label>

        <select name="category" value={formData.category} className="border w-85 p-2 rounded-lg border-pink-300 focus:outline-none appearance-none" onChange={handleChange}>
          <option value="">Välj en Kategori</option>
          <option value="Virkat">Virkat</option>
          <option value="Stickers">Stickers</option>
          <option value="Pins">Pins</option>
          <option value="Övrigt">Övrigt</option>
        </select>
      </div>

        <div className="flex flex-col mx-auto w-fit gap-1 mt-4 ">
        <label htmlFor="available-quantity" className="">Tillänglig kvantitet<span className="text-red-500"> *</span></label>

        <input type="text" name="quantity" value={formData.quantity} className="border w-85 p-2 rounded-lg border-pink-300 focus:outline-none" onChange={handleChange} />
      </div>

      <div className="flex flex-col mx-auto w-fit gap-1 mt-4 ">
        <label htmlFor="product_code" className="">Produkt Kod<span className="text-red-500"> *</span></label>
        <input type="text" name="product_code" value={formData.product_code} className="border w-85 p-2 rounded-lg border-pink-300 focus:outline-none" onChange={handleChange} placeholder="Produkt-100" />
      </div>

      <div className="flex flex-col mx-auto w-fit gap-1 mt-4 ">
        <label htmlFor="product_image" className="">Produkt Bild<span className="text-red-500"> *</span></label>
        <input type="file" name="image" className="border w-85 p-2 rounded-lg border-pink-300 focus:outline-none" onChange={handleChange} placeholder="Produkt-100" />
      </div>


         <div className="flex flex-col mx-auto w-80 gap-1 mt-4 ">
        <button type="submit" className="mt-5 mb-10 p-3.5 bg-purple-500 text-lg text-white font-medium rounded-xl ">
          Spara
        </button>
      </div>

      </form>
    </div>
    </>

  )

}