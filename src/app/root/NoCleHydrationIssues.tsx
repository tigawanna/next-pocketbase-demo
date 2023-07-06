import { PBUserRecord } from "@/state/user/types";
import { Record,Admin} from "pocketbase";

interface WontCauseHydrationIssuesProps {
  user: Record | Admin | null;
}

export function WontCauseHydrationIssues({user}:WontCauseHydrationIssuesProps){
return (
  <div className="w-full h-full flex items-center justify-center">
    {user && <h1 className="text-2xl">Server User Logged In</h1>}
  </div>
);
}



