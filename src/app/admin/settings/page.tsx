import { getSettingsAction } from "@/actions/settings";
import { getCurrentUser } from "@/actions/auth";
import SettingsClient from "./SettingsClient";

export default async function AdminSettingsPage() {
  const [settings, user] = await Promise.all([
    getSettingsAction(),
    getCurrentUser(),
  ]);

  return <SettingsClient settings={settings} userName={user?.name} />;
}
