import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DetailCard from "../components/DetailCard";
import BurgerMenu from "../components/BurgerMenu";
import GoBackButton from "../components/goBackButton";

export default function ConYear() {
  const [storedCons, setStoredCons] = useState([]);
  const [storedYear, setStoredYear] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const API_BASE_URL = import.meta.env.PROD
    ? "https://pawsisterssalestracker-production-529b.up.railway.app"
    : "http://localhost:5000";

  const { year } = useParams();

  useEffect(() => {
    const fetchConsByYear = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/stored_products/cons/year/${year}`,
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
    fetchConsByYear();
  }, [year]);

  return (
    <div>
      <BurgerMenu />
      <GoBackButton />
      <DetailCard refreshTrigger={refreshTrigger} year={year} />
    </div>
  );
}
