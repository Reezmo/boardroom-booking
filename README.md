# RoomReserve 📅

RoomReserve is a modern, blazing-fast boardroom booking application built for enterprise environments. It provides seamless meeting scheduling, real-time room availability tracking, and automated email confirmations.

## 🚀 Tech Stack

* **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
* **Authentication:** Firebase Auth
* **Database:** Firebase Firestore
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
* **Email Infrastructure:** [Resend API](https://resend.com/)

## ✨ Key Features

* **Secure Authentication:** Email/password login and registration powered by Firebase.
* **Smart Booking Flow:** Prevents double-booking and enforces boardroom capacity limits.
* **Instant Database Sync:** Direct Firestore integration for rapid read/writes.
* **Automated Email Confirmations:** Sends customized booking confirmations and cancellation notices.
* **Strict Type Safety:** Built with TypeScript to ensure runtime reliability.

## 🛠️ Getting Started

### Prerequisites
Make sure you have Node.js and npm installed on your local machine. You will also need a Firebase project and a Resend API key.

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/yourusername/roomreserve.git
cd roomreserve
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Set up Environment Variables
Create a \`.env.local\` file in the root of the project and add the following keys. You can find your Firebase keys in your Firebase Project Settings, and the Resend key in your Resend dashboard.

\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

RESEND_API_KEY=your_resend_api_key
\`\`\`

### 4. Run the Development Server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🌿 Git Workflow
This project follows a strict branching strategy:
* \`prod\`: The live production environment. Never push directly to this branch.
* \`dev\`: The staging environment for testing integrated features.
* \`feature/*\`: Isolated sandbox branches for building new features or fixing bugs.
