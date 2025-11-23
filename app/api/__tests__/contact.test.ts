import { POST } from "../contact/route";
import { NextRequest } from "next/server";

// Mock SendGrid
jest.mock("@sendgrid/mail", () => ({
  setApiKey: jest.fn(),
  send: jest.fn(),
}));

describe("POST /api/contact", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.SENDGRID_API_KEY = "test-key";
    process.env.SENDGRID_FROM_EMAIL = "test@example.com";
    process.env.CONTACT_EMAIL = "contact@example.com";
  });

  it("sends email successfully with SendGrid", async () => {
    const sgMail = require("@sendgrid/mail");
    sgMail.send.mockResolvedValueOnce([{ statusCode: 200 }]);

    const request = new NextRequest("http://localhost/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "John Doe",
        email: "john@example.com",
        message: "Test message",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(sgMail.send).toHaveBeenCalled();
  });

  it("validates required fields", async () => {
    const request = new NextRequest("http://localhost/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "John Doe",
        // Missing email and message
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });

  it("validates email format", async () => {
    const request = new NextRequest("http://localhost/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "John Doe",
        email: "invalid-email",
        message: "Test message",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });
});

