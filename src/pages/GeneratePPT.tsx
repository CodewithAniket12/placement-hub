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
    slide.addText("Built with React + Node.js + Supabase", {
      x: 0.5, y: 4.5, w: 9, h: 0.5,
      fontSize: 14, color: "888888",
      align: "center"
    });

    // Slide 2: Team Members (Placeholder)
    slide = pptx.addSlide();
    slide.addText("Team Members", {
      x: 0.5, y: 0.5, w: 9, h: 0.8,
      fontSize: 28, bold: true, color: "1e3a5f"
    });
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1, y: 1.5, w: 3.5, h: 1.8,
      fill: { color: "e3f2fd" },
      line: { color: "1976d2", width: 2 }
    });
    slide.addText("Team Member 1\nRole: Project Lead\nID: XXXXXXXX", {
      x: 1, y: 1.5, w: 3.5, h: 1.8,
      fontSize: 12, color: "1976d2", align: "center", valign: "middle"
    });
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 5.5, y: 1.5, w: 3.5, h: 1.8,
      fill: { color: "e8f5e9" },
      line: { color: "388e3c", width: 2 }
    });
    slide.addText("Team Member 2\nRole: Developer\nID: XXXXXXXX", {
      x: 5.5, y: 1.5, w: 3.5, h: 1.8,
      fontSize: 12, color: "388e3c", align: "center", valign: "middle"
    });
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1, y: 3.6, w: 3.5, h: 1.8,
      fill: { color: "fff3e0" },
      line: { color: "f57c00", width: 2 }
    });
    slide.addText("Team Member 3\nRole: UI/UX Designer\nID: XXXXXXXX", {
      x: 1, y: 3.6, w: 3.5, h: 1.8,
      fontSize: 12, color: "f57c00", align: "center", valign: "middle"
    });
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 5.5, y: 3.6, w: 3.5, h: 1.8,
      fill: { color: "fce4ec" },
      line: { color: "c2185b", width: 2 }
    });
    slide.addText("Team Member 4\nRole: Tester\nID: XXXXXXXX", {
      x: 5.5, y: 3.6, w: 3.5, h: 1.8,
      fontSize: 12, color: "c2185b", align: "center", valign: "middle"
    });

    // Slide 3: Problem Statement
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
      "No proper task assignment and tracking mechanism",
      "Paper-based processes are slow and error-prone"
    ];
    problems.forEach((problem, i) => {
      slide.addText(`• ${problem}`, {
        x: 0.7, y: 1.5 + i * 0.55, w: 8.5, h: 0.5,
        fontSize: 16, color: "333333"
      });
    });

    // Slide 4: Project Objectives
    slide = pptx.addSlide();
    slide.addText("Project Objectives", {
      x: 0.5, y: 0.5, w: 9, h: 0.8,
      fontSize: 28, bold: true, color: "1e3a5f"
    });
    const objectives = [
      "Develop a centralized web-based placement management system",
      "Implement role-based access control for admins and coordinators",
      "Enable efficient company tracking and communication",
      "Automate email generation using AI capabilities",
      "Provide scheduling tools with conflict detection",
      "Create a task management system with priority levels",
      "Ensure data security with row-level security policies"
    ];
    objectives.forEach((obj, i) => {
      slide.addText(`${i + 1}. ${obj}`, {
        x: 0.7, y: 1.5 + i * 0.55, w: 8.5, h: 0.5,
        fontSize: 15, color: "333333"
      });
    });

    // Slide 5: Solution Overview
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
      "Campus drive scheduling with conflict detection",
      "Secure authentication with admin approval workflow"
    ];
    solutions.forEach((solution, i) => {
      slide.addText(`✓ ${solution}`, {
        x: 0.7, y: 1.5 + i * 0.55, w: 8.5, h: 0.5,
        fontSize: 15, color: "2d5a3d"
      });
    });

    // Slide 6: Technology Stack - Frontend
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

    // Slide 7: Technology Stack - Backend
    slide = pptx.addSlide();
    slide.addText("Technology Stack - Backend", {
      x: 0.5, y: 0.5, w: 9, h: 0.8,
      fontSize: 28, bold: true, color: "1e3a5f"
    });
    const backendTech = [
      { name: "Node.js", desc: "JavaScript runtime for backend logic" },
      { name: "Supabase", desc: "Open-source Firebase alternative" },
      { name: "PostgreSQL", desc: "Relational database for data storage" },
      { name: "Row Level Security", desc: "Database-level access control" },
      { name: "Edge Functions", desc: "Serverless Deno-based functions" },
      { name: "Supabase Auth", desc: "JWT-based email authentication" },
      { name: "OpenAI API", desc: "AI-powered email generation" }
    ];
    backendTech.forEach((tech, i) => {
      slide.addText(`${tech.name}`, {
        x: 0.7, y: 1.3 + i * 0.55, w: 3, h: 0.5,
        fontSize: 16, bold: true, color: "1e3a5f"
      });
      slide.addText(`${tech.desc}`, {
        x: 3.5, y: 1.3 + i * 0.55, w: 6, h: 0.5,
        fontSize: 14, color: "666666"
      });
    });

    // Slide 8: System Architecture
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
    slide.addText("Business Logic Layer\nNode.js Edge Functions + TanStack Query", {
      x: 1, y: 3.3, w: 8, h: 1,
      fontSize: 14, color: "f57c00", align: "center", valign: "middle"
    });
    // Data Layer
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1, y: 4.6, w: 8, h: 1,
      fill: { color: "e8f5e9" },
      line: { color: "388e3c", width: 2 }
    });
    slide.addText("Data Layer\nSupabase PostgreSQL + Row Level Security", {
      x: 1, y: 4.6, w: 8, h: 1,
      fontSize: 14, color: "388e3c", align: "center", valign: "middle"
    });

    // Slide 9: Data Flow Diagram
    slide = pptx.addSlide();
    slide.addText("Data Flow Diagram", {
      x: 0.5, y: 0.5, w: 9, h: 0.8,
      fontSize: 28, bold: true, color: "1e3a5f"
    });
    // User
    slide.addShape(pptx.ShapeType.ellipse, {
      x: 0.5, y: 2.5, w: 1.5, h: 1,
      fill: { color: "e3f2fd" },
      line: { color: "1976d2", width: 2 }
    });
    slide.addText("User", {
      x: 0.5, y: 2.5, w: 1.5, h: 1,
      fontSize: 12, color: "1976d2", align: "center", valign: "middle"
    });
    // Arrow
    slide.addText("→", { x: 2, y: 2.7, w: 0.5, h: 0.5, fontSize: 20, color: "666666" });
    // Frontend
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 2.5, y: 2.3, w: 2, h: 1.2,
      fill: { color: "fff3e0" },
      line: { color: "f57c00", width: 2 }
    });
    slide.addText("React\nFrontend", {
      x: 2.5, y: 2.3, w: 2, h: 1.2,
      fontSize: 11, color: "f57c00", align: "center", valign: "middle"
    });
    // Arrow
    slide.addText("→", { x: 4.5, y: 2.7, w: 0.5, h: 0.5, fontSize: 20, color: "666666" });
    // Supabase
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 5, y: 2.3, w: 2, h: 1.2,
      fill: { color: "e8f5e9" },
      line: { color: "388e3c", width: 2 }
    });
    slide.addText("Supabase\nAPI", {
      x: 5, y: 2.3, w: 2, h: 1.2,
      fontSize: 11, color: "388e3c", align: "center", valign: "middle"
    });
    // Arrow
    slide.addText("→", { x: 7, y: 2.7, w: 0.5, h: 0.5, fontSize: 20, color: "666666" });
    // Database
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 7.5, y: 2.3, w: 2, h: 1.2,
      fill: { color: "fce4ec" },
      line: { color: "c2185b", width: 2 }
    });
    slide.addText("PostgreSQL\nDatabase", {
      x: 7.5, y: 2.3, w: 2, h: 1.2,
      fontSize: 11, color: "c2185b", align: "center", valign: "middle"
    });
    slide.addText("Data Flow: User → React Frontend → Supabase API → PostgreSQL Database", {
      x: 0.5, y: 4.5, w: 9, h: 0.5,
      fontSize: 12, color: "666666", align: "center"
    });

    // Slide 10: User Roles
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

    // Slide 11: Database Schema
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

    // Slide 12: ER Diagram
    slide = pptx.addSlide();
    slide.addText("Entity Relationship Diagram", {
      x: 0.5, y: 0.5, w: 9, h: 0.8,
      fontSize: 28, bold: true, color: "1e3a5f"
    });
    // Profiles
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.5, y: 1.5, w: 2, h: 1.2,
      fill: { color: "e3f2fd" },
      line: { color: "1976d2", width: 2 }
    });
    slide.addText("profiles\n• id\n• user_id\n• display_name", {
      x: 0.5, y: 1.5, w: 2, h: 1.2,
      fontSize: 9, color: "1976d2", align: "center", valign: "middle"
    });
    // Companies
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 4, y: 1.3, w: 2, h: 1.5,
      fill: { color: "e8f5e9" },
      line: { color: "388e3c", width: 2 }
    });
    slide.addText("companies\n• id\n• name\n• status\n• poc_1st", {
      x: 4, y: 1.3, w: 2, h: 1.5,
      fontSize: 9, color: "388e3c", align: "center", valign: "middle"
    });
    // Tasks
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 7.5, y: 1.5, w: 2, h: 1.2,
      fill: { color: "fff3e0" },
      line: { color: "f57c00", width: 2 }
    });
    slide.addText("tasks\n• id\n• title\n• company_id", {
      x: 7.5, y: 1.5, w: 2, h: 1.2,
      fontSize: 9, color: "f57c00", align: "center", valign: "middle"
    });
    // Campus Drives
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.5, y: 3.5, w: 2, h: 1.2,
      fill: { color: "fce4ec" },
      line: { color: "c2185b", width: 2 }
    });
    slide.addText("campus_drives\n• id\n• company_id\n• drive_date", {
      x: 0.5, y: 3.5, w: 2, h: 1.2,
      fontSize: 9, color: "c2185b", align: "center", valign: "middle"
    });
    // Email Logs
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 4, y: 3.5, w: 2, h: 1.2,
      fill: { color: "f3e5f5" },
      line: { color: "7b1fa2", width: 2 }
    });
    slide.addText("email_logs\n• id\n• company_name\n• status", {
      x: 4, y: 3.5, w: 2, h: 1.2,
      fontSize: 9, color: "7b1fa2", align: "center", valign: "middle"
    });
    // Blocked Dates
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 7.5, y: 3.5, w: 2, h: 1.2,
      fill: { color: "ffebee" },
      line: { color: "d32f2f", width: 2 }
    });
    slide.addText("blocked_dates\n• id\n• start_date\n• end_date", {
      x: 7.5, y: 3.5, w: 2, h: 1.2,
      fontSize: 9, color: "d32f2f", align: "center", valign: "middle"
    });
    slide.addText("Relationships: companies → tasks, companies → campus_drives, companies → email_logs", {
      x: 0.5, y: 5, w: 9, h: 0.4,
      fontSize: 11, color: "666666", align: "center"
    });

    // Slide 13: Screenshot - Login Page
    slide = pptx.addSlide();
    slide.addText("Screenshot: Login Page", {
      x: 0.5, y: 0.5, w: 9, h: 0.8,
      fontSize: 28, bold: true, color: "1e3a5f"
    });
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1.5, y: 1.3, w: 7, h: 4,
      fill: { color: "f5f5f5" },
      line: { color: "cccccc", width: 2 }
    });
    slide.addText("[ Login Page Screenshot ]\n\nFeatures:\n• Email & Password Authentication\n• Remember Me Option\n• Register Link\n• Forgot Password", {
      x: 1.5, y: 1.3, w: 7, h: 4,
      fontSize: 14, color: "666666", align: "center", valign: "middle"
    });

    // Slide 14: Screenshot - Dashboard
    slide = pptx.addSlide();
    slide.addText("Screenshot: Dashboard", {
      x: 0.5, y: 0.5, w: 9, h: 0.8,
      fontSize: 28, bold: true, color: "1e3a5f"
    });
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1.5, y: 1.3, w: 7, h: 4,
      fill: { color: "f5f5f5" },
      line: { color: "cccccc", width: 2 }
    });
    slide.addText("[ Dashboard Screenshot ]\n\nFeatures:\n• Summary Statistics Cards\n• Recent Companies List\n• Pending Tasks Overview\n• Quick Action Buttons", {
      x: 1.5, y: 1.3, w: 7, h: 4,
      fontSize: 14, color: "666666", align: "center", valign: "middle"
    });

    // Slide 15: Screenshot - Companies List
    slide = pptx.addSlide();
    slide.addText("Screenshot: Companies Management", {
      x: 0.5, y: 0.5, w: 9, h: 0.8,
      fontSize: 28, bold: true, color: "1e3a5f"
    });
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1.5, y: 1.3, w: 7, h: 4,
      fill: { color: "f5f5f5" },
      line: { color: "cccccc", width: 2 }
    });
    slide.addText("[ Companies Page Screenshot ]\n\nFeatures:\n• Company Cards with Status\n• Search & Filter Options\n• Add New Company Button\n• Quick Actions (Email, Schedule)", {
      x: 1.5, y: 1.3, w: 7, h: 4,
      fontSize: 14, color: "666666", align: "center", valign: "middle"
    });

    // Slide 16: Screenshot - Task Management
    slide = pptx.addSlide();
    slide.addText("Screenshot: Task Management", {
      x: 0.5, y: 0.5, w: 9, h: 0.8,
      fontSize: 28, bold: true, color: "1e3a5f"
    });
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1.5, y: 1.3, w: 7, h: 4,
      fill: { color: "f5f5f5" },
      line: { color: "cccccc", width: 2 }
    });
    slide.addText("[ Tasks Page Screenshot ]\n\nFeatures:\n• Task Cards with Priority Badges\n• Status Filters (Pending/In Progress/Done)\n• Due Date Display\n• Company Association", {
      x: 1.5, y: 1.3, w: 7, h: 4,
      fontSize: 14, color: "666666", align: "center", valign: "middle"
    });

    // Slide 17: Screenshot - Scheduling
    slide = pptx.addSlide();
    slide.addText("Screenshot: Scheduling System", {
      x: 0.5, y: 0.5, w: 9, h: 0.8,
      fontSize: 28, bold: true, color: "1e3a5f"
    });
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1.5, y: 1.3, w: 7, h: 4,
      fill: { color: "f5f5f5" },
      line: { color: "cccccc", width: 2 }
    });
    slide.addText("[ Scheduling Page Screenshot ]\n\nFeatures:\n• Campus Drive Calendar\n• Blocked Dates List\n• Date Request Workflow\n• Conflict Detection", {
      x: 1.5, y: 1.3, w: 7, h: 4,
      fontSize: 14, color: "666666", align: "center", valign: "middle"
    });

    // Slide 18: Screenshot - Admin Panel
    slide = pptx.addSlide();
    slide.addText("Screenshot: Admin Panel", {
      x: 0.5, y: 0.5, w: 9, h: 0.8,
      fontSize: 28, bold: true, color: "1e3a5f"
    });
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1.5, y: 1.3, w: 7, h: 4,
      fill: { color: "f5f5f5" },
      line: { color: "cccccc", width: 2 }
    });
    slide.addText("[ Admin Panel Screenshot ]\n\nFeatures:\n• User Approval Management\n• System Statistics\n• Coordinator List\n• Pending Approval Requests", {
      x: 1.5, y: 1.3, w: 7, h: 4,
      fontSize: 14, color: "666666", align: "center", valign: "middle"
    });

    // Slide 19: Key Features - Company Management
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

    // Slide 20: Key Features - Task Management
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

    // Slide 21: Key Features - Scheduling
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

    // Slide 22: Key Features - Email System
    slide = pptx.addSlide();
    slide.addText("Feature: Email System", {
      x: 0.5, y: 0.5, w: 9, h: 0.8,
      fontSize: 28, bold: true, color: "1e3a5f"
    });
    const emailFeatures = [
      "AI-powered email generation using OpenAI API",
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

    // Slide 23: Security Features
    slide = pptx.addSlide();
    slide.addText("Security Implementation", {
      x: 0.5, y: 0.5, w: 9, h: 0.8,
      fontSize: 28, bold: true, color: "1e3a5f"
    });
    const securityFeatures = [
      "JWT-based authentication with Supabase Auth",
      "Admin approval required for new coordinators",
      "Row Level Security (RLS) on all tables",
      "Role-based access control functions",
      "Protected routes for authenticated users",
      "Secure API calls with auth tokens",
      "Input validation with Zod schema",
      "HTTPS encryption for data in transit"
    ];
    securityFeatures.forEach((feature, i) => {
      slide.addText(`🔒 ${feature}`, {
        x: 0.7, y: 1.3 + i * 0.5, w: 8.5, h: 0.5,
        fontSize: 15, color: "333333"
      });
    });

    // Slide 24: Backend APIs (Edge Functions)
    slide = pptx.addSlide();
    slide.addText("Backend APIs (Edge Functions)", {
      x: 0.5, y: 0.5, w: 9, h: 0.8,
      fontSize: 28, bold: true, color: "1e3a5f"
    });
    const edgeFunctions = [
      { name: "POST /create-coordinator", desc: "Creates new coordinator user accounts" },
      { name: "POST /generate-email", desc: "AI-powered email content generation" },
      { name: "POST /send-email", desc: "Sends emails via SMTP configuration" },
      { name: "POST /extract-pdf-data", desc: "Extracts structured data from PDFs" }
    ];
    edgeFunctions.forEach((func, i) => {
      slide.addText(`${func.name}`, {
        x: 0.7, y: 1.5 + i * 0.9, w: 4, h: 0.5,
        fontSize: 14, bold: true, color: "1e3a5f", fontFace: "Courier New"
      });
      slide.addText(`${func.desc}`, {
        x: 4.8, y: 1.5 + i * 0.9, w: 4.7, h: 0.5,
        fontSize: 13, color: "666666"
      });
    });
    slide.addText("All APIs are secured with JWT authentication and role-based access control", {
      x: 0.5, y: 5, w: 9, h: 0.4,
      fontSize: 11, color: "888888", align: "center"
    });

    // Slide 25: Code Snippet - React Component
    slide = pptx.addSlide();
    slide.addText("Code Sample: React Component", {
      x: 0.5, y: 0.5, w: 9, h: 0.8,
      fontSize: 28, bold: true, color: "1e3a5f"
    });
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.5, y: 1.3, w: 9, h: 4,
      fill: { color: "1e1e1e" },
      line: { color: "333333", width: 1 }
    });
    const codeSnippet = `// CompanyCard.tsx
export function CompanyCard({ company }: Props) {
  const { mutate: updateStatus } = useUpdateCompany();
  
  return (
    <Card className="hover:shadow-lg transition">
      <CardHeader>
        <CardTitle>{company.name}</CardTitle>
        <Badge>{company.status}</Badge>
      </CardHeader>
      <CardContent>
        <p>POC: {company.poc_1st}</p>
        <p>Package: {company.package_offered}</p>
      </CardContent>
    </Card>
  );
}`;
    slide.addText(codeSnippet, {
      x: 0.7, y: 1.5, w: 8.6, h: 3.6,
      fontSize: 10, color: "d4d4d4", fontFace: "Courier New", valign: "top"
    });

    // Slide 26: Code Snippet - Supabase Query
    slide = pptx.addSlide();
    slide.addText("Code Sample: Supabase Query", {
      x: 0.5, y: 0.5, w: 9, h: 0.8,
      fontSize: 28, bold: true, color: "1e3a5f"
    });
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.5, y: 1.3, w: 9, h: 4,
      fill: { color: "1e1e1e" },
      line: { color: "333333", width: 1 }
    });
    const dbCodeSnippet = `// useCompanies.ts - Custom Hook
export function useCompanies() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });
}`;
    slide.addText(dbCodeSnippet, {
      x: 0.7, y: 1.5, w: 8.6, h: 3.6,
      fontSize: 10, color: "d4d4d4", fontFace: "Courier New", valign: "top"
    });

    // Slide 27: Testing & Quality Assurance
    slide = pptx.addSlide();
    slide.addText("Testing & Quality Assurance", {
      x: 0.5, y: 0.5, w: 9, h: 0.8,
      fontSize: 28, bold: true, color: "1e3a5f"
    });
    const testingItems = [
      "Manual testing of all user workflows",
      "Cross-browser compatibility testing",
      "Responsive design testing on multiple devices",
      "API endpoint testing with sample data",
      "Authentication flow validation",
      "Role-based access control verification",
      "Edge case handling and error scenarios",
      "Performance testing for database queries"
    ];
    testingItems.forEach((item, i) => {
      slide.addText(`✓ ${item}`, {
        x: 0.7, y: 1.3 + i * 0.5, w: 8.5, h: 0.5,
        fontSize: 15, color: "2d5a3d"
      });
    });

    // Slide 28: Challenges & Solutions
    slide = pptx.addSlide();
    slide.addText("Challenges & Solutions", {
      x: 0.5, y: 0.5, w: 9, h: 0.8,
      fontSize: 28, bold: true, color: "1e3a5f"
    });
    const challenges = [
      { challenge: "Complex role management", solution: "Implemented RLS + database functions" },
      { challenge: "Real-time data sync", solution: "TanStack Query with cache invalidation" },
      { challenge: "Form validation", solution: "React Hook Form + Zod schemas" },
      { challenge: "Responsive layouts", solution: "Tailwind CSS responsive utilities" },
      { challenge: "AI integration", solution: "Edge functions with OpenAI API" }
    ];
    challenges.forEach((item, i) => {
      slide.addText(`Challenge: ${item.challenge}`, {
        x: 0.7, y: 1.3 + i * 0.8, w: 8.5, h: 0.4,
        fontSize: 14, bold: true, color: "c2185b"
      });
      slide.addText(`Solution: ${item.solution}`, {
        x: 0.7, y: 1.65 + i * 0.8, w: 8.5, h: 0.4,
        fontSize: 13, color: "388e3c"
      });
    });

    // Slide 29: Future Scope
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
      "Push notifications for real-time updates",
      "Automated report generation (PDF/Excel)",
      "Company feedback and rating system"
    ];
    futureFeatures.forEach((feature, i) => {
      slide.addText(`→ ${feature}`, {
        x: 0.7, y: 1.3 + i * 0.5, w: 8.5, h: 0.5,
        fontSize: 15, color: "333333"
      });
    });

    // Slide 30: Conclusion
    slide = pptx.addSlide();
    slide.addText("Conclusion", {
      x: 0.5, y: 0.5, w: 9, h: 0.8,
      fontSize: 28, bold: true, color: "1e3a5f"
    });
    const conclusions = [
      "Successfully developed a comprehensive placement management system",
      "Implemented secure role-based access control",
      "Integrated AI capabilities for email generation",
      "Created an intuitive and responsive user interface",
      "Established a scalable database architecture",
      "Delivered a production-ready application"
    ];
    conclusions.forEach((item, i) => {
      slide.addText(`✓ ${item}`, {
        x: 0.7, y: 1.4 + i * 0.6, w: 8.5, h: 0.5,
        fontSize: 16, color: "2d5a3d"
      });
    });

    // Slide 31: References
    slide = pptx.addSlide();
    slide.addText("References", {
      x: 0.5, y: 0.5, w: 9, h: 0.8,
      fontSize: 28, bold: true, color: "1e3a5f"
    });
    const references = [
      "React Documentation - https://react.dev",
      "Supabase Documentation - https://supabase.com/docs",
      "TypeScript Handbook - https://typescriptlang.org/docs",
      "Tailwind CSS Documentation - https://tailwindcss.com/docs",
      "TanStack Query Documentation - https://tanstack.com/query",
      "shadcn/ui Components - https://ui.shadcn.com",
      "PostgreSQL Documentation - https://postgresql.org/docs"
    ];
    references.forEach((ref, i) => {
      slide.addText(`${i + 1}. ${ref}`, {
        x: 0.7, y: 1.4 + i * 0.55, w: 8.5, h: 0.5,
        fontSize: 14, color: "333333"
      });
    });

    // Slide 32: Thank You
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
              <h3 className="font-semibold">Presentation Includes (32 Slides):</h3>
              <ul className="text-sm text-muted-foreground space-y-1 grid grid-cols-2 gap-1">
                <li>• Title & Team Members</li>
                <li>• Problem Statement</li>
                <li>• Project Objectives</li>
                <li>• Solution Overview</li>
                <li>• Frontend Technology Stack</li>
                <li>• Backend Technology Stack</li>
                <li>• System Architecture</li>
                <li>• Data Flow Diagram</li>
                <li>• User Roles & Permissions</li>
                <li>• Database Schema</li>
                <li>• ER Diagram</li>
                <li>• Screenshots (6 slides)</li>
                <li>• Feature Details (4 slides)</li>
                <li>• Security Implementation</li>
                <li>• Backend APIs</li>
                <li>• Code Samples (2 slides)</li>
                <li>• Testing & QA</li>
                <li>• Challenges & Solutions</li>
                <li>• Future Scope</li>
                <li>• Conclusion & References</li>
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
              <p className="text-center text-sm text-muted-foreground">
                ✓ Presentation generated successfully! Check your downloads folder.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
