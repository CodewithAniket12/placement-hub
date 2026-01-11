import { useState } from "react";
import { useCompanies, Company } from "@/hooks/useCompanies";
import { useAuth } from "@/contexts/AuthContext";
import { CompanyCard } from "@/components/company/CompanyCard";
import { CompanyDetailsPanel } from "@/components/company/CompanyDetailsPanel";
import { AddCompanyModal } from "@/components/company/AddCompanyModal";
import { EmailComposeModal } from "@/components/email/EmailComposeModal";
import { TemplateManagerModal } from "@/components/email/TemplateManagerModal";
import { Briefcase, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const { profile } = useAuth();
  const coordinatorName = profile?.display_name || "";

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false);
  const [emailCompany, setEmailCompany] = useState<Company | null>(null);
  const [emailOverride, setEmailOverride] = useState<{ email?: string; hrName?: string }>({});

  const { data: companies = [], isLoading } = useCompanies();

  // Filter companies where current user is 1st or 2nd POC
  const assignedCompanies = companies.filter(
    (c) => c.poc_1st === coordinatorName || c.poc_2nd === coordinatorName
  );

  const handleCardClick = (company: Company) => {
    setSelectedCompany(company);
    setIsPanelOpen(true);
  };

  const handleMailClick = (company: Company, e: React.MouseEvent) => {
    e.stopPropagation();
    setEmailCompany(company);
    setIsEmailModalOpen(true);
  };

  const handlePanelClose = () => {
    setIsPanelOpen(false);
  };

  const handleManageTemplates = () => {
    setIsEmailModalOpen(false);
    setIsTemplateModalOpen(true);
  };

  return (
    <div className="animate-fade-in">
      {/* Greeting Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground">
          {getGreeting()}, {coordinatorName}! {getGreetingEmoji()}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Ready to place some students? Let's get to work.
        </p>
      </div>

      {/* Assigned Companies Section */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Assigned Companies</h2>
              <p className="text-sm text-muted-foreground">
                {assignedCompanies.length} companies under your management
              </p>
            </div>
          </div>
          <Button onClick={() => setIsAddCompanyModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Company
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Company Cards Grid */}
        {!isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {assignedCompanies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                onCardClick={handleCardClick}
                onMailClick={handleMailClick}
              />
            ))}
            {assignedCompanies.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No companies assigned yet.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Company Details Panel */}
      <CompanyDetailsPanel
        company={selectedCompany}
        isOpen={isPanelOpen}
        onClose={handlePanelClose}
        onSendEmail={(company, overrideEmail, overrideHrName) => {
          setEmailCompany(company);
          setEmailOverride({ email: overrideEmail, hrName: overrideHrName });
          setIsEmailModalOpen(true);
        }}
      />

      {/* Email Compose Modal */}
      <EmailComposeModal
        isOpen={isEmailModalOpen}
        onClose={() => {
          setIsEmailModalOpen(false);
          setEmailOverride({});
        }}
        company={emailCompany}
        onManageTemplates={handleManageTemplates}
        overrideEmail={emailOverride.email}
        overrideHrName={emailOverride.hrName}
      />

      {/* Template Manager Modal */}
      <TemplateManagerModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
      />

      {/* Add Company Modal */}
      <AddCompanyModal
        isOpen={isAddCompanyModalOpen}
        onClose={() => setIsAddCompanyModalOpen(false)}
      />
    </div>
  );
}
