import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import nodemailer from "https://esm.sh/nodemailer@6.9.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SendEmailRequest {
  to: string;
  subject: string;
  body: string;
  companyName: string;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GMAIL_USER = Deno.env.get("GMAIL_USER");
    const GMAIL_PASS = Deno.env.get("GMAIL_PASS");

    if (!GMAIL_USER || !GMAIL_PASS) {
      console.error("Missing Gmail configuration");
      throw new Error("Gmail configuration is missing");
    }

    const { to, subject, body, companyName }: SendEmailRequest = await req.json();

    console.log(`Sending email to ${to} for company ${companyName}`);
    console.log(`Subject: ${subject}`);

    // Create transporter with Gmail service
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS,
      },
    });

    // Send the email
    const info = await transporter.sendMail({
      from: `Placement Coordinator <${GMAIL_USER}>`,
      to: to,
      subject: subject,
      html: body.replace(/\n/g, "<br>"),
    });

    console.log("Email sent successfully:", info.messageId);

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully", messageId: info.messageId }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
