"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/Button";

type AuthFormProps = {
    onSuccess: () => void;
    view?: "login" | "signup";
};

export function AuthForm({ onSuccess, view = "login" }: AuthFormProps) {
    const supabase = supabaseBrowser();
    const [mode, setMode] = useState<"login" | "signup" | "reset">(view);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err?.message ?? "Google login failed");
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        setLoading(true);
        setError(null);
        setSuccessMsg(null);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/update-password`,
            });
            if (error) throw error;
            setSuccessMsg("Check your email for the password reset link.");
        } catch (err: any) {
            let msg = err?.message || "Failed to send reset email";
            if (msg.toLowerCase().includes("rate limit")) {
                msg = "Too many attempts. Please wait a while before trying again.";
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleAuth = async () => {
        setLoading(true);
        setError(null);
        try {
            if (mode === "signup") {
                const { data, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { name, phone },
                    },
                });
                if (signUpError) throw signUpError;

                if (data.user) {
                    const { error: profileError } = await (supabase as any).from("profiles").insert({
                        id: data.user.id,
                        email: email,
                        name: name,
                        phone: phone,
                        role: "user",
                    });
                    if (profileError) console.error("Profile creation failed:", profileError);
                }

                alert("Account created! Please check your email to confirm.");
                onSuccess();
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError) throw signInError;
                onSuccess();
            }
        } catch (err: any) {
            let msg = err?.message ?? "Authentication failed";
            if (msg.toLowerCase().includes("rate limit")) {
                msg = "Too many attempts. Please wait a moment before trying again.";
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="mb-6 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                    {mode === "login"
                        ? "Login"
                        : mode === "signup"
                            ? "Create Account"
                            : "Reset Password"}
                </h3>
            </div>

            <div className="space-y-4">
                {mode !== "reset" && (
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant={mode === "login" ? "primary" : "outline"}
                            onClick={() => setMode("login")}
                            className="flex-1"
                        >
                            Login
                        </Button>
                        <Button
                            type="button"
                            variant={mode === "signup" ? "primary" : "outline"}
                            onClick={() => setMode("signup")}
                            className="flex-1"
                        >
                            Sign Up
                        </Button>
                    </div>
                )}

                {mode !== "reset" && (
                    <button
                        onClick={handleGoogleLogin}
                        type="button"
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 4.36c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Continue with Google
                    </button>
                )}

                {mode !== "reset" && (
                    <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="mx-2 flex-shrink-0 text-gray-400 text-xs uppercase">Or</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>
                )}

                <div className="space-y-3">
                    <label className="flex flex-col gap-1 text-sm font-semibold text-gray-700">
                        Email
                        <input
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                        />
                    </label>

                    {mode === "signup" && (
                        <>
                            <label className="flex flex-col gap-1 text-sm font-semibold text-gray-700">
                                Name
                                <input
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your name"
                                />
                            </label>
                            <label className="flex flex-col gap-1 text-sm font-semibold text-gray-700">
                                Phone Number
                                <input
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+91 ..."
                                />
                            </label>
                        </>
                    )}

                    {mode !== "reset" && (
                        <label className="flex flex-col gap-1 text-sm font-semibold text-gray-700">
                            Password
                            <input
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </label>
                    )}
                </div>

                {mode === "login" && (
                    <div className="text-right">
                        <button
                            type="button"
                            className="text-xs text-blue-600 hover:underline"
                            onClick={() => setMode("reset")}
                        >
                            Forgot password?
                        </button>
                    </div>
                )}

                {error && <p className="text-sm text-rose-600 bg-rose-50 p-2 rounded">{error}</p>}
                {successMsg && <p className="text-sm text-green-600 bg-green-50 p-2 rounded">{successMsg}</p>}

                {mode === "reset" ? (
                    <div className="flex flex-col gap-2">
                        <Button type="button" onClick={handleResetPassword} className="w-full" disabled={loading}>
                            {loading ? "Sending..." : "Send Reset Link"}
                        </Button>
                        <button
                            type="button"
                            className="text-sm text-gray-500 hover:text-gray-800"
                            onClick={() => setMode("login")}
                        >
                            Back to Login
                        </button>
                    </div>
                ) : (
                    <Button type="button" onClick={handleAuth} className="w-full" disabled={loading}>
                        {loading ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
                    </Button>
                )}
            </div>
        </div>
    );
}
