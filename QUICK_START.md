# Quick Start Checklist ✅

## Supabase Setup (Do This First!)

### 1. Run SQL Script
- [ ] Go to Supabase Dashboard → SQL Editor
- [ ] Copy all content from `supabase-setup.sql`
- [ ] Paste and click **Run**
- [ ] Verify tables created: `products`, `profiles`
- [ ] Verify storage bucket created: `products`

### 2. Create Admin Account
- [ ] Run `npm run dev` in terminal
- [ ] Open http://localhost:3000
- [ ] Click user icon → Sign Up
- [ ] Create account with email/password
- [ ] Copy your User ID from Supabase Dashboard → Authentication → Users

### 3. Grant Admin Access (CRITICAL!)
- [ ] Go to Supabase Dashboard → SQL Editor
- [ ] Run this SQL (replace with your User ID):
```sql
UPDATE profiles SET role = 'admin' WHERE id = 'YOUR-USER-ID-HERE';
```
OR if profile doesn't exist:
```sql
INSERT INTO profiles (id, email, role)
VALUES ('YOUR-USER-ID-HERE', 'your-email@example.com', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

## Test Everything

### 4. Verify Login Works
- [ ] Click user icon on website
- [ ] Log in with your credentials
- [ ] See dropdown with "Admin Panel" option

### 5. Verify Admin Panel Works
- [ ] Click "🛠️ Admin Panel" from dropdown
- [ ] See admin page (not "Access Denied")
- [ ] See product creation form

### 6. Test Product Management
- [ ] Create a test product
- [ ] Mark it as "featured"
- [ ] Upload an image
- [ ] Click "Create Product"
- [ ] Verify it appears in product list below
- [ ] Try editing the product
- [ ] Try deleting the product

### 7. Verify Products Show on Website
- [ ] Go to home page
- [ ] Check if featured product appears
- [ ] Go to brand page (Uphaar/Kyddoz/Festive)
- [ ] Check if product appears based on category

## ✅ All Done!

If everything above works, your setup is complete!

## 🚨 If Something's Wrong

### Can't access admin panel?
→ Did you run Step 3? Check your role in Supabase Dashboard → Table Editor → profiles

### Products not saving?
→ Check browser console for errors. Verify Supabase connection in .env.local

### Images not uploading?
→ Verify storage bucket 'products' exists in Supabase Dashboard → Storage

### Can't see products on website?
→ Make sure product is marked as "featured" (for home page) or has correct category (for brand pages)
