# Syft - AI-Powered Recruitment Platform

## Overview

Syft is a modern recruitment platform that leverages AI to streamline the hiring process. Built with React, TypeScript, and Supabase, it offers a comprehensive solution for managing job postings, candidate applications, and recruitment analytics.

## Key Features

- 🤖 AI-powered candidate screening and interviews
- 📊 Real-time analytics dashboard
- 🔄 Multi-channel job posting (LinkedIn, etc.)
- 👥 Candidate management system
- 💼 Company and user management
- 📈 Performance metrics and reporting
- 🔐 Role-based access control
- 💳 Subscription management with Stripe

## Tech Stack

- **Frontend:**
  - React 18
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - Lucide React (icons)

- **Backend:**
  - Supabase (PostgreSQL)
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Edge Functions

- **Authentication:**
  - Supabase Auth
  - Role-based access control

- **Payments:**
  - Stripe integration
  - Subscription management

## Project Structure

```
src/
├── components/         # Reusable UI components
├── lib/               # Utility functions and API clients
├── pages/             # Page components and routes
│   ├── admin/         # Admin dashboard pages
│   └── dashboard/     # User dashboard pages
└── types/             # TypeScript type definitions

supabase/
└── migrations/        # Database migrations
```

## Database Schema

### Core Tables

- `users` - User profiles and settings
- `admin_users` - Administrative user accounts
- `jobs` - Job postings and details
- `job_applications` - Candidate applications
- `job_analytics` - Real-time job performance metrics
- `job_board_postings` - External job board integrations

### Supporting Tables

- `support_tickets` - Customer support system
- `subscription_plans` - Available subscription tiers
- `subscriptions` - User subscription records
- `payment_methods` - Stored payment methods

## Setup Instructions

1. **Environment Setup**
   ```bash
   # Clone the repository
   git clone [repository-url]
   cd syft

   # Install dependencies
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file with:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
   ```

3. **Development**
   ```bash
   # Start development server
   npm run dev
   ```

4. **Build**
   ```bash
   # Create production build
   npm run build
   ```

## Key Integrations

### LinkedIn Integration
- Job posting via LinkedIn API2
- Application tracking
- Analytics integration

### Stripe Integration
- Subscription management
- Payment processing
- Usage-based billing

## Security

- Row Level Security (RLS) policies for all tables
- Role-based access control
- Secure authentication flow
- Data encryption at rest

## Deployment

The application is configured for deployment on Netlify with:
- Automatic builds and deployments
- Environment variable management
- Edge function support

## Monitoring

- Real-time analytics tracking
- Error tracking and reporting
- Performance monitoring
- User activity logging

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

Proprietary software. All rights reserved.

## Support

For technical support, please contact the development team through:
- Email: support@usesyft.com
- Internal documentation: [link]