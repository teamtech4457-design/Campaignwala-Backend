# Manual Test Scenarios: Leads

**Module:** `leads`
**API Prefix:** `/api/leads`

---

### 1. Get All Leads (`GET /`)

- [ ] **Admin Access:** As an admin, fetch all leads without filters.
  - **Expected:** Receive a `200 OK` with a paginated list of all leads.
- [ ] **HR User Access:** As an HR user, fetch leads. The list should be scoped to their own leads if such logic exists.
  - **Expected:** Receive a `200 OK` with a list of their leads.
- [ ] **Filter by `status`:** Test filtering by `pending`, `approved`, `completed`, and `rejected`.
  - **Expected:** The list should be correctly filtered by the provided status.
- [ ] **Filter by `hrUserId`:** As an admin, filter leads by a specific HR user's ID.
  - **Expected:** The list should only contain leads associated with that HR user.
- [ ] **Search:** Use the `search` parameter to find leads by `leadId`, `offerName`, `hrName`, `customerName`, etc.
  - **Expected:** The list should contain only leads that match the search term.
- [ ] **Pagination and Sorting:** Test `page`, `limit`, `sortBy`, and `order` parameters.
  - **Expected:** The response should be correctly paginated and sorted.

### 2. Get Lead Statistics (`GET /stats`)

- [ ] **Admin Access:** As an admin, get overall lead statistics.
  - **Expected:** Receive a `200 OK` with total counts for each status.
- [ ] **HR User Access:** As an HR user, get statistics for their own leads using the `hrUserId` query parameter.
  - **Expected:** Receive a `200 OK` with stats scoped to their user ID.

### 3. Get Lead Analytics (`GET /analytics`)

- [ ] **Admin Access:** As an admin, get analytics data.
  - **Expected:** Receive a `200 OK` with analytics data (e.g., leads over time).
- [ ] **Date Range Filtering:** Test `startDate` and `endDate` to filter analytics.
  - **Expected:** The analytics data should correspond to the specified date range.
- [ ] **Filtering by `category` or `hrUserId`:** Test filtering analytics by category or a specific HR user.
  - **Expected:** The data should be filtered accordingly.

### 4. Get All Users for Dropdown (`GET /users`)

- [ ] **Admin/HR Access:** Make a request to fetch the list of users (presumably for a dropdown in the UI).
  - **Expected:** Receive a `200 OK` with a simplified list of users (e.g., `id` and `name`).

### 5. Get Lead by ID (`GET /:id`)

- [ ] **Admin/Owner Access:** As an admin or the HR user who owns the lead, fetch a lead by its ID.
  - **Expected:** Receive a `200 OK` with the full lead details.
- [ ] **Unauthorized Access:** As a different HR user, attempt to fetch a lead not belonging to them.
  - **Expected:** Receive a `403 Forbidden` or `404 Not Found`.
- [ ] **Invalid ID:** Use a non-existent lead ID.
  - **Expected:** Receive a `404 Not Found`.

### 6. Create Lead (`POST /`)

- [ ] **Valid Data:** Simulate a customer filling out a form from a shared link. Provide all required fields (`offerId`, `hrUserId`, `customerName`, etc.).
  - **Expected:** Receive a `201 Created` with the new lead object, status set to `pending`.
- [ ] **Missing Required Fields:** Send a request without a required field like `customerContact`.
  - **Expected:** Receive a `400 Bad Request` with a validation error.
- [ ] **Invalid `offerId` or `hrUserId`:** Use an ID for an offer or user that does not exist.
  - **Expected:** Receive a `400 Bad Request` or `404 Not Found`.

### 7. Update Lead Status (`PUT /:id`)

- [ ] **Admin Access:** As an admin, update the status of a lead (e.g., to `completed`).
  - **Expected:** Receive a `200 OK` with the updated lead.
- [ ] **Invalid Status:** Attempt to update to a non-existent status.
  - **Expected:** Receive a `400 Bad Request`.
- [ ] **Non-Admin Access:** As an HR user, attempt to update the status directly (this might be disallowed in favor of `approve`/`reject` endpoints).
  - **Expected:** Receive a `403 Forbidden`.

### 8. Delete Lead (`DELETE /:id`)

- [ ] **Admin Access:** As an admin, delete a lead by its ID.
  - **Expected:** Receive a `200 OK` with a success message.
- [ ] **Invalid ID:** Attempt to delete a lead with a non-existent ID.
  - **Expected:** Receive a `404 Not Found`.
- [ ] **Non-Admin Access:** As an HR user, attempt to delete a lead.
  - **Expected:** Receive a `403 Forbidden`.

### 9. Approve Lead (`POST /:id/approve`)

- [ ] **Admin Access, Pending Lead:** As an admin, approve a lead that has a `pending` status.
  - **Expected:** Receive a `200 OK`, the lead status changes to `approved`, and the HR user's wallet is credited.
- [ ] **Lead Not Pending:** Attempt to approve a lead that is already `approved`, `completed`, or `rejected`.
  - **Expected:** Receive a `400 Bad Request` stating the action cannot be performed.
- [ ] **Non-Admin Access:** As an HR user, attempt to approve a lead.
  - **Expected:** Receive a `403 Forbidden`.

### 10. Reject Lead (`POST /:id/reject`)

- [ ] **Admin Access, Pending Lead:** As an admin, reject a `pending` lead with a `rejectionReason`.
  - **Expected:** Receive a `200 OK`, and the lead status changes to `rejected`.
- [ ] **Missing `rejectionReason`:** Attempt to reject a lead without providing a reason.
  - **Expected:** Receive a `400 Bad Request`.
- [ ] **Lead Not Pending:** Attempt to reject a lead that is not in `pending` status.
  - **Expected:** Receive a `400 Bad Request`.
- [ ] **Non-Admin Access:** As an HR user, attempt to reject a lead.
  - **Expected:** Receive a `403 Forbidden`.