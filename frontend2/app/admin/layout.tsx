import { ReactNode } from "react";
import AuthGuard from "../../components/admin/AuthGuard";

export const metadata = {
  title: "Admin Dashboard - KavoshSite",
  description: "Manage your website content and settings",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <main>{children}</main>
    </AuthGuard>
  );
} 