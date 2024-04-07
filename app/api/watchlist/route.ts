import { auth, db } from "@/firebase/client/config";
import {
  collection,
  DocumentData,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    console.log("depuis le api dynamic", userId);

    if (!userId) {
      return NextResponse.json(
        { error: "UserId ID is required" },
        { status: 400 }
      );
    }

    const watchlistRef = collection(db, "users", userId, "watchlists");

    const querySnapshot = await getDocs(watchlistRef);

    const watchlist: DocumentData = [];
    querySnapshot.forEach((doc) => {
      // Ajoutez l'ID du film à la watchlist
      watchlist.push(doc.id);
    });
    // Retournez la watchlist de l'utilisateur
    return NextResponse.json({ watchlist }, { status: 200 });
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch watchlist" },
      { status: 500 }
    );
  }
}
