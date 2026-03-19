# Tour Guides Israel 🧭

A modern platform connecting travelers with licensed professional tour guides across Israel. Built with TanStack Start, Supabase, and TailwindCSS.

![TanStack Start](https://img.shields.io/badge/TanStack-Start-orange)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## Features

- 🔍 **Guide Search** - Find guides by region, language, and tour type
- 👤 **Guide Profiles** - Detailed profiles with photos, reviews, and availability
- 📝 **Guide Registration** - Multi-step registration wizard
- 🔐 **Authentication** - Email/password and Google OAuth
- 📊 **Dashboard** - Analytics, messaging, and profile management
- 🌍 **i18n** - Hebrew and English support with RTL
- 🎨 **Modern UI** - Desert/Mediterranean themed design

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) (Full-stack React)
- **Routing**: [TanStack Router](https://tanstack.com/router) (Type-safe routing)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Database**: [Supabase](https://supabase.com) (PostgreSQL + Auth + Storage)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com)
- **UI Components**: Radix UI primitives
- **i18n**: i18next + react-i18next
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/YakovYeger/tour-guides-israel.git
cd tour-guides-israel

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

### Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Project Structure

```
src/
├── routes/           # File-based routing
│   ├── index.tsx     # Home page
│   ├── guides/       # Guide search & profiles
│   ├── dashboard/    # Guide dashboard
│   └── auth/         # Authentication
├── components/       # React components
│   ├── ui/           # Base UI components
│   ├── layout/       # Navbar, Footer
│   ├── home/         # Home page sections
│   └── guides/       # Guide-specific components
├── hooks/            # Custom React hooks
├── lib/              # Utilities and configs
│   ├── supabase/     # Supabase clients
│   ├── i18n/         # Internationalization
│   └── utils/        # Helper functions
├── messages/         # Translation files (en/he)
└── types/            # TypeScript types
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
```

## Database Schema

The Supabase database includes:
- `guides` - Tour guide profiles
- `reviews` - Client reviews
- `conversations` & `messages` - Messaging system
- `user_memberships` - Subscription tiers
- `tour_events` - Tours and events
- `blog_posts` - Guide blog articles
- And more...

## License

MIT License

## Author

Built by Jacob Yeger
