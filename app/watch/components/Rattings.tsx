/* eslint-disable @next/next/no-img-element */
"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PiStarFill } from "react-icons/pi";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { auth } from "@/firebase/client/config";
import { toast } from "sonner";
import { DocumentData, Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

type ReviewProps = {
  film: DocumentData;
};
type ReviewInterface = {
  id: string;
  userId: string;
  rating: number;
  email: string;
  comment: string;
  timestamp: Timestamp;
};

export default function Rattings({ film }: ReviewProps) {
  const [rating, setRating] = useState(0);
  const [isRev, setIsRev] = useState(false);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState<DocumentData>([]);

  const router = useRouter();

  useEffect(() => {
    const getReviews = async () => {
      try {
        const reviewsData = await fetchFilmReviews(film.id);
        setReviews(reviewsData);
        console.log(reviewsData);
      } catch (error) {
        console.error("Error fetching film reviews:", error);
      }
    };

    getReviews();
  }, [film]); // Cette dépendance garantit que useEffect est exécuté à chaque changement de filmId

  async function fetchFilmReviews(filmId: string) {
    const response = await fetch(`/api/reviews?filmId=${filmId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch film reviews");
    }

    const data = await response.json();
    return data.reviews;
  }

  const user = auth.currentUser;

  const handleRatingChange = async () => {
    if (user) {
      try {
        const response = await fetch("/api/reviews", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filmId: film.id,
            rating: rating,
            comment: comment,
            userId: user.uid,
            email: user.email,
          }),
        });
        if (response.ok) {
          toast.success("Comment added successfully");
          router.refresh();
        } else {
          toast.error("Failed to add comment");
        }
      } catch (error) {
        console.error("Error adding comment:", error);
        toast.error("Failed to add comment");
      }
    } else {
      toast.error("Please login to add a comment");
    }
  };

  return (
    <div className="px-4  w-full items-center sm:max-w-full  py-4 sm:px-8 sm:py-6 grid grid-cols-12 gap-x-16 lg:px-8 lg:py-24">
      <div className="md:col-span-4 col-span-12 flex flex-col">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Kundenbewertungen
        </h2>
        <div className="flex items-center mt-2 space-x-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => {
              const starValue = index + 1;
              return (
                <span
                  key={index}
                  className={` ${
                    starValue <= 3 ? "text-foreground" : "text-muted"
                  } focus:outline-none`}>
                  <PiStarFill className="h-5 w-5" />
                </span>
              );
            })}
          </div>
          <p className="text-sm text-muted-foreground">
            Basierend auf 1624 Bewertungen
          </p>
        </div>
        <div className="mt-6">
          <div className="m-0 space-y-3">
            <div className="flex items-center text-sm">
              <div className="flex flex-1 items-center">
                <p>5</p>
                <div className="flex ml-3 flex-1 items-center">
                  <PiStarFill className="h-5 w-5" />
                  <Progress value={66} className="flex-1 ml-3 relative" />
                </div>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <div className="flex flex-1 mr-1 items-center">
                <p>4</p>
                <div className="flex ml-3 flex-1 items-center">
                  <PiStarFill className="h-5 w-5" />
                  <Progress value={0} className="flex-1 ml-3 relative" />
                </div>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <div className="flex flex-1 mr-1 items-center">
                <p>3</p>
                <div className="flex ml-3 flex-1 items-center">
                  <PiStarFill className="h-5 w-5" />
                  <Progress value={35} className="flex-1 ml-3 relative" />
                </div>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <div className="flex mr-1 flex-1 items-center">
                <p>2</p>
                <div className="flex ml-3 flex-1 items-center">
                  <PiStarFill className="h-5 w-5" />
                  <Progress value={15} className="flex-1 ml-3 relative" />
                </div>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <div className="flex flex-1 mr-1 items-center">
                <p>1</p>
                <div className="flex ml-3 flex-1 items-center">
                  <PiStarFill className="h-5 w-5" />
                  <Progress value={5} className="flex-1 ml-3 relative" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <h2 className="pt-8 pb-2 text-xl">Teile deine Gedanken</h2>
        <p className="text-sm text-muted-foreground">
          Wenn Sie den Film genießen haben oder nicht, teilen Sie Ihre Gedanken
          mit anderen Kunden
        </p>
        {!isRev && (
          <Button
            variant="outline"
            onClick={() => setIsRev(true)}
            className="mt-4">
            Eine Bewertung Schreiben
          </Button>
        )}

        {/* Review Hinzufügen */}
        {isRev && (
          <div>
            <div className="flex flex-col space-y-4 items-start space-x-2 mt-8">
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => {
                  const starValue = index + 1;
                  return (
                    <button
                      key={index}
                      onClick={() => setRating(starValue)}
                      className={`text-2xl ${
                        starValue <= rating ? "text-foreground" : "text-muted"
                      } focus:outline-none hover:text-foreground`}>
                      <PiStarFill className="h-5 w-5" />
                    </button>
                  );
                })}
              </div>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Fügen Sie hier Ihren Kommentar ein..."
              />
              <Button
                className="flex w-full"
                onClick={handleRatingChange}
                disabled={rating === 0 ? true : false}>
                Senden
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="md:col-span-8 col-span-12">
        <div className="flow-root items-center">
          {reviews.length === 0 && (
            <Button
              variant="ghost"
              className="w-full flex"
              onClick={() => setIsRev(true)}>
              Keine Bewertungen, Sein Sie der ersten
            </Button>
          )}
          {reviews.map((review: ReviewInterface) => (
            <div key={review.id} className="my-6">
              <div className="flex items-center">
                <img
                  className="w-12 h-12 rounded-full"
                  src={`https://api.dicebear.com/8.x/avataaars-neutral/svg?seed=${review.email}&radius=10&mouth=smile&eyes=squint,surprised,wink,default`}
                  alt="img"
                />
                <div className="ml-4">
                  <h4 className="font-bold text-sm"> {review.email} </h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => {
                      const starValue = index + 1;
                      return (
                        <span
                          key={index}
                          className={`text- ${
                            starValue <= review.rating
                              ? "text-foreground"
                              : "text-muted"
                          } focus:outline-none`}>
                          <PiStarFill />
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="mt-4 italic">
                <p className="text-sm text-muted-foreground">
                  {review.comment}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
