import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import PocketBase from "pocketbase";
import { pb_url, pb_user_collection } from "./state/consts";
import { encodeNextPBCookie } from "./state/utils/encodeCookies";

export async function middleware(request: NextRequest) {
  
  const cookie = request.cookies.get("pb_auth");
  const response = NextResponse.next();
  const encoded_cookie_string =encodeNextPBCookie(cookie)

  const pb = new PocketBase(pb_url);
  if (cookie) {
    try {
      pb.authStore.loadFromCookie(encoded_cookie_string)
      // const pb_model = JSON.parse(cookie);
      // console.log("JOSN parsed  == pb model :", pb_model);
      // pb.authStore.save(pb_model.token, pb_model.model);

    } catch (error) {
      // console.log("invalid cookie format invalidating cookie");
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
    const next_url = request.headers.get("next-url") as string
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
    // console.log("next url  == ",request.nextUrl)
    // console.log("next url  == ",request.nextUrl)
    if(next_url){
      const redirect_to = new URL(next_url, request.url);
      // console.log("alredy loggedn in ,next url", redirect_to.toString());
      return NextResponse.redirect(redirect_to);
    }
    const redirect_to = new URL(next_url,`/`);
    return NextResponse.redirect(redirect_to);

  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
};
