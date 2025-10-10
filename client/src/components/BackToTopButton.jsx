import { useEffect, useState } from "react";

export default function BackToTopButton() {
  const [backToTopButton, setBackToTopButton] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        setBackToTopButton(true);
      } else {
        setBackToTopButton(false);
      }
    });
  }, []);

  const scrollUp = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div>
      {backToTopButton && (
        <button
          onClick={scrollUp}
          className=" text-xl bg-pink-300  h-10 w-10 rounded-full fixed bottom-1.5 p-2 right-2.5 mr-2 mb-2 flex items-center justify-center opacity-75"
        >
          <i class="fa-solid fa-arrow-up"></i>
        </button>
      )}
    </div>
  );
}
