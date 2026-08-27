import { getPerformances } from "../rentability/actions";
import DashboardClient from "./DashboardClient";
import { getUserProfile } from "@/app/(dashboard)/settings/actions";

export default async function DashboardPage() {
  const performances = await getPerformances();
  const profile = await getUserProfile().catch(() => ({ display_currency: 'XOF' }));

  return <DashboardClient performances={performances} displayCurrency={profile.display_currency} />;
}
