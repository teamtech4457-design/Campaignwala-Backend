# Manual Test Scenarios: Wallet

**Module:** `wallet`
**API Prefix:** `/api/wallet`

---

### 1. Get Wallet by User ID (`GET /:userId`)

- [ ] **Admin/Owner Access:** As an admin or the user who owns the wallet, request the wallet with a valid user ID.
  - **Expected:** Receive a `200 OK` with the wallet object, including balance, total earned, and transactions.
- [ ] **New User:** Request a wallet for a user who does not have one yet.
  - **Expected:** Receive a `200 OK` and a new wallet should be created automatically with a balance of 0.
- [ ] **Unauthorized Access:** As a regular user, attempt to access another user's wallet.
  - **Expected:** Receive a `403 Forbidden` or appropriate authorization error.
- [ ] **Invalid User ID:** Request a wallet with a non-existent user ID.
  - **Expected:** The request should be handled gracefully, likely creating a new wallet for a non-existent user if the logic allows, or failing if the user must exist first. The ideal behavior depends on system design (should a wallet be creatable for a non-user?). Let's assume the user must exist, so a `404 Not Found` for the user is expected.

### 2. Add Credit to Wallet (`POST /credit`)

- [ ] **Admin Access:** As an admin, add credit to a user's wallet with a valid `userId`, `amount`, and `description`.
  - **Expected:** Receive a `200 OK` with the updated wallet object. The balance and total earned should increase, and a new credit transaction should be present.
- [ ] **Invalid Amount:** Attempt to add a negative or zero amount.
  - **Expected:** Receive a `400 Bad Request` with an error message.
- [ ] **Missing Fields:** Omit `userId` or `amount` from the request.
  - **Expected:** Receive a `400 Bad Request`.
- [ ] **Non-Admin Access:** As a regular user, attempt to use this endpoint.
  - **Expected:** Receive a `403 Forbidden` as this is likely an admin-only action.

### 3. Add Debit from Wallet (`POST /debit`)

- [ ] **Admin Access:** As an admin, process a debit from a user's wallet.
  - **Expected:** Receive a `200 OK` with the updated wallet. The balance should decrease, total withdrawn should increase, and a new debit transaction should be present.
- [ ] **Insufficient Balance:** Attempt to debit an amount greater than the user's current balance.
  - **Expected:** Receive a `400 Bad Request` with an "Insufficient balance" message.
- [ ] **Invalid Amount:** Attempt to debit a negative or zero amount.
  - **Expected:** Receive a `400 Bad Request`.
- [ ] **Non-existent Wallet:** Attempt to debit from a user who does not have a wallet.
  - **Expected:** Receive a `404 Not Found` for the wallet.
- [ ] **Non-Admin Access:** As a regular user, attempt to use this endpoint.
  - **Expected:** Receive a `403 Forbidden`.

### 4. Get All Wallets (`GET /admin/all`)

- [ ] **Admin Access:** As an admin, make a GET request to this endpoint.
  - **Expected:** Receive a `200 OK` with a list of all wallets and their associated user details.
- [ ] **Non-Admin Access:** As a regular user, attempt to access this endpoint.
  - **Expected:** Receive a `403 Forbidden`.
