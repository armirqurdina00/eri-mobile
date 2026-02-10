import { getDashboardStats } from "@/actions/dashboard";
import { getCurrentUser } from "@/actions/auth";
import DashboardClient from "./DashboardClient";

export default async function AdminDashboard() {
  const [stats, user] = await Promise.all([
    getDashboardStats(),
    getCurrentUser(),
  ]);

  return <DashboardClient stats={stats} userName={user?.name} />;
}
