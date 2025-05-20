import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import BurgerMenu from "../components/BurgerMenu";


function AddProduct(){
  document.title = "Lägg till produkt"
  
  const navigate = useNavigate();


  const [products, setProducts] = useState([]);
  const [conTitle, setConTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [conId, setConId] = useState(() => localStorage.getItem("conId")|| null);
  const [activeCons, setActiveCons] = useState([]);
  const [showNewConInput, setShowNewConInput] = useState(false);
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

    const fetchActiveCons = async() => {
      try{
        const response = await fetch(`${API_BASE_URL}/api/cons/active`)
      if(!response.ok) {
      throw new Error('Failed to fetch active conventions')
      }
      const data = await response.json()
      setActiveCons(data)


      if(!conId && data.length > 0) {
        setConId(data[0].id);
        setConTitle(data[0].title);
        localStorage.setItem('conId', data[0].id);
        localStorage.setItem('conTitle',data[0].title);

        }
    }catch(err) {
      console.error('Error fetching active cons:', err);
    }finally{
      setLoading(false);
    }
  }
    fetchActiveCons();
  }, [conId])

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
      let currentConId = conId === 'none' ? null : conId;
      let currentConTitle = conTitle;
      if(conId === 'new' && conTitle){
        
        const respone = await fetch (`${API_BASE_URL}/api/cons`, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({title: conTitle}),
        });
        

        const data = await respone.json();
        currentConId = data.conId;
        setConId(currentConId);
        localStorage.setItem("conId", currentConId);
        localStorage.setItem("conTitle", conTitle);

      }else if(conId && conId !== 'new' && conId !== 'none') {
        currentConId = conId;
        const selectedCon = activeCons.find((con) => con.id === parseInt(conId));
        if(selectedCon){
          currentConTitle = selectedCon.title;
          localStorage.setItem('conTitle', currentConTitle)
  
        }
      }
      
     const payload = {
      product: form.product,
      price: parseFloat(form.price),
      payment: selectedPayments.join(", "),
      conId: currentConId,
      maker: form.maker,
      conId: currentConId,

     }

      const productResponse = await fetch(`${API_BASE_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(payload),
      });
      const productData = await productResponse.json();

      console.log("Product data received:", productData);
      const productId = productData.productId;

      if (!productId) {
        console.error("Error: productId is missing from the response", productData);
        alert("Failed to create product, missing productId.");
        return;
      }

      if (productData.conId) {
        currentConId = productData.conId;
        currentConTitle = currentConTitle || 'Temp Con ' + Date.now(); 
        setConId(currentConId);
        setConTitle(currentConTitle);
        localStorage.setItem("conId", currentConId);
        localStorage.setItem("conTitle", currentConTitle);
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

      navigate('/sales-tracker', {state: {conId: currentConId, conTitle: currentConTitle}});
      
    }catch(error){
      console.error("Error adding product:", error);
      alert("Failed to add product");
    }
  };


  return (
    <>
      <BurgerMenu/>
      {loading ? (
        <div className="flex justify-center items-center mt-3 pb-1 gap-9">
          <p className="text-2xl text-pink-300 animate-pulse">🧁 Laddar...</p>
        <div className="animate-spin rounded-full h-9 w-9 border-t-4 border-pink-300"></div>
        </div>
      ) : (
        <div className="p-3">
          <form onSubmit={addProduct} className="space-y-5 flex flex-col justify-center items-center pt-2 pb-2">
            <div className="w-11/12 lg:w-1/4">
              <label className="text-lg font-medium text-pink-500">Lägg till produkt och skapa nytt konvent </label>
              <select name=""
               id=""
               value={conId || ''}
               onChange={(e) => {
                const value = e.target.value;
                setConId(value);
                localStorage.setItem('conId', value);
                setShowNewConInput(value === 'new');
                if(value !== 'new' && value !== 'none') {
                  localStorage.setItem('conTitle', '')
                }
               }}
               className="p-2 mt-2 w-full border border-pink-300 focus:outline-none rounded-xl focus:border-purple-500">

                <option value="">Välj ett alternativ</option>
                <option value="none">Lägg till produkt utan con titel</option>
                {activeCons.map((con) => (
                  <option key={con.id} value={con.id}>
                    {con.title}
                  </option>
                ))}
                <option value="new">
                  Skapa Nytt Konvent
                </option>
              </select>
            </div>
            {showNewConInput && (
              <input 
              type="text"
              placeholder="Ange Konventstitle (t.ex. ExampleCon 2025)"
              value={conTitle}
              onChange={(e) => setConTitle(e.target.value)}
              className="p-2 w-11/12 border border-pink-300 focus:outline-none rounded-xl focus:border-purple-500 lg:w-1/4"
              />

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
              <label className="text-lg flex items-center gap-2  text-pink-500">
                <input
                  type="checkbox"
                  name="Swish"
                  checked={form.payment.Swish}
                  onChange={handleCheckbox}
                />
                Swish
              </label>
  
              <label className="text-lg flex items-center gap-2 text-pink-500">
                <input
                  
                  type="checkbox"
                  name="Kort"
                  checked={form.payment.Kort}
                  onChange={handleCheckbox}
                />
                Kort
              </label>
  
              <label className="text-lg flex items-center gap-2 text-pink-500">
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

            <label className="text-lg flex items-center gap-2 text-pink-500 ">
                <input
                  type="radio"
                  name="maker"
                  value="T"
                  checked={form.maker === "T"}
                  onChange={handleMakerChange}
                />
                T
              </label>

              <label className="text-lg flex items-center gap-2 text-pink-500 ">
                <input
                  type="radio"
                  name="maker"
                  value="M"
                  checked={form.maker === "M"}
                  onChange={handleMakerChange}
                />
                M
              </label>

              <label className="text-lg flex items-center gap-2 text-pink-500">
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
              className="border border-transparent text-2xl cursor-pointer p-3 bg-pink-300 rounded-xl shadow-pink-500 shadow-md"
            >
              Lägg till produkt!
            </button>
          </form>
        </div>
      )}
    </>
  );
  
  
    

  
}


export default AddProduct;