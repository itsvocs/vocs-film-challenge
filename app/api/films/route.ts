import { db } from "@/firebase/client/config";
import { collection, DocumentData, getDocs } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

// pages/api/films.ts;
export async function GET(request: NextRequest, response: NextResponse) {
  try {
    const filmsRef = collection(db, "films");
    const querySnapshot = await getDocs(filmsRef);

    const films: { id: string; data: DocumentData }[] = [];
    querySnapshot.forEach((doc) => {
      films.push({ id: doc.id, data: doc.data() });
    });
    return NextResponse.json({ films }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la demande des films :", error);
    return NextResponse.json(
      { error: "Erreur lors de la demande des films :" },
      { status: 500 }
    );
  }
}
