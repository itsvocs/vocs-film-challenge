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
import { DocumentData } from "firebase/firestore";
import { auth } from "@/firebase/client/config";
import { Film } from "@/src/interface/film";
import { getWatchlist } from "@/src/controller/watchlist";
import { getFilmById } from "@/src/controller/film";
export function WatchList() {
  const [films, setFilms] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);

  const user = auth.currentUser;

  useEffect(() => {
    const fetchWatchlistAndFilms = async () => {
      if (user) {
        try {
          // Récupérer la watchlist de l'utilisateur
          const userId = user.uid;
          const watchlist = await getWatchlist(userId);

          if (watchlist.length > 0) {
            const filmsData: DocumentData[] = [];

            for (const filmId of watchlist) {
              const film = await getFilmById(filmId);
              filmsData.push(film);
            }
            setLoading(false);
            setFilms(filmsData);
          }
        } catch (error) {
          console.error("Error fetching watchlist or films:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchWatchlistAndFilms();
  }, [user]);

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

          {films.length > 0 ? (
            films.map((i: DocumentData) => (
              <CarouselItem
                key={i.id}
                className="pl-4 basis-1/2 sm:basis-1/3 md:basis-[30%] lg:basis-[25%] xl:basis-[20%]">
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
            ))
          ) : (
            <div className="text-center text-2xl px-10">Noch Keine</div>
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
