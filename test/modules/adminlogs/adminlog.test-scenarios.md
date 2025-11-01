# Manual Test Scenarios: Admin Logs

**Module:** `adminlogs`
**API Prefix:** `/api/adminlogs`

**Note:** All endpoints in this module should be protected and require ADMIN authentication. Tests should be performed with both an Admin user token and a regular user token.

---

### 1. Get All Admin Logs (`GET /`)

- [ ] **Admin Access:** As an admin, make a GET request.
  - **Expected:** Receive a `200 OK` status with a list of logs.
- [ ] **Non-Admin Access:** As a regular user, make a GET request.
  - **Expected:** Receive a `403 Forbidden` or `401 Unauthorized` status.
- [ ] **Filtering:** As an admin, test various query parameters (`severity`, `actionType`, `module`, `status`, `adminId`).
  - **Expected:** The returned logs should be correctly filtered according to the parameters.
- [ ] **Pagination:** As an admin, use the `page` and `limit` parameters.
  - **Expected:** The response should provide the correct page of results and respect the limit.

### 2. Get Log Statistics (`GET /stats`)

- [ ] **Admin Access:** As an admin, make a GET request to `/stats`.
  - **Expected:** Receive a `200 OK` status with an object containing log statistics (total, bySeverity, etc.).
- [ ] **Non-Admin Access:** As a regular user, make a GET request to `/stats`.
  - **Expected:** Receive a `403 Forbidden` or `401 Unauthorized` status.

### 3. Get Log by ID (`GET /:id`)

- [ ] **Valid ID:** As an admin, request a log with a valid and existing log ID.
  - **Expected:** Receive a `200 OK` status with the correct log object.
- [ ] **Invalid ID:** As an admin, request a log with an invalid or non-existent ID.
  - **Expected:** Receive a `404 Not Found` status.

### 4. Delete Log (`DELETE /:id`)

- [ ] **Valid ID:** As an admin, delete a log with a valid ID.
  - **Expected:** Receive a `200 OK` status with a success message.
- [ ] **Verify Deletion:** Attempt to GET the deleted log ID again.
  - **Expected:** Receive a `404 Not Found` status.

### 5. Bulk Delete Logs (`POST /bulk-delete`)

- [ ] **Valid IDs:** As an admin, send a POST request with an array of valid log IDs.
  - **Expected:** Receive a `200 OK` status with a success message and the count of deleted logs.
- [ ] **Empty/Invalid Payload:** Send a request with an empty array or invalid data.
  - **Expected:** Receive a `400 Bad Request` status.

