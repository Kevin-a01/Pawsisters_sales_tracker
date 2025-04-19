import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"

function AddProduct(){
  document.title = "Lägg till produkt"
  
  const navigate = useNavigate();


  const [products, setProducts] = useState([]);
  const [conTitle, setConTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [conId, setConId] = useState(() => localStorage.getItem("conId")|| null);
  const [form, setForm] = useState({
    title: "",
    product: "",
    price: "",
    payment: {Swish: false, Kort: false, Kontant: false},
    maker: "",
  });

  const API_BASE_URL = import.meta.env.PROD 
    ? "https://pawsisterssalestracker-production-529b.up.railway.app"
    : "http://localhost:5000";

  useEffect(() => {
    if(!localStorage.getItem("conId")){
      setConId(null);
      setConTitle("");

    }
  },[]);

  
  useEffect(() => {
    const checkConId = async() => {
      console.log('conId after fetch:', conId);
      try{
        const response = await fetch(`${API_BASE_URL}/api/cons/latest`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        if(data?.conId){
          setConId(data.conId);
          setConTitle(data.title);
          localStorage.setItem("conId", data.conId);
        } else{
          setConId(null);
          setConTitle("");
          localStorage.removeItem("conId");
        } 

      }catch(error){
        console.error("Error checking conventions: ",error);
        
      }finally{
        setLoading(false);

      }
    };
      checkConId();
      
  }, []);
  

  

  const handleChange = (e) => {

    setForm({...form, [e.target.name]: e.target.value});
    

  }

  const handleMakerChange = (e) => {

    setForm({...form, maker: e.target.value});

  }

  const handleCheckbox = (e) => {

    setForm({...form, payment:{...form.payment, [e.target.name]: e.target.checked},});
  };
  
  const addProduct = async (e) => {

    e.preventDefault();
    const selectedPayments = Object.keys(form.payment).filter(
      (key) => form.payment[key]
    );

    if (!form.product || !form.price || !form.maker || selectedPayments.length === 0){

      alert('Var snäll och fyll i alla fält.');
      return;
      
    }
    

   
    try{
      let currentConId = conId;
      if(!conId && conTitle.trim() !== ""){
        
        const respone = await fetch (`${API_BASE_URL}/api/cons`, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({title: conTitle}),
         

        });
        

        const data = await respone.json();
        currentConId = data.conId;
        setConId(currentConId);
        localStorage.setItem("conId", currentConId);

      }
      ;
      const productResponse = await fetch(`${API_BASE_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
          product: form.product,
          price: parseFloat(form.price),
          payment: selectedPayments.join(", "),
          conId: currentConId,
          maker: form.maker,
        }),
      });
      const productData = await productResponse.json();

      console.log("Product data received:", productData);
      const productId = productData.productId;

      if (!productId) {
        console.error("Error: productId is missing from the response", productData);
        alert("Failed to create product, missing productId.");
        return;
      }
      
      setProducts(prevProducts => [
        ...prevProducts,
        {
          id: Date.now(),
          product: form.product,
          price: form.price,
          payment: selectedPayments.join(", ")
        }
      ]);

      setForm({
        ...form,
        product:"",
        price: "",
        payment: { Swish: false, Kort: false, Kontant: false},
        maker: "",
      });

      navigate("/");
      
    }catch(error){
      console.error("Error adding product:", error);
      alert("Failed to add product");
    }
  };


  return (
    <>
      <Header />
      {loading ? (
        <div className="text-center text-3xl text-pink-300 mt-3 pb-1">Loading...</div>
      ) : (
        <div className="p-3">
          <form onSubmit={addProduct} className="space-y-5 flex flex-col justify-center items-center pt-2">
            {!conId ? (
              <input
                type="text"
                placeholder="ExampleCon..."
                value={conTitle}
                onChange={(e) => setConTitle(e.target.value)}
                className="p-2 w-11/12 border border-pink-300 focus:outline-none rounded-xl focus:border-purple-500 lg:w-1/4"
              />
            ) : (
              <h2 className="text-xl font-black text-pink-300">{conTitle}</h2>
            )}
              <input
              list="productOptions"
              type="text"
              name="product"
              placeholder="Produkt Namn..."
              value={form.product}
              onChange={handleChange}
              className="p-2 w-11/12 border border-pink-300 focus:outline-none rounded-xl focus:border-purple-500 appearance-none lg:w-1/4"
            /> 

            <datalist id="productOptions">
            <option value="Mushroom Villager">
              Mushroom Villager
            </option>

            <option value="Keychain">
              Keychain
            </option>

            <option value="1 Sticker">
               1 Sticker
            </option>

            <option value="5 Stickers">
              5 Stickers
            </option>

            <option value="Duckling">
              Duckling
            </option>

            <option value="Mystery Bag">
              Mystery Bag
            </option>
            
            </datalist>
  
            <input
              type="tel"
              inputmode="numeric"
              name="price"
              placeholder="Pris (SEK)"
              value={form.price}
              onChange={handleChange}
              className="p-2 w-11/12 border border-pink-300 focus:outline-none rounded-xl focus:border-purple-500 lg:w-1/4"
            />
  
            <div className="grid grid-cols-1 gap-3 place-items-start w-full lg:w-128 ml-11">
              <label className="text-lg flex items-center gap-2">
                <input
                  type="checkbox"
                  name="Swish"
                  checked={form.payment.Swish}
                  onChange={handleCheckbox}
                />
                Swish
              </label>
  
              <label className="text-lg flex items-center gap-2">
                <input
                  
                  type="checkbox"
                  name="Kort"
                  checked={form.payment.Kort}
                  onChange={handleCheckbox}
                />
                Kort
              </label>
  
              <label className="text-lg flex items-center gap-2">
                <input
                  type="checkbox"
                  name="Kontant"
                  checked={form.payment.Kontant}
                  onChange={handleCheckbox}
                />
                Kontant
              </label>
            </div>

            <div className="flex gap-5 place-items-start w-full lg:w-128 ml-11">

            <label className="text-lg flex items-center gap-2">
                <input
                  type="radio"
                  name="maker"
                  value="T"
                  checked={form.maker === "T"}
                  onChange={handleMakerChange}
                />
                T
              </label>

              <label className="text-lg flex items-center gap-2">
                <input
                  type="radio"
                  name="maker"
                  value="M"
                  checked={form.maker === "M"}
                  onChange={handleMakerChange}
                />
                M
              </label>

              <label className="text-lg flex items-center gap-2">
                <input
                  type="radio"
                  name="maker"
                  value="T-M"
                  checked={form.maker === "T-M"}
                  onChange={handleMakerChange}
                />
                T-M
              </label>

            </div>

  
            <button
              type="submit"
              className="border border-transparent text-2xl cursor-pointer p-3 bg-pink-300 rounded-xl shadow-2xl"
            >
              Lägg till produkt
            </button>
          </form>
        </div>
      )}
    </>
  );
  
  
    

  
}


export default AddProduct;