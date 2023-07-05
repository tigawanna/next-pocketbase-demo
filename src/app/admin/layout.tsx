

export const metadata = {
  title: "Admin Page",
  description: "Where authentocated tasks are done",
};


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
 <section>
    {children}
 </section>
  );
}
