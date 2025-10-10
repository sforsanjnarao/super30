# Authentication Architecture Guide

This document outlines the complete authentication system for this application, covering both the Express.js backend and the Next.js frontend. The architecture is built around a secure, modern, and stateless approach using JSON Web Tokens (JWTs) and `httpOnly` cookies.

## Table of Contents

1.  [High-Level Strategy](#high-level-strategy)
2.  [Technology Stack](#technology-stack)
3.  [Backend Architecture](#backend-architecture)
    -   [Database Schema](#database-schema)
    -   [API Endpoints](#api-endpoints)
    -   [Core Logic & Security](#core-logic--security)
4.  [Frontend Architecture](#frontend-architecture)
    -   [Centralized API Client (Axios)](#centralized-api-client-axios)
    -   [Next.js Middleware](#nextjs-middleware)
    -   [UI Components (Sign-in/Sign-up)](#ui-components-sign-insign-up)
    -   [Protected Routes & Data Fetching](#protected-routes--data-fetching)
5.  [The End-to-End Authentication Flow](#the-end-to-end-authentication-flow)
    -   [User Sign-In Journey](#user-sign-in-journey)
    -   [Accessing a Protected Page](#accessing-a-protected-page)
6.  [Environment Variables](#environment-variables)

## High-Level Strategy

The core strategy is to use a stateless authentication model. When a user successfully signs in, the backend generates a signed JWT and sets it inside an **`httpOnly` cookie**.

-   **JWT (JSON Web Token)**: A compact, URL-safe means of representing claims to be transferred between two parties. We use it to store the user's ID, proving their identity on subsequent requests.
-   **`httpOnly` Cookie**: This is a special type of cookie that cannot be accessed by client-side JavaScript. Storing the JWT here is a critical security measure that mitigates Cross-Site Scripting (XSS) attacks, as a malicious script cannot steal the user's token.

The browser automatically handles sending this cookie with every request to the backend, and the Next.js frontend uses a multi-layered approach with middleware and Server Components to manage protected routes.

## Technology Stack

-   **Backend**: Express.js, Prisma (with MongoDB), JWT, bcrypt
-   **Frontend**: Next.js (App Router), React, Axios, TypeScript

## Backend Architecture

The backend is responsible for user management, password security, and session (JWT) creation/validation.

### Database Schema

The authentication revolves around the `User` model defined in `prisma/schema.prisma`. It stores essential user information and establishes relationships with other models like `Workflow` and `Credentials`.

prisma
// prisma/schema.prisma
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  password  String
  userName  String?
  // ... relations
}



### API Endpoints

All authentication-related routes are prefixed with `/api/v0/user`.

| Method | Path | Description | Protected? |
| :--- | :--- | :--- | :--- |
| `POST` | `/signup` | Registers a new user, hashes their password, and sets the auth cookie. | No |
| `POST` | `/signin` | Authenticates a user with email/password and sets the auth cookie. | No |
| `POST` | `/signout` | Clears the authentication cookie to log the user out. | No |
| `GET` | `/me` | Verifies the user's token and returns their profile information. | **Yes** |

### Core Logic & Security

-   **Password Hashing**: In the `signup` controller, user passwords are never stored in plaintext. They are securely hashed using `bcrypt`, a strong, adaptive hashing algorithm.

-   **JWT Signing**: Upon successful sign-up or sign-in, a JWT is created using `jwt.sign()`. The token's payload contains only non-sensitive identifying information, typically the user's database ID (`{ id: user.id }`). This token is signed with a secret key (`JWT_PASS`) stored in environment variables.

-   **Route Protection (`protect` Middleware)**:
    -   This middleware is applied to sensitive routes like `/me`.
    -   It reads the `token` from the incoming request's cookies (`req.cookies`).
    -   If the token is missing, it immediately sends a `401 Unauthorized` error.
    -   If the token exists, `jwt.verify()` is used to check its signature and validity.
    -   On successful verification, the decoded payload (e.g., `{ id: '...' }`) is attached to the request object as `req.user`.
    -   The request is then passed to the next handler (e.g., the `itsMe` controller).

## Frontend Architecture

The frontend uses Next.js with the App Router to create a secure and efficient user experience.

### Centralized API Client (Axios)

The file `lib/api.ts` creates a pre-configured Axios instance. This is the cornerstone of frontend-to-backend communication.

```typescript
// lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v0",
  withCredentials: true, // CRITICAL: Tells Axios to send cookies with every request
});

export default api;


The `withCredentials: true` setting is essential. It automatically handles the sending of the `httpOnly` cookie from the browser to the backend.

### Next.js Middleware

The `middleware.ts` file acts as the first line of defense. It runs on the server before a request is handed to a page or layout.

**Logic**:

1.  It checks if a request is for a `protectedRoutes` (e.g., `/dashboard`). If the `token` cookie is missing, it redirects the user to `/signin`.
2.  It checks if a request is for a `publicRoutes` (e.g., `/signin`, `/signup`). If the `token` cookie *is* present, it redirects the already logged-in user to the `/dashboard`, preventing them from seeing the sign-in page again.

### UI Components (Sign-in/Sign-up)

-   These are Client Components (`'use client'`) that handle user input.
-   They use the centralized Axios instance (`api`) to send form data directly from the browser to the backend API.
-   Upon a successful API response, they use the Next.js router to redirect the user.

### Protected Routes & Data Fetching

This is handled by the `(dashboard)/layout.tsx` file, a **React Server Component (RSC)**. This component acts as a secure wrapper for all pages inside the `/dashboard` route group.

-   **Server-Side Execution**: This layout runs entirely on the server for every request to a dashboard page.
-   **Data Fetching (`getUser` function)**:
    -   It uses `cookies()` from `next/headers` to read the auth `token` from the incoming request.
    -   If the token exists, it makes a **server-to-server API call** to the backend's `/me` endpoint.
    -   It **must manually forward the cookie** in the `headers` of this request, as server-side `fetch`/`axios` calls do not have a browser's cookie jar.
    -   If the backend returns user data, it is passed down to the page.
    -   If the backend returns an error (e.g., the token is invalid), the function returns `null`. The layout then uses `redirect('/signin')` to immediately send the user to the login page. **No part of the protected UI is ever rendered or sent to an unauthenticated user.**

## The End-to-End Authentication Flow

### User Sign-In Journey

1.  **User Submits Form**: The user fills in the `LoginPage` form and submits.
2.  **Frontend API Call**: The browser sends a `POST` request to `http://localhost:8080/api/v0/user/signin`. The `token` cookie is **not** present yet.
3.  **Backend Verification**: Express verifies the credentials. On success, it generates a JWT and sends back a response with the `Set-Cookie` header containing the `httpOnly` token.
4.  **Browser Stores Cookie**: The browser receives the response and securely stores the `token` cookie.
5.  **Frontend Redirects**: The Axios request resolves successfully, and the Next.js router redirects the user to `/dashboard`.

### Accessing a Protected Page

1.  **Browser Requests `/dashboard`**: The browser now makes a `GET` request to the Next.js frontend for the `/dashboard` page. It **automatically attaches the `token` cookie** to this request.
2.  **Next.js Middleware Runs**: The middleware sees the request is for `/dashboard` and confirms the `token` cookie exists. It allows the request to proceed.
3.  **Dashboard Layout Renders on Server**: The `DashboardLayout` server component executes.
4.  **Server-to-Server API Call**: The `getUser` function inside the layout reads the cookie from the initial request and makes a new `GET` request to the backend's `/me` endpoint, forwarding the cookie.
5.  **Backend Verifies Token**: The `protect` middleware on the backend verifies the JWT and returns the user's data.
6.  **UI Rendered and Sent**: The `DashboardLayout` receives the user data, renders the complete page HTML (including the "Welcome, {user.userName}!" message), and sends this HTML to the browser for display.

## Environment Variables

The following environment variables are required for the authentication system to function:

```bash
# .env

# Used by Prisma to connect to the database
DATABASE_URL="mongodb+srv://..."

# A long, complex, and secret string used to sign the JWTs
JWT_PASS="your-super-secret-jwt-key"