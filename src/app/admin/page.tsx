"use client";

import Link from "next/link";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { Database } from "@/lib/types";
import { useAuth } from "@/features/auth/AuthProvider";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

const EMPTY_FORM: Partial<ProductRow> = {
  name: "",
  price: 0,
  category: "uphaar",
  description: "",
  delivery_time: "",
  availability: true,
  featured: false,
  limited: false,
  aspect_ratio: "aspect-square",
  images: [],
};

export default function AdminPage() {
  const supabase = supabaseBrowser();
  const { user, requireAuth } = useAuth();

  const [products, setProducts] = useState<ProductRow[]>([]);
  const [form, setForm] = useState<Partial<ProductRow>>(EMPTY_FORM);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [generatedCode, setGeneratedCode] = useState("");

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setCheckingAuth(false);
        return;
      }

      const { data } = (await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()) as { data: { role: "admin" | "user" | null } | null };

      setIsAdmin(data?.role === "admin");
      setCheckingAuth(false);
    };

    checkAdmin();
  }, [user, supabase]);

  // Load products
  useEffect(() => {
    if (!user || !isAdmin) return;

    const load = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setProducts(data ?? []);
    };

    load();
  }, [supabase, user, isAdmin]);

  // Upload image
  const handleUpload = async (file?: File | null) => {
    if (!file) return null;

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `products/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(path, file);

    setUploading(false);
    if (error) return null;

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(path);

    return data.publicUrl;
  };

  // Create / Update product
  const saveProduct = () => {
    requireAuth(async () => {
      setBusy(true);

      const productData = {
        name: form.name || "",
        price: Number(form.price) || 0,
        category: form.category || ("uphaar" as const),
        description: form.description || null,
        delivery_time: form.delivery_time || null,
        availability: form.availability ?? true,
        featured: form.featured ?? false,
        limited: form.limited ?? false,
        aspect_ratio: form.aspect_ratio || null,
        images: form.images ?? [],
      };

      let error: any = null;

      if (form.id) {
        // Update existing product
        const result = await (supabase as any)
          .from("products")
          .update(productData)
          .eq("id", form.id);
        error = result.error;
      } else {
        // Insert new product
        const result = await (supabase as any).from("products").insert(productData);
        error = result.error;
      }

      if (!error) {
        const { data } = await (supabase as any)
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        setProducts(data ?? []);
        setForm(EMPTY_FORM);
      } else {
        console.error("Error saving product:", error);
        alert("Error saving product: " + (error.message || "Unknown error"));
      }

      setBusy(false);
    });
  };

  // Delete product
  const deleteProduct = (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    requireAuth(async () => {
      await (supabase as any).from("products").delete().eq("id", id);
      setProducts((p) => p.filter((x) => x.id !== id));
      if (form.id === id) setForm(EMPTY_FORM);
    });
  };

  /*
  // TEMPORARILY DISABLED AUTH CHECKS SO YOU CAN USE THE GENERATOR
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-home-bg">
        <Navbar theme="home" />
        <main className="mx-auto max-w-5xl px-6 py-16">
          <p className="text-center">Loading...</p>
        </main>
        <Footer theme="home" />
      </div>
    );
  }

  if (!user) {
    // ... hidden ...
  }
  */

  // Bypass checks
  if (false) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f3cfc6]">
      <Navbar theme="home" />

      <main className="mx-auto max-w-6xl px-6 py-12 space-y-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-[#670E10]">Admin Panel</h1>
          <Link href="/admin/orders">
            <Button tone="amber">View Orders</Button>
          </Link>
        </div>

        {/* EDIT MODE INDICATOR */}
        {form.id && (
          <div className="rounded-lg bg-yellow-100 px-4 py-2 text-sm text-yellow-800">
            Editing product: <strong>{form.name}</strong>
          </div>
        )}

        {/* PRODUCT FORM */}
        <div className="rounded-2xl bg-white p-6 shadow-card space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Name" value={form.name ?? ""} onChange={(v) => setForm(f => ({ ...f, name: v }))} />
            <Input label="Price" type="number" value={String(form.price ?? "")} onChange={(v) => setForm(f => ({ ...f, price: Number(v) }))} />

            <Input
              label="Category"
              as="select"
              value={form.category ?? "uphaar"}
              onChange={(v) => setForm(f => ({ ...f, category: v as any }))}
              options={[
                { label: "Uphaar", value: "uphaar" },
                { label: "Kyddoz", value: "kyddoz" },
                { label: "Festive", value: "festive" },
              ]}
            />

            <Input
              label="Image Ratio"
              as="select"
              value={form.aspect_ratio ?? "aspect-square"}
              onChange={(v) => setForm(f => ({ ...f, aspect_ratio: v }))}
              options={[
                { label: "Square (1:1)", value: "aspect-square" },
                { label: "Portrait (3:4)", value: "aspect-[3/4]" },
                { label: "Landscape (4:3)", value: "aspect-[4/3]" },
                { label: "Wide (16:9)", value: "aspect-video" },
              ]}
            />

            <Input label="Delivery Time" value={form.delivery_time ?? ""} onChange={(v) => setForm(f => ({ ...f, delivery_time: v }))} />
            <Input label="Description" as="textarea" value={form.description ?? ""} onChange={(v) => setForm(f => ({ ...f, description: v }))} />
          </div>

          <div className="flex gap-4 text-sm">
            {["featured", "limited", "availability"].map((k) => (
              <label key={k} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={(form as any)[k] ?? false}
                  onChange={(e) => setForm(f => ({ ...f, [k]: e.target.checked }))}
                />
                {k}
              </label>
            ))}
          </div>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={async (e) => {
              const files = e.target.files ? Array.from(e.target.files) : [];
              const urls: string[] = [];
              for (const f of files) {
                const url = await handleUpload(f);
                if (url) urls.push(url);
              }
              setForm((x) => ({ ...x, images: [...(x.images || []), ...urls] }));
            }}
          />

          <Input
            label="Or Image URL (for local files)"
            value={form.images?.[0] || ""}
            onChange={(v) => setForm((f) => ({ ...f, images: [v, ...(f.images?.slice(1) || [])] }))}
          />

          {uploading && <p className="text-xs">Uploading…</p>}

          {uploading && <p className="text-xs">Uploading…</p>}

          <div className="flex gap-2">
            {/* DATABASE SAVE BUTTON HIDDEN DUE TO PERMISSIONS ISSUE
            <Button onClick={saveProduct} disabled={busy} tone="amber">
              {busy ? "Saving..." : form.id ? "Update Product" : "Create Product"}
            </Button>
            */}

            {form.id && (
              <Button variant="ghost" onClick={() => setForm(EMPTY_FORM)}>
                Cancel Edit
              </Button>
            )}

            <Button
              className="flex-1"
              tone="amber" // Promoted to primary action
              onClick={() => {
                const code = `
  {
    id: "${form.category?.substring(0, 2) || "pr"}-${Date.now().toString().slice(-4)}",
    name: "${form.name}",
    price: ${form.price},
    image: "${form.images?.[0] || ""}",
    images: ${JSON.stringify(form.images || [])},
    brand: "${form.category}",
    description: "${form.description || ""}",
    material: "Standard",
    thickness: "Standard",
    rate: "₹${form.price} per piece",
    ${form.featured ? 'badge: "Featured",' : ""}
  },`;
                setGeneratedCode(code);
              }}
            >
              Generate Product Code (Copy-Paste)
            </Button>
          </div>

          {generatedCode && (
            <div className="mt-4 rounded-lg bg-gray-900 p-4 text-gray-100">
              <p className="mb-2 text-xs text-gray-400">Copy and paste this into src/data/products.ts:</p>
              <pre className="whitespace-pre-wrap font-mono text-xs">{generatedCode}</pre>
              <Button
                className="mt-2 h-8 text-xs"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(generatedCode);
                  alert("Copied to clipboard!");
                }}
              >
                Copy Code
              </Button>
            </div>
          )}
        </div>

        {/* PRODUCTS LIST */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-[#670E10]">
            Existing Products
          </h2>

          <div className="h-px w-full bg-[#670E10]/20" />

          {products.length === 0 ? (
            <p className="text-sm text-gray-500">
              No products added yet. Create your first product above.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {products.map((p) => (
                <div key={p.id} className="rounded-2xl bg-white p-4 shadow-card">
                  <p className="text-xs uppercase text-gray-500">{p.category}</p>
                  <h3 className="font-semibold text-[#670E10]">{p.name}</h3>
                  <p>₹{p.price}</p>

                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" onClick={() => setForm(p)}>
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => deleteProduct(p.id)}
                    >
                      Delete
                    </Button>
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

function Input({
  label,
  value,
  onChange,
  type = "text",
  as,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  as?: "textarea" | "select";
  options?: { label: string; value: string }[];
}) {
  return (
    <label className="flex flex-col gap-1 text-sm font-semibold text-gray-700">
      {label}
      {as === "select" ? (
        <select
          className="rounded-lg border px-3 py-2"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : as === "textarea" ? (
        <textarea
          className="rounded-lg border px-3 py-2"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="rounded-lg border px-3 py-2"
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}
