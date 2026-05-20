# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev          # Start Expo dev server (clears cache)
npm run ios          # Start on iOS simulator
npm run android      # Start on Android emulator
npm run web          # Start web version
npm run clean        # Remove .expo and node_modules
```

Press `i` for iOS, `a` for Android, or `w` for web after starting the dev server.

## Architecture Overview

This is a React Native Expo app for wedding hall booking with these key architectural decisions:

### Routing (Expo Router - File-based)
- `app/_layout.tsx` - Root layout with ThemeProvider wrapper
- `app/(tabs)/` - Authenticated tab navigation (home, halls, myBooking, profile)
- `app/(tabs)/_layout.tsx` - Auth guard that redirects to `/register` if unauthenticated
- `app/halls/[id].tsx` - Dynamic route for hall details
- `app/booking/[id].tsx` - Dynamic route for booking details

### Authentication (Token-based)
- `lib/auth.ts` - Auth client configuration
- Tokens stored securely via `expo-secure-store`
- API base URL: `https://api.qaat.app` (prod) or `http://localhost:3333` (dev)
- Bearer token auth: `Authorization: Bearer {token}`

### Company Status Flow
Company must be `approved` before creating halls or managing bookings:
- `pending` - Awaiting admin approval (show pending screen)
- `approved` - Full access
- `rejected` - Show rejection reason
- `suspended` - Show suspension notice

### State Management
- React Context for theme (`lib/theme-context.tsx`) - persists to AsyncStorage
- Server state with TanStack React Query
- API hooks in `hooks/api/` directory

### API Layer
- `utils/api.ts` - Axios instance with `EXPO_PUBLIC_API_URL` base URL
- Custom hooks pattern: `useLogin`, `useBookHall`, `useAddHalls`

### Styling
- NativeWind (Tailwind CSS for React Native)
- Shadcn-style components in `components/ui/`
- Add new components: `npx @react-native-reusables/cli@latest add [component]`
- Theme colors defined in `global.css` (lavender-based palette)
- Class utilities via `lib/utils.ts` (cn function for tailwind-merge)

### Internationalization
- `lib/i18n.ts` - i18next setup with Arabic (ar) and English (en)
- Translation files in `locals/` directory
- Language persisted to AsyncStorage, defaults to device locale
- Fallback language: Arabic

### Path Aliases
```
@/components  → components/
@/lib         → lib/
@/hooks       → hooks/
@/components/ui → components/ui/
```

## API Endpoints

### Auth
- `POST /api/companies/register` - Register company (returns pending status)
- `POST /api/companies/login` - Login
- `GET /api/companies/me` - Get current company profile
- `POST /api/companies/logout` - Revoke token

### Halls (requires approved status)
- `GET /api/companies/halls` - List company's halls
- `GET /api/companies/halls/{id}` - Hall details
- `POST /api/companies/halls` - Create hall
- `PUT /api/companies/halls/{id}` - Update hall
- `DELETE /api/companies/halls/{id}` - Delete hall

### Bookings (requires approved status)
- `GET /api/companies/bookings` - List all bookings
- `GET /api/companies/bookings/pending` - Pending bookings needing response
- `GET /api/companies/bookings/{id}` - Booking details
- `PATCH /api/companies/bookings/{id}/accept` - Accept booking
- `PATCH /api/companies/bookings/{id}/reject` - Reject with reason

### Notifications
- `GET /api/companies/notifications` - List notifications
- `GET /api/companies/notifications/unread-count` - Unread count
- `PATCH /api/companies/notifications/{id}/read` - Mark as read
- `PATCH /api/companies/notifications/read-all` - Mark all read

## Key Patterns

- Form validation uses React Hook Form + Zod schemas (see `types/types.ts`)
- Hall-specific components live in `components/halls/`
- UI primitives from `@rn-primitives/*` packages wrapped in `components/ui/`
- Theme toggle available in profile screen, uses `useTheme()` hook
- All tab screens are protected - auth check happens in `(tabs)/_layout.tsx`
- Bookings expire after 7 days without company response
- Date format: `YYYY-MM-DD`, Time: `HH:MM` (24h), Timestamps: ISO 8601


///////////////////////
api docs
///////////


# QaaAt Company App — API Documentation

Base URL: `{API_BASE_URL}/api`

> All response keys are **camelCase**. Request body keys are also **camelCase**.

## Authentication

All authenticated endpoints require the header:

```
Authorization: Bearer {token}
```

Tokens are returned from `/companies/register` and `/companies/login`.

### Error Responses (Global)

**401 Unauthorized** (missing/invalid token on protected routes):

```json
{ "errors": [{ "message": "Unauthorized access" }] }
```

**403 Company Account Required** (non-company account accessing company routes):

```json
{ "message": "Access denied. Company account required." }
```

**403 Company Not Approved** (approved-only routes when company is pending/rejected/suspended):

```json
{
  "message": "Your company is pending admin approval. You cannot perform this action yet.",
  "code": "COMPANY_PENDING_APPROVAL"
}
```

```json
{
  "message": "Your company registration was rejected. Please contact support for more information.",
  "code": "COMPANY_REJECTED",
  "reason": "..."
}
```

```json
{
  "message": "Your company account has been suspended. Please contact support.",
  "code": "COMPANY_SUSPENDED"
}
```

**422 Validation Error** (invalid request body):

```json
{ "errors": [{ "message": "...", "rule": "...", "field": "..." }] }
```

---

## 1. Auth Endpoints

### POST `/companies/register`

Register a new company account. The company starts in `pending` status and must be approved by an admin before it can manage halls or bookings.

**Auth:** None

**Content-Type:** `multipart/form-data` (required for file upload)

**Request Body:**

| Field                   | Type   | Required | Rules               |
| ----------------------- | ------ | -------- | ------------------- |
| `email`                 | string | yes      | valid email, unique |
| `password`              | string | yes      | min 8 characters    |
| `companyName`           | string | yes      |                     |
| `city`                  | string | yes      |                     |
| `taxId`                 | string | no       |                     |
| `registrationNumber`    | string | yes      | CR number           |
| `registrationNumberPdf` | file   | yes      | PDF file (max 10MB) |
| `businessLicense`       | string | no       |                     |
| `contactPerson`         | string | no       |                     |
| `businessAddress`       | string | yes      |                     |
| `description`           | string | no       |                     |
| `logo`                  | string | no       |                     |
| `banner`                | string | no       |                     |
| `website`               | string | no       |                     |
| `socialLinks`           | any    | no       | JSON object         |

**Response 201:**

```json
{
  "message": "Company registered successfully. Your account is pending admin approval.",
  "user": {
    "id": 1,
    "email": "company@example.com",
    "userType": "company"
  },
  "company": {
    "id": 1,
    "companyName": "Events Co.",
    "city": "Riyadh",
    "status": "pending"
  },
  "token": {
    "type": "bearer",
    "token": "oat_MTA.aWQ..."
  }
}
```

---

### POST `/companies/login`

**Auth:** None

**Request Body:**

| Field      | Type   | Required |
| ---------- | ------ | -------- |
| `email`    | string | yes      |
| `password` | string | yes      |

**Response 200:**

```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "company@example.com",
    "userType": "company"
  },
  "company": {
    "id": 1,
    "taxId": "300123456789",
    "registrationNumber": "CR-1234567890",
    "registrationNumberPdf": null,
    "businessLicense": null,
    "contactPerson": "Ahmed Al-Salem",
    "businessAddress": "123 King Fahd Road",
    "city": "Riyadh",
    "userId": 1,
    "createdAt": "2025-01-01T00:00:00.000+00:00",
    "updatedAt": "2025-01-01T00:00:00.000+00:00",
    "deletedAt": null,
    "status": "approved",
    "approvedAt": "2025-01-01T00:00:00.000+00:00",
    "approvedBy": 1,
    "rejectionReason": null,
    "rejectedAt": null,
    "companyProfile": {
      "id": 1,
      "companyName": "Events Co.",
      "description": "We organize events",
      "logo": "https://...",
      "banner": null,
      "website": "https://events.co",
      "socialLinks": null,
      "userId": 1,
      "createdAt": "2025-01-01T00:00:00.000+00:00",
      "updatedAt": "2025-01-01T00:00:00.000+00:00",
      "deletedAt": null
    }
  },
  "token": {
    "type": "bearer",
    "token": "oat_MTA.aWQ..."
  }
}
```

> The `message` field changes based on company status:
>
> - `"Login successful"` — approved
> - `"Login successful. Your company is pending admin approval."` — pending
> - `"Login successful. Your company registration was rejected."` — rejected
> - `"Login successful. Your company account is suspended."` — suspended

**Response 401:**

```json
{ "message": "Invalid credentials" }
```

---

### GET `/companies/me`

Get the authenticated company's profile.

**Auth:** Bearer token

**Response 200:**

```json
{
  "user": {
    "id": 1,
    "email": "company@example.com",
    "userType": "company"
  },
  "company": {
    "id": 1,
    "taxId": "300123456789",
    "registrationNumber": "CR-1234567890",
    "registrationNumberPdf": null,
    "businessLicense": null,
    "contactPerson": "Ahmed Al-Salem",
    "businessAddress": "123 King Fahd Road",
    "city": "Riyadh",
    "userId": 1,
    "status": "approved",
    "approvedAt": "2025-01-01T00:00:00.000+00:00",
    "approvedBy": 1,
    "rejectionReason": null,
    "rejectedAt": null,
    "createdAt": "2025-01-01T00:00:00.000+00:00",
    "updatedAt": "2025-01-01T00:00:00.000+00:00",
    "deletedAt": null,
    "companyProfile": {
      "id": 1,
      "companyName": "Events Co.",
      "description": "We organize events",
      "logo": "https://...",
      "banner": null,
      "website": "https://events.co",
      "socialLinks": null,
      "userId": 1,
      "createdAt": "2025-01-01T00:00:00.000+00:00",
      "updatedAt": "2025-01-01T00:00:00.000+00:00",
      "deletedAt": null
    }
  }
}
```

---

### POST `/companies/logout`

Revoke the current access token.

**Auth:** Bearer token

**Response 200:**

```json
{ "message": "Logged out successfully" }
```

---

## 2. Hall Management Endpoints

All hall endpoints require authentication with a company account. Creating, updating, and deleting halls also require the company to be **approved**.

### GET `/companies/halls`

List all halls belonging to the authenticated company.

**Auth:** Bearer token (company)

**Query Parameters:**

| Param   | Type   | Default | Description              |
| ------- | ------ | ------- | ------------------------ |
| `page`  | number | 1       | Page number              |
| `limit` | number | 20      | Items per page (max 100) |

**Response 200:**

```json
{
  "meta": {
    "total": 5,
    "perPage": 20,
    "currentPage": 1,
    "lastPage": 1,
    "firstPage": 1,
    "firstPageUrl": "/?page=1",
    "lastPageUrl": "/?page=1",
    "nextPageUrl": null,
    "previousPageUrl": null
  },
  "data": [
    {
      "id": 1,
      "name": "Grand Hall",
      "description": "A luxury hall...",
      "capacity": 200,
      "location": "Downtown",
      "amenities": { "wifi": true, "parking": true },
      "pricing": "500.00",
      "images": ["https://...jpg"],
      "address": "123 Main St",
      "city": "Riyadh",
      "services": ["free coffee", "free sweets", "valet parking"],
      "isAvailable": true,
      "companyId": 1,
      "createdAt": "2025-01-01T00:00:00.000+00:00",
      "updatedAt": "2025-01-01T00:00:00.000+00:00",
      "deletedAt": null
    }
  ]
}
```

---

### GET `/companies/halls/:id`

Get a single hall by ID (must belong to the authenticated company). Includes the hall's bookings.

**Auth:** Bearer token (company)

**Response 200:** Single hall object (same shape as list items above, plus a `bookings` array).

**Response 404 (E_ROW_NOT_FOUND):**

```json
{ "errors": [{ "message": "Row not found" }] }
```

---

### POST `/companies/halls`

Create a new hall.

**Auth:** Bearer token (approved company)

**Request Body:**

| Field         | Type     | Required | Rules                                                                         |
| ------------- | -------- | -------- | ----------------------------------------------------------------------------- |
| `name`        | string   | yes      |                                                                               |
| `capacity`    | number   | yes      | min 1                                                                         |
| `location`    | string   | yes      |                                                                               |
| `pricing`     | number   | yes      | min 0                                                                         |
| `address`     | string   | yes      |                                                                               |
| `city`        | string   | yes      |                                                                               |
| `description` | string   | no       |                                                                               |
| `amenities`   | object   | no       | JSON object                                                                   |
| `images`      | string[] | no       | array of URLs                                                                 |
| `services`    | string[] | no       | free services included with booking (e.g. `["free coffee", "valet parking"]`) |
| `isAvailable` | boolean  | no       | defaults to `true`                                                            |

**Response 201:**

```json
{
  "message": "Hall created successfully",
  "hall": {
    "id": 1,
    "name": "Grand Hall",
    "description": "A luxury hall...",
    "capacity": 200,
    "location": "Downtown",
    "amenities": { "wifi": true },
    "pricing": "500.00",
    "images": ["https://...jpg"],
    "address": "123 Main St",
    "city": "Riyadh",
    "services": ["free coffee", "free sweets", "valet parking"],
    "isAvailable": true,
    "companyId": 1,
    "createdAt": "2025-01-01T00:00:00.000+00:00",
    "updatedAt": "2025-01-01T00:00:00.000+00:00"
  }
}
```

---

### PUT `/companies/halls/:id`

Update a hall. All required fields must be sent (full replacement).

**Auth:** Bearer token (approved company)

**Request Body:** Same as POST `/companies/halls`.

**Response 200:**

```json
{
  "message": "Hall updated successfully",
  "hall": { ... }
}
```

**Response 404 (E_ROW_NOT_FOUND):**

```json
{ "errors": [{ "message": "Row not found" }] }
```

---

### DELETE `/companies/halls/:id`

Soft-delete a hall.

**Auth:** Bearer token (approved company)

**Response 200:**

```json
{ "message": "Hall deleted successfully" }
```

**Response 404 (E_ROW_NOT_FOUND):**

```json
{ "errors": [{ "message": "Row not found" }] }
```

---

## 3. Booking Management Endpoints

All booking endpoints require authentication with an **approved** company account.

### GET `/companies/bookings`

List all bookings for the company's halls.

**Auth:** Bearer token (approved company)

**Query Parameters:**

| Param    | Type   | Default | Description                                                                                 |
| -------- | ------ | ------- | ------------------------------------------------------------------------------------------- |
| `page`   | number | 1       | Page number                                                                                 |
| `limit`  | number | 20      | Items per page (max 100)                                                                    |
| `status` | string | --      | Filter: `pending`, `accepted`, `rejected`, `confirmed`, `cancelled`, `completed`, `expired` |

**Response 200:** Paginated bookings. Each booking includes the hall, user (with profile), and services:

```json
{
  "meta": { "total": 10, "perPage": 20, "currentPage": 1, "lastPage": 1 },
  "data": [
    {
      "id": 1,
      "bookingDate": "2025-06-15",
      "startTime": "10:00",
      "endTime": "14:00",
      "status": "pending",
      "totalPrice": "2000.00",
      "specialRequests": "Need extra chairs",
      "rejectionReason": null,
      "companyRespondedAt": null,
      "expiresAt": "2025-06-22T00:00:00.000+00:00",
      "paymentStatus": "unpaid",
      "paymentDueDate": null,
      "userId": 5,
      "hallId": 1,
      "createdAt": "2025-06-15T00:00:00.000+00:00",
      "updatedAt": "2025-06-15T00:00:00.000+00:00",
      "deletedAt": null,
      "hall": {
        "id": 1,
        "name": "Grand Hall",
        "pricing": "500.00",
        "city": "Riyadh"
      },
      "user": {
        "id": 5,
        "userName": "john",
        "email": "john@example.com",
        "userType": "user",
        "userProfile": {
          "firstName": "John",
          "lastName": "Doe",
          "phone": "+966...",
          "avatar": null
        }
      },
      "services": [
        {
          "id": 1,
          "name": "Photography",
          "price": "300.00"
        }
      ]
    }
  ]
}
```

---

### GET `/companies/bookings/pending`

List pending bookings that need the company's response. Only shows non-expired pending bookings, ordered oldest first.

**Auth:** Bearer token (approved company)

**Query Parameters:**

| Param   | Type   | Default | Description              |
| ------- | ------ | ------- | ------------------------ |
| `page`  | number | 1       | Page number              |
| `limit` | number | 20      | Items per page (max 100) |

**Response 200:** Same paginated booking shape as `GET /companies/bookings`, but filtered to pending only.

---

### GET `/companies/bookings/:id`

Get a single booking by ID (must belong to one of the company's halls).

**Auth:** Bearer token (approved company)

**Response 200:** Single booking object (same shape as list items above).

**Response 404:**

```json
{ "message": "Booking not found" }
```

---

### POST `/companies/bookings/:id/accept`

Accept a pending booking. Sets a 3-day payment deadline for the user.

**Auth:** Bearer token (approved company)

**Request Body:** None

**Response 200:**

```json
{
  "message": "Booking accepted successfully. The customer will be notified to proceed with payment.",
  "booking": {
    "id": 1,
    "status": "accepted",
    "paymentDueDate": "2025-06-18T00:00:00.000+00:00"
  }
}
```

**Response 400:**

```json
{ "message": "Booking not found" }
```

```json
{ "message": "Unauthorized: This booking does not belong to your company" }
```

```json
{ "message": "Cannot accept booking with status: rejected" }
```

```json
{ "message": "Cannot accept expired booking" }
```

---

### POST `/companies/bookings/:id/reject`

Reject a pending booking with a reason.

**Auth:** Bearer token (approved company)

**Request Body:**

| Field    | Type   | Required | Rules                      |
| -------- | ------ | -------- | -------------------------- |
| `reason` | string | yes      | min 10, max 500 characters |

**Response 200:**

```json
{
  "message": "Booking rejected. The customer will be notified.",
  "booking": {
    "id": 1,
    "status": "rejected",
    "rejectionReason": "The hall is under maintenance on that date."
  }
}
```

**Response 400:**

```json
{ "message": "Booking not found" }
```

```json
{ "message": "Unauthorized: This booking does not belong to your company" }
```

```json
{ "message": "Cannot reject booking with status: accepted" }
```

---

## 4. Notification Endpoints

All notification endpoints require authentication with a company account.

### GET `/companies/notifications`

List the authenticated company's notifications.

**Auth:** Bearer token (company)

**Query Parameters:**

| Param         | Type    | Default | Description                                 |
| ------------- | ------- | ------- | ------------------------------------------- |
| `page`        | number  | 1       | Page number                                 |
| `limit`       | number  | 20      | Items per page (max 100)                    |
| `unread_only` | boolean | false   | If `true`, only return unread notifications |

**Response 200:**

```json
{
  "meta": { "total": 10, "perPage": 20, "currentPage": 1, "lastPage": 1 },
  "data": [
    {
      "id": 1,
      "userId": 1,
      "type": "new_booking_request",
      "title": "New Booking Request",
      "message": "You have a new booking request from A customer for \"Grand Hall\" on 2025-06-15. Please review and respond within 7 days.",
      "data": {
        "bookingId": 1,
        "hallName": "Grand Hall",
        "bookingDate": "2025-06-15",
        "userName": "A customer"
      },
      "readAt": null,
      "createdAt": "2025-06-15T00:00:00.000+00:00"
    }
  ]
}
```

**Notification types for companies:**

| Type                  | When                                           |
| --------------------- | ---------------------------------------------- |
| `new_booking_request` | A user creates a booking for one of your halls |
| `company_approved`    | Admin approves your company                    |
| `company_rejected`    | Admin rejects your company                     |

---

### GET `/companies/notifications/unread-count`

**Auth:** Bearer token (company)

**Response 200:**

```json
{ "unreadCount": 3 }
```

---

### POST `/companies/notifications/:id/read`

Mark a single notification as read.

**Auth:** Bearer token (company)

**Response 200:**

```json
{
  "message": "Notification marked as read",
  "notification": { "id": 1, "readAt": "2025-06-15T12:00:00.000+00:00" }
}
```

**Response 404:**

```json
{ "message": "Notification not found" }
```

---

### POST `/companies/notifications/read-all`

Mark all notifications as read.

**Auth:** Bearer token (company)

**Response 200:**

```json
{ "message": "All notifications marked as read", "markedCount": 5 }
```

---

## 5. Company Status Flow

```
pending --> approved --> (active)
   |
   +--> rejected (by admin, with reason)

approved --> suspended (by admin)
suspended --> approved (reactivated by admin)
```

- **pending**: Just registered, waiting for admin review. Can log in and view profile, but cannot manage halls or bookings.
- **approved**: Fully active. Can create halls, manage bookings, receive notifications.
- **rejected**: Admin rejected the registration. `rejectionReason` is provided. Cannot manage halls or bookings.
- **suspended**: Admin suspended the account. Cannot manage halls or bookings.

## 6. Booking Status Flow (Company Perspective)

```
pending --> accepted --> confirmed --> completed
   |            |
   |            +--> cancelled (by user)
   |
   +--> rejected (by company)
   +--> cancelled (by user)
   +--> expired (no company response within 7 days)
```

- **pending**: New booking request. Company has 7 days to accept or reject.
- **accepted**: Company accepted. User has 3 days to pay (`paymentDueDate` is set).
- **rejected**: Company rejected with a `rejectionReason`.
- **confirmed**: User completed payment.
- **cancelled**: User cancelled (from `pending` or `accepted`).
- **expired**: Company did not respond within 7 days.
- **completed**: Event date has passed.

## 7. Data Types Reference

### Pagination Envelope

All paginated responses use this shape:

```json
{
  "meta": {
    "total": 50,
    "perPage": 20,
    "currentPage": 1,
    "lastPage": 3,
    "firstPage": 1,
    "firstPageUrl": "/?page=1",
    "lastPageUrl": "/?page=3",
    "nextPageUrl": "/?page=2",
    "previousPageUrl": null
  },
  "data": []
}
```

### DateTime Format

All datetime fields are ISO 8601: `"2025-01-15T14:30:00.000+00:00"`

Date-only fields (like `bookingDate`): `"2025-01-15"`

Time fields (`startTime`, `endTime`): `"HH:MM"` (e.g. `"14:00"`)

### JSON Field Keys

Both request and response use **camelCase** keys throughout (e.g. `companyName`, `startTime`, `totalPrice`, `perPage`, `createdAt`).

### Numeric Fields

Price fields (`pricing`, `totalPrice`, `price`) are returned as **strings** (e.g. `"500.00"`) due to PostgreSQL decimal type. Parse them as numbers on the client side.
