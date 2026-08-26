import { getPerformances } from "../rentability/actions";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const performances = await getPerformances();

  return <DashboardClient performances={performances} />;
}
