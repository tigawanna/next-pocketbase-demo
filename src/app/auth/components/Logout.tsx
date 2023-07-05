"use client"

import { logoutUser } from "@/state/user/user";
import { useRouter } from "next/navigation";

interface LogoutProps {

}

export function Logout({}:LogoutProps){
    const router = useRouter();
return (
<button 
className=" hover:bg-slate-700 "
onClick={() => { 
    logoutUser()
    router.refresh()
     
}} >
    Logout
</button>
);
}
