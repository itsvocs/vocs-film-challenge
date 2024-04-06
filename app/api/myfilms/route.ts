import { auth, db } from "@/firebase/client/config";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    console.log(userId, "Le user ID");

    if (!userId) {
      return NextResponse.json(
        { error: "UserId is required" },
        { status: 400 }
      );
    }

    const filmsRef = collection(db, "films");
    const userFilmsQuery = query(filmsRef, where("createdBy", "==", userId));
    const userFilmsSnapshot = await getDocs(userFilmsQuery);

    const userFilms: DocumentData = [];
    userFilmsSnapshot.forEach((doc) => {
      userFilms.push({ id: doc.id, ...doc.data() });
    });

    return NextResponse.json({ userFilms }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user films:", error);
    return NextResponse.json(
      { error: "Error fetching user films" },
      { status: 500 }
    );
  }
}
