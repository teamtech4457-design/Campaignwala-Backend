# Manual Test Scenarios: Leads

**Module:** `leads`
**API Prefix:** `/api/leads`

---

### 1. Create Lead (`POST /` - Public)

- [ ] **Successful Creation:** As a public user (e.g., a customer), submit the lead form with all required fields (`offerId`, `hrUserId`, `customerName`, `customerContact`).
  - **Expected:** Receive a `201 Created` status and the new lead object.
- [ ] **Missing Fields:** Attempt to submit the form with a required field missing (e.g., no `customerContact`).
  - **Expected:** Receive a `400 Bad Request` status with an error message.
- [ ] **Invalid `offerId` or `hrUserId`:** Submit the form with an ID that does not exist in the database.
  - **Expected:** Receive a `404 Not Found` status.

### 2. Get All Leads (`GET /` - Admin)

- [ ] **Admin Access:** As an admin, make a GET request.
  - **Expected:** Receive a `200 OK` status with a list of all leads from all users.
- [ ] **Regular User Access:** As a regular user (HR), make a GET request.
  - **Expected:** Receive a `200 OK` status, but the list should be filtered to only show leads associated with that user's `hrUserId`.
- [ ] **Filtering:** As an admin, test filtering by `status` and `hrUserId`.
  - **Expected:** The lead list should be correctly filtered.

### 3. Approve Lead (`POST /:id/approve` - Admin)

- [ ] **First Approval (Pending -> Approved/Completed):** As an admin, approve a `pending` lead.
  - **Expected:** Receive a `200 OK`. The lead status changes to `approved` (if it has a second commission) or `completed` (if not). The HR user's wallet should be credited with the first commission amount.
- [ ] **Second Approval (Approved -> Completed):** As an admin, approve an `approved` lead (that has a second commission).
  - **Expected:** Receive a `200 OK`. The lead status changes to `completed`. The HR user's wallet should be credited with the second commission amount.
- [ ] **Invalid Approval:** Attempt to approve a lead that is already `completed` or `rejected`.
  - **Expected:** Receive a `400 Bad Request` status.

### 4. Reject Lead (`POST /:id/reject` - Admin)

- [ ] **Reject a Pending Lead:** As an admin, reject a `pending` lead, providing a `rejectionReason`.
  - **Expected:** Receive a `200 OK`. The lead status changes to `rejected`.
- [ ] **No Commission Paid:** Verify that no commission was paid to the HR user's wallet.

### 5. Get User's Own Stats (`GET /stats?hrUserId=...`)

- [ ] **Own Stats:** As a logged-in HR user, request stats for your own `hrUserId`.
  - **Expected:** Receive a `200 OK` with a stats object (`total`, `pending`, etc.) correctly scoped to your leads.
- [ ] **Another User's Stats:** As a logged-in HR user, attempt to request stats for a different `hrUserId`.
  - **Expected:** This should ideally be forbidden (`403 Forbidden`), or the system should default to showing your own stats regardless of the query parameter.
