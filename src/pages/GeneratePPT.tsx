import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Loader2, CheckCircle } from "lucide-react";
import pptxgen from "pptxgenjs";
import { toast } from "sonner";

export default function GeneratePPT() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const generatePPT = async () => {
    setIsGenerating(true);
    setIsComplete(false);

    try {
      const pptx = new pptxgen();
      pptx.author = "PlaceCell Team";
      pptx.title = "PlaceCell - Campus Placement Management System";
      pptx.subject = "Mini Project Presentation";

      // Slide 1: Title
      let slide = pptx.addSlide();
      slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: "1e3a8a" } });
      slide.addText("PlaceCell", {
        x: 0.5, y: 1.8, w: 9, h: 1.2,
        fontSize: 52, bold: true, color: "FFFFFF",
        align: "center"
      });
      slide.addText("Campus Placement Management System", {
        x: 0.5, y: 3, w: 9, h: 0.6,
        fontSize: 22, color: "93c5fd",
        align: "center"
      });
      slide.addText("Mini Project Presentation\nComputer Engineering Department\nAcademic Year 2024-25", {
        x: 0.5, y: 4, w: 9, h: 1.2,
        fontSize: 14, color: "bfdbfe",
        align: "center"
      });

      // Slide 2: Team Members
      slide = pptx.addSlide();
      slide.addText("Team Members", {
        x: 0.5, y: 0.5, w: 9, h: 0.8,
        fontSize: 28, bold: true, color: "1e3a8a"
      });
      const teamMembers = [
        { name: "Student Name 1", roll: "Roll No: XXX", color: "e0f2fe" },
        { name: "Student Name 2", roll: "Roll No: XXX", color: "dcfce7" },
        { name: "Student Name 3", roll: "Roll No: XXX", color: "fef3c7" },
        { name: "Student Name 4", roll: "Roll No: XXX", color: "fce7f3" }
      ];
      teamMembers.forEach((member, i) => {
        const xPos = (i % 2) * 4.5 + 0.5;
        const yPos = Math.floor(i / 2) * 1.8 + 1.6;
        slide.addShape(pptx.ShapeType.roundRect, {
          x: xPos, y: yPos, w: 4, h: 1.4,
          fill: { color: member.color },
          line: { color: "3b82f6", width: 1 }
        });
        slide.addText(`${member.name}\n${member.roll}`, {
          x: xPos, y: yPos, w: 4, h: 1.4,
          fontSize: 14, color: "1e3a8a", align: "center", valign: "middle"
        });
      });
      slide.addText("Guide: Prof. [Guide Name]", {
        x: 0.5, y: 5, w: 9, h: 0.4,
        fontSize: 14, bold: true, color: "1e3a8a", align: "center"
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
        "Keeps record of all emails, tasks and schedules",
        "Makes placement work organized and easy",
        "Replaces manual Excel sheets and paper work"
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
        "Coordinators forget important tasks and deadlines",
        "No proper record of emails sent to companies",
        "Scheduling campus drives is confusing",
        "Admin has no clear view of what's happening"
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
        "Task reminders for deadlines",
        "Email templates for quick communication",
        "Calendar view for scheduling drives",
        "Dashboard with all important statistics"
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
      const adminTasks = ["Approves new coordinators", "Manages all companies", "Blocks dates for holidays", "Views all activities"];
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

      // Slide 7: Technology Used
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
        { name: "Supabase", desc: "Database and authentication" },
        { name: "PostgreSQL", desc: "For storing all data securely" }
      ];
      tech.forEach((t, i) => {
        slide.addText(t.name, {
          x: 0.7, y: 1.4 + i * 0.55, w: 2.5, h: 0.5,
          fontSize: 16, bold: true, color: "1e3a8a"
        });
        slide.addText(t.desc, {
          x: 3.2, y: 1.4 + i * 0.55, w: 6.3, h: 0.5,
          fontSize: 14, color: "666666"
        });
      });

      // Slide 8: Main Features
      slide = pptx.addSlide();
      slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: "1e3a8a" } });
      slide.addText("Main Features", {
        x: 0.5, y: 2.2, w: 9, h: 1,
        fontSize: 40, bold: true, color: "FFFFFF", align: "center"
      });
      slide.addText("What you can do with PlaceCell", {
        x: 0.5, y: 3.3, w: 9, h: 0.6,
        fontSize: 18, color: "93c5fd", align: "center"
      });

      // Slide 9: Company Management
      slide = pptx.addSlide();
      slide.addText("Feature 1: Company Management", {
        x: 0.5, y: 0.5, w: 9, h: 0.8,
        fontSize: 28, bold: true, color: "1e3a8a"
      });
      const companyFeatures = [
        "Add new companies with all their details",
        "Track status: Contacted, In Progress, Confirmed, etc.",
        "Store HR contact information",
        "Add multiple contacts per company",
        "Keep notes about each company"
      ];
      companyFeatures.forEach((item, i) => {
        slide.addText(`• ${item}`, {
          x: 0.7, y: 1.5 + i * 0.6, w: 8.5, h: 0.5,
          fontSize: 16, color: "333333"
        });
      });

      // Slide 10: Task Management
      slide = pptx.addSlide();
      slide.addText("Feature 2: Task Management", {
        x: 0.5, y: 0.5, w: 9, h: 0.8,
        fontSize: 28, bold: true, color: "1e3a8a"
      });
      const taskFeatures = [
        "Create tasks with due dates",
        "Set priority: High, Medium, Low",
        "Mark as Pending, In Progress, Completed",
        "Link tasks to specific companies",
        "Never miss an important deadline"
      ];
      taskFeatures.forEach((item, i) => {
        slide.addText(`• ${item}`, {
          x: 0.7, y: 1.5 + i * 0.6, w: 8.5, h: 0.5,
          fontSize: 16, color: "333333"
        });
      });

      // Slide 11: Scheduling & Email
      slide = pptx.addSlide();
      slide.addText("Feature 3: Scheduling & Email", {
        x: 0.5, y: 0.5, w: 9, h: 0.8,
        fontSize: 28, bold: true, color: "1e3a8a"
      });
      const scheduleFeatures = [
        "Schedule campus drives on specific dates",
        "Block dates for exams and holidays",
        "Request dates for companies (needs admin approval)",
        "Pre-made email templates",
        "AI helps generate professional emails",
        "All sent emails are saved for future reference"
      ];
      scheduleFeatures.forEach((item, i) => {
        slide.addText(`• ${item}`, {
          x: 0.7, y: 1.4 + i * 0.55, w: 8.5, h: 0.5,
          fontSize: 15, color: "333333"
        });
      });

      // Slide 12: Screenshot - Login
      slide = pptx.addSlide();
      slide.addText("Screenshot: Login Page", {
        x: 0.5, y: 0.5, w: 9, h: 0.8,
        fontSize: 28, bold: true, color: "1e3a8a"
      });
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 1, y: 1.3, w: 8, h: 4,
        fill: { color: "f1f5f9" },
        line: { color: "cbd5e1", width: 2, dashType: "dash" }
      });
      slide.addText("📷 Add Login Page Screenshot Here", {
        x: 1, y: 2.8, w: 8, h: 0.8,
        fontSize: 18, color: "94a3b8", align: "center"
      });

      // Slide 13: Screenshot - Dashboard
      slide = pptx.addSlide();
      slide.addText("Screenshot: Dashboard", {
        x: 0.5, y: 0.5, w: 9, h: 0.8,
        fontSize: 28, bold: true, color: "1e3a8a"
      });
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 1, y: 1.3, w: 8, h: 4,
        fill: { color: "f1f5f9" },
        line: { color: "cbd5e1", width: 2, dashType: "dash" }
      });
      slide.addText("📷 Add Dashboard Screenshot Here", {
        x: 1, y: 2.8, w: 8, h: 0.8,
        fontSize: 18, color: "94a3b8", align: "center"
      });

      // Slide 14: Screenshot - Companies
      slide = pptx.addSlide();
      slide.addText("Screenshot: Companies Page", {
        x: 0.5, y: 0.5, w: 9, h: 0.8,
        fontSize: 28, bold: true, color: "1e3a8a"
      });
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 1, y: 1.3, w: 8, h: 4,
        fill: { color: "f1f5f9" },
        line: { color: "cbd5e1", width: 2, dashType: "dash" }
      });
      slide.addText("📷 Add Companies Page Screenshot Here", {
        x: 1, y: 2.8, w: 8, h: 0.8,
        fontSize: 18, color: "94a3b8", align: "center"
      });

      // Slide 15: Database Tables
      slide = pptx.addSlide();
      slide.addText("How Data is Stored", {
        x: 0.5, y: 0.5, w: 9, h: 0.8,
        fontSize: 28, bold: true, color: "1e3a8a"
      });
      const tables = [
        { name: "Users", desc: "Login info" },
        { name: "Companies", desc: "Company details" },
        { name: "Tasks", desc: "To-do items" },
        { name: "Drives", desc: "Campus drives" },
        { name: "Emails", desc: "Email records" },
        { name: "Blocked Dates", desc: "Holidays" }
      ];
      tables.forEach((table, i) => {
        const xPos = (i % 3) * 3 + 0.5;
        const yPos = Math.floor(i / 3) * 1.5 + 1.6;
        slide.addShape(pptx.ShapeType.roundRect, {
          x: xPos, y: yPos, w: 2.7, h: 1.1,
          fill: { color: "e0f2fe" },
          line: { color: "3b82f6", width: 1 }
        });
        slide.addText(`${table.name}\n${table.desc}`, {
          x: xPos, y: yPos, w: 2.7, h: 1.1,
          fontSize: 12, color: "1e3a8a", align: "center", valign: "middle"
        });
      });
      slide.addText("All tables are connected and data is kept secure", {
        x: 0.5, y: 4.8, w: 9, h: 0.4,
        fontSize: 12, color: "64748b", align: "center", italic: true
      });

      // Slide 16: Security
      slide = pptx.addSlide();
      slide.addText("Security Features", {
        x: 0.5, y: 0.5, w: 9, h: 0.8,
        fontSize: 28, bold: true, color: "1e3a8a"
      });
      const security = [
        "Passwords are encrypted - nobody can see them",
        "Only logged-in users can access the system",
        "Admin must approve new users",
        "Each user can only see their own data",
        "All actions are logged for safety"
      ];
      security.forEach((item, i) => {
        slide.addText(`🔒 ${item}`, {
          x: 0.7, y: 1.5 + i * 0.6, w: 8.5, h: 0.5,
          fontSize: 16, color: "333333"
        });
      });

      // Slide 17: Future Improvements
      slide = pptx.addSlide();
      slide.addText("Future Improvements", {
        x: 0.5, y: 0.5, w: 9, h: 0.8,
        fontSize: 28, bold: true, color: "1e3a8a"
      });
      const future = [
        "Mobile app for coordinators",
        "SMS notifications for updates",
        "Student portal to check status",
        "Calendar integration",
        "Detailed reports and analytics"
      ];
      future.forEach((item, i) => {
        slide.addText(`→ ${item}`, {
          x: 0.7, y: 1.5 + i * 0.6, w: 8.5, h: 0.5,
          fontSize: 16, color: "333333"
        });
      });

      // Slide 18: Conclusion
      slide = pptx.addSlide();
      slide.addText("Conclusion", {
        x: 0.5, y: 0.5, w: 9, h: 0.8,
        fontSize: 28, bold: true, color: "1e3a8a"
      });
      const conclusion = [
        "PlaceCell makes placement work easy and organized",
        "Saves time by automating repetitive tasks",
        "Keeps all placement data in one secure place",
        "Helps coordinators and admin work together",
        "Ready to use for real campus placements"
      ];
      conclusion.forEach((item, i) => {
        slide.addText(`✓ ${item}`, {
          x: 0.7, y: 1.5 + i * 0.6, w: 8.5, h: 0.5,
          fontSize: 16, color: "16a34a"
        });
      });

      // Slide 19: Thank You
      slide = pptx.addSlide();
      slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: "1e3a8a" } });
      slide.addText("Thank You!", {
        x: 0.5, y: 2, w: 9, h: 1,
        fontSize: 48, bold: true, color: "FFFFFF", align: "center"
      });
      slide.addText("Questions & Discussion", {
        x: 0.5, y: 3.2, w: 9, h: 0.6,
        fontSize: 22, color: "93c5fd", align: "center"
      });
      slide.addText("PlaceCell - Making Placements Simple", {
        x: 0.5, y: 4.5, w: 9, h: 0.5,
        fontSize: 16, color: "bfdbfe", align: "center"
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
            <h3 className="font-semibold text-blue-800 mb-2">Contains 19 slides:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Title, Team & Introduction</li>
              <li>• Problem & Solution</li>
              <li>• User Roles & Technology</li>
              <li>• Features (Company, Task, Scheduling)</li>
              <li>• Screenshots (3 placeholder slides)</li>
              <li>• Database, Security & Future Scope</li>
            </ul>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
            <p className="text-sm text-amber-700">
              📝 After download: Add screenshots and update team member names.
            </p>
          </div>

          <Button 
            onClick={generatePPT} 
            disabled={isGenerating}
            className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : isComplete ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Download Again
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Download PPT
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
