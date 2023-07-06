import PocketBase from "pocketbase";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { pb_url, pb_user_collection } from "../consts";
import { getNextjsCookie } from "../utils/server-cookie";

export async function route_handlers_pb(req: NextRequest, res: NextResponse) {
  const cookie = await getNextjsCookie();
  const response = NextResponse.next();
  const pb = new PocketBase(pb_url);
  // load the auth store data from the request cookie string
  pb.authStore.loadFromCookie(cookie || "");
  // send back the default 'pb_auth' cookie to the client with the latest store state
  pb.authStore.onChange(() => {
    response.headers.set("set-cookie", pb.authStore.exportToCookie());
  });
  try {
    // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
    pb.authStore.isValid && (await pb.collection(pb_user_collection).authRefresh());
  } catch (_) {
    // clear the auth store on failed refresh
    pb.authStore.clear();
  }

  return pb;
}
