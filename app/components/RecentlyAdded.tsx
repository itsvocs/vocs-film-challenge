"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { data } from "@/firebase/seed";
import CardFilm from "./CardFilm";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DocumentData } from "firebase/firestore";
export function RecentlyAdded() {
  const [films, setFilms] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Effectuez la requête GET vers votre API /api/films
    fetch("/api/films")
      .then((response) => response.json())
      .then((data) => {
        setFilms(data.films);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des films :", error);
        setLoading(false);
      });
  }, []);

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
          {films.map((i, k) => (
            <CarouselItem
              key={k}
              className="pl-4 basis-1/2 sm:basis-1/3 md:basis-[30%] lg:basis-[25%] xl:basis-[20%]">
              <div className="p-1">
                <CardFilm
                  title={i.data.title}
                  image={i.data.imageString}
                  description={i.data.overview}
                  rate={i.data.ratting}
                  duration={i.data.duration}
                  age={i.data.age}
                  id={i.id}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
