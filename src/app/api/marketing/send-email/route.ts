/**
 * ============================================================
 * API ROUTE: /api/marketing/send-email
 * ============================================================
 * Handles all outgoing marketing emails using Resend.
 * 
 * To activate: Add RESEND_API_KEY to your .env.local
 * Get your free key at: https://resend.com
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { to, toName, subject, html } = body;

        // ── Validate inputs ───────────────────────────────────────
        if (!to || !subject || !html) {
            return NextResponse.json(
                { success: false, error: "Missing required fields: to, subject, html" },
                { status: 400 }
            );
        }

        // Basic email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(to)) {
            return NextResponse.json(
                { success: false, error: "Invalid email address" },
                { status: 400 }
            );
        }

        const apiKey = process.env.RESEND_API_KEY;

        if (!apiKey) {
            // Development mode: log email to console instead of sending
            console.log("📧 [EMAIL - DEV MODE]");
            console.log("To:", to, toName ? `(${toName})` : "");
            console.log("Subject:", subject);
            console.log("(Set RESEND_API_KEY in .env.local to send real emails)");
            return NextResponse.json({ success: true, dev_mode: true });
        }

        // ── Send via Resend ───────────────────────────────────────
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: process.env.EMAIL_FROM ?? "Uphaar & Kyddoz <noreply@uphaarandkyddoz.com>",
                to: toName ? `${toName} <${to}>` : to,
                subject,
                html,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("[Email API] Resend error:", errorData);
            return NextResponse.json(
                { success: false, error: "Email service error" },
                { status: 500 }
            );
        }

        const data = await response.json();
        return NextResponse.json({ success: true, messageId: data.id });
    } catch (error) {
        console.error("[Email API] Unexpected error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
