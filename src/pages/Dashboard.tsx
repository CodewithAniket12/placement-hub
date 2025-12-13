import { useState } from "react";
import { companies, Company } from "@/data/mockData";
import { CompanyCard } from "@/components/company/CompanyCard";
import { CompanyDetailsPanel } from "@/components/company/CompanyDetailsPanel";
import { Briefcase } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const COORDINATOR_NAME = "Aniket";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function getGreetingEmoji(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "☀️";
  if (hour < 17) return "🌤️";
  return "🌙";
}

export default function Dashboard() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const assignedCompanies = companies.filter((c) => c.poc === COORDINATOR_NAME);

  const handleCardClick = (company: Company) => {
    setSelectedCompany(company);
    setIsPanelOpen(true);
  };

  const handleMailClick = (company: Company, e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Opening mail...",
      description: `Preparing email for ${company.hr.name} at ${company.name}`,
    });
    console.log(`Open Mail Template for ${company.name}`);
  };

  const handlePanelClose = () => {
    setIsPanelOpen(false);
  };

  return (
    <div className="animate-fade-in">
      {/* Greeting Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground">
          {getGreeting()}, {COORDINATOR_NAME}! {getGreetingEmoji()}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Ready to place some students? Let's get to work.
        </p>
      </div>

      {/* My Assigned Companies Section */}
      <div>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">My Assigned Companies</h2>
            <p className="text-sm text-muted-foreground">
              {assignedCompanies.length} companies under your management
            </p>
          </div>
        </div>

        {/* Company Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {assignedCompanies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              onCardClick={handleCardClick}
              onMailClick={handleMailClick}
            />
          ))}
        </div>
      </div>

      {/* Company Details Panel */}
      <CompanyDetailsPanel
        company={selectedCompany}
        isOpen={isPanelOpen}
        onClose={handlePanelClose}
      />
    </div>
  );
}
