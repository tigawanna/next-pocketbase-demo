//  would have used this as the auth page if modifying cookies was allowed in server components
import { pb_url } from "@/state/consts";
import { loginUser } from "@/state/user/user";
import { cookies } from "next/headers";
import PocketBase from "pocketbase";
interface User{
    email:string,
    password:string
}
export default function AdminPage() {
  
async function authUser(form_data:FormData) {
        "use server";
        try {
          const pb = new PocketBase(pb_url);
          const email = form_data.get("user") as string;
          const password = form_data.get("password") as string;
          const user = await loginUser({ pb, user: email, password });
          const auth_cookie = pb.authStore.exportToCookie({ httpOnly: false });
          //  we would do this
          cookies().set("pb_auth", auth_cookie);
          // but it's only allowed in Server Action or Route Handler
          // https://nextjs.org/docs/app/api-reference/functions/cookies#cookiessetname-value-options
          // so we'll use a client componenn instaed
          return auth_cookie;
        } 
          catch (error:any) {
          console.log("error logging in user === ",error.originalError);
          return error.originalError;  
          }

      }
  return (
    <main className="flex h-full w-full min-h-screen flex-col items-center justify-between p-2">
    
        <form action={authUser} 
        className="md:w-[50%] min-h-[50%] flex flex-col 
        border shadow shadow-slate-300 items-center justify-center gap-2 p-4 rounded">
          <input type="text" name="user" className="px-1 w-full " />
          <input type="password" name="password" className="px-1 w-full " />
          <button type="submit" className="w-[70%] px-1 bg-slate-700 ">Auth</button>
        </form>
   
    </main>
  );
}
