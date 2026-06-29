# Improvement Checklist

## High Priority
- [ ] **Global Error Boundary:** Implement `error.tsx` and `not-found.tsx` to prevent full app crashes if Firebase fails to load.
- [ ] **Form Validation Polish:** Enhance the Zod schema in `new-booking.tsx` to ensure end-times cannot be earlier than start-times across different days.
- [ ] **Real-time Listeners:** Refactor the dashboard `fetchEvents` function to use Firebase `onSnapshot` so the calendar updates instantly without requiring a page refresh.

## Medium Priority
- [ ] **Environment Variable Validation:** Add a startup check to ensure all `NEXT_PUBLIC_FIREBASE_*` and `RESEND_API_KEY` variables are present before the app boots.
- [ ] **Role-Based Access Control (RBAC):** Restrict standard users from deleting meetings they did not organize.