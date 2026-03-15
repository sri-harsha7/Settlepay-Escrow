# Settlepay Escrow Platform

A production-ready P2P Escrow web application built on the MERN stack (MongoDB, Express, React, Node.js). It facilitates safe second-hand transactions by holding buyer funds in a simulated third-party escrow account until physical handover and buyer confirmation are completed.

## Architecture

- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT Auth.
- **Frontend**: React (Vite), React Router, Axios, Context API.
- **Styling**: Premium Vanilla CSS (Vibrant dark mode aesthetic for a stunning UI).
- **Escrow Provider**: Simulated via `/services/escrowService.js`, with an interactive mock payment page (`/mock-payment/:id`) that hits a webhook simulator (`/api/mock/payment-success`).

## Setup & Running Instructions

### 1. Database Requirement
Ensure you have MongoDB running locally (`mongodb://localhost:27017`) or have a MongoDB Atlas connection string.

### 2. Backend Config & Run
Navigate to the `server` directory and configure the environment:
```bash
cd server


# Install dependencies (already executed if setup by AI)
npm install

# Start the server (runs on port 5000)
npm run dev
```

### 3. Frontend Config & Run
Navigate to the `client` directory:
```bash
cd client

# Install dependencies (already executed if setup by AI)
npm install

# Start the React Vite app (runs on port 5173)
npm run dev
```

## Adding a Real Escrow Provider

To integrate a real provider (like RazorpayX, Castler, or Escrow.com):

1. **Credentials**: Add your real `ESCROW_API_KEY` and `ESCROW_API_SECRET` to `server/.env`.
2. **Service Layer**: Open `server/services/escrowService.js`. Modify the `createEscrowTransaction` to call the external provider's API. Return their payment URL instead of the mock frontend URL.
3. **Webhooks**: Update `server/controllers/escrowController.js -> webhookProvider` to handle the real incoming provider payload. Validate the webhook signature using your keys to ensure it's a legitimate request before mapping the event (`payment.captured`, `funds.released`, etc.) to the `EscrowTransaction` statuses. 
4. **Remove mocks**: You can then remove the `mockPaymentSuccess` endpoint and `src/pages/MockPayment.jsx` component.

## State Transitions
1. `created` -> `awaiting_payment` (Buyer assigned)
2. `awaiting_payment` -> `in_escrow` (Escrow funded securely)
3. `in_escrow` -> `awaiting_buyer_confirmation` (Seller handed over item)
4. `awaiting_buyer_confirmation` -> `completed` (Buyer confirms receipt -> funds released)



## Seller Account 
email    : seller@gmail.com
password : seller

Can create deals and showcase in Marketplace

## Buyer Account
email    : buyer@gmail.com
password : buyer1

Buyer can buy the deals that are available in the Marketplace


