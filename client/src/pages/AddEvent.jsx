import BurgerMenu from "../components/BurgerMenu";

export default function AddEvent() {

  return(
    <>
    <BurgerMenu/>
  <div className="p-3 flex justify-center">
    <form className="space-y-5 flex flex-col justify-center items-center pt-2 pb-2">
      <div className="">
        <h1 className="text-center text-2xl mb-3">Skapa ett event!</h1>
          <div className="">
          <input
              type="text"
              name=""
              placeholder="Event Namn..."
              value={""}
              onChange={""}
              className="p-2 w-full border border-pink-300 focus:outline-none rounded-xl focus:border-purple-500 lg:w-1/4"
            />

            <input
              type="date"
              name=""
              placeholder=""
              value={""}
              onChange={""}
              className="p-2 mt-3 w-full border border-pink-300 focus:outline-none rounded-xl focus:border-purple-500 lg:w-1/4"
            />
          </div>
      </div>
    </form>
  </div>
    </>
  )

}