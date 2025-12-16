import { Company } from "@/hooks/useCompanies";
import { Mail, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CompanyCardProps {
  company: Company;
  onCardClick: (company: Company) => void;
  onMailClick: (company: Company, e: React.MouseEvent) => void;
}

export function CompanyCard({ company, onCardClick, onMailClick }: CompanyCardProps) {
  return (
    <div
      onClick={() => onCardClick(company)}
      className="group cursor-pointer rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-200 hover:shadow-card-hover hover:border-primary/20"
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
            {company.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{company.industry || "No industry"}</p>
        </div>
        <Badge
          variant={company.status === "Active" ? "default" : "destructive"}
          className={
            company.status === "Active"
              ? "bg-success/10 text-success hover:bg-success/20 border-0"
              : "bg-destructive/10 text-destructive hover:bg-destructive/20 border-0"
          }
        >
          {company.status}
        </Badge>
      </div>

      {/* Registration Status */}
      <div className="mb-5 flex items-center gap-2">
        {company.registration_status === "Submitted" ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span className="text-sm text-success font-medium">Registration Complete</span>
          </>
        ) : (
          <>
            <Clock className="h-4 w-4 text-warning" />
            <span className="text-sm text-warning font-medium">Registration Pending</span>
          </>
        )}
      </div>

      {/* Action Button */}
      <Button
        onClick={(e) => onMailClick(company, e)}
        className="w-full gap-2 rounded-xl bg-primary hover:bg-primary/90"
      >
        <Mail className="h-4 w-4" />
        Mail Now
      </Button>
    </div>
  );
}
