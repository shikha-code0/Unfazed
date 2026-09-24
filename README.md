# Unfazed

## 1. Overview

**Problem Statement**  
Therapists and independent mental health professionals struggle with fragmented tools. Managing scheduling, intake forms, digital consent, clinical notes, and payments often requires piecing together multiple generic SaaS products, leading to data silos, privacy risks, and administrative burnout.

**Project Objective**  
Unfazed provides an all-in-one, secure practice management platform specifically tailored for independent therapists. It centralizes client CRM, scheduling, intake, clinical documentation, and billing into a single, cohesive interface, ensuring strict data isolation and privacy.

**Key Features**  
- **Therapist Public Profile**: A customizable public booking page (e.g., `/dr-ananya-sharma`).
- **Smart Scheduling**: Dynamic availability management and automatic conflict resolution.
- **Client CRM**: Comprehensive client profiles tracking history, statuses, and appointments.
- **Secure Intake & Consent**: Digital intake forms and secure electronic consent capture that block bookings until completed.
- **Clinical Notes**: Locked, uneditable private notes post-signature for compliance.
- **Payments & Packages**: Tracking individual session payments and multi-session package balances.
- **Client Portal**: Dedicated secure login for clients to manage forms, appointments, and payments.
- **Dashboard & Analytics**: Real-time insights into practice health, pending intake, and revenue.
- **Global Search & Notifications**: Quick access to clients/sessions and real-time alerts.

**User Roles**  
1. **Therapist**: The practice owner. Full access to schedule, CRM, clinical notes, and revenue data. Data is strictly isolated by `therapistId`.
2. **Client**: The patient. Access is restricted to their own appointments, pending forms (intake/consent), and billing via the Client Portal.
3. **Public User**: An unauthenticated user browsing the public therapist profile to book an initial session.

**Tech Stack**  
- **Frontend**: React (Vite), Tailwind CSS, Lucide React (Icons), Context API for state management.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ODMs).
- **Authentication**: JWT (JSON Web Tokens) with strictly segregated Therapist and Client roles.

---

## 2. Project Structure

The repository is structured as a full-stack monorepo, cleanly separating the frontend client from the backend API.

### Frontend (`/unfazed-frontend`)
- `src/api/` - Axios instance configured with JWT interceptors.
- `src/components/` - Reusable UI components grouped by domain (`common`, `booking`, `crm`, `dashboard`, `portal`).
- `src/context/` - React Context providers (`AuthContext.jsx` manages dual-role authentication state).
- `src/pages/` - Top-level page components (e.g., `Dashboard.jsx`, `ClientProfile.jsx`, `PublicProfile.jsx`).
- `src/App.jsx` - Main router implementation utilizing a `ProtectedRoute` wrapper for role-based access.

### Backend (`/unfazed-backend`)
- `src/models/` - Mongoose schemas defining data structure and relationships.
- `src/controllers/` - Core business logic handling requests and formatting responses.
- `src/routes/` - Express routers mapping endpoints to controller functions.
- `src/middleware/` - Custom middleware, primarily `authMiddleware.js` for verifying JWTs and enforcing `protect` (Therapist), `protectClient` (Client), and `protectAny` access.
- `src/services/` - Reusable business logic abstracted from controllers (e.g., `therapistService.js`).

---

## 3. API Documentation

All API responses follow the standard format: `{ "success": true, "data": {} }` (or `"message"`/`"errors"` on failure).

### Authentication (`/api/auth`)
- `POST /register` - Register a new Therapist. (Public)
- `POST /login` - Therapist login returning JWT. (Public)
- `GET /me` - Get current therapist profile. (Therapist)
- `POST /client/login` - Client login returning JWT. (Public)
- `GET /client/me` - Get current client profile. (Client)

### Therapists (`/api/therapist`)
- `GET /public/:slug` - Fetch public profile data and services. (Public)
- `GET /me` - Get full therapist details. (Therapist)
- `PUT /me` - Update therapist profile/settings. (Therapist)

### Calendar & Bookings (`/api/scheduling`)
- `GET /public/:slug/slots` - Get available booking slots for a date. (Public)
- `POST /book` - Public endpoint to create a session booking. (Public)
- `GET /me` - Get therapist's schedule (date range). (Therapist)
- `GET /me/:sessionId` - Get single session details. (Therapist)
- `PATCH /me/:sessionId` - Update session status. (Therapist)
- `PATCH /me/:sessionId/cancel` - Cancel session. (Therapist)

### Availability (`/api/availability`)
- `GET /public/:slug` - Fetch general availability rules. (Public)
- `GET /me` - Get therapist's availability config. (Therapist)
- `PUT /me` - Update availability config. (Therapist)

### Clients CRM (`/api/clients`)
- `GET /` - List all clients. (Therapist)
- `POST /` - Add a new client. (Therapist)
- `GET /:clientId` - Get full client profile. (Therapist)
- `PATCH /:clientId` - Update client status/tags. (Therapist)
- `DELETE /:clientId` - Delete a client. (Therapist)

### Intake & Consent (`/api/clients/:clientId/...`)
- `GET /intake` - Get client's intake data. (Therapist)
- `PUT /intake` - Update/save intake data. (Therapist)
- `GET /consent` - Get client's signed consent. (Therapist)
- `POST /consent` - Sign digital consent. (Therapist)

### Notes (`/api/notes`)
- `GET /client/:clientId` - Get all notes for a client. (Therapist)
- `POST /` - Create a new clinical note. (Therapist)
- `PUT /:id` - Update a note (fails if status is `signed`). (Therapist)
- `DELETE /:id` - Delete a note. (Therapist)

### Payments & Packages
- `GET /api/payments` - List all payments. (Therapist)
- `POST /api/payments` - Record a new payment. (Therapist)
- `GET /api/packages` - List all active packages. (Therapist)
- `POST /api/packages` - Create a package for a client. (Therapist)

### Analytics & Search
- `GET /api/analytics` - Get dashboard metrics (sessions, revenue). (Therapist)
- `GET /api/search?q=` - Global search across clients, sessions, and payments. (Therapist)

### Notifications & Chat
- `GET /api/notifications` - Get user's notifications. (Therapist | Client)
- `PATCH /api/notifications/read-all` - Mark all read. (Therapist | Client)
- `GET /api/chat/:clientId` - Get chat history. (Therapist | Client)
- `POST /api/chat/:clientId` - Send a message. (Therapist | Client)

---

## 4. Database Documentation

The platform uses MongoDB with the following Mongoose models:

- **Therapist**: The core user. Contains auth credentials, profile data, slug, and service definitions.
- **Client**: Represents the patient. Contains personal info, `therapistId` reference, and nested objects for `intakeData` and `consent`.
  - *Relationship*: Belongs to exactly one `Therapist`.
- **Session**: Represents an appointment. Contains start/end times, `therapistId`, `clientId` (optional for unregistered), and status.
  - *Relationship*: Belongs to a Therapist and optionally a Client.
- **Availability**: Stores the therapist's weekly working hours and timezone.
- **Note**: Clinical progress notes. Contains `therapistId`, `clientId`, `sessionId`, and `status` (`draft` or `signed`).
  - *Relationship*: Links a Therapist to a Client and specific Session.
- **Payment**: Tracks individual financial transactions. Contains amount, status, `therapistId`, `clientId`, and `bookingId`.
- **Package**: Tracks multi-session bundles. Contains `totalSessions`, `usedSessions`, and calculates `remainingSessions`.
- **Notification**: Alerts (unread/read state) assigned to a specific user (`userId`, `userType`).
- **Message**: Chat messages between therapist and client.
- **Lead**: Potential clients captured before full onboarding.
- **Invoice**: For generating billing statements.

---

## 5. Security Documentation

- **Authentication**: JWT-based. Tokens are issued on login and must be passed as `Bearer <token>` in the Authorization header.
- **Role Isolation (Authorization)**: The `authMiddleware.js` exports three distinct guards:
  1. `protect`: Verifies JWT and strictly checks `role !== 'client'`. Injects `req.therapist`.
  2. `protectClient`: Verifies JWT and strictly checks `role === 'client'`. Injects `req.client`.
  3. `protectAny`: Allows either role, injecting `req.therapist` or `req.client` based on the token.
- **Therapist Ownership Checks**: Every protected backend controller enforces data isolation by querying with `{ therapistId: req.therapist._id }`. A therapist can NEVER query, modify, or delete a client, session, or note belonging to another therapist.
- **Intake Data Protection**: The general `GET /api/clients` list query explicitly uses `.select('-intakeData')` to prevent leaking highly sensitive medical data to the dashboard or frontend state. Intake data is only fetched securely via targeted endpoints (`GET /api/clients/:clientId/intake`).
- **Note Immutability**: The `PUT /api/notes/:id` endpoint enforces a strict business rule: if a Note in the database has `status === 'signed'`, the update is rejected with a `403 Forbidden` error.

---

## 6. User Flows

### Therapist Flow
`Login` → lands on `Dashboard` (viewing daily sessions & revenue analytics) → clicks `Clients` → selects a client to view `Client Profile` → reviews `Intake/Consent` tabs → opens `Notes` tab to draft and lock a session note → opens `Payments` tab to log a cash transaction.

### Client Flow
`Login` → lands on `Client Portal` → views `Appointments` (Upcoming/Past) → navigates to `Intake & Forms` to complete pending paperwork → checks `Billing & Packages` for session balances.

### Public User Flow
Visits `unfazed.com/dr-name` (`PublicProfile`) → reads bio and selects a service → uses `SlotPicker` on the Calendar to find availability → fills out name/email in the Booking Wizard → receives booking confirmation.

---

## 7. Final Architecture Diagram

```text
       [Public User Browser]         [Client Portal]           [Therapist Dashboard]
                |                           |                            |
                v                           v                            v
          Public Routes              Protected Routes            Protected Routes
      (Profile, Booking)          (Forms, Appointments)     (CRM, Analytics, Notes)
                |                           |                            |
                +---------------------------+----------------------------+
                                            |
                                  [Express / Node.js]
                                            |
                            +---------------+---------------+
                            |                               |
                 [authMiddleware.js]             [authMiddleware.js]
                  (Public Bypass)           (JWT Validation & Role Guard)
                            |                               |
                            v                               v
                  [Controllers & Services] (Business Logic & Ownership Checks)
                            |                               |
                            +---------------+---------------+
                                            |
                                            v
                                [Mongoose ODM (Models)]
                                            |
                                            v
                                 [MongoDB Database]
```

## Future Scope
- **Telehealth Integration**: Direct Zoom/Google Meet link generation upon booking.
- **Payment Gateway**: Stripe integration for processing actual credit card transactions securely.
- **Calendar Sync**: Two-way sync with Google Calendar/Outlook to block personal events.
- **Automated Reminders**: Email/SMS notifications via SendGrid or Twilio prior to appointments.
