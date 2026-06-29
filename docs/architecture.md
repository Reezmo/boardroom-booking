# RoomReserve Architecture

## Overview
RoomReserve is a boardroom booking application built using the Next.js App Router, designed for speed and real-time synchronization.

## Technology Stack
* **Framework:** Next.js 15 (App Router)
* **Authentication:** Firebase Auth
* **Database:** Firebase Firestore (Single source of truth for bookings and room status)
* **Styling:** Tailwind CSS + Shadcn UI primitives
* **Email:** Resend API

## Design Decisions
1. **Firebase over SQL:** We migrated from a split MySQL/Firebase architecture to a 100% Firebase backend. This allows for rapid prototyping, real-time UI updates (future), and seamless integration with our existing Firebase Authentication.
2. **App Router:** We exclusively use the Next.js App Router (`/src/app`) and have deprecated the legacy Pages router to minimize bundle sizes and take advantage of modern React Server Components.
3. **Strict TypeScript:** The codebase enforces strict null checks and avoids `any` types to ensure runtime safety during the booking flow.