import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Loader2, CheckCircle } from "lucide-react";
import pptxgen from "pptxgenjs";

export default function GeneratePPT() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const generatePPT = async () => {
    setIsGenerating(true);
    setIsComplete(false);

    const pptx = new pptxgen();
    pptx.author = "Campus Placement System";
    pptx.title = "Campus Placement Coordinator Management System";
    pptx.subject = "Project Presentation";

    // Slide 1: Title
    let slide = pptx.addSlide();
    slide.addText("Campus Placement Coordinator\nManagement System", {
      x: 0.5, y: 2, w: 9, h: 1.5,
      fontSize: 36, bold: true, color: "1e3a5f",
      align: "center"
    });
    slide.addText("A Comprehensive Solution for Campus Recruitment Management", {
      x: 0.5, y: 3.5, w: 9, h: 0.5,
      fontSize: 18, color: "666666",
      align: "center"
    });
    slide.addText("Built with React + TypeScript + Lovable Cloud", {
      x: 0.5, y: 4.5, w: 9, h: 0.5,
      fontSize: 14, color: "888888",
      align: "center"
    });

    // Slide 2: Problem Statement
    slide = pptx.addSlide();
    slide.addText("Problem Statement", {
      x: 0.5, y: 0.5, w: 9, h: 0.8,
      fontSize: 28, bold: true, color: "1e3a5f"
    });
    const problems = [
      "Manual tracking of company interactions leads to data loss",
      "No centralized system for coordinator collaboration",
      "Difficulty in managing campus drive schedules",
      "Inefficient email communication with companies",
      "Lack of real-time updates and notifications",
      "No proper task assignment and tracking mechanism"
    ];
    problems.forEach((problem, i) => {
      slide.addText(`• ${problem}`, {
        x: 0.7, y: 1.5 + i * 0.6, w: 8.5, h: 0.5,
        fontSize: 16, color: "333333"
      });
    });

    // Slide 3: Solution Overview
    slide = pptx.addSlide();
    slide.addText("Solution Overview", {
      x: 0.5, y: 0.5, w: 9, h: 0.8,
      fontSize: 28, bold: true, color: "1e3a5f"
    });
    const solutions = [
      "Centralized web-based platform for all placement activities",
      "Role-based access control (Admin & Coordinator roles)",
      "Real-time company tracking with status management",
      "Integrated task management with priority levels",
      "AI-powered email generation and template system",
      "Campus drive scheduling with conflict detection"
    ];
    solutions.forEach((solution, i) => {
      slide.addText(`✓ ${solution}`, {
        x: 0.7, y: 1.5 + i * 0.6, w: 8.5, h: 0.5,
        fontSize: 16, color: "2d5a3d"
      });
    });

    // Slide 4: Technology Stack - Frontend
    slide = pptx.addSlide();
    slide.addText("Technology Stack - Frontend", {
      x: 0.5, y: 0.5, w: 9, h: 0.8,
      fontSize: 28, bold: true, color: "1e3a5f"
    });
    const frontendTech = [
      { name: "React 18", desc: "Component-based UI library with hooks" },
      { name: "TypeScript", desc: "Type-safe JavaScript for better reliability" },
      { name: "Vite", desc: "Fast build tool with HMR support" },
      { name: "Tailwind CSS", desc: "Utility-first CSS framework" },
      { name: "shadcn/ui", desc: "Accessible component library" },
      { name: "React Router v6", desc: "Client-side routing" },
      { name: "TanStack Query", desc: "Data fetching and caching" }
    ];
    frontendTech.forEach((tech, i) => {
      slide.addText(`${tech.name}`, {
        x: 0.7, y: 1.3 + i * 0.55, w: 3, h: 0.5,
        fontSize: 16, bold: true, color: "1e3a5f"
      });
      slide.addText(`${tech.desc}`, {
        x: 3.5, y: 1.3 + i * 0.55, w: 6, h: 0.5,
        fontSize: 14, color: "666666"
      });
    });

    // Slide 5: Technology Stack - Backend
    slide = pptx.addSlide();
    slide.addText("Technology Stack - Backend", {
      x: 0.5, y: 0.5, w: 9, h: 0.8,
      fontSize: 28, bold: true, color: "1e3a5f"
    });
    const backendTech = [
      { name: "Lovable Cloud", desc: "Full-stack cloud platform" },
      { name: "PostgreSQL", desc: "Relational database for data storage" },
      { name: "Row Level Security", desc: "Database-level access control" },
      { name: "Edge Functions", desc: "Serverless backend logic" },
      { name: "Supabase Auth", desc: "Email-based authentication" },
      { name: "Lovable AI", desc: "AI-powered email generation" }
    ];
    backendTech.forEach((tech, i) => {
      slide.addText(`${tech.name}`, {
        x: 0.7, y: 1.3 + i * 0.6, w: 3, h: 0.5,
        fontSize: 16, bold: true, color: "1e3a5f"
      });
      slide.addText(`${tech.desc}`, {
        x: 3.5, y: 1.3 + i * 0.6, w: 6, h: 0.5,
        fontSize: 14, color: "666666"
      });
    });

    // Slide 6: System Architecture
    slide = pptx.addSlide();
    slide.addText("System Architecture", {
      x: 0.5, y: 0.5, w: 9, h: 0.8,
      fontSize: 28, bold: true, color: "1e3a5f"
    });
    slide.addText("Three-Tier Architecture", {
      x: 0.5, y: 1.3, w: 9, h: 0.5,
      fontSize: 18, bold: true, color: "333333", align: "center"
    });
    // Presentation Layer
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1, y: 2, w: 8, h: 1,
      fill: { color: "e3f2fd" },
      line: { color: "1976d2", width: 2 }
    });
    slide.addText("Presentation Layer\nReact + TypeScript + Tailwind CSS", {
      x: 1, y: 2, w: 8, h: 1,
      fontSize: 14, color: "1976d2", align: "center", valign: "middle"
    });
    // Business Layer
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1, y: 3.3, w: 8, h: 1,
      fill: { color: "fff3e0" },
      line: { color: "f57c00", width: 2 }
    });
    slide.addText("Business Logic Layer\nEdge Functions + TanStack Query", {
      x: 1, y: 3.3, w: 8, h: 1,
      fontSize: 14, color: "f57c00", align: "center", valign: "middle"
    });
    // Data Layer
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1, y: 4.6, w: 8, h: 1,
      fill: { color: "e8f5e9" },
      line: { color: "388e3c", width: 2 }
    });
    slide.addText("Data Layer\nPostgreSQL + Row Level Security", {
      x: 1, y: 4.6, w: 8, h: 1,
      fontSize: 14, color: "388e3c", align: "center", valign: "middle"
    });

    // Slide 7: User Roles
    slide = pptx.addSlide();
    slide.addText("User Roles & Access Control", {
      x: 0.5, y: 0.5, w: 9, h: 0.8,
      fontSize: 28, bold: true, color: "1e3a5f"
    });
    // Admin box
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.5, y: 1.5, w: 4, h: 3.5,
      fill: { color: "fce4ec" },
      line: { color: "c2185b", width: 2 }
    });
    slide.addText("ADMIN", {
      x: 0.5, y: 1.6, w: 4, h: 0.5,
      fontSize: 18, bold: true, color: "c2185b", align: "center"
    });
    const adminPerms = ["Approve/reject coordinators", "Manage all companies", "Block date ranges", "Approve date requests", "View all activities", "Manage email templates"];
    adminPerms.forEach((perm, i) => {
      slide.addText(`• ${perm}`, {
        x: 0.7, y: 2.2 + i * 0.4, w: 3.6, h: 0.4,
        fontSize: 12, color: "333333"
      });
    });
    // Coordinator box
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 5.5, y: 1.5, w: 4, h: 3.5,
      fill: { color: "e3f2fd" },
      line: { color: "1976d2", width: 2 }
    });
    slide.addText("COORDINATOR", {
      x: 5.5, y: 1.6, w: 4, h: 0.5,
      fontSize: 18, bold: true, color: "1976d2", align: "center"
    });
    const coordPerms = ["Manage assigned companies", "Create and track tasks", "Schedule campus drives", "Send emails to HRs", "Request special dates", "View own dashboard"];
    coordPerms.forEach((perm, i) => {
      slide.addText(`• ${perm}`, {
        x: 5.7, y: 2.2 + i * 0.4, w: 3.6, h: 0.4,
        fontSize: 12, color: "333333"
      });
    });

    // Slide 8: Database Schema
    slide = pptx.addSlide();
    slide.addText("Database Schema", {
      x: 0.5, y: 0.5, w: 9, h: 0.8,
      fontSize: 28, bold: true, color: "1e3a5f"
    });
    const tables = [
      { name: "profiles", desc: "User profiles with display names and status" },
      { name: "user_roles", desc: "Role assignments (admin/coordinator)" },
      { name: "companies", desc: "Company details, contacts, job info" },
      { name: "company_contacts", desc: "Multiple HR contacts per company" },
      { name: "tasks", desc: "Task assignments with priority & status" },
      { name: "campus_drives", desc: "Scheduled drives with details" },
      { name: "blocked_dates", desc: "Admin-blocked date ranges" },
      { name: "email_logs", desc: "Email history and status tracking" },
      { name: "email_templates", desc: "Reusable email templates" }
    ];
    tables.forEach((table, i) => {
      slide.addText(`${table.name}`, {
        x: 0.7, y: 1.3 + i * 0.45, w: 2.5, h: 0.4,
        fontSize: 14, bold: true, color: "1e3a5f", fontFace: "Courier New"
      });
      slide.addText(`${table.desc}`, {
        x: 3.3, y: 1.3 + i * 0.45, w: 6.2, h: 0.4,
        fontSize: 12, color: "666666"
      });
    });

    // Slide 9: Key Features - Company Management
    slide = pptx.addSlide();
    slide.addText("Feature: Company Management", {
      x: 0.5, y: 0.5, w: 9, h: 0.8,
      fontSize: 28, bold: true, color: "1e3a5f"
    });
    const companyFeatures = [
      "Complete company lifecycle tracking",
      "Status management: New → Contacted → In Progress → Confirmed → Completed",
      "Registration status: Pending, Approved, Registered",
      "Multiple HR contacts per company",
      "Job details: roles, package, location, eligibility",
      "Search and filter capabilities",
      "Quick actions: email, schedule drive, view details"
    ];
    companyFeatures.forEach((feature, i) => {
      slide.addText(`• ${feature}`, {
        x: 0.7, y: 1.4 + i * 0.55, w: 8.5, h: 0.5,
        fontSize: 15, color: "333333"
      });
    });

    // Slide 10: Key Features - Task Management
    slide = pptx.addSlide();
    slide.addText("Feature: Task Management", {
      x: 0.5, y: 0.5, w: 9, h: 0.8,
      fontSize: 28, bold: true, color: "1e3a5f"
    });
    const taskFeatures = [
      "Create tasks with title, description, and due date",
      "Priority levels: Low, Medium, High",
      "Status tracking: Pending → In Progress → Completed",
      "Link tasks to specific companies",
      "Filter by status and priority",
      "Dashboard summary cards",
      "Coordinator-specific task views"
    ];
    taskFeatures.forEach((feature, i) => {
      slide.addText(`• ${feature}`, {
        x: 0.7, y: 1.4 + i * 0.55, w: 8.5, h: 0.5,
        fontSize: 15, color: "333333"
      });
    });

    // Slide 11: Key Features - Scheduling
    slide = pptx.addSlide();
    slide.addText("Feature: Scheduling System", {
      x: 0.5, y: 0.5, w: 9, h: 0.8,
      fontSize: 28, bold: true, color: "1e3a5f"
    });
    const scheduleFeatures = [
      "Campus drive scheduling with date/time",
      "Venue and eligible branches specification",
      "Admin-controlled blocked date ranges",
      "Special date request workflow",
      "Request approval/rejection by admin",
      "Conflict detection for overlapping dates",
      "Drive status tracking: Scheduled → Ongoing → Completed"
    ];
    scheduleFeatures.forEach((feature, i) => {
      slide.addText(`• ${feature}`, {
        x: 0.7, y: 1.4 + i * 0.55, w: 8.5, h: 0.5,
        fontSize: 15, color: "333333"
      });
    });

    // Slide 12: Key Features - Email System
    slide = pptx.addSlide();
    slide.addText("Feature: Email System", {
      x: 0.5, y: 0.5, w: 9, h: 0.8,
      fontSize: 28, bold: true, color: "1e3a5f"
    });
    const emailFeatures = [
      "AI-powered email generation using Lovable AI",
      "Customizable email templates with placeholders",
      "Template management (create, edit, delete)",
      "Email history and logging",
      "Status tracking: Pending, Sent, Failed",
      "Resend capability for failed emails",
      "Company and recipient details auto-filled"
    ];
    emailFeatures.forEach((feature, i) => {
      slide.addText(`• ${feature}`, {
        x: 0.7, y: 1.4 + i * 0.55, w: 8.5, h: 0.5,
        fontSize: 15, color: "333333"
      });
    });

    // Slide 13: Security Features
    slide = pptx.addSlide();
    slide.addText("Security Implementation", {
      x: 0.5, y: 0.5, w: 9, h: 0.8,
      fontSize: 28, bold: true, color: "1e3a5f"
    });
    const securityFeatures = [
      "Email-based authentication with verification",
      "Admin approval required for new coordinators",
      "Row Level Security (RLS) on all tables",
      "Role-based access control functions",
      "Protected routes for authenticated users",
      "Secure API calls with auth tokens",
      "Input validation on all forms",
      "HTTPS encryption for data in transit"
    ];
    securityFeatures.forEach((feature, i) => {
      slide.addText(`🔒 ${feature}`, {
        x: 0.7, y: 1.3 + i * 0.5, w: 8.5, h: 0.5,
        fontSize: 15, color: "333333"
      });
    });

    // Slide 14: Edge Functions
    slide = pptx.addSlide();
    slide.addText("Backend Edge Functions", {
      x: 0.5, y: 0.5, w: 9, h: 0.8,
      fontSize: 28, bold: true, color: "1e3a5f"
    });
    const edgeFunctions = [
      { name: "create-coordinator", desc: "Creates user accounts for coordinators" },
      { name: "generate-email", desc: "AI-powered email content generation" },
      { name: "send-email", desc: "Sends emails via configured SMTP" },
      { name: "extract-pdf-data", desc: "Extracts data from uploaded PDFs" }
    ];
    edgeFunctions.forEach((func, i) => {
      slide.addText(`${func.name}`, {
        x: 0.7, y: 1.5 + i * 0.8, w: 3.5, h: 0.5,
        fontSize: 16, bold: true, color: "1e3a5f", fontFace: "Courier New"
      });
      slide.addText(`${func.desc}`, {
        x: 4.3, y: 1.5 + i * 0.8, w: 5.2, h: 0.5,
        fontSize: 14, color: "666666"
      });
    });

    // Slide 15: Future Scope
    slide = pptx.addSlide();
    slide.addText("Future Scope", {
      x: 0.5, y: 0.5, w: 9, h: 0.8,
      fontSize: 28, bold: true, color: "1e3a5f"
    });
    const futureFeatures = [
      "Advanced analytics and reporting dashboard",
      "Mobile application for on-the-go access",
      "Student portal for drive registrations",
      "AI-based resume parsing and matching",
      "Calendar integration (Google, Outlook)",
      "Push notifications for updates",
      "Automated report generation",
      "Company feedback and rating system"
    ];
    futureFeatures.forEach((feature, i) => {
      slide.addText(`→ ${feature}`, {
        x: 0.7, y: 1.3 + i * 0.5, w: 8.5, h: 0.5,
        fontSize: 15, color: "333333"
      });
    });

    // Slide 16: Thank You
    slide = pptx.addSlide();
    slide.addText("Thank You!", {
      x: 0.5, y: 2, w: 9, h: 1,
      fontSize: 44, bold: true, color: "1e3a5f",
      align: "center"
    });
    slide.addText("Questions & Discussion", {
      x: 0.5, y: 3.2, w: 9, h: 0.5,
      fontSize: 24, color: "666666",
      align: "center"
    });
    slide.addText("Campus Placement Coordinator Management System", {
      x: 0.5, y: 4.5, w: 9, h: 0.5,
      fontSize: 14, color: "888888",
      align: "center"
    });

    // Generate and download
    await pptx.writeFile({ fileName: "Campus_Placement_System_Presentation.pptx" });
    
    setIsGenerating(false);
    setIsComplete(true);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <FileText className="h-8 w-8 text-primary" />
              Generate Project Presentation
            </CardTitle>
            <CardDescription>
              Download a comprehensive PowerPoint presentation for the Campus Placement Coordinator Management System
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold">Presentation Includes:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Title & Introduction</li>
                <li>• Problem Statement & Solution Overview</li>
                <li>• Technology Stack (Frontend & Backend)</li>
                <li>• System Architecture Diagram</li>
                <li>• User Roles & Permissions</li>
                <li>• Database Schema</li>
                <li>• Feature Details (Company, Tasks, Scheduling, Email)</li>
                <li>• Security Implementation</li>
                <li>• Edge Functions</li>
                <li>• Future Scope</li>
              </ul>
            </div>

            <Button 
              onClick={generatePPT} 
              disabled={isGenerating}
              className="w-full h-12 text-lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Presentation...
                </>
              ) : isComplete ? (
                <>
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Download Again
                </>
              ) : (
                <>
                  <Download className="mr-2 h-5 w-5" />
                  Generate & Download PPT
                </>
              )}
            </Button>

            {isComplete && (
              <p className="text-center text-sm text-green-600">
                ✓ Presentation downloaded successfully!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
