import { db } from "@/firebase/client/config";
import { doc, getDoc } from "firebase/firestore";

// Créez un cache pour stocker les films déjà récupérés
const filmCache: { [key: string]: any } = {};

export const getFilmById = async (filmId: string) => {
  try {
    // Vérifiez d'abord si le film est déjà dans le cache
    if (filmCache[filmId]) {
      return filmCache[filmId];
    } else {
      const filmDocRef = doc(db, "films", filmId);
      const filmDocSnapshot = await getDoc(filmDocRef);

      if (filmDocSnapshot.exists()) {
        const filmData = filmDocSnapshot.data();
        console.log(filmData, "depuis le getFilmById");

        // Mettez les données du film dans le cache
        filmCache[filmId] = filmData;

        return filmData;
      } else {
        throw new Error("Film not found");
      }
    }
  } catch (error) {
    console.error("Error fetching film by ID:", error);
    throw error;
  }
};
