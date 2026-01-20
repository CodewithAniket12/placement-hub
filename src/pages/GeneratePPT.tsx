import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Loader2, CheckCircle } from "lucide-react";
import pptxgen from "pptxgenjs";
import { toast } from "sonner";

// Import screenshots and diagrams
import loginScreenshot from "@/assets/screenshots/login-page.png";
import dashboardMockup from "@/assets/screenshots/dashboard-mockup.png";
import companiesMockup from "@/assets/screenshots/companies-mockup.png";
import adminMockup from "@/assets/screenshots/admin-mockup.png";
import erDiagram from "@/assets/diagrams/er-diagram.png";
import useCaseDiagram from "@/assets/diagrams/use-case-diagram.png";

export default function GeneratePPT() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const generatePPT = async () => {
    setIsGenerating(true);
    setIsComplete(false);

    try {
      const pptx = new pptxgen();
      pptx.author = "Aniket Madavi";
      pptx.title = "PlaceCell - Campus Placement Management System";
      pptx.subject = "Mini Project Presentation";

      // Slide 1: Title
      let slide = pptx.addSlide();
      slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: "1e3a8a" } });
      slide.addText("PlaceCell", {
        x: 0.5, y: 1.5, w: 9, h: 1.2,
        fontSize: 52, bold: true, color: "FFFFFF",
        align: "center"
      });
      slide.addText("Campus Placement Management System", {
        x: 0.5, y: 2.7, w: 9, h: 0.6,
        fontSize: 22, color: "93c5fd",
        align: "center"
      });
      slide.addText("Mini Project Presentation\nComputer Engineering Department\nAcademic Year 2024-25", {
        x: 0.5, y: 3.6, w: 9, h: 1.2,
        fontSize: 14, color: "bfdbfe",
        align: "center"
      });

      // Slide 2: Project Details (Solo Project)
      slide = pptx.addSlide();
      slide.addText("Project Details", {
        x: 0.5, y: 0.5, w: 9, h: 0.8,
        fontSize: 28, bold: true, color: "1e3a8a"
      });
      // Student info box
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 2, y: 1.5, w: 6, h: 1.8,
        fill: { color: "dbeafe" },
        line: { color: "3b82f6", width: 2 }
      });
      slide.addText("Developed By", {
        x: 2, y: 1.6, w: 6, h: 0.5,
        fontSize: 14, color: "64748b", align: "center"
      });
      slide.addText("Aniket Madavi", {
        x: 2, y: 2.1, w: 6, h: 0.6,
        fontSize: 22, bold: true, color: "1e3a8a", align: "center"
      });
      slide.addText("Roll Number: 24112038", {
        x: 2, y: 2.7, w: 6, h: 0.5,
        fontSize: 16, color: "3b82f6", align: "center"
      });
      // Guide info box
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 2, y: 3.6, w: 6, h: 1.3,
        fill: { color: "dcfce7" },
        line: { color: "16a34a", width: 2 }
      });
      slide.addText("Project Guide", {
        x: 2, y: 3.7, w: 6, h: 0.4,
        fontSize: 14, color: "64748b", align: "center"
      });
      slide.addText("Prof. Pallavi Mam", {
        x: 2, y: 4.2, w: 6, h: 0.6,
        fontSize: 20, bold: true, color: "16a34a", align: "center"
      });

      // Slide 3: What is PlaceCell?
      slide = pptx.addSlide();
      slide.addText("What is PlaceCell?", {
        x: 0.5, y: 0.5, w: 9, h: 0.8,
        fontSize: 28, bold: true, color: "1e3a8a"
      });
      const whatIs = [
        "A website to manage campus placement activities",
        "Helps coordinators track companies visiting campus",
        "Schedule campus drives and track their status",
        "Send emails to HR with templates",
        "Makes placement work organized and paperless"
      ];
      whatIs.forEach((item, i) => {
        slide.addText(`• ${item}`, {
          x: 0.7, y: 1.5 + i * 0.6, w: 8.5, h: 0.5,
          fontSize: 16, color: "333333"
        });
      });

      // Slide 4: Problem We Are Solving
      slide = pptx.addSlide();
      slide.addText("Problem We Are Solving", {
        x: 0.5, y: 0.5, w: 9, h: 0.8,
        fontSize: 28, bold: true, color: "1e3a8a"
      });
      const problems = [
        "Placement work managed using Excel - hard to track",
        "No proper record of scheduled campus drives",
        "Coordinators forget important tasks and deadlines",
        "No history of emails sent to companies",
        "Admin has no clear view of placement activities"
      ];
      problems.forEach((item, i) => {
        slide.addText(`✗ ${item}`, {
          x: 0.7, y: 1.5 + i * 0.6, w: 8.5, h: 0.5,
          fontSize: 16, color: "dc2626"
        });
      });

      // Slide 5: How PlaceCell Helps
      slide = pptx.addSlide();
      slide.addText("How PlaceCell Helps", {
        x: 0.5, y: 0.5, w: 9, h: 0.8,
        fontSize: 28, bold: true, color: "1e3a8a"
      });
      const solutions = [
        "All company information in one place",
        "Schedule drives and see status (upcoming/completed)",
        "Task reminders for deadlines",
        "Email templates for quick HR communication",
        "Dashboard shows all important statistics"
      ];
      solutions.forEach((item, i) => {
        slide.addText(`✓ ${item}`, {
          x: 0.7, y: 1.5 + i * 0.6, w: 8.5, h: 0.5,
          fontSize: 16, color: "16a34a"
        });
      });

      // Slide 6: Who Uses PlaceCell?
      slide = pptx.addSlide();
      slide.addText("Who Uses PlaceCell?", {
        x: 0.5, y: 0.5, w: 9, h: 0.8,
        fontSize: 28, bold: true, color: "1e3a8a"
      });
      // Admin box
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.5, y: 1.5, w: 4, h: 3,
        fill: { color: "fce7f3" },
        line: { color: "db2777", width: 2 }
      });
      slide.addText("ADMIN", {
        x: 0.5, y: 1.6, w: 4, h: 0.5,
        fontSize: 18, bold: true, color: "db2777", align: "center"
      });
      const adminTasks = ["Approves new coordinators", "Manages all companies", "Blocks dates for holidays", "Views all drives & activities"];
      adminTasks.forEach((task, i) => {
        slide.addText(`• ${task}`, {
          x: 0.7, y: 2.3 + i * 0.5, w: 3.6, h: 0.4,
          fontSize: 12, color: "333333"
        });
      });
      // Coordinator box
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 5.5, y: 1.5, w: 4, h: 3,
        fill: { color: "dbeafe" },
        line: { color: "2563eb", width: 2 }
      });
      slide.addText("COORDINATOR", {
        x: 5.5, y: 1.6, w: 4, h: 0.5,
        fontSize: 18, bold: true, color: "2563eb", align: "center"
      });
      const coordTasks = ["Manages assigned companies", "Creates and tracks tasks", "Schedules campus drives", "Sends emails to HRs"];
      coordTasks.forEach((task, i) => {
        slide.addText(`• ${task}`, {
          x: 5.7, y: 2.3 + i * 0.5, w: 3.6, h: 0.4,
          fontSize: 12, color: "333333"
        });
      });

      // Slide 7: Use Case Diagram
      slide = pptx.addSlide();
      slide.addText("Use Case Diagram", {
        x: 0.5, y: 0.3, w: 9, h: 0.6,
        fontSize: 28, bold: true, color: "1e3a8a"
      });
      slide.addImage({
        path: useCaseDiagram,
        x: 0.5, y: 1, w: 9, h: 4.2
      });

      // Slide 8: Technology Used
      slide = pptx.addSlide();
      slide.addText("Technology Used", {
        x: 0.5, y: 0.5, w: 9, h: 0.8,
        fontSize: 28, bold: true, color: "1e3a8a"
      });
      const tech = [
        { name: "React.js", desc: "For building the website interface" },
        { name: "TypeScript", desc: "For writing error-free code" },
        { name: "Tailwind CSS", desc: "For modern and clean design" },
        { name: "Node.js", desc: "Backend server for business logic" },
        { name: "Supabase", desc: "Database and authentication" }
      ];
      tech.forEach((t, i) => {
        slide.addText(t.name, {
          x: 0.7, y: 1.4 + i * 0.65, w: 2.5, h: 0.5,
          fontSize: 16, bold: true, color: "1e3a8a"
        });
        slide.addText(t.desc, {
          x: 3.2, y: 1.4 + i * 0.65, w: 6.3, h: 0.5,
          fontSize: 14, color: "666666"
        });
      });

      // Slide 9: Key Features
      slide = pptx.addSlide();
      slide.addText("Key Features", {
        x: 0.5, y: 0.5, w: 9, h: 0.8,
        fontSize: 28, bold: true, color: "1e3a8a"
      });
      const features = [
        { title: "Company Management", desc: "Add, track, and manage visiting companies" },
        { title: "Drive Scheduling", desc: "Schedule drives and track status (upcoming/past)" },
        { title: "Task Management", desc: "Create tasks with priorities and deadlines" },
        { title: "Email System", desc: "AI-powered email templates and history" },
        { title: "Admin Panel", desc: "User approval and activity monitoring" },
        { title: "Dashboard", desc: "Statistics and quick overview" }
      ];
      features.forEach((f, i) => {
        const xPos = (i % 2) * 4.5 + 0.5;
        const yPos = Math.floor(i / 2) * 1.3 + 1.4;
        slide.addShape(pptx.ShapeType.roundRect, {
          x: xPos, y: yPos, w: 4.2, h: 1,
          fill: { color: "f0f9ff" },
          line: { color: "3b82f6", width: 1 }
        });
        slide.addText(f.title, {
          x: xPos + 0.15, y: yPos + 0.1, w: 4, h: 0.4,
          fontSize: 13, bold: true, color: "1e3a8a"
        });
        slide.addText(f.desc, {
          x: xPos + 0.15, y: yPos + 0.5, w: 4, h: 0.4,
          fontSize: 10, color: "64748b"
        });
      });

      // Slide 10: Screenshot - Login
      slide = pptx.addSlide();
      slide.addText("Screenshot: Login Page", {
        x: 0.5, y: 0.3, w: 9, h: 0.6,
        fontSize: 28, bold: true, color: "1e3a8a"
      });
      slide.addImage({
        path: loginScreenshot,
        x: 1.5, y: 1, w: 7, h: 4.2
      });
      slide.addText("Secure login with email and password authentication", {
        x: 0.5, y: 5.3, w: 9, h: 0.3,
        fontSize: 11, color: "64748b", align: "center", italic: true
      });

      // Slide 11: Screenshot - Dashboard
      slide = pptx.addSlide();
      slide.addText("Screenshot: Dashboard", {
        x: 0.5, y: 0.3, w: 9, h: 0.6,
        fontSize: 28, bold: true, color: "1e3a8a"
      });
      slide.addImage({
        path: dashboardMockup,
        x: 0.5, y: 1, w: 9, h: 4.2
      });
      slide.addText("Shows assigned companies, quick stats, and actions", {
        x: 0.5, y: 5.3, w: 9, h: 0.3,
        fontSize: 11, color: "64748b", align: "center", italic: true
      });

      // Slide 12: Screenshot - Companies
      slide = pptx.addSlide();
      slide.addText("Screenshot: Companies Page", {
        x: 0.5, y: 0.3, w: 9, h: 0.6,
        fontSize: 28, bold: true, color: "1e3a8a"
      });
      slide.addImage({
        path: companiesMockup,
        x: 0.5, y: 1, w: 9, h: 4.2
      });
      slide.addText("Manage all companies with status tracking and filters", {
        x: 0.5, y: 5.3, w: 9, h: 0.3,
        fontSize: 11, color: "64748b", align: "center", italic: true
      });

      // Slide 13: Screenshot - Admin Panel
      slide = pptx.addSlide();
      slide.addText("Screenshot: Admin Panel", {
        x: 0.5, y: 0.3, w: 9, h: 0.6,
        fontSize: 28, bold: true, color: "1e3a8a"
      });
      slide.addImage({
        path: adminMockup,
        x: 0.5, y: 1, w: 9, h: 4.2
      });
      slide.addText("User approval, blocked dates, and company oversight", {
        x: 0.5, y: 5.3, w: 9, h: 0.3,
        fontSize: 11, color: "64748b", align: "center", italic: true
      });

      // Slide 14: ER Diagram
      slide = pptx.addSlide();
      slide.addText("ER Diagram", {
        x: 0.5, y: 0.3, w: 9, h: 0.6,
        fontSize: 28, bold: true, color: "1e3a8a"
      });
      slide.addImage({
        path: erDiagram,
        x: 0.3, y: 1, w: 9.4, h: 4.2
      });

      // Slide 15: Database Tables
      slide = pptx.addSlide();
      slide.addText("Database Tables", {
        x: 0.5, y: 0.5, w: 9, h: 0.8,
        fontSize: 28, bold: true, color: "1e3a8a"
      });
      const tables = [
        { name: "profiles", desc: "User info & roles" },
        { name: "companies", desc: "Company details (name, HR, package)" },
        { name: "campus_drives", desc: "Scheduled drives with date & status" },
        { name: "tasks", desc: "To-do items with priority" },
        { name: "email_logs", desc: "Record of all emails sent" },
        { name: "blocked_dates", desc: "Holidays & exam dates" }
      ];
      tables.forEach((table, i) => {
        const yPos = 1.4 + i * 0.7;
        slide.addShape(pptx.ShapeType.roundRect, {
          x: 0.5, y: yPos, w: 2.8, h: 0.55,
          fill: { color: "1e3a8a" }
        });
        slide.addText(table.name, {
          x: 0.5, y: yPos, w: 2.8, h: 0.55,
          fontSize: 12, bold: true, color: "FFFFFF", align: "center", valign: "middle"
        });
        slide.addText(table.desc, {
          x: 3.5, y: yPos, w: 6, h: 0.55,
          fontSize: 13, color: "333333", valign: "middle"
        });
      });

      // Slide 16: Security Implementation
      slide = pptx.addSlide();
      slide.addText("Security Implementation", {
        x: 0.5, y: 0.5, w: 9, h: 0.8,
        fontSize: 28, bold: true, color: "1e3a8a"
      });
      const security = [
        { title: "Password Encryption", desc: "All passwords are hashed - cannot be read" },
        { title: "JWT Authentication", desc: "Secure tokens for login sessions" },
        { title: "Row Level Security", desc: "Users only see their own data" },
        { title: "Role-Based Access", desc: "Admin & Coordinator have different permissions" },
        { title: "Input Validation", desc: "All inputs checked to prevent attacks" }
      ];
      security.forEach((item, i) => {
        const yPos = 1.3 + i * 0.7;
        slide.addText(`🔒 ${item.title}`, {
          x: 0.7, y: yPos, w: 3.5, h: 0.6,
          fontSize: 14, bold: true, color: "16a34a"
        });
        slide.addText(item.desc, {
          x: 4.2, y: yPos, w: 5.3, h: 0.6,
          fontSize: 12, color: "333333"
        });
      });

      // Slide 17: Conclusion
      slide = pptx.addSlide();
      slide.addText("Conclusion", {
        x: 0.5, y: 0.5, w: 9, h: 0.8,
        fontSize: 28, bold: true, color: "1e3a8a"
      });
      const conclusion = [
        "PlaceCell makes placement work easy and organized",
        "Track companies, schedule drives, send emails in one place",
        "Secure login with role-based access",
        "Saves time by replacing manual Excel work",
        "Ready to use for real campus placements"
      ];
      conclusion.forEach((item, i) => {
        slide.addText(`✓ ${item}`, {
          x: 0.7, y: 1.5 + i * 0.6, w: 8.5, h: 0.5,
          fontSize: 16, color: "16a34a"
        });
      });

      // Slide 18: Thank You
      slide = pptx.addSlide();
      slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: "1e3a8a" } });
      slide.addText("Thank You!", {
        x: 0.5, y: 1.8, w: 9, h: 1,
        fontSize: 48, bold: true, color: "FFFFFF", align: "center"
      });
      slide.addText("Questions & Discussion", {
        x: 0.5, y: 3, w: 9, h: 0.6,
        fontSize: 22, color: "93c5fd", align: "center"
      });
      slide.addText("Aniket Madavi | Roll No: 24112038", {
        x: 0.5, y: 4, w: 9, h: 0.5,
        fontSize: 16, color: "bfdbfe", align: "center"
      });
      slide.addText("Guide: Prof. Pallavi Mam", {
        x: 0.5, y: 4.5, w: 9, h: 0.5,
        fontSize: 14, color: "bfdbfe", align: "center"
      });

      // Save
      await pptx.writeFile({ fileName: "PlaceCell_Presentation.pptx" });
      toast.success("Presentation downloaded successfully!");
      setIsComplete(true);
    } catch (error) {
      console.error("Error generating presentation:", error);
      toast.error("Failed to generate presentation");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">PlaceCell Presentation</CardTitle>
          <CardDescription>Campus Placement Management System</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">Contains 18 slides with:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Title & Project Details (Your name & Guide)</li>
              <li>• Problem & Solution</li>
              <li>• Use Case Diagram</li>
              <li>• Technology Stack</li>
              <li>• Screenshots (Login, Dashboard, Companies, Admin)</li>
              <li>• ER Diagram & Database Schema</li>
              <li>• Security Implementation</li>
              <li>• Conclusion & Thank You</li>
            </ul>
          </div>
          
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <p className="text-sm text-green-700">
              ✓ Aniket Madavi (24112038) | Guide: Prof. Pallavi Mam
            </p>
          </div>

          <Button 
            onClick={generatePPT} 
            disabled={isGenerating}
            className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : isComplete ? (
              <>
                <CheckCircle className="mr-2 h-5 w-5" />
                Download Complete!
              </>
            ) : (
              <>
                <Download className="mr-2 h-5 w-5" />
                Generate & Download PPT
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
