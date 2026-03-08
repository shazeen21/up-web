/**
 * ============================================================
 * EMAIL MARKETING SERVICE
 * ============================================================
 * Handles all transactional and marketing email flows.
 * Uses Resend (recommended) or falls back to Nodemailer/SMTP.
 *
 * SUPPORTED FLOWS:
 *  1. Welcome Flow     — sent on signup
 *  2. Abandoned Cart   — triggered 1h and 24h after cart abandon
 *  3. Post Purchase    — thank-you, care tips, review request
 *
 * Set your RESEND_API_KEY in .env.local to activate.
 * ============================================================
 */

// ─── Types ────────────────────────────────────────────────────

export interface EmailRecipient {
    name: string;
    email: string;
}

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

export interface OrderSummary {
    orderId: string;
    items: CartItem[];
    total: number;
    deliveryAddress?: string;
}

// ─── Base send function ───────────────────────────────────────

async function sendEmail(options: {
    to: EmailRecipient;
    subject: string;
    html: string;
}): Promise<{ success: boolean; error?: string }> {
    try {
        const response = await fetch("/api/marketing/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                to: options.to.email,
                toName: options.to.name,
                subject: options.subject,
                html: options.html,
            }),
        });

        const result = await response.json();
        return result;
    } catch (err) {
        console.error("[Email] Failed to send:", err);
        return { success: false, error: String(err) };
    }
}

// ─── Email Templates ──────────────────────────────────────────

function wrapInTemplate(content: string, previewText = "") {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Uphaar & Kyddoz</title>
</head>
<body style="margin:0;padding:0;background:#f3cfc6;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3cfc6;padding:32px 16px;">
    <tr>
      <td align="center">
        <!-- Header -->
        <table width="600" cellpadding="0" cellspacing="0" style="background:#670E10;border-radius:12px 12px 0 0;overflow:hidden;">
          <tr>
            <td align="center" style="padding:24px;">
              <h1 style="color:#fff;margin:0;font-size:26px;letter-spacing:2px;">UPHAAR & KYDDOZ</h1>
              <p style="color:#f3cfc6;margin:4px 0 0;font-size:13px;letter-spacing:1px;">Making Every Moment Special</p>
            </td>
          </tr>
        </table>
        <!-- Body -->
        <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:0 0 12px 12px;overflow:hidden;">
          <tr>
            <td style="padding:32px 40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#faf6f0;padding:20px 40px;border-top:1px solid #f3cfc6;">
              <p style="color:#670E10;font-size:12px;margin:0;text-align:center;">
                © 2024 Uphaar & Kyddoz · 
                <a href="https://uphaarandkyddoz.com" style="color:#670E10;">uphaarandkyddoz.com</a> · 
                <a href="{{unsubscribe_url}}" style="color:#670E10;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── 1. WELCOME FLOW ──────────────────────────────────────────

/** Step 1: Immediate welcome email on signup */
export async function sendWelcomeEmail(recipient: EmailRecipient) {
    const content = `
    <h2 style="color:#670E10;font-size:22px;margin:0 0 16px;">Welcome to the family, ${recipient.name}! 🎁</h2>
    <p style="color:#444;line-height:1.7;margin:0 0 16px;">
      Thank you for joining Uphaar & Kyddoz — where every gift tells a story. 
      We're so excited to have you with us.
    </p>
    <p style="color:#444;line-height:1.7;margin:0 0 24px;">
      Explore our handpicked collections of premium gifts, personalized keepsakes, 
      and festive surprises crafted with love.
    </p>
    <div style="text-align:center;margin:0 0 24px;">
      <a href="https://uphaarandkyddoz.com" 
         style="background:#670E10;color:#fff;padding:14px 32px;border-radius:8px;
                text-decoration:none;font-size:15px;display:inline-block;">
        Start Shopping
      </a>
    </div>
    <p style="color:#888;font-size:13px;margin:0;">
      Questions? Reply to this email or WhatsApp us anytime. 💬
    </p>
  `;

    return sendEmail({
        to: recipient,
        subject: "Welcome to Uphaar & Kyddoz 🎁",
        html: wrapInTemplate(content),
    });
}

/** Step 2: Best sellers email (sent ~24h after signup) */
export async function sendBestSellersEmail(recipient: EmailRecipient) {
    const content = `
    <h2 style="color:#670E10;font-size:22px;margin:0 0 16px;">Our Best Sellers Just for You ✨</h2>
    <p style="color:#444;line-height:1.7;margin:0 0 16px;">
      Hi ${recipient.name}, here's what everyone is loving right now!
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
      ${["Personalised Egyptian Wonder Towels", "Engraved Wooden Gift Box", "Custom Embroidery Hamper"]
            .map(
                (name, i) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #f3cfc6;">
            <span style="color:#670E10;font-weight:bold;">#${i + 1}</span>
            <span style="color:#444;margin-left:12px;">${name}</span>
          </td>
        </tr>`
            )
            .join("")}
    </table>
    <div style="text-align:center;">
      <a href="https://uphaarandkyddoz.com/uphaar" 
         style="background:#670E10;color:#fff;padding:14px 32px;border-radius:8px;
                text-decoration:none;font-size:15px;display:inline-block;">
        View All Products
      </a>
    </div>
  `;

    return sendEmail({
        to: recipient,
        subject: "🔥 Our Best Sellers — Customers Can't Get Enough!",
        html: wrapInTemplate(content),
    });
}

/** Step 3: Discount email (sent ~72h after signup) */
export async function sendWelcomeDiscountEmail(
    recipient: EmailRecipient,
    discountCode = "WELCOME10"
) {
    const content = `
    <h2 style="color:#670E10;font-size:22px;margin:0 0 16px;">A little gift from us to you 🎀</h2>
    <p style="color:#444;line-height:1.7;margin:0 0 16px;">
      Hi ${recipient.name}, as a thank you for joining us, 
      here's an exclusive discount just for you!
    </p>
    <div style="background:#f3cfc6;border:2px dashed #670E10;border-radius:12px;
                padding:24px;text-align:center;margin:0 0 24px;">
      <p style="color:#670E10;font-size:13px;margin:0 0 8px;letter-spacing:1px;">YOUR DISCOUNT CODE</p>
      <p style="color:#670E10;font-size:32px;font-weight:bold;margin:0;letter-spacing:4px;">${discountCode}</p>
      <p style="color:#670E10;font-size:13px;margin:8px 0 0;">10% OFF your first order</p>
    </div>
    <div style="text-align:center;">
      <a href="https://uphaarandkyddoz.com" 
         style="background:#670E10;color:#fff;padding:14px 32px;border-radius:8px;
                text-decoration:none;font-size:15px;display:inline-block;">
        Shop & Apply Code
      </a>
    </div>
  `;

    return sendEmail({
        to: recipient,
        subject: `🎀 ${discountCode} — Your Exclusive Welcome Discount`,
        html: wrapInTemplate(content),
    });
}

// ─── 2. ABANDONED CART FLOW ───────────────────────────────────

/** Reminder email (sent 1 hour after cart abandon) */
export async function sendAbandonedCartReminder(
    recipient: EmailRecipient,
    cartItems: CartItem[]
) {
    const itemRows = cartItems
        .map(
            (item) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #f3cfc6;">
        <span style="color:#444;">${item.name}</span>
        <span style="color:#670E10;float:right;">₹${item.price.toLocaleString("en-IN")}</span>
      </td>
    </tr>`
        )
        .join("");

    const total = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);

    const content = `
    <h2 style="color:#670E10;font-size:22px;margin:0 0 8px;">You left something behind! 🛒</h2>
    <p style="color:#444;line-height:1.7;margin:0 0 24px;">
      Hi ${recipient.name}, your cart is patiently waiting for you. 
      Don't let these beauties go!
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">
      ${itemRows}
      <tr>
        <td style="padding:16px 0 0;">
          <strong style="color:#670E10;">Total: ₹${total.toLocaleString("en-IN")}</strong>
        </td>
      </tr>
    </table>
    <div style="text-align:center;margin:0 0 16px;">
      <a href="https://uphaarandkyddoz.com/checkout" 
         style="background:#670E10;color:#fff;padding:14px 32px;border-radius:8px;
                text-decoration:none;font-size:15px;display:inline-block;">
        Complete My Order
      </a>
    </div>
    <p style="color:#888;font-size:13px;text-align:center;margin:0;">
      Items in your cart are not reserved. Complete your purchase before they sell out!
    </p>
  `;

    return sendEmail({
        to: recipient,
        subject: "🛒 You forgot something in your cart...",
        html: wrapInTemplate(content),
    });
}

/** Discount email (sent 24 hours after cart abandon) */
export async function sendAbandonedCartDiscount(
    recipient: EmailRecipient,
    cartItems: CartItem[],
    discountCode = "COMEBACK15"
) {
    const total = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const discounted = Math.round(total * 0.85);

    const content = `
    <h2 style="color:#670E10;font-size:22px;margin:0 0 8px;">We miss you! Here's 15% off 💸</h2>
    <p style="color:#444;line-height:1.7;margin:0 0 24px;">
      Hi ${recipient.name}, we saw your cart and wanted to make it easier for you 
      to complete your order with an exclusive discount!
    </p>
    <div style="background:#f3cfc6;border:2px dashed #670E10;border-radius:12px;
                padding:24px;text-align:center;margin:0 0 24px;">
      <p style="color:#670E10;font-size:13px;margin:0 0 8px;">USE CODE</p>
      <p style="color:#670E10;font-size:30px;font-weight:bold;margin:0;letter-spacing:4px;">${discountCode}</p>
      <p style="color:#670E10;font-size:13px;margin:8px 0 0;">
        Your cart: <s>₹${total.toLocaleString("en-IN")}</s> → 
        <strong>₹${discounted.toLocaleString("en-IN")}</strong>
      </p>
    </div>
    <div style="text-align:center;">
      <a href="https://uphaarandkyddoz.com/checkout" 
         style="background:#670E10;color:#fff;padding:14px 32px;border-radius:8px;
                text-decoration:none;font-size:15px;display:inline-block;">
        Claim My Discount
      </a>
    </div>
  `;

    return sendEmail({
        to: recipient,
        subject: `💸 ${discountCode} — 15% off your cart (expires soon!)`,
        html: wrapInTemplate(content),
    });
}

// ─── 3. POST-PURCHASE FLOW ────────────────────────────────────

/** Step 1: Thank-you email immediately after purchase */
export async function sendThankYouEmail(
    recipient: EmailRecipient,
    order: OrderSummary
) {
    const itemRows = order.items
        .map(
            (item) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f3cfc6;">
        <span style="color:#444;">${item.name} × ${item.quantity}</span>
        <span style="color:#670E10;float:right;">₹${(item.price * item.quantity).toLocaleString("en-IN")}</span>
      </td>
    </tr>`
        )
        .join("");

    const content = `
    <h2 style="color:#670E10;font-size:22px;margin:0 0 8px;">
      Thank you for your order, ${recipient.name}! 🎉
    </h2>
    <p style="color:#888;font-size:13px;margin:0 0 24px;">Order #${order.orderId}</p>
    <p style="color:#444;line-height:1.7;margin:0 0 24px;">
      We've received your order and our team is getting everything ready with love and care.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">
      ${itemRows}
      <tr>
        <td style="padding:16px 0 0;">
          <strong style="color:#670E10;font-size:16px;">
            Total: ₹${order.total.toLocaleString("en-IN")}
          </strong>
        </td>
      </tr>
    </table>
    <p style="color:#444;line-height:1.7;margin:0 0 24px;">
      We'll keep you updated via WhatsApp. If you have any questions, 
      just reply to this email!
    </p>
    <div style="text-align:center;">
      <a href="https://uphaarandkyddoz.com" 
         style="background:#670E10;color:#fff;padding:14px 32px;border-radius:8px;
                text-decoration:none;font-size:15px;display:inline-block;">
        Continue Shopping
      </a>
    </div>
  `;

    return sendEmail({
        to: recipient,
        subject: `🎉 Order Confirmed! #${order.orderId}`,
        html: wrapInTemplate(content),
    });
}

/** Step 2: Product care tips email */
export async function sendProductCareTipsEmail(recipient: EmailRecipient) {
    const content = `
    <h2 style="color:#670E10;font-size:22px;margin:0 0 16px;">
      Caring for your new gift 💝
    </h2>
    <p style="color:#444;line-height:1.7;margin:0 0 16px;">
      Hi ${recipient.name}, we hope your order has arrived and brought a big smile!
      Here are some tips to keep your products looking beautiful:
    </p>
    <ul style="color:#444;line-height:1.9;padding-left:20px;margin:0 0 24px;">
      <li>For embroidered items: Hand wash in cold water, avoid machine drying.</li>
      <li>For wooden items: Wipe with a dry cloth, keep away from direct sunlight.</li>
      <li>For personalized gifts: Store in the gift box provided to preserve quality.</li>
      <li>All items: Keep away from moisture for long-lasting beauty.</li>
    </ul>
    <p style="color:#444;line-height:1.7;margin:0 0 24px;">
      Your satisfaction is our priority. If anything isn't right, please let us know right away!
    </p>
    <div style="text-align:center;">
      <a href="https://uphaarandkyddoz.com" 
         style="background:#670E10;color:#fff;padding:14px 32px;border-radius:8px;
                text-decoration:none;font-size:15px;display:inline-block;">
        Shop Again
      </a>
    </div>
  `;

    return sendEmail({
        to: recipient,
        subject: "💝 Tips to Care for Your New Gift",
        html: wrapInTemplate(content),
    });
}

/** Step 3: Review request email */
export async function sendReviewRequestEmail(
    recipient: EmailRecipient,
    orderId: string
) {
    const content = `
    <h2 style="color:#670E10;font-size:22px;margin:0 0 16px;">
      How was your experience? ⭐
    </h2>
    <p style="color:#444;line-height:1.7;margin:0 0 16px;">
      Hi ${recipient.name}, it's been a few days since your order #${orderId} arrived. 
      We'd love to hear what you thought!
    </p>
    <p style="color:#444;line-height:1.7;margin:0 0 24px;">
      Your review helps other customers and helps us improve. It only takes 30 seconds!
    </p>
    <div style="text-align:center;margin:0 0 24px;">
      ${"⭐".repeat(5)}
    </div>
    <div style="text-align:center;">
      <a href="https://g.page/r/YOUR-GOOGLE-REVIEW-LINK" 
         style="background:#670E10;color:#fff;padding:14px 32px;border-radius:8px;
                text-decoration:none;font-size:15px;display:inline-block;">
        Leave a Review
      </a>
    </div>
    <p style="color:#888;font-size:13px;text-align:center;margin:24px 0 0;">
      As a thank you, mention this email in your review and get 10% off your next order!
    </p>
  `;

    return sendEmail({
        to: recipient,
        subject: "⭐ Would you leave us a review?",
        html: wrapInTemplate(content),
    });
}
