"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductSlider } from "@/components/ui/ProductSlider";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { Database } from "@/lib/types";
import {
  Product,
  featuredProducts,
  uphaarCollection,
  kyddozCollection,
  festiveCollection,
} from "@/data/products";
import { useCommerce } from "@/features/commerce/CommerceProvider";
import { useAuth } from "@/features/auth/AuthProvider";
import { FadeIn } from "@/components/ui/Animated";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

/* ================= THEME MAP ================= */
const themeMap = {
  uphaar: {
    bg: "#ffffff",
    card: "#b7c1b9",
    text: "black",
    button: "#2b6c43",
  },
  kyddoz: {
    bg: "#ACE4FF",
    card: "#E9F7FF",
    text: "#0B3C5D",
    button: "#0B3C5D",
  },
  festive: {
    bg: "#CACFFF",
    card: "#E8EAFF",
    text: "#2F2A55",
    button: "#2F2A55",
  },
};

export default function ProductDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const supabase = supabaseBrowser();
  const { addToCart } = useCommerce();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [manualEntry, setManualEntry] = useState<Record<string, boolean>>({});

  const getWhatsAppMessage = (type: "uphaar" | "kyddoz") => {
    if (!product) return "";

    let message = "";
    if (type === "uphaar") {
      message = `Hello, I am interested in knowing the price for *${product.name}*.\n\n`;
    } else {
      message = `Hello, I would like to place an order for *${product.name}* (Price: ₹${product.price}).\n\n`;
    }

    message += "*Details:*\n";
    if (pageFormValuesReceived) { // Only if we want to include form values
      // We iterate product.customizationForm to maintain order and labels
      product.customizationForm?.forEach(field => {
        const value = formValues[field.name];
        if (value) {
          message += `- ${field.label}: ${value}\n`;
        }
      });
      // Also include legacy color/size if present and not in form
      if (!product.customizationForm) {
        if (formValues["color"]) message += `- Color: ${formValues["color"]}\n`;
        if (formValues["size"]) message += `- Size: ${formValues["size"]}\n`;
      }
    }

    return encodeURIComponent(message);
  };

  // Helper boolean to check if we found customization form
  const pageFormValuesReceived = Object.keys(formValues).length > 0;

  const handleBuyNowKyddoz = () => {
    if (!product) return;

    // Validate
    if (product.customizationForm) {
      const missing = product.customizationForm.filter(
        (f) => f.required && !formValues[f.name]
      );
      if (missing.length > 0) {
        alert(`Please fill in: ${missing.map((m) => m.label).join(", ")}`);
        document.getElementById("customization-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    }

    // Redirect to WhatsApp
    const msg = getWhatsAppMessage("kyddoz");
    window.open(`https://wa.me/918767174252?text=${msg}`, "_blank");
  };

  const handleAddToCart = (redirect: boolean) => {
    if (!product) return;

    // Validate required fields
    if (product.customizationForm) {
      const missing = product.customizationForm.filter(
        (f) => f.required && !formValues[f.name]
      );
      if (missing.length > 0) {
        alert(`Please fill in: ${missing.map((m) => m.label).join(", ")}`);
        document.getElementById("customization-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    }

    if (redirect && product.brand === "kyddoz") {
      handleBuyNowKyddoz();
      return;
    }

    addToCart(product.id, qty, formValues);
    if (redirect) router.push("/checkout");
  };

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {

    const fetchProduct = async () => {
      setLoading(true);

      try {
        const allProducts = [
          ...featuredProducts,
          ...uphaarCollection,
          ...kyddozCollection,
          ...festiveCollection,
        ];

        const foundProduct = allProducts.find((p) => p.id === params.id);

        if (foundProduct) {
          setProduct(foundProduct);

          // Get related from static
          const relatedProducts = allProducts
            .filter((p) => p.brand === foundProduct.brand && p.id !== foundProduct.id)
            .slice(0, 6);
          setRelated(relatedProducts);
        } else {
          const { data, error } = (await supabase
            .from("products")
            .select("*")
            .eq("id", params.id)
            .limit(1)) as { data: ProductRow[] | null; error: any };

          if (!error && data && data.length > 0) {
            const productRow = data[0];
            const mappedProduct: Product = {
              id: productRow.id,
              name: productRow.name,
              price: productRow.price,
              image: productRow.images?.[0] || "",
              images: productRow.images || [],
              brand: productRow.category as any,
              features: [],
              sizes: [],
            };
            setProduct(mappedProduct);
          } else {
            router.push("/");
          }
        }
      } catch {
        router.push("/");
      }

      setLoading(false);
    };

    fetchProduct();
  }, [params.id, router, supabase]);

  /* ================= GUARDS ================= */
  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading…
      </div>
    );
  }

  const theme = themeMap[product.brand];
  const gallery = product.images?.length ? product.images : [product.image];

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text }}>
      <Navbar theme={product.brand} />

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-2">

          {/* IMAGES */}
          <FadeIn direction="up">
            <div className="space-y-4">
              <div
                className="relative aspect-square overflow-hidden rounded-3xl bg-white border"
                style={{ borderColor: theme.text }}
              >
                <Image src={gallery[activeImg]} alt={product.name} fill className="object-contain" />
              </div>

              <div className="grid grid-cols-5 gap-3">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`relative aspect-square rounded-xl overflow-hidden border ${i === activeImg ? "border-2" : "border-transparent"
                      }`}
                    style={{ borderColor: theme.text }}
                  >
                    <Image src={img} alt="" fill className="object-contain" />
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* INFO */}
          <FadeIn direction="up" delay={0.2}>
            <div className="space-y-6 rounded-3xl p-6" style={{ backgroundColor: theme.card }}>
              <h1 className="text-3xl font-semibold">{product.name}</h1>
              {product.brand !== "uphaar" && (
                <p className="text-2xl font-semibold">₹{product.price}</p>
              )}

              {/* DYNAMIC CUSTOMIZATION FORM */}
              {
                product.customizationForm ? (
                  <div className="space-y-4" id="customization-form">
                    {product.customizationForm.map((field) => {
                      const isManual = manualEntry[field.name];
                      return (
                        <div key={field.name}>
                          <label className="mb-1 block text-sm font-medium opacity-80">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                          </label>

                          {field.type === "select" && field.options && !isManual ? (
                            <div className="space-y-1">
                              <select
                                className="w-full rounded-xl border bg-transparent px-4 py-2 outline-none"
                                style={{ borderColor: theme.text }}
                                onChange={(e) =>
                                  setFormValues((prev) => ({ ...prev, [field.name]: e.target.value }))
                                }
                                value={formValues[field.name] || ""}
                              >
                                <option value="">Select an option</option>
                                {field.options.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                              <button
                                type="button"
                                onClick={() => setManualEntry(prev => ({ ...prev, [field.name]: true }))}
                                className="text-xs underline opacity-70 hover:opacity-100"
                              >
                                Type manually instead
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <input
                                type="text"
                                placeholder={field.placeholder || `Enter ${field.label}`}
                                className="w-full rounded-xl border bg-transparent px-4 py-2 outline-none"
                                style={{ borderColor: theme.text }}
                                onChange={(e) =>
                                  setFormValues((prev) => ({ ...prev, [field.name]: e.target.value }))
                                }
                                value={formValues[field.name] || ""}
                                autoFocus={isManual}
                              />
                              {field.type === "select" && isManual && (
                                <button
                                  type="button"
                                  onClick={() => setManualEntry(prev => ({ ...prev, [field.name]: false }))}
                                  className="text-xs underline opacity-70 hover:opacity-100"
                                >
                                  Back to options
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : !product.id.startsWith("fp-") ? (
                  /* Fallback for products without custom form config (Legacy) */
                  <div className="space-y-3" id="customization-form">
                    <input
                      placeholder="Color (optional)"
                      value={formValues["color"] || ""}
                      onChange={(e) => setFormValues(prev => ({ ...prev, color: e.target.value }))}
                      className="w-full rounded-xl border px-4 py-2 bg-transparent"
                      style={{ borderColor: theme.text }}
                    />
                    <input
                      placeholder="Size (optional)"
                      value={formValues["size"] || ""}
                      onChange={(e) => setFormValues(prev => ({ ...prev, size: e.target.value }))}
                      className="w-full rounded-xl border px-4 py-2 bg-transparent"
                      style={{ borderColor: theme.text }}
                    />
                  </div>
                ) : null
              }

              {
                product.brand === "uphaar" ? (
                  <button
                    onClick={() => {
                      if (product.customizationForm) {
                        const missing = product.customizationForm.filter(f => f.required && !formValues[f.name]);
                        if (missing.length > 0) {
                          alert(`Please fill in: ${missing.map(m => m.label).join(", ")}`);
                          return;
                        }
                      }
                      const msg = getWhatsAppMessage("uphaar");
                      window.open(`https://wa.me/919821141072?text=${msg}`, "_blank");
                    }}
                    className="block w-full"
                  >
                    <Button
                      className="w-full text-white py-6 text-lg"
                      style={{ backgroundColor: theme.button }}
                    >
                      Price Details
                    </Button>
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 text-white"
                      style={{ backgroundColor: theme.button }}
                      onClick={() => handleAddToCart(false)}
                    >
                      Add to Cart
                    </Button>

                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleAddToCart(true)}
                    >
                      Buy Now
                    </Button>
                  </div>
                )
              }

              {/* PRODUCT DETAILS & SPECS */}
              <div className="mt-8 space-y-6 border-t border-black/10 pt-6">

                {/* Features */}
                {product.features && product.features.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 text-lg">Key Features</h3>
                    <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base opacity-90">
                      {product.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Sizes / Dimensions */}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 text-lg">Available Sizes</h3>
                    <div className="space-y-2 text-sm sm:text-base">
                      {product.sizes.map((s, i) => {
                        if (typeof s === "string") {
                          return (
                            <div key={i} className="flex justify-between border-b border-black/10 pb-1">
                              <span>Size</span>
                              <span className="font-medium">{s}</span>
                            </div>
                          );
                        }
                        return (
                          <div key={i} className="flex justify-between border-b border-black/10 pb-1">
                            <span className="opacity-80">{s.label}</span>
                            <span className="font-medium">{s.size}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Legacy Description */}
                {product.description && (
                  <div>
                    <h3 className="font-semibold mb-3 text-lg">Description</h3>
                    {Array.isArray(product.description) ? (
                      <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base opacity-90">
                        {product.description.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm sm:text-base opacity-90 whitespace-pre-line">
                        {product.description}
                      </p>
                    )}
                  </div>
                )}

                {/* Disclaimer */}
                {(product.brand === "uphaar" || product.brand === "kyddoz") && (
                  <p className="text-xs sm:text-sm opacity-70 italic">
                    Actual product color may differ slightly from images shown due to photographic lighting and display settings.
                  </p>
                )}

                {/* Additional Specs */}
                {(product.material || product.thickness) && (
                  <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                    {product.material && (
                      <div>
                        <span className="block opacity-70 text-xs uppercase tracking-wider">Material</span>
                        <span className="font-medium">{product.material}</span>
                      </div>
                    )}
                    {product.thickness && (
                      <div>
                        <span className="block opacity-70 text-xs uppercase tracking-wider">Thickness</span>
                        <span className="font-medium">{product.thickness}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </FadeIn>
        </div>

        <section className="mt-12">
          <ProductSlider
            items={related}
            tone={product.brand}
            title="You may also like"
            description="More from this collection"
          />
        </section>
      </main>

      <Footer theme={product.brand} />
    </div>
  );
}
