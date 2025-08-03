import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { z } from "zod";

const supportRequestSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(5),
  category: z.enum(["bug", "feature", "billing", "technical", "general"]),
  message: z.string().min(10),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    
    // Validate the request data
    const validatedData = supportRequestSchema.parse(body);
    
    // In a real app, you might want to:
    // 1. Save to database
    // 2. Send email notification
    // 3. Create a ticket in your support system
    
    // For now, we'll just log it and return success
    console.log("Support request received:", {
      ...validatedData,
      userId: user?.id || "anonymous",
      timestamp: new Date().toISOString(),
    });

    // Here you could integrate with:
    // - Email service (Resend, SendGrid)
    // - Support tools (Intercom, Zendesk)
    // - Slack/Discord webhooks
    // - Database storage

    return NextResponse.json(
      { message: "Support request received successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing support request:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
