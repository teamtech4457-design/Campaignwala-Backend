# Manual Test Scenarios: Users

**Module:** `users`
**API Prefix:** `/api/users`

---

### 1. Send OTP (`POST /send-otp`)

- [ ] **Valid Phone Number:** Send a request with a valid 10-digit phone number.
  - **Expected:** Receive a `200 OK` with a success message. If SMS API is configured, OTP is sent to the phone. If not, a static OTP might be returned in the response for development.
- [ ] **Invalid Phone Number:** Send a request with an invalid phone number (e.g., less than 10 digits, contains characters).
  - **Expected:** Receive a `400 Bad Request` with an error message about the invalid format.
- [ ] **Missing Phone Number:** Send a request without a `phoneNumber` in the body.
  - **Expected:** Receive a `400 Bad Request` with an error message.
- [ ] **Rate Limiting:** Attempt to send OTP multiple times in a short period for the same number.
  - **Expected:** After a certain number of attempts, receive a `429 Too Many Requests` error.

### 2. Register User (`POST /register`)

- [ ] **Valid Registration:** Send a request with all required fields: `phoneNumber`, `otp`, `name`, `email`, and `password`. Use a valid static OTP for testing.
  - **Expected:** Receive a `201 Created` with the new user object and a JWT token.
- [ ] **Missing Fields:** Send a request with one or more missing fields.
  - **Expected:** Receive a `400 Bad Request` with an error message indicating which fields are required.
- [ ] **Invalid OTP:** Send a request with an invalid OTP.
  - **Expected:** Receive a `400 Bad Request` with an "Invalid OTP" message.
- [ ] **Existing Phone Number:** Try to register with a phone number that already exists.
  - **Expected:** Receive a `409 Conflict` with an error message.
- [ ] **Existing Email:** Try to register with an email that already exists.
  - **Expected:** Receive a `409 Conflict` with an error message.
- [ ] **Invalid Email Format:** Use an invalid email address.
  - **Expected:** Receive a `400 Bad Request` with an error message about the email format.

### 3. Login User (`POST /login`)

- [ ] **Valid Credentials:** Login with a correct, existing phone number and password.
  - **Expected:** Receive a `200 OK` with the user object and a JWT token.
- [ ] **Invalid Phone Number:** Login with a non-existent phone number.
  - **Expected:** Receive a `401 Unauthorized` with an "Invalid credentials" message.
- [ ] **Incorrect Password:** Login with a correct phone number but an incorrect password.
  - **Expected:** Receive a `401 Unauthorized` with an "Invalid credentials" message.
- [ ] **Deactivated Account:** Attempt to login with an account that has been deactivated (`isActive: false`).
  - **Expected:** Receive a `401 Unauthorized` with an "Account is deactivated" message.
- [ ] **Missing Fields:** Send a request without `phoneNumber` or `password`.
  - **Expected:** Receive a `400 Bad Request`.

### 4. Get User Profile (`GET /profile`)

- [ ] **Authenticated User:** Make a GET request with a valid JWT token in the `Authorization` header.
  - **Expected:** Receive a `200 OK` with the authenticated user's profile information.
- [ ] **Unauthenticated User:** Make a GET request without a token.
  - **Expected:** Receive a `401 Unauthorized`.

### 5. Update User Profile (`PUT /profile`)

- [ ] **Update Password:** As an authenticated user, send a PUT request with a new `password`.
  - **Expected:** Receive a `200 OK` with a success message and the updated user object. The password should be hashed in the database.
- [ ] **Password Too Short:** Attempt to update with a password less than 6 characters.
  - **Expected:** Receive a `400 Bad Request`.
- [ ] **No Changes:** Send a request with no updatable fields.
  - **Expected:** Receive a `200 OK` with a "No changes to update" message.

### 6. Change Password (`POST /change-password`)

- [ ] **Valid Password Change:** As an authenticated user, provide the correct `currentPassword` and a valid `newPassword`.
  - **Expected:** Receive a `200 OK` with a success message.
- [ ] **Incorrect Current Password:** Provide an incorrect `currentPassword`.
  - **Expected:** Receive a `400 Bad Request` with an "Current password is incorrect" message.
- [ ] **Missing Fields:** Omit `currentPassword` or `newPassword`.
  - **Expected:** Receive a `400 Bad Request`.

### 7. Admin: Get All Users (`GET /admin/users`)

- [ ] **Admin Access:** As an admin, make a GET request.
  - **Expected:** Receive a `200 OK` with a paginated list of all users.
- [ ] **Non-Admin Access:** As a regular user, make a GET request.
  - **Expected:** Receive a `403 Forbidden`.
- [ ] **Filtering and Searching:** Test the `role`, `isVerified`, and `search` query parameters.
  - **Expected:** The user list should be filtered correctly.

### 8. Admin: Get User by ID (`GET /admin/users/:userId`)

- [ ] **Admin Access, Valid ID:** As an admin, request a user with a valid ID.
  - **Expected:** Receive a `200 OK` with the user's data.
- [ ] **Admin Access, Invalid ID:** As an admin, request a user with a non-existent ID.
  - **Expected:** Receive a `404 Not Found`.
- [ ] **Non-Admin Access:** As a regular user, attempt to access this endpoint.
  - **Expected:** Receive a `403 Forbidden`.

### 9. Admin: Update User Role (`PUT /admin/users/:userId/role`)

- [ ] **Admin Access, Valid Role:** As an admin, update a user's role to 'admin' or 'user'.
  - **Expected:** Receive a `200 OK` with the updated user object.
- [ ] **Admin Access, Invalid Role:** Attempt to set an invalid role (e.g., 'superadmin').
  - **Expected:** Receive a `400 Bad Request`.
- [ ] **Non-Admin Access:** As a regular user, attempt to access this endpoint.
  - **Expected:** Receive a `403 Forbidden`.

### 10. Admin: Toggle User Status (`PUT /admin/users/:userId/toggle-status`)

- [ ] **Admin Access:** As an admin, toggle the `isActive` status of a user.
  - **Expected:** Receive a `200 OK` with a success message and the updated user.
- [ ] **Non-Admin Access:** As a regular user, attempt to access this endpoint.
  - **Expected:** Receive a `403 Forbidden`.

### 11. Update KYC Details (`PUT /kyc`)

- [ ] **Authenticated User:** As a logged-in user, submit a payload with personal, document, and bank details.
  - **Expected:** Receive a `200 OK` with the updated user object. If all required fields are present, `kycStatus` should become 'pending'.
- [ ] **Partial Update:** Submit only a few fields (e.g., only `firstName`).
  - **Expected:** Receive a `200 OK`, and only the submitted fields should be updated. `kycStatus` should not change to 'pending'.
- [ ] **Unauthenticated:** Attempt to submit without a valid token.
  - **Expected:** Receive a `401 Unauthorized`.

### 12. Get KYC Details (`GET /kyc`)

- [ ] **Authenticated User:** As a logged-in user with KYC data, make a GET request.
  - **Expected:** Receive a `200 OK` with a structured object containing all KYC and bank details.
- [ ] **Unauthenticated:** Attempt to get KYC details without a valid token.
  - **Expected:** Receive a `401 Unauthorized`.

### 13. Admin: Get Pending KYC (`GET /admin/kyc/pending`)

- [ ] **Admin Access:** As an admin, make a GET request.
  - **Expected:** Receive a `200 OK` with a list of users whose `kycStatus` is 'pending'.
- [ ] **Non-Admin Access:** As a regular user, attempt to access this endpoint.
  - **Expected:** Receive a `403 Forbidden`.

### 14. Admin: Approve/Reject KYC (`PUT /admin/kyc/:userId/approve` and `PUT /admin/kyc/:userId/reject`)

- [ ] **Admin Approve:** As an admin, approve a pending KYC request.
  - **Expected:** Receive a `200 OK`, and the user's `kycStatus` becomes 'approved'.
- [ ] **Admin Reject:** As an admin, reject a pending KYC request with a `reason`.
  - **Expected:** Receive a `200 OK`, and the user's `kycStatus` becomes 'rejected' with the reason stored.
- [ ] **Reject without Reason:** Attempt to reject without providing a `reason`.
  - **Expected:** Receive a `400 Bad Request`.
- [ ] **Non-Admin Access:** As a regular user, attempt to access these endpoints.
  - **Expected:** Receive a `403 Forbidden`.
