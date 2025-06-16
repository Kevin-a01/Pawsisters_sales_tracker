import BurgerMenu from "../components/BurgerMenu";

export default function AddTask() {

  return(
    <>
    <BurgerMenu/>
    <div>
      <h1 className="text-center text-2xl">Lägg till en uppgift att göra!</h1>
      <div className="flex flex-col">
        <label htmlFor="task" className="text-center pt-5 text-xl p-3">
        Uppgift...
      </label>
      <input type="text"
      className="border p-2 w-1/2 mx-auto focus:outline-none border-purple-500 rounded-xl" />
      </div>
      <div className="flex justify-center">
        <button className=" rounded-xl p-2 mt-7 bg-pink-300 cursor-pointer ">
        Lägg till uppgift
      </button>
      </div>
      
      
    </div>
    </>
  )

}