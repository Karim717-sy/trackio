import { logout } from "@/app/(auth)/actions";
import Sidebar from "./Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 overflow-hidden">
      <Sidebar logoutAction={logout} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 text-slate-900 w-full">
        {children}
      </main>
    </div>
  );
}
