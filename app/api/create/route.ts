import { auth, db } from "@/firebase/client/config";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {
      title,
      age,
      duration,
      description,
      videoSource,
      imageString,
      category,
      youtubeString,
      uid,
    } = await request.json();

    const docRef = await addDoc(collection(db, "films"), {
      title,
      age,
      duration,
      description,
      videoSource,
      imageString,
      category,
      youtubeString,
      createdBy: uid,
      ratting: 0,
    });
    const docId = docRef.id;

    // Mettre à jour le document avec l'identifiant unique
    await setDoc(doc(db, "films", docId), { id: docId }, { merge: true });

    return NextResponse.json(
      { message: "Der Film wurde erfolgreich hinzufügt" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Erreur lors de l'ajout du film :", error);
    return NextResponse.json(
      { error: "Erreur lors de l'ajout du film" },
      { status: 500 }
    );
  }
}
