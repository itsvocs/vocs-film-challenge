import { auth } from "@/firebase/server/config";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const authorization = headers().get("Authorization");

  if (authorization?.startsWith("Bearer ")) {
    const idToken = authorization.split("Bearer ")[1];

    const decodedToken = await auth.verifyIdToken(idToken);

    if (decodedToken) {
      // Neue Session Cookie für den aktuellen Benutzer erzeugen
      const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 Tagen
      const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn,
      });

      const options = {
        name: "session",
        value: sessionCookie ? sessionCookie : "",
        maxAge: expiresIn,
        httpOnly: true,
        secure: true,
      };

      cookies().set(options);
    }
  }

  return NextResponse.json({}, { status: 200 });
}

export async function GET(request: NextRequest, response: NextResponse) {
  const session = cookies().get("session")?.value || "";

  if (!session) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }

  const decodedClaims = await auth.verifySessionCookie(session, true);

  if (!decodedClaims) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }

  return NextResponse.json({ isLogged: true }, { status: 200 });
}
