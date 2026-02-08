"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { Database } from "@/lib/types";
import { useAuth } from "@/features/auth/AuthProvider";
import Link from "next/link";
import { ChevronLeft, ExternalLink } from "lucide-react";

type OrderRow = Database["public"]["Tables"]["orders"]["Row"];

export default function AdminOrdersPage() {
    const supabase = supabaseBrowser();
    const { user, loading: authLoading } = useAuth();

    const [orders, setOrders] = useState<OrderRow[]>([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const init = async () => {
            if (authLoading) return;

            if (!user) {
                setPageLoading(false);
                return;
            }

            // Check Admin
            const { data } = await (supabase as any)
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single();

            const isUserAdmin = data?.role === "admin";
            setIsAdmin(isUserAdmin);

            if (isUserAdmin) {
                // Fetch Orders
                const { data: ordersData, error } = await (supabase as any)
                    .from("orders")
                    .select("*")
                    .order("created_at", { ascending: false });

                if (!error) {
                    setOrders(ordersData || []);
                } else {
                    console.error("Error fetching orders:", error);
                }
            }

            setPageLoading(false);
        };

        init();
    }, [user, authLoading, supabase]);

    const updateStatus = async (orderId: string, newStatus: string) => {
        // Optimistic update
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

        const { error } = await (supabase as any)
            .from("orders")
            .update({ status: newStatus })
            .eq("id", orderId);

        if (error) {
            console.error("Failed to update status", error);
            // Revert if needed, but for now just log
            alert("Failed to update status");
        }
    };

    if (!isAdmin && !pageLoading) {
        return (
            <div className="min-h-screen bg-[#f3cfc6] flex items-center justify-center">
                <p>Access Denied. Admins only.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f3cfc6]">
            <Navbar theme="home" />

            <main className="mx-auto max-w-6xl px-6 py-12 space-y-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin">
                        <Button variant="ghost" className="gap-2">
                            <ChevronLeft size={16} /> Back to Dashboard
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-semibold text-[#670E10]">Orders</h1>
                </div>

                {pageLoading ? (
                    <p className="text-center">Loading orders...</p>
                ) : orders.length === 0 ? (
                    <div className="rounded-2xl bg-white p-8 text-center shadow-card">
                        <p className="text-gray-500">No orders placed yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => {
                            const customer = order.customer_details as { name?: string; phone?: string } | null;
                            const items = order.items as any[]; // Cast as needed
                            const date = new Date(order.created_at || "").toLocaleString("en-IN");

                            return (
                                <div key={order.id} className="rounded-2xl bg-white p-6 shadow-card space-y-4">
                                    {/* Header */}
                                    <div className="flex flex-wrap justify-between items-start gap-4 border-b pb-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-sm text-gray-500">#{order.id.slice(0, 8)}</span>
                                                <span className={`px-2 py-0.5 rounded text-xs font-semibold capitalize ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                        'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">{date}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-xl text-[#670E10]">₹{order.total.toLocaleString("en-IN")}</p>
                                            <p className="text-sm font-medium">{customer?.name || "Unknown Customer"}</p>
                                            <p className="text-sm text-gray-500">{customer?.phone || "No Phone"}</p>
                                        </div>
                                    </div>

                                    {/* Items */}
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                        {items && Array.isArray(items) ? (
                                            items.map((item: any, idx: number) => (
                                                <div key={idx} className="flex justify-between items-start text-sm">
                                                    <div>
                                                        <p className="font-medium">{item.name} <span className="text-gray-500">x {item.quantity}</span></p>
                                                        {/* Options */}
                                                        {item.options && Object.keys(item.options).length > 0 && (
                                                            <div className="text-xs text-gray-500 mt-0.5">
                                                                {Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(", ")}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="font-medium">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500">No items data</p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 justify-end pt-2">
                                        {order.status !== 'completed' && (
                                            <Button tone="amber" onClick={() => updateStatus(order.id, 'completed')}>
                                                Mark Completed
                                            </Button>
                                        )}
                                        {order.status === 'completed' && (
                                            <Button variant="outline" onClick={() => updateStatus(order.id, 'placed')}>
                                                Reopen Order
                                            </Button>
                                        )}
                                        <a
                                            href={`https://wa.me/?text=${encodeURIComponent(`Hi ${customer?.name}, regarding your order #${order.id.slice(0, 8)}...`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                                        >
                                            <ExternalLink className="mr-2 h-4 w-4" /> Chat on WhatsApp
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            <Footer theme="home" />
        </div>
    );
}
