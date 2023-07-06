import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import PocketBase from "pocketbase";
import { pb_url, pb_user_collection } from "./state/consts";
import { getNextjsCookie } from "./state/utils/server-cookie";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const request_cookie = request.cookies.get("pb_auth")
  // console.log("middlware request cookie  ===",)

  const cookie = await getNextjsCookie(request_cookie)
  const pb = new PocketBase(pb_url);
  if (cookie) {
    try {
      pb.authStore.loadFromCookie(cookie)
      } catch (error) {
      pb.authStore.clear();
      response.headers.set(
        "set-cookie",
        pb.authStore.exportToCookie({ httpOnly: false })
      );
    }
  }
  
  try {
    // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
    pb.authStore.isValid &&
      (await pb.collection(pb_user_collection).authRefresh());
  } catch (err) {
    // clear the auth store on failed refresh
  pb.authStore.clear();
    response.headers.set(
      "set-cookie",
      pb.authStore.exportToCookie({ httpOnly: false })
    );
  }

  if (!pb.authStore.model && !request.nextUrl.pathname.startsWith("/auth")) {
    const redirect_to = new URL("/auth", request.url);
  if (request.nextUrl.pathname){
      redirect_to.search = new URLSearchParams({
        next: request.nextUrl.pathname,
      }).toString();
    }else{
      redirect_to.search = new URLSearchParams({
        next:'/',
      }).toString();
    }


  return NextResponse.redirect(redirect_to);
  }


  if (pb.authStore.model && request.nextUrl.pathname.startsWith("/auth")) {
    const next_url = request.headers.get("next-url") as string
  if(next_url){
      const redirect_to = new URL(next_url, request.url);
      return NextResponse.redirect(redirect_to);
    }
    const redirect_to = new URL(`/`,request.url);
    return NextResponse.redirect(redirect_to);

  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
};
