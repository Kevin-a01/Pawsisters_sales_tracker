import { useEffect, useState } from "react";


function ToggleTheme() {
  const [darkMode, setDarkMode] = useState(() => {

    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    console.log("Dark mode changed:", darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");

    } else {
      document.documentElement.classList.remove("dark");

    }


    localStorage.setItem("darkMode", darkMode);
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(prev => !prev);


  return (
    <div className="fixed top-2 right-1 z-50 hidden ">
      <button
        onClick={toggleDarkMode}
        className={`relative w-12 h-8 rounded-xl flex items-center px-1 pb-1 transition-colors duration-300 ${darkMode ? "bg-gray-700" : "bg-yellow-300"
          }`}
      >
        <span
          className={`absolute left-0.5 text-yellow-600 text-xl transition-transform duration-300 ${darkMode ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"
            }`}
        >
          🔆
        </span>
        <span
          className={`absolute right-0.5 text-white text-xl transition-transform duration-300 ${darkMode ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 "
            }`}
        >
          🌕
        </span>
        {/*  <div
        className={`w-3 h-4 bg-white dark:bg-gray-100 rounded-full shadow-md transform transition-transform duration-300 ${
          darkMode ? "translate-x-6" : "translate-x-0"
        }`}
      /> */}
      </button>
    </div>

  )


}

export default ToggleTheme;