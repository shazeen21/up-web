"use client";

/**
 * ============================================================
 * NEWSLETTER SUBSCRIPTION COMPONENT
 * ============================================================
 * Collects email + name for newsletter signups.
 * Saves to Supabase newsletter_subscribers table.
 * Triggers welcome email flow automatically.
 * ============================================================
 */

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { sendWelcomeEmail } from "@/lib/email-service";
import { trackNewsletterSignup } from "@/lib/analytics";

export function NewsletterSignup({ className = "" }: { className?: string }) {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");

        try {
            const supabase = supabaseBrowser();

            // Save subscriber to database
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error } = await (supabase as any)
                .from("newsletter_subscribers")
                .upsert(
                    {
                        email: email.toLowerCase().trim(),
                        name: name.trim() || null,
                        subscribed_at: new Date().toISOString(),
                        active: true,
                    },
                    { onConflict: "email" }
                ) as { error: { message: string } | null };

            if (error && !error.message.includes("duplicate")) {
                throw error;
            }

            // Track analytics event
            trackNewsletterSignup(email);

            // Trigger welcome email flow
            if (name) {
                await sendWelcomeEmail({ name, email });
            }

            setStatus("success");
            setMessage("You're in! Check your inbox for a welcome gift 🎁");
            setEmail("");
            setName("");
        } catch (err) {
            console.error("Newsletter signup error:", err);
            setStatus("error");
            setMessage("Something went wrong. Please try again.");
        }
    };

    if (status === "success") {
        return (
            <div className={`rounded-2xl bg-[#670E10] p-6 text-center text-white ${className}`}>
                <div className="text-3xl mb-3">🎉</div>
                <p className="font-semibold text-lg mb-1">Welcome to the family!</p>
                <p className="text-sm text-white/80">{message}</p>
            </div>
        );
    }

    return (
        <div className={`rounded-2xl bg-[#670E10] p-6 md:p-8 ${className}`}>
            <h3 className="text-white font-bold text-xl mb-1">Join our community</h3>
            <p className="text-white/70 text-sm mb-5">
                Get early access to new collections, exclusive discounts, and gifting inspiration.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2.5 text-white 
                     placeholder:text-white/40 text-sm focus:outline-none focus:border-white/60"
                />
                <div className="flex gap-2">
                    <input
                        type="email"
                        required
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 rounded-lg bg-white/10 border border-white/20 px-4 py-2.5 text-white 
                       placeholder:text-white/40 text-sm focus:outline-none focus:border-white/60"
                    />
                    <button
                        type="submit"
                        disabled={status === "loading" || !email}
                        className="rounded-lg bg-[#f3cfc6] text-[#670E10] font-semibold px-5 py-2.5 text-sm
                       hover:bg-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed
                       whitespace-nowrap"
                    >
                        {status === "loading" ? "..." : "Subscribe"}
                    </button>
                </div>

                {status === "error" && (
                    <p className="text-red-300 text-xs">{message}</p>
                )}

                <p className="text-white/40 text-xs">
                    No spam, ever. Unsubscribe anytime.
                </p>
            </form>
        </div>
    );
}
