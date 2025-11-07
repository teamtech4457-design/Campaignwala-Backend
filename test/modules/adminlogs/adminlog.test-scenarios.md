# Manual Test Scenarios: Admin Logs

**Module:** `adminlogs`
**API Prefix:** `/api/adminlogs`

---

### 1. Get All Admin Logs (`GET /`)

- [ ] **Admin Access:** As an admin, make a GET request to fetch all logs.
  - **Expected:** Receive a `200 OK` with a paginated list of admin logs.
- [ ] **Non-Admin Access:** As a regular user, attempt to access this endpoint.
  - **Expected:** Receive a `403 Forbidden`.
- [ ] **Filtering by `severity`:** Test filtering with a valid severity (e.g., `info`, `warning`, `error`).
  - **Expected:** The list should only contain logs with the specified severity.
- [ ] **Filtering by `actionType`:** Test filtering with a valid action type (e.g., `create`, `update`, `delete`).
  - **Expected:** The list should be correctly filtered by the action type.
- [ ] **Filtering by `module`:** Test filtering with a valid module (e.g., `users`, `offers`).
  - **Expected:** The list should only contain logs related to the specified module.
- [ ] **Filtering by `status`:** Test filtering with a valid status (e.g., `success`, `failed`).
  - **Expected:** The list should be correctly filtered by status.
- [ ] **Filtering by `adminId`:** Test filtering with a valid admin user ID.
  - **Expected:** The list should only contain logs for the specified admin.
- [ ] **Search:** Test the `search` query parameter with a keyword.
  - **Expected:** The list should contain logs matching the search term in relevant fields.
- [ ] **Date Range Filtering:** Test filtering with `startDate` and `endDate`.
  - **Expected:** The list should only contain logs within the specified date range.
- [ ] **Pagination:** Test the `page` and `limit` query parameters.
  - **Expected:** The response should be correctly paginated.
- [ ] **Sorting:** Test `sortBy` and `sortOrder` (e.g., `createdAt`, `desc`).
  - **Expected:** The list should be sorted as specified.

### 2. Get Admin Log Statistics (`GET /stats`)

- [ ] **Admin Access:** As an admin, make a GET request to this endpoint.
  - **Expected:** Receive a `200 OK` with a comprehensive statistics object.
- [ ] **Non-Admin Access:** As a regular user, attempt to access this endpoint.
  - **Expected:** Receive a `403 Forbidden`.

### 3. Get Logs by Admin ID (`GET /admin/:adminId`)

- [ ] **Admin Access:** As an admin, fetch logs for a specific admin by their ID.
  - **Expected:** Receive a `200 OK` with a list of logs for that admin.
- [ ] **Invalid `adminId`:** Use a non-existent or invalid admin ID.
  - **Expected:** Receive a `404 Not Found` or an empty list.
- [ ] **Non-Admin Access:** As a regular user, attempt to access this endpoint.
  - **Expected:** Receive a `403 Forbidden`.

### 4. Get Admin Log by ID (`GET /:id`)

- [ ] **Admin Access:** As an admin, fetch a single log by its ID.
  - **Expected:** Receive a `200 OK` with the log details.
- [ ] **Invalid ID:** Use a non-existent log ID.
  - **Expected:** Receive a `404 Not Found`.
- [ ] **Non-Admin Access:** As a regular user, attempt to access this endpoint.
  - **Expected:** Receive a `403 Forbidden`.

### 5. Create Admin Log (`POST /`)

- [ ] **Admin Action:** This endpoint is likely used internally by the system to log admin actions. Manually test by simulating an admin action that should trigger a log entry.
  - **Expected:** A new log entry is created in the database with the correct details.
- [ ] **Direct POST Request:** Attempt to create a log entry via a direct POST request.
  - **Expected:** Depending on the implementation, this might be allowed for admins or specific services. If so, expect a `201 Created`. Otherwise, a `403 Forbidden` might be appropriate.
- [ ] **Missing Required Fields:** Send a request without required fields like `adminName` or `action`.
  - **Expected:** Receive a `400 Bad Request`.

### 6. Delete Admin Log (`DELETE /:id`)

- [ ] **Admin Access:** As a super admin, delete a specific log entry by its ID.
  - **Expected:** Receive a `200 OK` and the log is removed.
- [ ] **Invalid ID:** Attempt to delete a log with a non-existent ID.
  - **Expected:** Receive a `404 Not Found`.
- [ ] **Non-Admin Access:** As a regular user or a lower-level admin, attempt to delete a log.
  - **Expected:** Receive a `403 Forbidden`.

### 7. Bulk Delete Admin Logs (`POST /bulk-delete`)

- [ ] **Admin Access:** As a super admin, provide an array of log IDs to delete.
  - **Expected:** Receive a `200 OK` and all specified logs are removed.
- [ ] **Empty or Invalid IDs:** Send an empty array or an array with invalid IDs.
  - **Expected:** Receive a `400 Bad Request` or a partial success message.
- [ ] **Non-Admin Access:** As a regular user, attempt to bulk delete logs.
  - **Expected:** Receive a `403 Forbidden`.

### 8. Clear Old Logs (`POST /clear-old`)

- [ ] **Admin Access:** As a super admin, make a request to clear old logs (e.g., older than 90 days).
  - **Expected:** Receive a `200 OK` with a message indicating how many logs were cleared.
- [ ] **Custom `days` Parameter:** Specify a custom number of days.
  - **Expected:** Logs older than the specified number of days are cleared.
- [ ] **Non-Admin Access:** As a regular user, attempt to clear logs.
  - **Expected:** Receive a `403 Forbidden`.