# Setting Up Authentication and Admin Panel

## Overview
This guide will help you set up the complete authentication and admin panel for your e-commerce application. Follow these steps in order.

## Step 1: Set Up Supabase Database

### 1.1 Run the SQL Script
1. Open your Supabase project dashboard at https://supabase.com/dashboard
2. Navigate to the **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy the entire contents of `supabase-setup.sql` file
5. Paste it into the SQL editor
6. Click **Run** (or press Cmd+Enter)

This will create:
- `products` table for your products
- `profiles` table for user information and admin roles
- `products` storage bucket for product images
- All necessary Row Level Security (RLS) policies
- Helper functions for admin checks

### 1.2 Verify the Tables Were Created
1. Go to **Table Editor** in the left sidebar
2. You should see these tables:
   - `products`
   - `profiles`
3. Go to **Storage** in the left sidebar
4. You should see a bucket named `products`

## Step 2: Create Your Admin Account

### 2.1 Sign Up Through Your Website
1. Make sure your development server is running:
   ```bash
   npm run dev
   ```
2. Open your website at http://localhost:3000
3. Click the **user icon** in the top right corner
4. Click **Sign Up** tab
5. Enter your email and password
6. Click **Create Account**

### 2.2 Find Your User ID
1. Go back to Supabase Dashboard
2. Navigate to **Authentication** > **Users** in the left sidebar
3. Find your newly created user
4. Copy the **ID** (it's a UUID like `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

### 2.3 Grant Admin Access
1. Go to **SQL Editor** in Supabase
2. Create a new query
3. Run this command (replace `YOUR-USER-ID-HERE` with your actual user ID):

```sql
UPDATE profiles SET role = 'admin' WHERE id = 'YOUR-USER-ID-HERE';
```

If the profile doesn't exist yet, use this instead:

```sql
INSERT INTO profiles (id, email, role)
VALUES ('YOUR-USER-ID-HERE', 'your-email@example.com', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

4. You should see a success message like "Success. No rows returned"

## Step 3: Verify Admin Access

### 3.1 Test Logging In
1. Go to your website
2. Click the **user icon** in the top right
3. If you're not logged in, enter your credentials and log in
4. Click the user icon again
5. You should see a dropdown menu with:
   - Your email address
   - 🛠️ Admin Panel
   - 🚪 Logout

### 3.2 Access the Admin Panel
1. Click **🛠️ Admin Panel** from the dropdown
2. You should be redirected to `/admin`
3. You should see:
   - "Admin Panel" heading
   - A product creation form
   - A list of existing products (may be empty initially)

## Step 4: Test Product Management

### 4.1 Create a New Product
1. On the admin page, fill out the form:
   - **Name**: Test Product
   - **Price**: 999
   - **Category**: Select one (uphaar/kyddoz/festive)
   - **Image Ratio**: Select preferred ratio
   - **Delivery Time**: e.g., "3-5 days"
   - **Description**: Add some description
   - Check **featured** if you want it on the home page
   - Click **Choose Files** to upload product images
2. Click **Create Product**
3. The product should appear in the "Existing Products" section below

### 4.2 Edit a Product
1. Find the product in the list
2. Click **Edit**
3. The form above will populate with the product's data
4. Make your changes
5. Click **Update Product**

### 4.3 Delete a Product
1. Find the product in the list
2. Click **Delete**
3. Confirm the deletion
4. The product should be removed from the list

### 4.4 View Products on Website
1. Go to the home page
2. If you marked the product as "featured", it should appear in the "Featured Products" section
3. Go to the appropriate brand page (Uphaar/Kyddoz/Festive Picks)
4. The product should appear there based on its category

## Common Issues and Solutions

### Issue: "Access Denied" when visiting /admin
**Solution**: Make sure you completed Step 2.3 to grant admin access to your user.

### Issue: Products not showing on the website
**Possible causes**:
1. **Not marked as featured**: Only featured products show on the home page
2. **Database connection issue**: Check your `.env.local` file has correct Supabase credentials
3. **Wrong category**: Make sure the product's category matches the page you're viewing

### Issue: Can't upload images
**Possible causes**:
1. **Storage bucket not created**: Go back to Step 1.1
2. **Not authenticated**: Make sure you're logged in
3. **File too large**: Try with smaller images (< 5MB)

### Issue: "Please log in to access admin" message
**Solution**: Click the user icon and log in with your admin account.

### Issue: Products not updating/deleting
**Possible causes**:
1. **Not admin**: Verify you completed Step 2.3
2. **Network error**: Check console for errors
3. **Database permissions**: Verify RLS policies were created in Step 1.1

## How It All Works

### Authentication Flow
1. Users click the user icon → Auth modal appears
2. Users can sign up or log in
3. On successful auth, user data is stored in Supabase
4. A profile is created automatically (if signup includes profile creation)

### Admin Access Control
1. When user visits `/admin`, the page checks:
   - Is the user logged in?
   - Does the user have `role = 'admin'` in the profiles table?
2. If both are true → Admin panel is shown
3. If not logged in → "Please log in" message
4. If logged in but not admin → "Access Denied" message

### Product Management
1. Admin creates/edits product → Data saved to `products` table
2. Images uploaded → Stored in `products` storage bucket
3. Home page → Fetches products with `featured = true`
4. Brand pages → Fetches products by category
5. Real-time updates → Products appear immediately after creation

## Next Steps

### Optional Enhancements
1. **Add more admins**: Repeat Step 2 for each admin user
2. **Customize product fields**: Modify the `products` table schema
3. **Add product categories**: Update the category enum in the database
4. **Add bulk upload**: Create a CSV import feature
5. **Add analytics**: Track product views and sales

### Security Best Practices
1. **Never share your admin credentials**
2. **Use strong passwords** for admin accounts
3. **Regularly review** who has admin access
4. **Enable MFA** in Supabase for extra security
5. **Monitor logs** in Supabase for suspicious activity

## Getting Help

If you encounter issues not covered here:
1. Check the browser console for error messages
2. Check the Supabase logs in the Dashboard
3. Verify your `.env.local` file has the correct values
4. Make sure your development server is running

## Environment Variables

Make sure your `.env.local` file contains:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Get these from: Supabase Dashboard → Settings → API
