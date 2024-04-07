"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CardFilm from "./CardFilm";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteDoc, doc, DocumentData } from "firebase/firestore";
import { auth, db } from "@/firebase/client/config";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FaPlus } from "react-icons/fa6";
import { HiOutlineXMark } from "react-icons/hi2";
export function MyFilms() {
  const [films, setFilms] = useState<DocumentData>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const user = auth.currentUser;

  useEffect(() => {
    const getUserFilms = async () => {
      try {
        const filmsData = await fetchUserFilms(user?.uid);
        setFilms(filmsData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching user films:", error);
      } finally {
        setLoading(false);
      }
    };
    getUserFilms();
  }, [user]);

  async function fetchUserFilms(userId: string | undefined) {
    const response = await fetch(`/api/myfilms?userId=${userId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch user films");
    }

    const data = await response.json();
    return data.userFilms;
  }
  const handleDeleteFilm = async (filmId: string) => {
    try {
      const filmRef = doc(db, "films", filmId);

      // Supprimer le document du film
      await deleteDoc(filmRef);

      router.push("/");
      toast.success("Der Film wurde gelöscht");

      // Rediriger vers une autre page après la suppression du film
    } catch (error) {
      console.error("Error deleting film:", error);
      toast.error("Der Film konnte nicht gelöscht werden");
    }
  };
  return (
    <div className="mt-6">
      <Carousel className="w-full max-w-full relative">
        <CarouselContent className="-ml-1">
          {loading &&
            Array.from({ length: 10 }, (_, i) => (
              <CarouselItem
                key={i}
                className="pl-4 basis-1/2 sm:basis-1/3 md:basis-[30%] lg:basis-[25%] xl:basis-[20%]">
                <Skeleton className="h-[19rem] w-[300px] rounded-xl" />
                <div className="space-y-2"></div>
              </CarouselItem>
            ))}
          {films.map((i: DocumentData) => (
            <CarouselItem
              key={i.id}
              className="pl-4 basis-1/2 sm:basis-1/3 md:basis-[30%] lg:basis-[25%] xl:basis-[20%] relative">
              <Button
                onClick={() => {
                  console.log(i.id);

                  handleDeleteFilm(i.id);
                }}
                className="absolute text-xl rounded-full bg-red-950/80 text-red-100 z-50 -right-4 top-0 h-12 w-12"
                variant="destructive"
                size="icon">
                <HiOutlineXMark />
              </Button>
              <div className="p-1">
                <CardFilm
                  title={i.title}
                  image={i.imageString}
                  description={i.overview}
                  rate={i.ratting}
                  duration={i.duration}
                  age={i.age}
                  id={i.id}
                />
              </div>
            </CarouselItem>
          ))}
          <CarouselItem className="pl-4 basis-1/2 sm:basis-1/3 relative md:basis-[30%] lg:basis-[25%] xl:basis-[20%] flex items-center justify-center">
            <Button
              variant="secondary"
              className=" h-[10rem] w-[10rem] rounded-full "
              onClick={() => router.push("/create")}>
              <FaPlus className="w-24 h-24 " />
            </Button>
            <div className="space-y-2"></div>
          </CarouselItem>
        </CarouselContent>
        {films.length > 0 && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>
    </div>
  );
}
