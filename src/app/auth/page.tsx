import { ClientAuth } from "@/app/auth/components/ClientAuth";
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
