# Sistema de Pregação

## Overview

This is a comprehensive preaching management system built for religious organizations. The application facilitates the coordination and tracking of preaching activities across different territories. It provides features for managing territories and blocks, scheduling preaching days, tracking user participation, and generating activity reports. The system includes role-based access control with different user types (Admin, Coordinator, Leader, Member) and real-time notifications to keep participants informed about upcoming activities and updates.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built using React with TypeScript, utilizing a modern component-based architecture. The application uses Vite as the build tool and development server for fast development and optimized production builds. The UI is constructed with shadcn/ui components built on top of Radix UI primitives, providing accessible and customizable interface elements. TanStack Query handles all server state management and API data fetching, with automatic caching and synchronization. The application uses Wouter for client-side routing, providing a lightweight navigation solution. Styling is handled through Tailwind CSS with a custom design system including CSS variables for theming.

### Backend Architecture
The backend follows a RESTful API design built with Express.js and TypeScript. The server implements a layered architecture with separate concerns for routing, business logic, and data access. Database operations are abstracted through a storage interface that provides methods for all CRUD operations across different entities (users, territories, blocks, preaching days, participations, etc.). The API includes comprehensive route handlers for authentication, territory management, preaching day coordination, and user participation tracking.

### Database Design
The system uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations and schema management. The database schema includes tables for users, territories, blocks, preaching days, participations, work sessions, notifications, and user notifications. The schema supports complex relationships between entities, such as territories containing multiple blocks, preaching days having multiple participants, and users receiving targeted notifications. Database migrations are managed through Drizzle Kit for version control and deployment consistency.

### Authentication System
Authentication is implemented using Replit's OpenID Connect (OIDC) integration with Passport.js for session management. The system maintains user sessions in PostgreSQL using connect-pg-simple for persistent session storage. User authentication state is managed on the frontend through React Query, providing automatic user data fetching and caching. The authentication system supports role-based access control with different permission levels for various user types.

### State Management
The frontend uses TanStack Query as the primary state management solution for server data, handling caching, synchronization, and background updates. Local component state is managed using React's built-in useState and useEffect hooks. The query client is configured with custom error handling and retry logic, particularly for handling authentication errors and network issues.

### UI Component System
The interface is built using a comprehensive component library based on shadcn/ui, which provides pre-built, accessible components. The design system includes custom CSS variables for theming, allowing for consistent styling across the application. Components are built with responsive design principles, ensuring proper functionality across different screen sizes and devices.

## External Dependencies

### Database Services
- **Neon Database**: PostgreSQL-compatible serverless database service used as the primary data store
- **@neondatabase/serverless**: Neon's connection library for serverless environments

### Authentication Services
- **Replit Authentication**: OpenID Connect integration for user authentication and session management
- **openid-client**: OAuth/OIDC client library for handling authentication flows
- **passport**: Authentication middleware for Express.js applications

### UI and Styling Libraries
- **Radix UI**: Accessible, unstyled UI component primitives
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library providing consistent iconography
- **class-variance-authority**: Utility for creating type-safe component variants

### Development and Build Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type checking and enhanced development experience
- **Drizzle ORM**: Type-safe database ORM and query builder
- **TanStack React Query**: Server state management and data fetching library

### Utility Libraries
- **date-fns**: Date manipulation and formatting library with Portuguese locale support
- **wouter**: Lightweight client-side routing
- **zod**: Schema validation for type-safe data handling
- **react-hook-form**: Form state management and validation