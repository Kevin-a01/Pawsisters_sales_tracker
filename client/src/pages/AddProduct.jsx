import Header from "../components/Header";
import { useState } from "react";

function AddProduct(){
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({

    product: "",
    price: "",
    payment: {Swish: false, Kort: false, Kontant: false},

  });
  const [sales, setSales] = useState({});

  const handleChange = (e) => {

    setForm({...form, [e.target.name]: e.target.value});

  }

  const handleCheckbox = (e) => {

    setForm({...form, payment:{...form.payment, [e.target.name]: e.target.checked},});
  };
  
  const addProduct = (e) => {

    e.preventDefault();
    const selectedPayments = Object.keys(form.payment).filter(
      (key) => form.payment[key]
    );

    if (!form.product || !form.price || selectedPayments.length === 0){

      alert('Please fill all fields and select at least one payment method.');
      return;
    }
    setProducts([
      ...products,
      {
        id: Date.now(),
        product: form.product,
        price: form.price,
        payment: selectedPayments.join(", ")
      }
    ]);

    setForm({
      product: "",
      price: "",
      payment: {Swish: false, Kort: false, Kontant: false},
    });
  };


  return(
    <>
    <Header/>
    <div className="p-3">
      <form onSubmit={addProduct} className="space-y-4">
        <input 
        type="text"
        name="product"
        placeholder="Produkt Namn..."
        value={form.product}
        onChange={handleChange}
        className="w-full p-2 border border-pink-600 focus:outline-none rounded-xl focus:border-purple-500" />
      



      </form>
    </div>
    </>
  )

}


export default AddProduct;