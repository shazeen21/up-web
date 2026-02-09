"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

type Order = {
    id: string;
    created_at: string;
    total: number;
    status: string;
    items: any[];
};

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = supabaseBrowser();

    useEffect(() => {
        if (!user) {
            if (!authLoading) setLoading(false);
            return;
        }

        const fetchOrders = async () => {
            const { data, error } = await supabase
                .from("orders")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (data) {
                setOrders(data);
            }
            setLoading(false);
        };

        fetchOrders();
    }, [user, authLoading, supabase]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar theme="home" />
                <div className="max-w-7xl mx-auto px-4 py-24 text-center">
                    <h2 className="text-2xl font-bold mb-4">Please log in to view your profile</h2>
                    <p className="mb-8">Manage your orders and account details.</p>
                </div>
                <Footer theme="home" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar theme="home" />

            <main className="max-w-5xl mx-auto px-4 py-12">
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 border-b pb-4 mb-4">My Profile</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Email</label>
                            <p className="text-lg font-medium">{user.email}</p>
                        </div>
                        {/* We could fetch more profile details if needed */}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-900 border-b pb-4 mb-6">Order History</h2>

                    {orders.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <p>No orders found.</p>
                            <Link href="/" className="inline-block mt-4 text-primary hover:underline">
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                                    <div className="flex flex-wrap justify-between gap-4 border-b pb-3 mb-3">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">Order ID</p>
                                            <p className="font-mono text-sm">{order.id.slice(0, 8)}...</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">Date</p>
                                            <p className="text-sm">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">Total</p>
                                            <p className="text-sm font-bold">₹{order.total.toLocaleString("en-IN")}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">Status</p>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {Array.isArray(order.items) && order.items.map((item: any, idx: number) => (
                                            <div key={idx} className="flex justify-between text-sm">
                                                <span>{item.name} <span className="text-gray-500">x{item.quantity}</span></span>
                                                <span>₹{item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer theme="home" />
        </div>
    );
}
