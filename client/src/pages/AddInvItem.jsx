import { useState } from "react";
import BurgerMenu from "../components/BurgerMenu";
import { useNavigate } from "react-router-dom";

export default function () {
  const [formData, setFormData] = useState({
    /*  product_code: "", */
    name: "",
    quantity: "",
    category: "",
    image: "",
    maker: "",
    price: "",
  });

  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.PROD
    ? "https://pawsisterssalestracker-production-529b.up.railway.app"
    : "http://localhost:5000";

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("quantity", formData.quantity);
    data.append("image", formData.image);
    data.append("category", formData.category);
    data.append("maker", formData.maker);
    data.append("price", formData.price);

    if (
      !formData.name ||
      !formData.quantity ||
      !formData.category ||
      !formData.image ||
      !formData.maker ||
      !formData.price
    ) {
      alert("Var snäll och fyll i alla fält!");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory`, {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        const err = await res.json();
        alert("Error:" + err.error);
      } else {
        setFormData({
          name: "",
          quantity: "",
          category: "",
          image: "",
          maker: "",
          price: "",
        });
      }
    } catch (err) {
      console.error("Något gick fel:", err);
    }
    navigate("/inventory");
  };

  const handleMakerChange = (e) => {
    setFormData({ ...formData, maker: e.target.value });
  };

  return (
    <>
      <BurgerMenu />
      <div className="">
        <form onSubmit={handleSubmit}>
          <h1 className="text-center text-xl font-medium mb-5">
            Lägg till ny produkt
          </h1>
          <div className="flex flex-col mx-auto w-fit gap-1">
            <label htmlFor="product-name" className="">
              Produkt namn <span className="text-red-500"> *</span>
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              className="border w-85 p-2 rounded-lg border-pink-300 focus:outline-none"
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col mx-auto w-fit gap-1 mt-4">
            <label htmlFor="product-category" className="">
              Produkt Kategori <span className="text-red-500"> *</span>
            </label>

            <select
              name="category"
              value={formData.category}
              className="border w-85 p-2 rounded-lg border-pink-300 focus:outline-none appearance-none"
              onChange={handleChange}
            >
              <option value="">Välj en Kategori</option>
              <option value="Virkat">Virkat</option>
              <option value="Stickers">Stickers</option>
              <option value="Pins">Pins</option>
              <option value="Övrigt">Övrigt</option>
            </select>
          </div>

          <div className="flex flex-col mx-auto w-fit gap-1 mt-4 ">
            <label htmlFor="available-quantity" className="">
              Tillänglig kvantitet<span className="text-red-500"> *</span>
            </label>

            <input
              type="tel"
              inputMode="numeric"
              name="quantity"
              value={formData.quantity}
              className="border w-85 p-2 rounded-lg border-pink-300 focus:outline-none"
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col mx-auto w-fit gap-1 mt-4 ">
            <label htmlFor="product_price" className="">
              Pris för produkt<span className="text-red-500"> *</span>
            </label>

            <input
              type="tel"
              inputMode="numeric"
              name="price"
              value={formData.price}
              className="border w-85 p-2 rounded-lg border-pink-300 focus:outline-none"
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col justify-center items-center mx-auto w-fit gap-1 mt-4 ">
            <label htmlFor="product_image" className="text-xl">
              Produkt Bild<span className="text-red-500"> *</span>
            </label>
            <input
              type="file"
              id="product_image"
              name="image"
              className="hidden"
              onChange={handleChange}
              placeholder="Produkt-100"
            />

            <label
              htmlFor="product_image"
              className="cursor-pointer px-4 py-2 mt-2 bg-pink-300  text-white rounded-lg w-fit text-center"
            >
              Välj Bild...
            </label>

            {formData.image && (
              <span className="mt-2">
                <h3 className="text-lg animate-pulse">
                  Vald Fil: {formData.image.name}
                </h3>
              </span>
            )}
          </div>

          <div className="flex flex-col mx-auto w-full items-center gap-1 mt-4 ">
            <label htmlFor="product_maker" className="text-xl mb-2">
              Skapare<span className="text-red-500"> *</span>
            </label>

            <div className="flex gap-3 flex-col items-center justify-center w-full">
              <label
                className="flex items-center text-lg gap-3"
                htmlFor="product_maker"
              >
                T
                <input
                  type="radio"
                  name="maker"
                  value="T"
                  checked={formData.maker === "T"}
                  onChange={handleMakerChange}
                  className="ml-[12%] w-5 h-5  "
                />
              </label>

              <label
                className="flex items-center gap-3 text-lg mr-1.5"
                htmlFor="product_maker"
              >
                M
                <input
                  type="radio"
                  name="maker"
                  value="M"
                  checked={formData.maker === "M"}
                  onChange={handleMakerChange}
                  className="ml-[12%] w-5 h-5"
                />
              </label>

              <label
                className="flex items-center text-lg gap-3 mr-7"
                htmlFor="product_maker"
              >
                T+M
                <input
                  type="radio"
                  name="maker"
                  value="T+M"
                  checked={formData.maker === "T+M"}
                  onChange={handleMakerChange}
                  className="ml-[9%] w-5 h-5"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col mx-auto w-80 gap-1 mt-4 ">
            <button
              type="submit"
              className="mt-5 mb-10 p-3.5 bg-purple-500 text-lg text-white font-medium rounded-xl "
            >
              Spara
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
