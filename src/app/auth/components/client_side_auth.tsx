import { server_component_pb } from "@/state/pb/server_component_pb";
import { ClientAuth } from "./ClientAuth";
interface User {
  email: string;
  password: string;
}
export default async function AuthPage() {
  return (
    <main className="flex h-full w-full min-h-screen flex-col items-center justify-between p-2">
      <ClientAuth />
    </main>
  );
}
