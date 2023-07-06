import { cookies, headers } from "next/headers";
import PocketBase from "pocketbase";
import { pb_url, pb_user_collection } from "../consts";
import { getNextjsCookie } from "../utils/server-cookie";

export async function server_component_pb() {
  // const cookie = req.cookies.get('pb_auth')?.value;
  const cookie = await getNextjsCookie();
  // const response = NextResponse.next();
  const pb = new PocketBase(pb_url);
  // load the auth store data from the request cookie string
  // console.log("server component cookie == ",cookie)

  pb.authStore.loadFromCookie(cookie || "");
  // send back the default 'pb_auth' cookie to the client with the latest store state

  try {
    // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
    pb.authStore.isValid && (await pb.collection(pb_user_collection).authRefresh());
  } catch (_) {
    // clear the auth store on failed refresh
    pb.authStore.clear();
  }

  return { pb, cookies, headers };
}
