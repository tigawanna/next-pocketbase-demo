import { server_component_pb } from "@/state/pb/server_component_pb";
import { WontCauseHydrationIssues } from "./root/WontCauseHydrationIssues";

export default async function Home() {
const {pb}=await server_component_pb()
const user = pb.authStore.model

  return (
    <main className="flex h-full min-h-screen w-full flex-col items-center justify-between p-10">
    <div className="h-full flex flex-col items-center justify-center gap-3">
      <h1 className="text-8xl font-bold">Welcome to</h1>
      <h1 className="text-5xl font-bold">Main Page</h1>
      {/* both components below are client compoents that render optional elements basedon the user logedin status*/}
      <WontCauseHydrationIssues user={user}/>
      {/* comment this one out to see the unideal case which will cause hydration issue */}
      {/* <WillCauseHydrationIssues/> */}
    </div>
    </main>
  )
}
