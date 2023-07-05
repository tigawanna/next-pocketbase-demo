# Nextjs13 app directory authentication with `Pocketbase`

The `Pocketbase` SDK assumes SPA by default and saves the `auth` response in the local storage , while you can do this in the app directory or other SSR first frameworks  , it will give you hydration errors as the state goes from unauthenticated on the server to authenticated on the client which will cause a html mismatch if for example you were rendering a user profile picture if a user exists .

`Pocketbase` has an [`exportToCookie`](https://github.com/pocketbase/js-sdk#ssr-integration) which helps with this issue . The Nextjs13 integration is a little more tedious compared to the other frameworks.

First step is picking server or client login , 
this example ha s a server component and actions example included too ,but you'll have to setup some logic to sync the cookie with the client, 

- Client side
on the client we create a simple login component and call 

```ts
export async function loginUser({ pb,user, password }: ILoginUser) {
    try {
        const authData = await pb.collection(pb_user_collection)
            .authWithPassword<PBUserRecord>(user, password);
            return authData;
    } catch (error) {
        throw error;
    }
}
```

```ts
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const pb_user = await loginUser({
        pb,
        user: user.identity,
        password: user.password,
      });
    //  add te authstore to a cookie for easy server side use
      document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
      if (search_params) {
        //  redirect to the page tey were going to before
        router.push(search_params);
      } else {
        router.push("/");
      }
    // console.log("auth success = ",pb_user);
      return pb_user;
    } catch (error: any) {
      console.log("error logging in user === ", error.originalError);
      throw error;
    }
  };
```
- Middleware : Next13 uses middleware to do `auth guarding` , assuming the `/admin` page needs authentication and homepage can be used without a login

add a `middleware.ts` in our root directory , in my case am using `src/app` so it'll be in the `src` directory

```ts 
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
\   } catch (error) {
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

// if the user is not logged in and not in the /auth page
  if (!pb.authStore.model && !request.nextUrl.pathname.startsWith("/auth")) {
    const redirect_to = new URL("/auth", request.url);
    const next_url = request.headers.get("next-url") as string
    redirect_to.search = new URLSearchParams({
      next: request.nextUrl.pathname,
    }).toString();
    // console.log("login required redirecting to auth age : next ==", redirect_to,);
  return NextResponse.redirect(redirect_to);
  }


//   if the user is loggedin and they visit /auth
  if (pb.authStore.model && request.nextUrl.pathname.startsWith("/auth")) {
    const next_url = request.headers.get("next-url") as string
    const redirect_to = new URL(next_url,request.url);
    // console.log("alredy loggedn in ,next url", redirect_to.toString());
    return NextResponse.redirect(redirect_to);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
};

```


This now allows you to redirect any unauthenticated users from `admin` to `/auth`

- getting the user 
you can still get the user client side by using

```ts
export const pb = new PocketBase(pb_url);
pb.authStore.loadFromCookie(document?.cookie ?? "");
return pb.authStore.model
```

But we can also fetch the user that was used to login and fetch data on the server in a server component

```ts
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
      <div className="h-full flex flex-col items-center justify-center">
        <h1 className="text-8xl font-bold">Welcome to</h1>
        <h1 className="text-5xl font-bold text-yellow-700">ADMIN Page</h1>
        <TestClientCookie />
        <TestServerCookie cookie={parsed_cookie}/>
      </div>
    </main>
  );
}

```
and use it in our component
```ts
import PocketBase from 'pocketbase'
import { pb_url } from '../consts'
export function testPocketbaseCookie(cookie: string) {
    const pb = new PocketBase(pb_url)
    // load the auth store data from the request cookie string
    pb.authStore.loadFromCookie(cookie)
    // console.log("pb_auth model after cookie load === ", pb.authStore.model)
    // console.log("pb_auth is valid after cookie load === ", pb.authStore.isValid)
    if(pb.authStore.isValid){
     return pb.authStore.model?.email
    }
    return "pb_auth is invalid"
}


// server fetched user
import { testPocketbaseCookie } from "@/state/utils/testCookie";
interface TestClientCookieProps {
    cookie: string
}

export function TestServerCookie({cookie}: TestClientCookieProps) {
  const pb_email = testPocketbaseCookie(cookie);

  if (pb_email === "pb_auth is invalid") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3">
        <div className="text-6xl font-bold">Server</div>
        <textarea
          value={cookie}
          className="text-sm  w-[90%] border rounded h-[200px] p-3"
          readOnly
        />

        <div className="text-5xl text-red-500">{pb_email}</div>
      </div>
    );
  }
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
      <div className="text-6xl font-bold">Server</div>
      <textarea
        value={cookie}
        className="text-sm  w-[90%] border rounded h-[200px] p-3"
        readOnly
      />
      <div className="text-5xl">{pb_email}</div>
    </div>
  );
}


// client fetched user 
"use client"
import { testPocketbaseCookie } from "@/state/utils/testCookie";
interface TestClientCookieProps {

}

export function TestClientCookie({}:TestClientCookieProps){
    const cookie = document.cookie
    console.log("documanet cookie  == ",document.cookie)
    // console.log("decoded cookie === ",decodeURIComponent(document.cookie))
    const pb_email = testPocketbaseCookie(cookie)
    if(pb_email === "pb_auth is invalid"){
        return (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <div className="text-6xl font-bold">Client</div>
            <textarea
              value={cookie}
              className="text-sm  w-[90%] border rounded h-[200px] p-3"
              readOnly
            />
            <div className="text-5xl text-red-500">{pb_email}</div>
          </div>
        );
}
return (
  <div className="w-full h-full flex flex-col items-center justify-center gap-3">
    <div className="text-6xl font-bold ">Client</div>
    <textarea value={cookie} className="text-sm  w-[90%] border rounded h-[200px] p-3" readOnly />
    <div className="text-5xl">{pb_email}</div>
  </div>
);
}

```
With no hydration errors
