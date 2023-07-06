"use client"
import { testPocketbaseCookie } from "@/state/utils/testCookie";
interface TestClientCookieProps {

}

export function TestClientCookie({}:TestClientCookieProps){


    const cookie = document.cookie
    // console.log("documanet cookie  == ",document.cookie)
    // console.log("decoded cookie === ",decodeURIComponent(document.cookie))
    const pb_email = testPocketbaseCookie(cookie)
    if(pb_email === "pb_auth is invalid"){
        return (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <div className="text-6xl font-bold">Client</div>
            <div className="text-5xl text-red-500">{pb_email}</div>
            <textarea
              value={cookie}
              className="text-sm  w-[90%] border rounded h-[200px] p-3"
              readOnly
            />
          </div>
        );
}
return (
  <div className="w-full h-full flex flex-col items-center justify-center gap-3">
    <div className="text-6xl font-bold ">Client</div>
    <div className="text-5xl">{pb_email}</div>
    <textarea value={cookie} className="text-sm  w-[90%] border rounded h-[200px] p-3" readOnly />
  </div>
);
}
