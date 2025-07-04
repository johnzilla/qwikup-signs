# SmartSign - Smart Sign Cleanup & Bounty Platform

A revolutionary platform that transforms sign cleanup into a community-driven initiative through GPS tracking, QR codes, and automated bounty payments.

## 🚀 Project Overview

SmartSign is a comprehensive web application that connects sign owners, gig workers, and the public to maintain clean, compliant communities. The platform uses modern web technologies to provide real-time tracking, automated payments, and seamless user experiences.

### Key Features

- **Multi-Role System**: Sign owners, gig workers, and public users
- **GPS Tracking**: Precise location tracking for all sign activities
- **QR Code Generation**: Unique codes for each campaign
- **Bounty System**: Automated payments for verified sign cleanup
- **Real-Time Dashboard**: Analytics and compliance monitoring
- **Photo Verification**: Proof of pickup and removal
- **Mobile-First Design**: Responsive across all devices

## 🛠 Tech Stack

- **Frontend**: Next.js 13+ with App Router, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui with Radix UI primitives
- **Database**: Supabase PostgreSQL with Row Level Security
- **Authentication**: Supabase Auth with email/password
- **File Storage**: Supabase Storage for photo uploads
- **Payments**: Stripe Connect for gig worker payouts
- **Deployment**: Ready for Vercel or Netlify

## 📋 User Roles

### Sign Owners
- Create and manage sign campaigns
- Generate unique QR codes for each campaign
- Track sign deployment with GPS coordinates
- Monitor compliance and removal statistics
- Set bounty amounts for sign cleanup

### Gig Workers
- Browse available sign cleanup bounties
- Claim signs on interactive map
- Upload photo proof of pickup
- Verify drop-off locations
- Receive automated payments via Stripe

### Public Users
- Scan QR codes on expired signs
- Submit reports with GPS location
- Help maintain community cleanliness
- No account registration required

## 🏗 Project Structure

```
/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Owner dashboard
│   ├── worker/            # Gig worker interface
│   └── report/            # Public reporting
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── auth/             # Authentication forms
│   ├── dashboard/        # Dashboard components
│   ├── worker/           # Worker interface
│   ├── landing/          # Landing page
│   └── public/           # Public forms
├── lib/                  # Utility functions
├── supabase/            # Database schema and config
│   └── migrations/      # SQL migration files
└── public/              # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Stripe account for payments
- Git for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/smartsign-platform.git
   cd smartsign-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Stripe Configuration
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_webhook_secret

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the migration files in `supabase/migrations/`
   - Configure authentication settings
   - Set up storage bucket for photos

5. **Configure Stripe**
   - Create a Stripe account
   - Set up Stripe Connect for marketplace payments
   - Configure webhook endpoints

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:3000`

## 🗄 Database Schema

### Core Tables

- **profiles**: User profiles and role management
- **campaigns**: Sign campaigns created by owners
- **sign_pins**: Individual sign locations and tracking
- **reports**: Public reports of expired signs
- **claims**: Gig worker claims on bounties
- **payouts**: Payment records and transactions

### Key Features

- Row Level Security (RLS) for data protection
- Automatic timestamps and triggers
- Indexed fields for performance
- Proper foreign key relationships
- Custom enum types for status tracking

## 💳 Payment Integration

The platform uses Stripe Connect to handle marketplace payments:

1. **Sign owners** pay platform fees
2. **Gig workers** receive payouts minus service fees
3. **Automated processing** after photo verification
4. **Secure transactions** with fraud protection

## 📱 Mobile Experience

- **Progressive Web App** capabilities
- **GPS integration** for location tracking
- **Camera access** for photo verification
- **Offline support** for core features
- **Push notifications** for updates

## 🔒 Security Features

- **Row Level Security** in Supabase
- **Role-based access control**
- **Secure file uploads** with validation
- **GPS verification** for authenticity
- **Photo proof** requirements
- **Encrypted payment processing**

## 📈 Analytics & Monitoring

- **Real-time dashboards** for all user types
- **Compliance tracking** and reporting
- **Performance metrics** and KPIs
- **User activity** monitoring
- **Financial reporting** for payouts

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Configure build settings**:
   - Build command: `npm run build`
   - Output directory: `.next`
4. **Deploy** automatically on git push

### Netlify

1. **Connect your repository** to Netlify
2. **Set build command**: `npm run build`
3. **Set publish directory**: `out`
4. **Configure environment variables**
5. **Deploy** your site

## 📋 Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Roadmap

- [ ] Mobile app development (React Native)
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] API for third-party integrations
- [ ] Machine learning for sign detection
- [ ] Blockchain integration for transparency

## 📞 Support

For support, email support@smartsign.com or join our community Discord.

---

**SmartSign** - Transforming communities through smart sign management 🌟