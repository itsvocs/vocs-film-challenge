import Rating from "@/app/components/Rating";
import React from "react";
import Rattings from "./Rattings";
import { DocumentData } from "firebase/firestore";

type DetailProps = {
  film: DocumentData;
};
export default function Detail({ film }: DetailProps) {
  return (
    <div className="max-w-[1400px] px-4">
      <div className="flex items-center  justify-start">
        <div className="px-4">
          <h3 className="sm:text-3xl my-8 text-xl">Weitere Informationen</h3>
          <Rating
            initialValue={film?.ratting}
            isChanged={false}
            time={film.duration}
            age={film.age}
          />
        </div>
      </div>
      <div>
        <h3 className="sm:text-3xl px-4 mx-auto my-8 text-xl">Beschreibung</h3>
        <p className=" px-4 leading-7">{film.description}</p>
      </div>
      <Rattings film={film} />
    </div>
  );
}
