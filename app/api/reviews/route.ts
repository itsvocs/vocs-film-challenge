import { auth, db } from "@/firebase/client/config";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filmId = searchParams.get("filmId");

    if (!filmId) {
      return NextResponse.json(
        { error: "Film ID is required" },
        { status: 400 }
      );
    }
    const reviewsRef = collection(db, `films/${filmId}/reviews`);
    const reviewsSnapshot = await getDocs(reviewsRef);

    const reviews: DocumentData = [];
    reviewsSnapshot.forEach((doc) => {
      reviews.push({ id: doc.id, ...doc.data() });
    });
    return NextResponse.json({ reviews }, { status: 200 });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Error fetching reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { filmId, rating, comment, userId, email } = await request.json();

    console.log(filmId, rating, comment, userId, email);

    if (!filmId || !rating) {
      return NextResponse.json(
        { message: "Film ID and comment are required" },
        { status: 400 }
      );
    }
    const reviewsRef = collection(db, `films/${filmId}/reviews`);

    const userReviewRef = doc(reviewsRef, userId);

    await setDoc(userReviewRef, {
      userId: userId, // ID de l'utilisateur qui a créé le commentaire
      comment: comment,
      timestamp: serverTimestamp(),
      email: email,
      rating: rating,
    });

    // Calculer et mettre à jour la note de rating général du document
    const ratingsSnapshot = await getDocs(reviewsRef);
    let totalRating = 0;
    let totalRatingsCount = 0;

    ratingsSnapshot.forEach((doc) => {
      const rating = doc.data().rating;
      totalRating += rating;
      totalRatingsCount++;
    });

    const newRating = (totalRating + rating) / (totalRatingsCount + 1);

    // Mettre à jour la note de rating général du document "film"
    const filmRef = doc(db, `films/${filmId}`);
    await updateDoc(filmRef, { ratting: newRating });
    return NextResponse.json(
      { message: "Der Kommentar wurde mit Erfolg hinzufügt" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Erreur lors de l'ajout commentaire :", error);
    return NextResponse.json(
      { error: "Erreur lors de l'ajout commentaire" },
      { status: 500 }
    );
  }
}
