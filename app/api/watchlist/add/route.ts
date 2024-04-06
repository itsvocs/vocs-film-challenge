import { db } from "@/firebase/client/config";
import { doc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId, movieId } = await request.json();

    console.log(userId, movieId);

    const userRef = doc(db, "users", userId);

    // Ajoutez le document du film à la sous-collection "watchlist" de l'utilisateur
    await setDoc(doc(userRef, "watchlists", movieId), { addedAt: new Date() });

    return NextResponse.json(
      { message: "Film added to watchlist successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error adding film to watchlist:", error);
    return NextResponse.json(
      { error: "Failed to add film to watchlist" },
      { status: 500 }
    );
  }
}
