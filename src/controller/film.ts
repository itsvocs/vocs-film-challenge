import { db } from "@/firebase/client/config";
import { doc, getDoc } from "firebase/firestore";

export const getFilmById = async (filmId: string) => {
  try {
    const filmDocRef = doc(db, "films", filmId);
    const filmDocSnapshot = await getDoc(filmDocRef);

    if (filmDocSnapshot.exists()) {
      const filmData = filmDocSnapshot.data();
      return filmData;
    } else {
      throw new Error("Film not found");
    }
  } catch (error) {
    console.error("Error fetching film by ID:", error);
    throw error;
  }
};
