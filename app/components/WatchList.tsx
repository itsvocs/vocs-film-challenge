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
      try {
        // Récupérer la watchlist de l'utilisateur
        if (user) {
          const userId = user.uid;
          const watchlist = await getWatchlist(userId);

          setLoading(false); // Utiliser Promise.all avec une fonction de mapping pour récupérer les films en parallèle
          const filmsData = await Promise.all(
            watchlist.map(async (filmId: string) => {
              const film = await getFilmById(filmId);
              return film;
            })
          );

          setLoading(false);
          setFilms(filmsData);
        } else {
          // Aucun film dans la watchlist
          setFilms([]);
        }
      } catch (error) {
        console.error("Error fetching watchlist or films:", error);
        setLoading(false);
      }
    };

    fetchWatchlistAndFilms();
  }, [user]);
  return (
    <div className="mt-6">
      {films.length > 0 ? (
        <Carousel className="w-full max-w-full relative">
          <CarouselContent className="-ml-1">
            {loading &&
              Array.from({ length: 10 }, (_, i) => (
                <CarouselItem
                  key={i}
                  className="pl-4 basis-1/2 sm:basis-1/3 md:basis-[30%] lg:basis-[25%] xl:basis-[20%]">
                  <Skeleton className="h-[19rem] w-[300px] rounded-xl m-4" />
                  <div className="space-y-2"></div>
                </CarouselItem>
              ))}

            {films.map((i: DocumentData) => (
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
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <div className="w-full flex items-center justify-center text-sm">
          Keine Filme in der Watchlist
        </div>
      )}
    </div>
  );
}
