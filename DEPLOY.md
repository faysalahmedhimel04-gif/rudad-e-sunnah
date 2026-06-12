# Deploy Rudad E Sunnah to Vercel + GitHub + MongoDB

This guide takes the main site + full Admin Panel live.

## 1. Prerequisites

- GitHub account
- Vercel account (free)
- MongoDB Atlas account (free tier is enough)

## 2. Push to GitHub

```bash
cd D:\Website\rudad-e-sunnah
git init
git add .
git commit -m "feat: production-ready admin + MongoDB + Vercel Blob uploads"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/rudad-e-sunnah.git
git push -u origin main
```

## 3. Set up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster (M0)
3. Create a database user (username + strong password)
4. Network Access → Add IP → Allow access from anywhere (0.0.0.0/0) for Vercel
5. Get connection string (MongoDB + Atlas → Connect → Drivers → Node.js)
6. Format: `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/rudad-e-sunnah?retryWrites=true&w=majority`

## 4. Deploy on Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repo (`rudad-e-sunnah`)
3. Vercel will auto-detect Next.js

### Required Environment Variables (in Vercel Dashboard → Settings → Environment Variables)

Add these **before** first deploy or redeploy after adding:

- `MONGODB_URI` = your full Atlas connection string
- `ADMIN_USER` = `admin` (or change it)
- `ADMIN_PASSWORD` = a strong password (very important!)
- `JWT_SECRET` = generate a long random string (or let Vercel handle)
- `BLOB_READ_WRITE_TOKEN` = (strongly recommended)
  - In Vercel project → Storage tab → Create Blob Store → Copy the token

After adding variables, click **Redeploy**.

## 5. First Visit After Deploy

- Main site: `https://your-project.vercel.app`
- Admin: `https://your-project.vercel.app/admin`
  - Login with the `ADMIN_USER` / `ADMIN_PASSWORD` you set in env vars

On first load of `/api/products`, the app will automatically seed the beautiful original product catalog into MongoDB.

## 6. Image Uploads

- In development: images saved to `public/uploads/products/`
- In production (with `BLOB_READ_WRITE_TOKEN`): images are uploaded to Vercel Blob (persistent + global CDN)

## 7. Important Notes for Live

- The current checkout in the cart creates real orders in MongoDB.
- All admin CRUD (products, orders status) now talks to real MongoDB.
- Authentication is enforced by middleware + httpOnly JWT cookies.
- Change the default admin password immediately via Vercel env vars.

## 8. Future Improvements (recommended after launch)

- Add real user accounts / NextAuth
- Stripe checkout instead of prompt-based
- Full categories API + image upload for categories
- Admin user management
- Order email notifications (Resend / SendGrid)

You are now live with a real full-stack Islamic e-commerce admin panel!
