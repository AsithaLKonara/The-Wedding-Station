import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import { addContactSubmission } from "@/lib/storage/contacts";
import type { ContactFormData, ContactApiResponse } from "@/types";

/**
 * POST /api/contact
 * Sends contact form email via SendGrid or SMTP
 */
export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    const { name, email, phone, message, subject } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json<ContactApiResponse>(
        {
          success: false,
          message: "Name, email, and message are required",
        },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json<ContactApiResponse>(
        {
          success: false,
          message: "Invalid email address",
        },
        { status: 400 }
      );
    }

    const sendGridKey = process.env.SENDGRID_API_KEY;
    const smtpUrl = process.env.SMTP_URL;
    const siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE || "The Wedding Station";
    const recipientEmail = process.env.CONTACT_EMAIL || process.env.SENDGRID_FROM_EMAIL || "contact@example.com";

    // Try SendGrid first
    if (sendGridKey) {
      try {
        sgMail.setApiKey(sendGridKey);

        const emailContent = {
          to: recipientEmail,
          from: process.env.SENDGRID_FROM_EMAIL || "noreply@example.com",
          subject: subject || `Contact Form: ${name}`,
          text: `
Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}

Message:
${message}
          `.trim(),
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap; background: #f5f5f5; padding: 15px; border-radius: 5px;">${message}</p>
            </div>
          `,
        };

        await sgMail.send(emailContent);

        // Save to storage
        await addContactSubmission({
          name,
          email,
          phone,
          message,
          subject,
        });

        return NextResponse.json<ContactApiResponse>({
          success: true,
          message: "Thank you! Your message has been sent successfully.",
        });
      } catch (error) {
        console.error("SendGrid error:", error);
        // Fall through to SMTP or error
      }
    }

    // Fallback to SMTP if configured
    if (smtpUrl) {
      try {
        // Parse SMTP URL: smtp://user:pass@host:port
        const url = new URL(smtpUrl);
        const nodemailer = (await import("nodemailer")).default;
        
        const transporter = nodemailer.createTransport({
          host: url.hostname,
          port: parseInt(url.port || "587", 10),
          secure: url.port === "465",
          auth: {
            user: url.username,
            pass: url.password,
          },
        });

        await transporter.sendMail({
          from: url.username,
          to: recipientEmail,
          subject: subject || `Contact Form: ${name}`,
          text: `
Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}

Message:
${message}
          `.trim(),
        });

        // Save to storage
        await addContactSubmission({
          name,
          email,
          phone,
          message,
          subject,
        });

        return NextResponse.json<ContactApiResponse>({
          success: true,
          message: "Thank you! Your message has been sent successfully.",
        });
      } catch (error) {
        console.error("SMTP error:", error);
      }
    }

    // No email service configured - still save the submission
    await addContactSubmission({
      name,
      email,
      phone,
      message,
      subject,
    });

    return NextResponse.json<ContactApiResponse>(
      {
        success: false,
        message: "Email service not configured. Your message has been saved and will be reviewed.",
        error: "No email service available",
      },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error in /api/contact:", error);
    return NextResponse.json<ContactApiResponse>(
      {
        success: false,
        message: "An error occurred while sending your message. Please try again later.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

