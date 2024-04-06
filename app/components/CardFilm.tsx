"use client";

import { useEffect, useRef, useState } from "react";
import { DirectionAwareHover } from "@/components/ui/direction-aware-hover";
import Rating from "./Rating";
import { FaCheck, FaChevronDown, FaPlay } from "react-icons/fa6";
import { TiPlus } from "react-icons/ti";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
} from "@/src/controller/watchlist";
import { auth } from "@/firebase/client/config";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type CardFilmProps = {
  title: string;
  image: string;
  description: string;
  rate: number;
  duration: string;
  age: number;
  id: string;
};
export default function CardFilm({
  title,
  image,
  rate,
  duration,
  age,
  id,
}: CardFilmProps) {
  const router = useRouter();
  const user = auth.currentUser;
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        if (user) {
          const userId = user.uid;
          const watchlist = await getWatchlist(userId);
          setIsInWatchlist(watchlist.includes(id));
        }
      } catch (error) {
        console.error("Error fetching watchlist:", error);
      }
    };

    fetchWatchlist();
  }, [user, id]);

  async function handleAddFilm() {
    try {
      if (user) {
        const add = await addToWatchlist(user.uid, id);
        router.push("/");
        toast.success(add);
      }
    } catch (error) {
      toast.error("Failed to add the Movie");
      console.log("Failed to add the Movie", id, user?.uid, error);
    }
  }
  async function handleSupFilm() {
    try {
      if (user) {
        const add = await removeFromWatchlist(user.uid, id);
        router.push("/");
        toast.success(add);
      }
    } catch (error) {
      toast.error("Failed to add the Movie");
      console.log("Failed to add the Movie", id, user?.uid, error);
    }
  }
  return (
    <div className="relative flex items-center justify-center group">
      <Link
        href={`watch/${id}`}
        className="relative  flex items-center justify-center">
        <DirectionAwareHover imageUrl={image} className="h-[19rem]">
          <div>
            <p className="font-bold text-sm sm:text-xl">{title}</p>
            <Rating
              isChanged={false}
              time={duration}
              age={age}
              initialValue={rate}
            />
          </div>
        </DirectionAwareHover>
      </Link>
      <div className="absolute top-4 z-50 w-full flex justify-between items-center pt-3 px-4 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          size="icon"
          className="rounded-full text-sm h-7  w-7 sm:h-14 sm:w-14 sm:text-2xl scale-100 hover:scale-110 transition-transform">
          <FaPlay className="" />
        </Button>
        <div className="flex space-x-3">
          {!isInWatchlist && (
            <Button
              onClick={handleAddFilm}
              size="icon"
              className="rounded-full text-sm h-7  w-7 sm:h-14 sm:w-14 sm:text-4xl">
              <TiPlus className="" />
            </Button>
          )}

          {isInWatchlist && (
            <Button
              onClick={handleSupFilm}
              size="icon"
              className="rounded-full text-sm h-7  w-7 sm:h-14 sm:w-14 sm:text-4xl">
              <FaCheck className="" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
