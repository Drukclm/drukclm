// app/kpo-dashboard/CLM-Participation/page.tsx
import CLMParticipationPageContent from "../components/clm-participation/CLMParticipationPageContent";
import { CLMDataProvider } from "../components/clm-participation/CLMDataContext";

export default async function CLMParticipationPage() {
  // ⛔️ Do NOT fetch report here – the provider handles it internally
  return (
    <CLMDataProvider>
      <CLMParticipationPageContent />
    </CLMDataProvider>
  );
}
