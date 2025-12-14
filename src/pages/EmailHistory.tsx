import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Mail,
  Search,
  RefreshCw,
  Eye,
  Send,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";

interface EmailLog {
  id: string;
  template_id: string | null;
  company_name: string;
  recipient_email: string;
  subject: string;
  body: string;
  status: string;
  sent_at: string | null;
  created_at: string;
}

export default function EmailHistory() {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLog, setSelectedLog] = useState<EmailLog | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [resendingId, setResendingId] = useState<string | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("email_logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching logs:", error);
      toast({ title: "Error", description: "Failed to load email history", variant: "destructive" });
    } else {
      setLogs(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleResend = async (log: EmailLog) => {
    setResendingId(log.id);

    try {
      const { error } = await supabase.functions.invoke("send-email", {
        body: {
          to: log.recipient_email,
          subject: log.subject,
          body: log.body,
          companyName: log.company_name,
        },
      });

      if (error) throw error;

      // Log the resent email
      await supabase.from("email_logs").insert({
        template_id: log.template_id,
        company_name: log.company_name,
        recipient_email: log.recipient_email,
        subject: log.subject,
        body: log.body,
        status: "sent",
        sent_at: new Date().toISOString(),
      });

      toast({
        title: "Email resent!",
        description: `Successfully resent email to ${log.recipient_email}`,
      });

      fetchLogs();
    } catch (error: any) {
      console.error("Error resending email:", error);
      toast({
        title: "Failed to resend email",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setResendingId(null);
    }
  };

  const handlePreview = (log: EmailLog) => {
    setSelectedLog(log);
    setIsPreviewOpen(true);
  };

  const filteredLogs = logs.filter(
    (log) =>
      log.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.recipient_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return (
          <Badge className="bg-success/10 text-success border-0 gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Sent
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-warning/10 text-warning border-0 gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-destructive/10 text-destructive border-0 gap-1">
            <XCircle className="h-3 w-3" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Email History</h1>
        </div>
        <p className="text-muted-foreground">
          View and manage all sent emails with resend functionality
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by company, email, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={fetchLogs} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-16">
            <Mail className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">
              {searchQuery ? "No emails match your search" : "No emails sent yet"}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.company_name}</TableCell>
                  <TableCell className="text-muted-foreground">{log.recipient_email}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{log.subject}</TableCell>
                  <TableCell>{getStatusBadge(log.status)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {log.sent_at
                      ? format(new Date(log.sent_at), "MMM d, yyyy h:mm a")
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePreview(log)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleResend(log)}
                        disabled={resendingId === log.id}
                      >
                        {resendingId === log.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Email Preview</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Company</p>
                  <p className="font-medium">{selectedLog.company_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedLog.status)}</div>
                </div>
                <div>
                  <p className="text-muted-foreground">Recipient</p>
                  <p className="font-medium">{selectedLog.recipient_email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Sent At</p>
                  <p className="font-medium">
                    {selectedLog.sent_at
                      ? format(new Date(selectedLog.sent_at), "MMM d, yyyy h:mm a")
                      : "Not sent"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground text-sm mb-1">Subject</p>
                <p className="font-medium">{selectedLog.subject}</p>
              </div>

              <div>
                <p className="text-muted-foreground text-sm mb-1">Body</p>
                <div className="whitespace-pre-wrap text-sm p-4 bg-muted/30 rounded-lg border">
                  {selectedLog.body}
                </div>
              </div>

              <Button
                onClick={() => handleResend(selectedLog)}
                disabled={resendingId === selectedLog.id}
                className="w-full gap-2"
              >
                {resendingId === selectedLog.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Resend Email
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
