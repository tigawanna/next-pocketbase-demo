import { cookies } from "next/headers";
import { encodeNextPBCookie } from "./encodeCookies";
import { middleware } from "@/middleware";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export async function getNextjsCookie(request_cookie?: RequestCookie) {
    // console.log("middleware request cookie  === ",request_cookie)
    try {
        if (request_cookie) {
            const cookie = encodeNextPBCookie(request_cookie)
            return cookie
        }
        const next_cookie = await cookies().get('pb_auth')
        const cookie = encodeNextPBCookie(next_cookie)
        return cookie
    } catch (error:any) {
        console.log("issue getting next-cookie  === ",error)
      return ""
    }



}
