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



And now we can SetUp 2 components to text this out 

- Client Side User Fetch
```tsx
"use client"
import { pb } from "@/state/pb/client_config";

interface WillCauseHydrationIssuesProps {

}
/**
 * Renders a component that may cause hydration issues.
 *
 * @param {WillCauseHydrationIssuesProps} props - The props object for the component.
 * @return {JSX.Element} The rendered component.
 */
export function WillCauseHydrationIssues({}:WillCauseHydrationIssuesProps){
const user  = pb.authStore.model 
return (
 <div className='w-full h-full flex items-center justify-center'>
    {user && <h1 className="text-8xl font-bol text-red-400">User Logged in </h1>}
 </div>
);
}

```

` Server side user fetch and pass user as prop to the client component
```tsx
"use client";
import { PBUserRecord } from "@/state/user/types";
import { Record, Admin } from "pocketbase";

interface WontCauseHydrationIssuesProps {
  user: Record | Admin | null;
}

/**
 * Renders a component that won't cause hydration issues.
 *
 * @param {WontCauseHydrationIssuesProps} user - The user object.
 * @return {JSX.Element} - The rendered component.
 */

export function WontCauseHydrationIssues({ user }: WontCauseHydrationIssuesProps) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      {user && <h1 className="text-2xl font-bold">User Logged In</h1>}
    </div>
  );
}

```

Do note that for something with no user interactions like this , rendering it as a server component will serve you better , but components like this usually need user interactions like dark mode toggle or user logout on profile pic click ,NextJS server actions can also help out here eliminating need for client components but I'd usually place those items in toolbars and sidebars which work best as server components

also a few pointers on the cookies you get out of 

```ts
import { cookies } from "next/headers";
``` 
might vary depending on whether it was saved with `document.cookie or cookie().set()` ,the PocketBase client will correctly parse the   `document.cookie` string but you might  have to  encode the object from `cookie().get()` into a valid cookie string before passing it into 
```ts
  pb.authStore.loadFromCookie(cookie || ""); 
```
 looking at the `  pb.authStore` implementation and seems like it might work if you pass in the correct shape of cookie object but for convenience i made a [parsing function](https://github.com/tigawanna/next-pocketbase-demo/blob/9bcdfe43ad7dc4445e8240e3a2a841138010de9d/src/state/utils/encodeCookies.ts) that turns it the `cookie().get("pb_auth")` object that looks like

```json
{
  name: 'pb_auth',
  value: '{"token":"eyJhbGciOiJIJleHAiOjE2ODk4MjQ3ODIsImlkIjoiN2R4dzcyNDEyaDBlazdkIiwidHlwZSI6ImF1dG.MPqkEy9dd6UMXT46SXVvjss2OP-_J9agR7E5mdjS_kk","model":{"access_token":"","avatar":"","bio":"","collectionId":"5sckr8a13tos","collectionName":"developers","created":"2023-06-27 20:40:23.037Z","email":"picopicpo@email.com","emailVisibility":true,"github_avatar":"","github_login":"","id":"7dxw72412h0ek7d","updated":"2023-07-05 05:30:08.835Z","username":"picopico","verified":false,"expand":{}}}'
}
```
into a string that looks something like this 
```ts
const cookie= "%7B%22token%22%3A%22JhbiOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9zcyNDEyaDBlazdkIiwidHlwZSI6ImF1dGhSZWNvcmQifQ...."
```

 

# helpful references
- [complete code](https://github.com/tigawanna/next-pocketbase-demo)
- [bigger project example](https://github.com/tigawanna/pocketbook)
-[PocketBase `AuthStore`](https://github.com/pocketbase/js-sdk#authstore)
- [`Nextjs` server actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)
- [`Nextjs` server components data fetching](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching)

