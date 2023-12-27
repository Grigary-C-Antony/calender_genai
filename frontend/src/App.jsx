import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { generateDate, months } from "./util/calendar";
import cn from "./util/cn";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import Replicate from "replicate";

function App() {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const currentDate = dayjs();
  const [today, setToday] = useState(currentDate);
  const [selectDate, setSelectDate] = useState(currentDate);
  const [genIMage, setGenImg] = useState(null);
  // const replicate = new Replicate({
  //   auth: "r8_TDtyrK0rwOmzbqm68k7cA1ZiDISB0TP0u69uZ",
  // });
  // const imagegenerator = async () => {
  //   return await replicate.run(
  //     "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
  //     {
  //       input: {
  //         width: 2048,
  //         height: 1024,
  //         prompt: "january cinematic, dramatic",
  //         refine: "expert_ensemble_refiner",
  //         scheduler: "K_EULER",
  //         lora_scale: 0.6,
  //         num_outputs: 1,
  //         guidance_scale: 7.5,
  //         apply_watermark: false,
  //         high_noise_frac: 0.8,
  //         negative_prompt: "",
  //         prompt_strength: 0.8,
  //         num_inference_steps: 25,
  //       },
  //     }
  //   );
  // };
  const imageLoaderApi = async () => {
    try {
      const response = await fetch(
        "https://calender-genai.onrender.com/apiforimage",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers":
              "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods":
              "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
            "X-Requested-With": "*",
          },
          body: JSON.stringify({
            desc: today,
          }),
        }
      );
      const jsonData = await response.json();

      setGenImg(jsonData.output);

      console.log(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    const genage = imageLoaderApi(today);
    setGenImg(genage.output);
  }, [today]);

  return (
    <div className="flex md:w-full gap-10 sm:divide-x justify-center relative sm:w-1/2 mx-auto  h-screen items-center sm:flex-row flex-col bg-white">
      <img
        src={
          genIMage
            ? genIMage
            : "http://res.cloudinary.com/dylo5tos2/image/upload/v1703696498/generated_images/9338aeb0-2e9e-4a1f-851c-d74ac23c7616.png"
        }
        className="absolute w-[100vw] h-[100vh] object-cover opacity-80"
      ></img>

      <div className="w-2/6  h-4/6 p-10 bg-gray-200 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20 border border-gray-100 ">
        <div className="flex justify-between items-center">
          <h1 className="select-none font-semibold">
            {months[today.month()]}, {today.year()}
          </h1>
          <div className="flex gap-10 items-center ">
            <GrFormPrevious
              className="w-5 h-5 cursor-pointer hover:scale-105 transition-all"
              onClick={() => {
                setToday(today.month(today.month() - 1));
              }}
            />
            <h1
              className=" cursor-pointer hover:scale-105 transition-all"
              onClick={() => {
                setToday(currentDate);
              }}
            >
              Today
            </h1>
            <GrFormNext
              className="w-5 h-5 cursor-pointer hover:scale-105 transition-all"
              onClick={() => {
                setToday(today.month(today.month() + 1));
              }}
            />
          </div>
        </div>
        <div className="grid grid-cols-7 pt-2 ">
          {days.map((day, index) => {
            return (
              <h1
                key={index}
                className="text-base text-center h-14 w-14 grid place-content-center text-gray-700 select-none"
              >
                {day}
              </h1>
            );
          })}
        </div>

        <div className=" grid grid-cols-7 ">
          {generateDate(today.month(), today.year()).map(
            ({ date, currentMonth, today }, index) => {
              return (
                <div
                  key={index}
                  className="p-2 text-center h-14 grid place-content-center text-base border-t"
                >
                  <h1
                    className={cn(
                      currentMonth ? "" : "text-gray-600",
                      today ? "bg-red-600 text-white" : "",
                      selectDate.toDate().toDateString() ===
                        date.toDate().toDateString()
                        ? "bg-black text-white"
                        : "",
                      "h-10 w-10 rounded-full grid place-content-center hover:bg-black hover:text-white transition-all cursor-pointer select-none"
                    )}
                    onClick={() => {
                      setSelectDate(date);
                    }}
                  >
                    {date.date()}
                  </h1>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
