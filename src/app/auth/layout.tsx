export const metadata = {
  title: "Login",
  description: "Authentication page",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <section>{children}</section>;
}
