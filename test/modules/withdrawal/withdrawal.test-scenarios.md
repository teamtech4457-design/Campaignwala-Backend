# Manual Test Scenarios: Withdrawal

**Module:** `withdrawal`
**API Prefix:** `/api/withdrawals`

---

### 1. Create Withdrawal Request (`POST /`)

- [ ] **Authenticated User, Sufficient Balance:** As a logged-in user with enough balance, create a withdrawal request with a valid `amount` and `bankDetails`.
  - **Expected:** Receive a `201 Created` with the new withdrawal request object, status set to 'pending'.
- [ ] **Insufficient Balance:** Attempt to withdraw an amount greater than the available wallet balance.
  - **Expected:** Receive a `400 Bad Request` with an "Insufficient balance" message.
- [ ] **Invalid Amount:** Attempt to withdraw zero or a negative amount.
  - **Expected:** Receive a `400 Bad Request`.
- [ ] **Unauthenticated User:** Attempt to create a request without being logged in.
  - **Expected:** Receive a `401 Unauthorized`.
- [ ] **Missing Fields:** Send a request without the `amount` or `userId`.
  - **Expected:** Receive a `400 Bad Request`.

### 2. Get All Withdrawal Requests (`GET /`)

- [ ] **Admin Access:** As an admin, make a GET request.
  - **Expected:** Receive a `200 OK` with a paginated list of all withdrawal requests.
- [ ] **Non-Admin Access:** As a regular user, attempt to access this endpoint.
  - **Expected:** Receive a `403 Forbidden`.
- [ ] **Filtering:** As an admin, test filtering by `status` (pending, approved, rejected), `userId`, and `search`.
  - **Expected:** The list should be correctly filtered.
- [ ] **Pagination and Sorting:** Test the `page`, `limit`, `sortBy`, and `order` query parameters.
  - **Expected:** The response should be correctly paginated and sorted.

### 3. Get Withdrawal Statistics (`GET /stats`)

- [ ] **Admin Access:** As an admin, make a GET request to this endpoint.
  - **Expected:** Receive a `200 OK` with statistics like total requests, pending, approved, rejected counts, and total amounts.
- [ ] **Non-Admin Access:** As a regular user, attempt to access this endpoint.
  - **Expected:** Receive a `403 Forbidden`.

### 4. Get Withdrawals by User ID (`GET /user/:userId`)

- [ ] **Admin/Owner Access:** As an admin or the user specified by `:userId`, fetch their withdrawal history.
  - **Expected:** Receive a `200 OK` with a list of their withdrawals.
- [ ] **Filtering:** Test the `status` filter for the user's history.
  - **Expected:** The list should be correctly filtered.
- [ ] **Unauthorized Access:** As a regular user, attempt to get the history for another user.
  - **Expected:** Receive a `403 Forbidden`.

### 5. Get Withdrawal by ID (`GET /:id`)

- [ ] **Admin/Owner Access:** As an admin or the user who made the request, fetch a withdrawal by its ID.
  - **Expected:** Receive a `200 OK` with the withdrawal details.
- [ ] **Unauthorized Access:** As a regular user, attempt to fetch a withdrawal request made by another user.
  - **Expected:** Receive a `403 Forbidden` or `404 Not Found` depending on the authorization logic.
- [ ] **Invalid ID:** Use a non-existent withdrawal ID.
  - **Expected:** Receive a `404 Not Found`.

### 6. Approve Withdrawal Request (`PUT /:id/approve`)

- [ ] **Admin Access, Pending Request:** As an admin, approve a 'pending' withdrawal request. Provide `transactionId` and `remarks`.
  - **Expected:** Receive a `200 OK`. The withdrawal status changes to 'approved'. The corresponding amount is debited from the user's wallet.
- [ ] **Request Not Pending:** Attempt to approve a request that is already 'approved' or 'rejected'.
  - **Expected:** Receive a `400 Bad Request` stating the request is not pending.
- [ ] **Insufficient Balance on Approval:** Approve a request where the user's balance has dropped below the withdrawal amount since the request was made.
  - **Expected:** Receive a `400 Bad Request` for insufficient balance.
- [ ] **Non-Admin Access:** As a regular user, attempt to approve a request.
  - **Expected:** Receive a `403 Forbidden`.

### 7. Reject Withdrawal Request (`PUT /:id/reject`)

- [ ] **Admin Access, Pending Request:** As an admin, reject a 'pending' request with a valid `rejectionReason`.
  - **Expected:** Receive a `200 OK`. The withdrawal status changes to 'rejected'. The user's wallet balance is NOT debited.
- [ ] **Reject without Reason:** Attempt to reject without providing a `rejectionReason`.
  - **Expected:** Receive a `400 Bad Request`.
- [ ] **Non-Admin Access:** As a regular user, attempt to reject a request.
  - **Expected:** Receive a `403 Forbidden`.

### 8. Delete Withdrawal Request (`DELETE /:id`)

- [ ] **Admin Access, Valid ID:** As an admin, delete a withdrawal request by its ID.
  - **Expected:** Receive a `200 OK` with a success message.
- [ ] **Invalid ID:** Attempt to delete a request with a non-existent ID.
  - **Expected:** Receive a `404 Not Found`.
- [ ] **Non-Admin Access:** As a regular user, attempt to delete a request.
  - **Expected:** Receive a `403 Forbidden`.