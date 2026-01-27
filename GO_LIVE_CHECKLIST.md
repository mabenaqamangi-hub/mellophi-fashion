# Go-Live Checklist for Mellophi Fashion

## 1. Payment & API
- [x] PayGate credentials and URLs set for production
- [x] API_URL in frontend points to live backend
- [x] Payment flow tested with real/test cards

## 2. Email
- [x] SMTP credentials set in .env (not committed to git)
- [x] Order confirmation emails tested

## 3. Logging & Error Handling
- [x] Winston logging enabled (logs/ directory writable)
- [x] No stack traces or sensitive info in production error responses
- [x] All errors handled and logged

## 4. Security
- [x] HTTPS enabled for frontend and backend
- [x] Environment variables not exposed in frontend
- [x] JWT_SECRET and other secrets set

## 5. User Experience
- [x] Payment-return.html shows clear success/failure
- [x] Cart clears on successful payment
- [x] Confirmation/receipt email sent
- [x] Contact/support info visible

## 6. Deployment
- [x] All .env files set for production
- [x] Database backups enabled
- [x] Admin access tested

## 7. Final Testing
- [x] Place a real order and verify full flow
- [x] Check logs for errors
- [x] Confirm emails received

---

If all boxes are checked, you are ready to go live!
