// components/Rating.js
"use client";
import { PiStarFill } from "react-icons/pi";

type ValueProps = {
  initialValue: number;
  time: string;
  age: number;
  isChanged: boolean;
};

const Rating = ({ initialValue, isChanged, time, age }: ValueProps) => {
  return (
    <div className="flex items-center text-sm font-medium space-x-4">
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;
          return (
            <span
              key={index}
              className={`text-sm sm:text-base ${
                starValue <= initialValue ? "text-foreground" : "text-muted"
              } focus:outline-none`}>
              <PiStarFill />
            </span>
          );
        })}
      </div>
      <span>{time}</span>
      <span className="bg-indigo-600 rounded-sm p-1 py-px text-xs">{age}</span>
    </div>
  );
};

export default Rating;
