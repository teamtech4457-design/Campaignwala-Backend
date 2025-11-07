# Manual Test Scenarios: User Model

**Module:** `users`
**Model:** `User`

---

### 1. Schema Validation

- [ ] **Create with required fields:** Create a user with a valid `phoneNumber` and `password`.
  - **Expected:** The document is saved successfully.
- [ ] **Missing `phoneNumber`:** Attempt to save a user without a `phoneNumber`.
  - **Expected:** Receive a `ValidationError`.
- [ ] **Missing `password`:** Attempt to save a user without a `password`.
  - **Expected:** Receive a `ValidationError`.
- [ ] **Duplicate `phoneNumber`:** Attempt to save a user with a `phoneNumber` that already exists.
  - **Expected:** Receive a `MongoError` (or similar) with a duplicate key error code (e.g., 11000).
- [ ] **Invalid `phoneNumber`:** Attempt to save with a `phoneNumber` that is not 10 digits.
  - **Expected:** Receive a `ValidationError`.
- [ ] **Password too short:** Attempt to save with a `password` less than 6 characters.
  - **Expected:** Receive a `ValidationError`.
- [ ] **Invalid `role`:** Attempt to save with a `role` other than 'user' or 'admin'.
  - **Expected:** Receive a `ValidationError`.
- [ ] **Invalid `gender`:** Attempt to save with a `gender` not in the enum list.
  - **Expected:** Receive a `ValidationError`.
- [ ] **Invalid `kycStatus`:** Attempt to save with a `kycStatus` not in the enum list.
  - **Expected:** Receive a `ValidationError`.

### 2. Default Values

- [ ] **Create with only required fields:** Create a user with just `phoneNumber` and `password`.
  - **Expected:** The document is saved with correct default values (`name`: '', `email`: '', `role`: 'user', `isVerified`: false, `isActive`: true, `country`: 'India', `kycDetails.kycStatus`: 'not_submitted', etc.).

### 3. Pre-save Hook: Password Hashing

- [ ] **Create a new user:** Save a new user with a plain-text password.
  - **Expected:** The `password` field in the database is a long, hashed string, not the plain-text password.
- [ ] **Update user without changing password:** Fetch a user, change their `name`, and save.
  - **Expected:** The `password` hash in the database remains unchanged.
- [ ] **Update user and change password:** Fetch a user, set a new password, and save.
  - **Expected:** The `password` hash in the database is updated to a new hash.

### 4. Custom Methods

- [ ] **`comparePassword()` - Correct Password:** Create a user, then call `comparePassword()` with the correct plain-text password.
  - **Expected:** The method returns `true`.
- [ ] **`comparePassword()` - Incorrect Password:** Call `comparePassword()` with the wrong password.
  - **Expected:** The method returns `false`.
- [ ] **`canSendOtp()` - Initial State:** On a new user, call `canSendOtp()`.
  - **Expected:** Returns `true`.
- [ ] **`canSendOtp()` - Exceeded Attempts:** Call `incrementOtpAttempts()` 5 times, then call `canSendOtp()`.
  - **Expected:** Returns `false`.
- [ ] **`canSendOtp()` - Cooldown Period:** After exceeding attempts, wait for more than an hour and call `canSendOtp()` again.
  - **Expected:** The `otpAttempts` should be reset, and the method should return `true`.
- [ ] **`incrementOtpAttempts()`:** Call this method.
  - **Expected:** The `otpAttempts` count increases by 1, and `lastOtpSent` is updated to the current time.

### 5. `toJSON` Transformation

- [ ] **Convert user to JSON:** Create a user, save it, and then convert the document to a JSON object (e.g., by sending it in an API response).
  - **Expected:** The resulting JSON object should NOT contain the `password`, `otpAttempts`, or `lastOtpSent` fields.

### 6. Timestamps

- [ ] **Create a new user:** Save a new document.
  - **Expected:** The `createdAt` and `updatedAt` fields are automatically set.
- [ ] **Update an existing user:** Fetch a user, modify it, and save it.
  - **Expected:** The `updatedAt` field is updated, while `createdAt` remains the same.
