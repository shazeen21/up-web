"use client";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { useCommerce } from "@/features/commerce/CommerceProvider";
import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { Database } from "@/lib/types";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

type CartItemWithProduct = {
  id: string;
  quantity: number;
  product: ProductRow | null;
  options?: Record<string, any>;
};

export default function CheckoutPage() {
  const { cart, removeFromCart } = useCommerce();
  const { user, requireAuth } = useAuth();
  const supabase = supabaseBrowser();

  const [cartWithProducts, setCartWithProducts] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Customer Details State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  /* ================= FETCH USER PROFILE ================= */
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const { data } = await (supabase as any)
        .from("profiles")
        .select("name, phone")
        .eq("id", user.id)
        .single();

      if (data) {
        setCustomerName(data.name || "");
        setCustomerPhone(data.phone || "");
      }
    };

    fetchProfile();
  }, [user, supabase]);

  /* ================= FETCH CART PRODUCTS ================= */
  useEffect(() => {
    const fetchCartProducts = async () => {
      setLoading(true);
      const cartIds = cart.map((item) => item.id);

      if (!cartIds.length) {
        setCartWithProducts([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .in("id", cartIds) as { data: ProductRow[] | null; error: any };

        if (data && !error) {
          setCartWithProducts(
            cart.map((item) => ({
              id: item.id,
              quantity: item.qty,
              product: data.find((p) => p.id === item.id) || null,
              options: item.options,
            }))
          );
        } else {
          throw new Error("Supabase fetch failed");
        }
      } catch {
        const { featuredProducts, uphaarCollection, kyddozCollection, festiveCollection } =
          await import("@/data/products");

        const allProducts = [
          ...featuredProducts,
          ...uphaarCollection,
          ...kyddozCollection,
          ...festiveCollection,
        ];

        setCartWithProducts(
          cart.map((item) => {
            const p = allProducts.find((x) => x.id === item.id);
            return {
              id: item.id,
              quantity: item.qty,
              product: p
                ? ({
                  id: p.id,
                  name: p.name,
                  price: p.price,
                  category: p.brand,
                  images: p.images || [p.image],
                  description: p.description || null,
                  availability: true,
                  featured: false,
                  limited: false,
                  created_at: null,
                  tags: null,
                  delivery_time: null,
                  aspect_ratio: p.aspect_ratio || null,
                } as ProductRow)
                : null,
              options: item.options,
            };
          })
        );
      }

      setLoading(false);
    };

    fetchCartProducts();
  }, [cart, supabase]);

  /* ================= TOTALS ================= */
  const subtotal = useMemo(
    () =>
      cartWithProducts.reduce(
        (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
        0
      ),
    [cartWithProducts]
  );

  // Shipping logic removed as requested
  const total = subtotal;

  /* ================= WHATSAPP ORDER ================= */
  const placeOrder = () => {
    requireAuth(async () => {
      if (!customerName || !customerPhone) {
        alert("Please enter your Name and Phone Number to proceed.");
        return;
      }

      setLoading(true);

      /* --- SAVE ORDER TO DATABASE --- */
      try {
        if (user) {
          const { error } = await (supabase as any).from("orders").insert({
            user_id: user.id,
            items: cartWithProducts.map(item => ({
              product_id: item.product?.id || item.id,
              name: item.product?.name || "Unknown Product",
              price: item.product?.price || 0,
              quantity: item.quantity,
              options: item.options
            })),
            total: total,
            customer_details: {
              name: customerName,
              phone: customerPhone
            },
            status: "placed"
          });

          if (error) {
            console.error("Failed to save order:", error);
            // We continue to WhatsApp even if DB fails, but maybe log it
          }
        }
      } catch (err) {
        console.error("Order save error:", err);
      }

      /* --- PROCEED TO WHATSAPP --- */
      const hasKyddoz = cartWithProducts.some(
        (item) => item.product?.category === "kyddoz"
      );

      const targetNumber = hasKyddoz
        ? process.env.NEXT_PUBLIC_KYDDOZ_WHATSAPP!
        : process.env.NEXT_PUBLIC_UPHAAR_WHATSAPP!;


      const productLines = cartWithProducts
        .map((item, index) => {
          const name = item.product?.name ?? "Product";
          const price = item.product?.price ?? 0;
          let line = `${index + 1}. ${name} x ${item.quantity} – ₹${price * item.quantity}`;

          // Add customization details if present
          if (item.options && Object.keys(item.options).length > 0) {
            const customizations = Object.entries(item.options)
              .filter(([_, value]) => value) // Only include non-empty values
              .map(([key, value]) => `${key}: ${value}`)
              .join(", ");
            if (customizations) {
              line += `\n   Customization: ${customizations}`;
            }
          }

          return line;
        })
        .join("\n");

      const message = `
Hello, I would like to place an order.

Customer Name: ${customerName}
Phone Number: ${customerPhone}

Products:
${productLines}

Total Amount: ₹${total.toLocaleString("en-IN")} (Excluding Shipping)

Order Type: Normal
      `.trim();

      const whatsappURL = `https://api.whatsapp.com/send?phone=${targetNumber.replace(
        "+",
        ""
      )}&text=${encodeURIComponent(message)}`;



      window.location.href = whatsappURL;
      setLoading(false);
    });
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#f3cfc6] text-black">
      <Navbar theme="home" />

      <main className="mx-auto max-w-3xl px-6 py-12 lg:px-8 lg:py-16 space-y-10">
        <div className="text-center">
          <h1 className="text-3xl font-semibold">Checkout</h1>
          <p className="text-black/80">
            Confirm your order details.
          </p>
        </div>

        <div className="space-y-6">
          {/* USER DETAILS FORM */}
          <div className="rounded-2xl bg-white/80 p-6 shadow-card space-y-4">
            <h3 className="text-xl font-semibold border-b pb-4">Your Details</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-1">
                <span className="text-sm font-medium">Name <span className="text-red-500">*</span></span>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 bg-white"
                  placeholder="Enter your name"
                />
              </label>
              <label className="block space-y-1">
                <span className="text-sm font-medium">Phone <span className="text-red-500">*</span></span>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 bg-white"
                  placeholder="Enter your phone number"
                />
              </label>
            </div>
          </div>

          <div className="rounded-2xl bg-white/80 p-6 shadow-card space-y-6">
            <h3 className="text-xl font-semibold border-b pb-4">Order Summary</h3>

            <div className="space-y-4">
              {cartWithProducts.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="flex justify-between border-b pb-4 last:border-0"
                >
                  <div className="flex-1 pr-4">
                    <p className="font-medium text-lg">
                      {item.product?.name ?? "Item"}
                    </p>
                    <p className="text-sm text-black/60">
                      Qty: {item.quantity}
                    </p>
                    {/* Display customization options */}
                    {item.options && Object.keys(item.options).length > 0 && (
                      <div className="mt-2 text-xs text-black/70 space-y-1 bg-black/5 p-2 rounded-lg">
                        {Object.entries(item.options)
                          .filter(([_, value]) => value)
                          .map(([key, value]) => (
                            <p key={key}>
                              <span className="font-semibold capitalize">{key}:</span> {value}
                            </p>
                          ))}
                      </div>
                    )}
                    <button
                      onClick={() => {
                        const cartIndex = cart.findIndex((c, i) => i === idx);
                        if (cartIndex !== -1) removeFromCart(cartIndex);
                      }}
                      className="text-sm text-red-600 hover:text-red-700 font-medium mt-2"
                    >
                      Remove
                    </button>
                  </div>
                  <span className="font-semibold text-lg">
                    ₹
                    {(
                      (item.product?.price ?? 0) * item.quantity
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Amount</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
              <p className="text-xs text-center text-black/60 italic">
                * Final amount is excluding shipping cost. Shipping will be calculated separately.
              </p>
            </div>

            <Button
              tone="amber"
              className="w-full py-4 text-lg"
              onClick={placeOrder}
              disabled={loading || !cartWithProducts.length || !customerName || !customerPhone}
            >
              {loading ? "Processing..." : "Place Order on WhatsApp"}
            </Button>
          </div>
        </div>
      </main>

      <Footer theme="home" />
    </div>
  );
}
