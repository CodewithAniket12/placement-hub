import { useState, useMemo } from "react";
import { useCompanies, Company } from "@/hooks/useCompanies";
import { CompanyDetailsPanel } from "@/components/company/CompanyDetailsPanel";
import { EmailComposeModal } from "@/components/email/EmailComposeModal";
import { TemplateManagerModal } from "@/components/email/TemplateManagerModal";
import { Search, Building2, CheckCircle2, Clock, Loader2, Briefcase, IndianRupee, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AllCompanies() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [registrationFilter, setRegistrationFilter] = useState<string>("all");
  const [jobRoleFilter, setJobRoleFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [packageFilter, setPackageFilter] = useState<string>("all");
  
  // Email modal state
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [emailCompany, setEmailCompany] = useState<Company | null>(null);
  const [emailOverride, setEmailOverride] = useState<{ email?: string; hrName?: string }>({});

  const { data: companies = [], isLoading } = useCompanies();

  // Extract unique job roles, locations, and package ranges for filter options
  const filterOptions = useMemo(() => {
    const roles = new Set<string>();
    const locations = new Set<string>();
    
    companies.forEach((company) => {
      if (company.job_roles) {
        company.job_roles.split(/[,;]/).forEach((role) => {
          const trimmed = role.trim();
          if (trimmed) roles.add(trimmed);
        });
      }
      if (company.job_location) {
        company.job_location.split(/[,;]/).forEach((loc) => {
          const trimmed = loc.trim();
          if (trimmed) locations.add(trimmed);
        });
      }
    });

    return {
      roles: Array.from(roles).sort(),
      locations: Array.from(locations).sort(),
    };
  }, [companies]);

  // Helper to parse package value in LPA
  const parsePackage = (pkg: string | null): number | null => {
    if (!pkg) return null;
    const match = pkg.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : null;
  };

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const matchesSearch =
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (company.industry?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        company.poc_1st.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (company.poc_2nd?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

      const matchesStatus = statusFilter === "all" || company.status === statusFilter;
      const matchesRegistration =
        registrationFilter === "all" || company.registration_status === registrationFilter;

      // Job role filter
      const matchesJobRole =
        jobRoleFilter === "all" ||
        (company.job_roles?.toLowerCase().includes(jobRoleFilter.toLowerCase()) ?? false);

      // Location filter
      const matchesLocation =
        locationFilter === "all" ||
        (company.job_location?.toLowerCase().includes(locationFilter.toLowerCase()) ?? false);

      // Package filter
      let matchesPackage = true;
      if (packageFilter !== "all") {
        const pkgValue = parsePackage(company.package_offered);
        if (pkgValue === null) {
          matchesPackage = false;
        } else {
          switch (packageFilter) {
            case "0-5":
              matchesPackage = pkgValue <= 5;
              break;
            case "5-10":
              matchesPackage = pkgValue > 5 && pkgValue <= 10;
              break;
            case "10-15":
              matchesPackage = pkgValue > 10 && pkgValue <= 15;
              break;
            case "15+":
              matchesPackage = pkgValue > 15;
              break;
          }
        }
      }

      return matchesSearch && matchesStatus && matchesRegistration && matchesJobRole && matchesLocation && matchesPackage;
    });
  }, [companies, searchQuery, statusFilter, registrationFilter, jobRoleFilter, locationFilter, packageFilter]);

  const handleRowClick = (company: Company) => {
    setSelectedCompany(company);
    setIsPanelOpen(true);
  };

  const handlePanelClose = () => {
    setIsPanelOpen(false);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">All Companies</h1>
        </div>
        <p className="text-muted-foreground">
          Master list of all registered companies ({companies.length} total)
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search companies, industries, or POC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl border-border bg-card"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] rounded-xl border-border bg-card">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Blacklisted">Blacklisted</SelectItem>
            </SelectContent>
          </Select>
          <Select value={registrationFilter} onValueChange={setRegistrationFilter}>
            <SelectTrigger className="w-[150px] rounded-xl border-border bg-card">
              <SelectValue placeholder="Registration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Registration</SelectItem>
              <SelectItem value="Submitted">Submitted</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Select value={jobRoleFilter} onValueChange={setJobRoleFilter}>
            <SelectTrigger className="w-[160px] rounded-xl border-border bg-card">
              <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Job Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {filterOptions.roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-[150px] rounded-xl border-border bg-card">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {filterOptions.locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={packageFilter} onValueChange={setPackageFilter}>
            <SelectTrigger className="w-[150px] rounded-xl border-border bg-card">
              <IndianRupee className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Package" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Packages</SelectItem>
              <SelectItem value="0-5">Up to 5 LPA</SelectItem>
              <SelectItem value="5-10">5-10 LPA</SelectItem>
              <SelectItem value="10-15">10-15 LPA</SelectItem>
              <SelectItem value="15+">15+ LPA</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Table */}
      {!isLoading && (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold">Company</TableHead>
                <TableHead className="font-semibold">Job Roles</TableHead>
                <TableHead className="font-semibold">Package</TableHead>
                <TableHead className="font-semibold">1st POC</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Registration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.map((company) => (
                <TableRow
                  key={company.id}
                  onClick={() => handleRowClick(company)}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <TableCell>
                    <div>
                      <span className="font-medium text-card-foreground">{company.name}</span>
                      {company.industry && (
                        <p className="text-xs text-muted-foreground">{company.industry}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {company.job_roles ? (
                      <div className="flex items-center gap-1 text-sm text-card-foreground">
                        <Briefcase className="h-3 w-3 text-muted-foreground" />
                        <span className="max-w-[150px] truncate">{company.job_roles}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {company.package_offered ? (
                      <div className="flex items-center gap-1 text-sm font-medium text-success">
                        <IndianRupee className="h-3 w-3" />
                        <span className="max-w-[120px] truncate">{company.package_offered}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{company.poc_1st}</TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    {company.registration_status === "Submitted" ? (
                      <span className="inline-flex items-center gap-1 text-sm text-success">
                        <CheckCircle2 className="h-4 w-4" />
                        Submitted
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-sm text-warning">
                        <Clock className="h-4 w-4" />
                        Pending
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredCompanies.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No companies found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

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
        onManageTemplates={() => {
          setIsEmailModalOpen(false);
          setIsTemplateModalOpen(true);
        }}
        overrideEmail={emailOverride.email}
        overrideHrName={emailOverride.hrName}
      />

      {/* Template Manager Modal */}
      <TemplateManagerModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
      />
    </div>
  );
}
