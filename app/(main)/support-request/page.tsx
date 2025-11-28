// app/(main)/support-request/page.js
import React, { Suspense } from "react";
import BeneficiaryClientForm from "./BeneficiaryClientForm"; // Adjust path if needed

// This page.js component can be a Server Component or Client Component,
// but the Suspense boundary ensures useSearchParams only runs on the client.
export const dynamic = "force-dynamic"; // Keep this if you want dynamic SSR

export default function SupportRequestPage() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <BeneficiaryClientForm />
    </Suspense>
  );
}
