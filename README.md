# Toshiba Indoor Stadium

Online Indoor Stadium Booking & Management System.

## Stack

- React + Vite + JavaScript
- React Router
- Firebase Authentication + Cloud Firestore
- Lucide React icons

## Getting started

```bash
npm install
npm run dev
```

## Firebase setup

1. Copy `.env.example` to `.env`
2. Create a Firebase web app
3. Fill in:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

4. Deploy rules from `firestore/firestore.rules`

## Notes

- Pricing: 1 Hour = LKR 2,750 · 2 Hours = LKR 5,500
- Admin access requires `role: "admin"` in the Firestore `users` document
- The Express/MySQL backend in the older project folder is not used
