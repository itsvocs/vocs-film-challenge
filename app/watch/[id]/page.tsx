"use client";
import Hero from "../components/Hero";
import Detail from "../components/Detail";
import { useEffect, useState } from "react";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import { db } from "@/firebase/client/config";

export default function Page({ params }: { params: { id: string } }) {
  const [film, setFilm] = useState<DocumentData>();
  const id = params.id;
  useEffect(() => {
    if (id) {
      // Ici, tu récupères les données du film en fonction de son titre
      // Tu peux utiliser le titre pour rechercher le film dans Firestore
      // Par exemple, supposons que ta collection s'appelle "films"
      const fetchFilm = async () => {
        try {
          const docRef = doc(db, "films", id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setFilm(docSnap.data());
          } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching film:", error);
        }
      };

      fetchFilm();
    }
  }, [id, params.id]);

  if (!film) {
    return <div>Loading...</div>;
  }
  return (
    <div className="min-h-screen w-full bg-dot-white/[0.03] relative overflow-hidden flex-col pb-24">
      <Hero
        title={film.title}
        image={film.imageString}
        video={film.youtubeString}
      />
      <Detail film={film} />
    </div>
  );
}
