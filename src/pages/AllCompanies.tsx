import { useState, useMemo } from "react";
import { useCompanies, Company } from "@/hooks/useCompanies";
import { CompanyDetailsPanel } from "@/components/company/CompanyDetailsPanel";
import { Search, Building2, CheckCircle2, Clock, Loader2 } from "lucide-react";
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

  const { data: companies = [], isLoading } = useCompanies();

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

      return matchesSearch && matchesStatus && matchesRegistration;
    });
  }, [companies, searchQuery, statusFilter, registrationFilter]);

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
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search companies, industries, or POC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl border-border bg-card"
          />
        </div>
        <div className="flex gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] rounded-xl border-border bg-card">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Blacklisted">Blacklisted</SelectItem>
            </SelectContent>
          </Select>
          <Select value={registrationFilter} onValueChange={setRegistrationFilter}>
            <SelectTrigger className="w-[160px] rounded-xl border-border bg-card">
              <SelectValue placeholder="Registration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Registration</SelectItem>
              <SelectItem value="Submitted">Submitted</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
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
                <TableHead className="font-semibold">Industry</TableHead>
                <TableHead className="font-semibold">1st POC</TableHead>
                <TableHead className="font-semibold">2nd POC</TableHead>
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
                    <span className="font-medium text-card-foreground">{company.name}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{company.industry || "-"}</TableCell>
                  <TableCell className="text-muted-foreground">{company.poc_1st}</TableCell>
                  <TableCell className="text-muted-foreground">{company.poc_2nd || "-"}</TableCell>
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
      />
    </div>
  );
}
