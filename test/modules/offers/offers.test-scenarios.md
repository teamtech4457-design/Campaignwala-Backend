# Manual Test Scenarios: Offers

**Module:** `offers`
**API Prefix:** `/api/offers`

---

### 1. Public User: Viewing Offers

- [ ] **Get All Offers (`GET /`):** As a public user, make a GET request.
  - **Expected:** Receive a `200 OK` with a list of all approved/active offers.
- [ ] **Get Offers by Category (`GET /category/:categoryId`):** As a public user, use a valid category ID.
  - **Expected:** Receive a `200 OK` with a list of offers belonging only to that category.
- [ ] **Get Single Offer (`GET /:id`):** As a public user, use a valid offer ID.
  - **Expected:** Receive a `200 OK` with the detailed information for that single offer.
- [ ] **Get Invalid Offer:** Use an invalid or non-existent offer ID.
  - **Expected:** Receive a `404 Not Found` status.

### 2. Admin: Offer Management

- [ ] **Create Offer (`POST /`):** As an admin, create a new offer with all required fields (`name`, `category`, commissions, etc.).
  - **Expected:** Receive a `201 Created` status with the new offer object. The offer should initially be in a pending/unapproved state.
- [ ] **Non-Admin Access:** As a regular user, attempt to create an offer.
  - **Expected:** Receive a `403 Forbidden` or `401 Unauthorized` status.
- [ ] **Approve Offer (`POST /:id/approve`):** As an admin, approve the newly created offer.
  - **Expected:** Receive a `200 OK`. The offer's `isApproved` status should now be `true`.
- [ ] **Verify Public Visibility:** As a public user, verify that the newly approved offer now appears in the `GET /` list.
- [ ] **Update Offer (`PUT /:id`):** As an admin, update the description or commission of the offer.
  - **Expected:** Receive a `200 OK` with the updated offer object.
- [ ] **Reject Offer (`POST /:id/reject`):** As an admin, reject a different pending offer.
  - **Expected:** Receive a `200 OK`. The offer's `isApproved` status should be `false`.
- [ ] **Delete Offer (`DELETE /:id`):** As an admin, delete an offer.
  - **Expected:** Receive a `200 OK`. The offer should no longer be visible via any `GET` request.

### 3. Admin: Bulk Upload

- [ ] **Valid Bulk Upload (`POST /bulk-upload`):** As an admin, upload a JSON array with several valid offer objects.
  - **Expected:** Receive a `201 Created` with a success message indicating the number of offers created.
- [ ] **Invalid Bulk Upload:** Upload a file with missing required fields or incorrect data types.
  - **Expected:** Receive a `400 Bad Request` or the operation should partially fail, with an error report.
