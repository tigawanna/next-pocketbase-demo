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
