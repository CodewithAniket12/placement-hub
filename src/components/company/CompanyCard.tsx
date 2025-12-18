import { Company } from "@/hooks/useCompanies";
import { Mail, CheckCircle2, Clock, Phone, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface CompanyCardProps {
  company: Company;
  onCardClick: (company: Company) => void;
  onMailClick: (company: Company, e: React.MouseEvent) => void;
}

export function CompanyCard({ company, onCardClick, onMailClick }: CompanyCardProps) {
  const handleMailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (company.hr_email) {
      onMailClick(company, e);
    } else {
      toast({
        title: "No email available",
        description: `${company.hr_name || 'HR contact'} doesn't have an email address.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div
      onClick={() => onCardClick(company)}
      className="group cursor-pointer rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-200 hover:shadow-card-hover hover:border-primary/20"
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
            {company.name}
          </h3>
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

      {/* HR Contact Info */}
      <div className="mb-3 space-y-1.5">
        {company.hr_name && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-3.5 w-3.5" />
            <span>{company.hr_name}</span>
          </div>
        )}
        {company.hr_phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-3.5 w-3.5" />
            <span>{company.hr_phone}</span>
          </div>
        )}
        {company.hr_email && (
          <div className="flex items-center gap-2 text-sm text-primary">
            <Mail className="h-3.5 w-3.5" />
            <span className="truncate">{company.hr_email}</span>
          </div>
        )}
      </div>

      {/* Registration Status */}
      <div className="mb-4 flex items-center gap-2">
        {company.registration_status === "Submitted" ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span className="text-sm text-success font-medium">Mail Sent</span>
          </>
        ) : (
          <>
            <Clock className="h-4 w-4 text-warning" />
            <span className="text-sm text-warning font-medium">Pending</span>
          </>
        )}
      </div>

      {/* Action Button */}
      <Button
        onClick={handleMailClick}
        className={`w-full gap-2 rounded-xl ${
          company.hr_email 
            ? "bg-primary hover:bg-primary/90" 
            : "bg-muted text-muted-foreground hover:bg-muted"
        }`}
        disabled={!company.hr_email}
      >
        <Mail className="h-4 w-4" />
        {company.hr_email ? "Send Email" : "No Email"}
      </Button>
    </div>
  );
}
