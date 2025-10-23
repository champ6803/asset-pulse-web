# Asset Pulse Web Frontend Setup Guide

## Prerequisites
- Node.js 18+
- npm or yarn

## Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Features Implemented

✅ **Authentication System**
- Login page with role selection
- JWT token management
- Role-based routing
- Mock authentication with API fallback

✅ **Role-based Dashboards**
- Employee Dashboard
- Manager Dashboard
- CTO Dashboard
- Group CTO Dashboard

✅ **AI Integration Ready**
- JD Recommendation form
- AI rationale modal
- Mock API client with real API fallback

✅ **UI Components**
- Reusable component library
- Tailwind CSS styling
- Responsive design
- Font Awesome icons

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── dashboard/         # Role-based dashboards
│   ├── login/             # Authentication
│   ├── requests/          # Request management
│   └── ...
├── components/            # Reusable components
│   ├── layout/           # Layout components
│   ├── ui/               # UI components
│   └── modals/           # Modal components
├── lib/                   # Utilities and services
│   ├── api.ts            # API client
│   ├── store/            # Zustand stores
│   └── utils.ts          # Utility functions
└── types/                # TypeScript types
```

## API Integration

The frontend is configured to connect to the Asset Pulse API:

- **Development**: `http://localhost:8080/api/v1`
- **Production**: Set `NEXT_PUBLIC_API_URL` environment variable

### Authentication Flow

1. User logs in with username/password
2. Frontend calls `/api/v1/auth/login`
3. Receives JWT token and user data
4. Token stored in Zustand store
5. All API calls include `Authorization: Bearer <token>`

### Role-based Access

- **Employee**: Basic asset access, request software
- **Manager**: Team management, approvals, templates
- **CTO**: Seat optimization, analytics
- **Group CTO**: Consolidation, cross-subsidiary analysis

## Mock Data

The application includes mock data for development:

- **Users**: employee@scb.com, manager@scb.com, cto@scb.com
- **Password**: password (for all accounts)
- **Roles**: Automatically assigned based on email

## Next Steps

1. **API Connection**: Ensure backend API is running
2. **Real Data**: Replace mock data with real API calls
3. **Testing**: Add unit tests and integration tests
4. **Deployment**: Set up production build and deployment
5. **Performance**: Optimize bundle size and loading times
