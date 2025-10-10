import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import DetailCard from "./components/DetailCard";
import BurgerMenu from "./components/BurgerMenu";
import BackToTopButton from "./components/BackToTopButton";

function SalesTracker() {
  const { state } = useLocation();
  const [products, setProducts] = useState([]);
  const [conId, setConId] = useState(
    state?.conId || localStorage.getItem("conId") || null
  );
  const [conTitle, setConTitle] = useState(
    state?.conTitle || localStorage.getItem("conTitle") || ""
  );
  const [isStoring, setIsStoring] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(false);
  const [storedCons, setStoredCons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCons, setSelectedCons] = useState([]);
  const [activeCon, setActiveCon] = useState(false);

  const API_BASE_URL = import.meta.env.PROD
    ? "https://pawsisterssalestracker-production-529b.up.railway.app"
    : "http://localhost:5000";

  useEffect(() => {
    const fetchStoredCons = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/stored_products/cons`
        );
        if (!response.ok) {
          throw new err("Failed to fetch stored cons");
        }
        const data = await response.json();
        setStoredCons(data);
      } catch (err) {
        console.error("Error fetching stored cons", err);
        setStoredCons([]);
      }
    };
    fetchStoredCons();
  }, []);

  useEffect(() => {
    if (state?.conId && state?.conTitle) {
      console.log("Updating conId and conTitle from state", state);
      setConId(state.conId);
      setConTitle(state.conTitle);
      localStorage.setItem("conId", state.conId);
      localStorage.setItem("conTitle", state.conTitle);
      setProducts([]);
    }
  }, [state]);

  useEffect(() => {
    if (products) {
      setActiveCon(true);
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        let url = `${API_BASE_URL}/api/products`;
        if (conId && conId !== "none") {
          url += `?conId=${conId}`;
          console.log("Fetching products for conId:", conId);
        } else {
          console.log("Fetching all products (no conId)");
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching product:", err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [conId, refreshTrigger]);

  useEffect(() => {
    document.title = "PawSisters Sale Tracker";
  });

  useEffect(() => {
    const total = products.reduce(
      (sum, product) => sum + Number(product.price),
      0
    );
    setTotalSales(total);
  }, [products]);

  useEffect(() => {
    const handleFocus = () => {
      setRefreshTrigger((prev) => prev + 1);
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const deleteProduct = async (id) => {
    console.log("Attempting to delete product with ID:", id);

    if (!window.confirm("Vill du verkligen ta bort denna produkt?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete product: ${errorText}`);
      }

      setProducts(products.filter((product) => product.id !== id));
      alert("Produkt Borttagen!");
    } catch (error) {
      console.error("Error deleting product:");
      alert("Error deleting product.");
    }
  };

  const handleStoreClick = () => {
    if (products.length === 0) {
      alert("Inga produkter att lagra!");
      return;
    }
    setShowModal(true);
  };

  const storedProducts = async () => {
    if (products.length === 0) {
      alert("Inga produkter att lagra!");
      setShowModal(false);
      return;
    }

    setIsStoring(true);
    try {
      console.log("Storing product:");
      if (selectedCons.length === 0 && conId && conTitle !== "") {
        console.log("Storing in current con:", conId, conTitle);
        const response = await fetch(
          `${API_BASE_URL}/api/stored_products/store`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              conId,
              conTitle,
              conDate: new Date().toISOString().split("T")[0],
              products: products.map((p) => ({
                productId: p.id,
                price: p.price,
                payment: p.payment,
              })),
            }),
          }
        );
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Misslyckades att lagra i aktuellt konvent: ${errorText}`
          );
        }
      }

      for (const con of selectedCons) {
        console.log("Storing inn selected con:", con.id, con.title);
        const response = await fetch(
          `${API_BASE_URL}/api/stored_products/store`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              conId: con.id,
              conTitle: con.title,
              conDate: new Date().toISOString().split("T")[0],
              products: products.map((p) => ({
                productId: p.id,
                price: p.price,
                payment: p.payment,
              })),
            }),
          }
        );
        if (!response.ok)
          throw new Error(`Misslyckades att lagra i ${con.title}`);
      }
      /* if(selectedCons.length > 0 && conId){
                    try{
                        await fetch(`${API_BASE_URL}/api/products/cons/${conId}` , {
                            method: "DELETE"

                        })

                        await fetch(`${API_BASE_URL}/api/cons/${conId}`, {
                            method: "DELETE"
                        });
                        console.log(`Deleted conId ${conId} and its products after transferring to another con`);
                    }catch(error){
                        console.error('Error cleaning up current conId:', error);
                        

                    }

                } */

      setRefreshTrigger((prev) => prev + 1);
      setProducts([]);
      setConTitle("");
      setConId(null);
      localStorage.removeItem("conId");
      localStorage.removeItem("conTitle");
      setShowModal(false);
      setSelectedCons([]);
    } catch (error) {
      console.error("Error storing products", error);
      alert("Ett fel uppstod");
    } finally {
      setIsStoring(false);
    }
  };

  return (
    <>
      <BurgerMenu />
      <div className="p-2 lg:flex lg:flex-col lg:justify-center ">
        <div className="flex justify-between items-center pb-8">
          <button
            className="border border-transparent p-2 bg-[#FCD4DF] font-medium rounded-xl shadow-2xl cursor-pointer"
            onClick={handleStoreClick}
            disabled={isStoring}
          >
            {isStoring ? "Lagrar..." : "Lagra Produkter"}
          </button>
          <Link
            to="/add-product"
            className="border border-transparent p-2 bg-[#FCD4DF] font-medium rounded-xl shadow-2xl "
          >
            Lägg till produkt
          </Link>
        </div>
        {activeCon && products.length > 0 ? (
          <>
            <h1 className="text-center text-4xl font-bold mb-4 text-pink-300">
              {conTitle}
            </h1>
            <h2 className="text-center text-2xl font-bold font-mono">
              Dagens försäljning.
            </h2>
            {loading ? (
              <div className="flex justify-center items-center mt-3 pb-1 gap-9">
                <p className="text-2xl text-pink-300 animate-pulse">
                  🧁 Laddar...
                </p>
                <div className="animate-spin rounded-full h-9 w-9 border-t-4 border-pink-300"></div>
              </div>
            ) : (
              <>
                <table className="w-full border-collapse border-pink-300 mt-5 lg:w-4/5 lg:mx-auto ">
                  <thead className="">
                    <tr className="w-screen">
                      <th className="border border-pink-300  text-md">
                        Produkt
                      </th>
                      <th className="border border-pink-300 p-1 text-md">
                        Pris
                      </th>
                      <th className="border border-pink-300 p-1 text-md w-fit">
                        Maker
                      </th>
                      <th className="border border-pink-300 p-1 text-md w-fit">
                        Betalning
                      </th>
                      {/* <th className="border border-pink-300 p-1 text-md w-fit ">Action</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {products.length > 0 ? (
                      products.map((product) => (
                        <tr key={product.id}>
                          <td className="border border-pink-300 p-2 text-center text-sm font-medium">
                            {product.product}
                          </td>

                          <td className="border border-pink-300 p-2 text-center text-sm font-medium">
                            {product.price}kr
                          </td>

                          <td className="border border-pink-300 p-2 text-center text-sm font-medium">
                            {product.maker}
                          </td>

                          <td className="border border-pink-300 p-2 text-center text-sm font-medium">
                            {product.payment}
                          </td>

                          <td className="border border-pink-300 p-2 text-center text-sm font-medium bg-[#FCD4DF] ">
                            <button
                              className="cursor-pointer w-full text-lg"
                              onClick={() => {
                                console.log(
                                  "Delete button clicked for ID:",
                                  product.id
                                );
                                deleteProduct(product.id);
                              }}
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="border-2 border-pink-300 p-2 text-center text-pink-400 "
                        >
                          Inga sålda produkter...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <h2 className="mt-3 text-center pt-2 text-xl font-medium text-pink-400">
                  Summa för allt sålt: {totalSales}kr
                </h2>
              </>
            )}
          </>
        ) : (
          <h1 className="text-center text-2xl p-3">
            {" "}
            💤 Ingen aktiv försäljning pågår just nuuuuu.
          </h1>
        )}
      </div>
      <DetailCard refreshTrigger={refreshTrigger} />
      <BackToTopButton />

      {showModal && (
        <div className="fixed inset-0 backdrop-blur-xl flex items-center justify-center z-50">
          <div className="bg-[#FCD4DF] p-6 rounded-xl shadow-lg w-11/12 max-w-md">
            <h3 className="text-2xl text-center font-medium mb-4 text-[#F4538B]">
              Välj ett konvent att lagra produkter i
            </h3>
            <div className="max-h-60 overflow-y-auto">
              {conId && conTitle !== "" && (
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="checkbox"
                    id="current-con"
                    checked={selectedCons.length === 0 && conId}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCons([]);
                      } else {
                        setSelectedCons([]);
                      }
                    }}
                    className="mt-0.5 h-4.5 w-4.5 border-2 "
                  />
                  <label
                    htmlFor="current-con"
                    className="text-[#F4538B] font-medium"
                  >
                    {conTitle} (Aktuellt konvent)
                  </label>
                </div>
              )}
              {storedCons.map((con) => (
                <div key={con.id} className="flex items-center gap-3 mb-2">
                  <input
                    type="checkbox"
                    id={`con-${con.id}`}
                    checked={selectedCons.some((c) => c.id === con.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCons([
                          ...selectedCons,
                          { id: con.id, title: con.title },
                        ]);
                      } else {
                        setSelectedCons(
                          selectedCons.filter((c) => c.id !== con.id)
                        );
                      }
                    }}
                    className="h-4.5 w-4.5 "
                  />
                  <label
                    htmlFor={`con-${con.id}`}
                    className="text-[#F4538B] font-medium"
                  >
                    {con.title}
                  </label>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <button
                className="border-none bg-white p-2 rounded-lg text-[#F4538B]"
                onClick={() => {
                  setShowModal(false);
                  setSelectedCons([]);
                }}
              >
                Avbryt
              </button>

              <button
                className="border border-transparent p-2 bg-[#F4538B] text-white rounded-lg"
                onClick={storedProducts}
                disabled={isStoring}
              >
                {isStoring ? "Lagrar..." : "Lagra"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SalesTracker;
