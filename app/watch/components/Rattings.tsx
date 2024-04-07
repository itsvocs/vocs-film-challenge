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
import { usePathname, useRouter } from "next/navigation";

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
  const pathname = usePathname();

  useEffect(() => {
    const getReviews = async () => {
      try {
        const reviewsData = await fetchFilmReviews(film.id);
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching film reviews:", error);
      }
    };

    getReviews();
  }, [film]);

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
          toast.success("Der Kommentar wurde gespeichert");
          router.push(pathname);
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

  const handleDeleteComment = async (filmId: string, userId: string) => {
    try {
      const response = await fetch("/api/reviews", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filmId, userId }),
      });

      if (response.ok) {
        router.push(pathname);
        router.refresh();
        toast.success("Comment deleted successfully");
        // Mettre à jour l'état de votre composant si nécessaire
      } else {
        throw new Error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      // Gérer les erreurs si nécessaire
    }
  };
  const handleDelete = async () => {
    const filmId = film.id;
    const userId = user?.uid ? user.uid : "";
    try {
      await handleDeleteComment(filmId, userId);
      // Mettre à jour l'état ou effectuer d'autres actions après la suppression du commentaire
    } catch (error) {
      console.error("Error deleting comment:", error);
      // Gérer les erreurs si nécessaire
    }
  };
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Intl.DateTimeFormat("fr-FR", options).format(date);
  };
  return (
    <div className="px-4 mt-5">
      <div className=" flex flex-col">
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
                    starValue <= film.ratting ? "text-foreground" : "text-muted"
                  } focus:outline-none`}>
                  <PiStarFill className="h-5 w-5" />
                </span>
              );
            })}
          </div>
          <p className="text-sm text-muted-foreground">
            Basierend auf {reviews.length} Bewertungen
          </p>
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
      <div className="">
        <div className="flow-root items-center">
          {reviews.length === 0 && (
            <Button
              variant="link"
              className="w-full flex"
              onClick={() => setIsRev(true)}>
              Keine Bewertungen, Sein Sie der ersten
            </Button>
          )}
          {reviews.map((review: ReviewInterface) => (
            <div key={review.id} className="my-8">
              <div className="flex items-center">
                <img
                  className="w-12 h-12 rounded-full"
                  src={`https://api.dicebear.com/8.x/avataaars-neutral/svg?seed=${review.email}&radius=10&mouth=smile&eyes=squint,surprised,wink,default`}
                  alt="img"
                />
                <div className="ml-4 space-y-2">
                  <h4 className="font-bold text-sm">
                    {" "}
                    {review.email}{" "}
                    {user?.uid === review.userId && (
                      <Button
                        className="text-red-600"
                        variant="link"
                        onClick={handleDelete}>
                        löschen
                      </Button>
                    )}
                  </h4>
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
                <div className="text-sm text-muted pt-2">
                  {formatDate(new Date(review.timestamp.seconds * 1000))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
