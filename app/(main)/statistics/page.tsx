import { createReport } from "../../utils/fetchProcessSubmission";
import StatsClient from "./StatsClient";
export const dynamic = "force-dynamic";

export default async function StatisticsPage() {
  const processedData = await createReport();
  return <StatsClient initialData={processedData} />;
}