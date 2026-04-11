import { useNavigate } from "react-router-dom";
export default function GoBackButton() {
  const navigate = useNavigate();

  const goBackButton = () => {
    navigate(-1);
  };

  return (
    <button
      className="p-1 text-pink-400 underline font-medium text-sm"
      onClick={goBackButton}
    >
      Tillbaka till föregående sida
    </button>
  );
}
