// src/pages/MintFormPage.tsx
import BetterCause from "../components/BetterCause";
import CampaignList from "../components/CampaignList";
export default function BetterCausePage() {
  return (
    <div className="container mx-auto p-8">
      <BetterCause />
      <div className="mt-10">
        <CampaignList />
      </div>
    </div>
  );
}
