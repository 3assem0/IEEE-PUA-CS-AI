import { useState } from "react";
import AdminLogin from "../components/admin/AdminLogin";
import AdminDashboardContent from "../components/admin/AdminDashboard";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return <AdminDashboardContent onLogout={() => setIsAuthenticated(false)} />;
}
