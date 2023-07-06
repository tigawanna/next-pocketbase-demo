import { server_component_pb } from "@/state/pb/server_component_pb";
import { TestClientCookie } from "./components/TestClientCookie";
import { cookies } from "next/headers";
import { TestServerCookie } from "./components/TestServerComponentCookie";
import { encodeCookie, encodeNextPBCookie } from "@/state/utils/encodeCookies";

export default async function AdminPage() {
    // const { pb,cookies } = await server_component_pb();
    const pb_auth_cookie = await cookies().get('pb_auth')
    const parsed_cookie = encodeNextPBCookie(pb_auth_cookie)
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-2">
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <h1 className="text-8xl font-bold">Welcome to</h1>
        <h1 className="text-5xl font-bold text-yellow-700 ">ADMIN Page</h1>
        {/* <TestClientCookie /> */}
        <TestServerCookie cookie={parsed_cookie}/>
      </div>
    </main>
  );
}
