# FUNDamental Grow - Crowdfunding Platform

A production-ready crowdfunding platform built with Next.js 15, Prisma, PostgreSQL, and integrated payment gateway (Razorpay).

## Features

- **User Authentication**: Email/Password + Google OAuth (NextAuth v5)
- **Campaign Management**: Create, approve, and manage fundraising campaigns
- **Secure Payments**: Razorpay integration with signature verification
- **Admin Panel**: Full CRUD operations for campaigns, users, donations
- **Role-Based Access**: User, Admin, Volunteer roles
- **Email Notifications**: Automated emails via Resend
- **Image Uploads**: Cloudinary integration
- **Responsive Design**: Mobile-first approach with Tailwind CSS v4

## Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: JavaScript
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma 6.0
- **Authentication**: NextAuth v5
- **Payments**: Razorpay
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database
- Razorpay account (test mode)
- Cloudinary account
- Resend account

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd fundamental-grow
```

2. Install dependencies
```bash
bun install
# or
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Fill in your actual credentials
```

4. Run database migrations
```bash
bunx prisma generate
bunx prisma db push
```

5. (Optional) Seed database
```bash
bunx prisma db seed
```

6. Start development server
```bash
bun run dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

See `.env.example` for required variables:

- `DATABASE_URL`: PostgreSQL connection string
- `AUTH_SECRET`: Generate using `openssl rand -base64 32`
- `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`: Payment gateway keys
- `CLOUDINARY_*`: Image upload credentials
- `RESEND_API_KEY`: Email service key
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: OAuth credentials

## Project Structure
```
├── app/
│   ├── (admin)/          # Admin panel routes
│   ├── (auth)/           # Authentication pages
│   ├── (portal)/         # Volunteer dashboard
│   ├── (public)/         # Public-facing pages
│   └── api/              # API routes
├── components/
│   ├── admin/            # Admin components
│   ├── public/           # Public components
│   └── ui/               # Reusable UI components
├── lib/
│   ├── auth.js           # NextAuth configuration
│   ├── prisma.js         # Prisma client
│   ├── razorpay.js       # Payment integration
│   ├── email.js          # Email service
│   └── utils.js          # Utility functions
└── prisma/
    └── schema.prisma     # Database schema
```

## Key Features Implemented

### Security
- ✅ Payment signature verification
- ✅ Idempotency for duplicate payments
- ✅ Role-based access control
- ✅ API route protection
- ✅ Rate limiting (5 req/min per IP)
- ✅ Input validation with Zod
- ✅ XSS protection

### Performance
- ✅ Cursor-based pagination
- ✅ Database indexes optimized
- ✅ Dynamic imports for code splitting
- ✅ Image optimization via Cloudinary

### Payment Flow
1. User submits donation form
2. Backend creates Razorpay order
3. Razorpay checkout opens
4. User completes payment
5. Backend verifies signature
6. Atomic transaction: Create donation + Update campaign
7. Email receipt sent

## API Endpoints

### Public
- `GET /api/campaigns` - List campaigns (paginated)
- `POST /api/payment/create-order` - Create payment order
- `POST /api/payment/verify` - Verify payment
- `POST /api/fundraiser-requests` - Submit request

### Admin Only
- `GET /api/users` - List users
- `PUT /api/campaigns/[id]` - Update campaign
- `GET /api/donations` - List donations
- `PUT /api/fundraiser-requests/[id]` - Approve/reject

## Testing

### Payment Testing (Razorpay Test Mode)

**UPI IDs:**
- `success@razorpay` - Payment success
- `failure@razorpay` - Payment failure

**Test Card:**
- Number: `4111 1111 1111 1111`
- Expiry: Any future date
- CVV: `123`

### Create Admin User
```bash
bunx prisma studio
# Open User table
# Set role = "admin" for your email
```

## Production Deployment

1. Set environment to production in `.env`
2. Update `NEXT_PUBLIC_APP_URL` to production domain
3. Switch Razorpay to live mode
4. Run migrations: `bunx prisma migrate deploy`
5. Deploy to Vercel/Railway/AWS

## Contributing

This is a final year project. Contributions are welcome!

## License

MIT License

## Author

Mohammed Saif
```

---

## Summary - STEP 4 Complete

**3 New Files:**
1. `/.env.example` - Template for env variables
2. `/lib/rate-limit.js` - Rate limiting utility
3. `/README.md` - Complete documentation

**1 Updated File:**
4. `/app/api/fundraiser-requests/route.js` - Rate limiting added

---

## FINAL CHECKLIST - Production Ready
```
✅ Payment Flow
  ✅ Razorpay order creation
  ✅ Signature verification
  ✅ Idempotency
  ✅ Transaction safety

✅ Security
  ✅ Auth on all routes
  ✅ Ownership validation
  ✅ Rate limiting (5/min per IP)
  ✅ Admin-only routes
  ✅ Input validation

✅ Performance
  ✅ Pagination (cursor-based)
  ✅ Database indexes
  ✅ Dynamic imports

✅ Code Quality
  ✅ Error handling
  ✅ Consistent patterns
  ✅ No dead code

✅ Documentation
  ✅ README complete
  ✅ .env.example
  ✅ Code comments