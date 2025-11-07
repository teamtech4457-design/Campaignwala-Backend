# Manual Test Scenarios: User Middleware

**Module:** `middleware`
**File:** `src/middleware/user.middleware.js`

---

These scenarios test the authentication and authorization middleware. They are not endpoints themselves but are used to protect routes. These tests should be performed by attempting to access routes that are protected by these middlewares.

### 1. `authenticateToken` Middleware

This middleware is used to protect routes that require a logged-in user.

- [ ] **Valid Token:** Access a protected route with a valid, non-expired JWT token in the `Authorization: Bearer <token>` header.
  - **Expected:** The request should proceed, and the user's data should be attached to `req.user`. The protected route should return a `200 OK` or its expected success status.
- [ ] **No Token:** Attempt to access a protected route without any `Authorization` header.
  - **Expected:** Receive a `401 Unauthorized` with the message "Access token is required".
- [ ] **Invalid Token:** Use a malformed or garbage string as the token.
  - **Expected:** Receive a `401 Unauthorized` with the message "Invalid token".
- [ ] **Expired Token:** Use a JWT token that has expired.
  - **Expected:** Receive a `401 Unauthorized` with the message "Token expired".
- [ ] **Token for Non-existent User:** Use a validly signed token containing a `userId` that has been deleted from the database.
  - **Expected:** Receive a `401 Unauthorized` with the message "Invalid token - user not found".
- [ ] **Token for Deactivated User:** Use a valid token for a user whose `isActive` status is `false`.
  - **Expected:** Receive a `401 Unauthorized` with the message "Account is deactivated".

### 2. `requireAdmin` Middleware

This middleware is used after `authenticateToken` to ensure the user has admin privileges.

- [ ] **Admin User:** Access a route protected by `requireAdmin` using a token from a user with `role: 'admin'`.
  - **Expected:** The request should proceed successfully.
- [ ] **Non-Admin User:** Access the same route using a token from a regular user (`role: 'user'`).
  - **Expected:** Receive a `403 Forbidden` with the message "Admin access required".

### 3. `requireVerified` Middleware

This middleware is used after `authenticateToken` to ensure the user has verified their phone number.

- [ ] **Verified User:** Access a route protected by `requireVerified` using a token from a user with `isVerified: true`.
  - **Expected:** The request should proceed successfully.
- [ ] **Unverified User:** Access the same route using a token from a user with `isVerified: false`.
  - **Expected:** Receive a `403 Forbidden` with the message "Phone number verification required".

### 4. `optionalAuth` Middleware

This middleware attaches a user to the request if a valid token is provided, but does not fail if the token is missing or invalid.

- [ ] **Valid Token:** Access a route using this middleware with a valid token.
  - **Expected:** The request proceeds, and `req.user` is populated. The endpoint should behave as if the user is logged in.
- [ ] **No Token:** Access the route without a token.
  - **Expected:** The request proceeds, but `req.user` is `undefined`. The endpoint should behave as if the user is a guest.
- [ ] **Invalid/Expired Token:** Access the route with an invalid or expired token.
  - **Expected:** The request proceeds, but `req.user` is `undefined`. The endpoint should behave as if the user is a guest.
