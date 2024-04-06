import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export async function middleware(request: NextRequest) {
  let session = request.cookies.get("session");

  const returnUrl = encodeURIComponent(request.nextUrl.pathname);

  if (!session) {
    console.log("session not found");
    return NextResponse.redirect(
      `https://vocs-film-challenge.vercel.app/auth/signIn?returnUrl=${returnUrl}`
    );
  }

  const responseApi = await fetch(
    "https://vocs-film-challenge.vercel.app/api/auth/login",
    {
      headers: {
        Cookie: `session=${session?.value}`,
      },
    }
  );

  if (responseApi.status !== 200) {
    console.log("token is not authorized");
    return NextResponse.redirect(
      `https://vocs-film-challenge.vercel.app/auth/signIn?returnUrl=${returnUrl}`
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
