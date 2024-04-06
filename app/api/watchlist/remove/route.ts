import { db } from "@/firebase/client/config";
import { deleteDoc, doc } from "firebase/firestore";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId, movieId } = await request.json();
    // Créez une référence au document du film dans la sous-collection "watchlist" de l'utilisateur
    const watchlistDocRef = doc(db, "users", userId, "watchlist", movieId);

    // Supprimez le document du film de la watchlist de l'utilisateur
    await deleteDoc(watchlistDocRef);

    return NextResponse.json(
      { message: "Film removed from watchlist successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error removing film to watchlist:", error);
    return NextResponse.json(
      { error: "Failed to removing film to watchlist" },
      { status: 500 }
    );
  }
}
