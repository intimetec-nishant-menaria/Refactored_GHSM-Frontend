import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useEffect, useState } from "react";
import single from "@/assets/single.jpg";
import double from "@/assets/double.jpg";
import suite from "@/assets/suite.jpg";
import { useFetchAllRoomTypesQuery } from "@/app/Api's/roomType";

function Carousel() {
  const dispatch = useAppDispatch();
  // const { roomTypes, loading } = useAppSelector((state) => state.roomType);
  const {data:roomTypes , isLoading , isError ,error} = useFetchAllRoomTypesQuery();
  const [carousalIndex, setCarousalIndex] = useState(0);
  const imgArray = [single, double, suite];


  useEffect(() => {
    const id = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(id);
  }, [carousalIndex, roomTypes?.length]);

  if (isLoading) return <div>loading...</div>;

  if(isError) return <div>{error?.data.message}</div>

  function handlePrev() {
    carousalIndex == 0
      ? setCarousalIndex(roomTypes?.length ?? 1 - 1)
      : setCarousalIndex(carousalIndex - 1);
  }

  function handleNext() {
    carousalIndex == (roomTypes?.length ?? 1) - 1
      ? setCarousalIndex(0)
      : setCarousalIndex(carousalIndex + 1);
  }

  return (
    <div
      className={`relative bg-cover bg-center w-full h-64 rounded-xl shadow-xl`}
    >
      {imgArray.map((img, index) => (
        <div
          key={index}
          style={{ backgroundImage: `url(${img})` }}
          className={`absolute inset-0 bg-cover bg-center rounded-2xl transition-opacity duration-1000 ease-in-out ${
            index === carousalIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <button
        className="h-full w-[3%] cursor-pointer absolute left-1 top-[5%] bg-transparent font-bold text-sm text-white"
        onClick={handlePrev}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>
      <div className="absolute left-10 bottom-4 text-2xl text-white font-bold">
        {roomTypes?.map((type, i) => (
          <div key={i} className={`${carousalIndex == i ? "" : "hidden"}`}>
            <p>{type.roomTypeName}</p>
            <p className="text-sm font-semibold">Capacity : {type.capacity}</p>
          </div>
        ))}
      </div>
      <button
        className=" h-full w-[3%] cursor-pointer absolute top-[5%] right-1 bg-transparent font-bold text-sm text-white"
        onClick={handleNext}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
      <div className="absolute bottom-2 left-1/2 flex gap-2 -translate-x-1.5">
        {roomTypes?.map((_, i) => (
          <div key={i}
            className={`h-2 rounded-full transition-all ${carousalIndex == i ? "w-6 bg-white" : "w-2 bg-white/50"}`}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default Carousel;
