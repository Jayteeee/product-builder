# Replit.md

## Overview

This is a Korean food menu recommendation web application called "오늘뭐먹지?" (What should I eat today?). The application helps office workers discover food options based on their preferences for food category, price range, and spice level. It's built as a full-stack web application with a React frontend and Express backend, featuring a step-by-step recommendation wizard interface with extensive menu variety.

## System Architecture

The application follows a modern full-stack architecture:

**Frontend**: React with TypeScript, using Vite for build tooling and development server
**Backend**: Express.js with TypeScript for API endpoints
**Database**: PostgreSQL with Drizzle ORM for data modeling and migrations
**UI Framework**: Tailwind CSS with shadcn/ui component library
**State Management**: TanStack Query for server state management
**Routing**: Wouter for client-side routing

## Key Components

### Frontend Architecture
- **React Components**: Modular UI components following the shadcn/ui design system
- **Step-based UI Flow**: Progressive form with category selection, price range, and spice level preferences
- **Responsive Design**: Mobile-first approach with Korean language support
- **State Management**: TanStack Query for API data fetching and caching

### Backend Architecture
- **Express Server**: RESTful API with middleware for request logging and error handling
- **In-Memory Storage**: Currently using MemStorage class for data persistence (designed to be replaceable with database storage)
- **Type Safety**: Shared TypeScript types and Zod schemas between frontend and backend

### Data Storage
- **Database Schema**: Drizzle ORM with PostgreSQL support configured
- **Tables**: Users and food_recommendations tables defined
- **Current Implementation**: In-memory storage with hardcoded Korean food data
- **Migration Ready**: Drizzle configuration prepared for database migrations

### API Structure
- **POST /api/recommendations**: Returns food recommendation and alternatives based on user preferences
- **Request Validation**: Zod schema validation for recommendation requests
- **Error Handling**: Comprehensive error responses with appropriate HTTP status codes

## Data Flow

1. User selects food category (Korean, Chinese, Japanese, Western, Street food)
2. User chooses price range (Budget, Moderate, Premium)
3. User picks spice level preference (Mild, Medium, Hot)
4. Frontend sends POST request to `/api/recommendations` with preferences
5. Backend filters available food data based on criteria
6. API returns primary recommendation plus alternative options
7. Frontend displays recommendation with food details, ratings, and images

## External Dependencies

### Core Framework Dependencies
- **React 18**: UI framework with hooks and modern patterns
- **Express**: Backend web framework
- **Drizzle ORM**: Type-safe database toolkit
- **Neon Database**: PostgreSQL serverless database (configured but not currently used)

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Unstyled, accessible UI primitives
- **shadcn/ui**: Pre-built component library
- **Lucide React**: Icon library

### Development Tools
- **Vite**: Fast build tool and dev server
- **TypeScript**: Type safety across the stack
- **TanStack Query**: Data fetching and caching
- **Wouter**: Lightweight routing library

## Deployment Strategy

The application is configured for deployment with the following setup:

**Development**: 
- Frontend served by Vite dev server
- Backend runs with tsx for TypeScript execution
- Hot module replacement enabled

**Production**:
- Frontend built with Vite to static assets
- Backend compiled with esbuild to ESM format
- Single server serves both API and static files
- Environment variable configuration for database connection

**Build Process**:
- `npm run build`: Compiles both frontend and backend
- `npm run start`: Runs production server
- Database migrations handled via `npm run db:push`

## Changelog

```
Changelog:
- June 30, 2025. Initial setup
- June 30, 2025. Enhanced menu variety with 29 food items across all categories and price ranges
- June 30, 2025. Fixed recommendation algorithm to properly match user price preferences
- June 30, 2025. Improved image matching for menu items
- June 30, 2025. Changed app title from "점심뭐먹지?" to "오늘뭐먹지?"
- June 30, 2025. Added randomization to recommendations for variety in repeat usage
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```