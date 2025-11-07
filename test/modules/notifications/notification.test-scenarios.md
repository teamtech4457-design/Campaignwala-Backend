# Manual Test Scenarios: Notifications

**Module:** `notifications`
**API Prefix:** `/api/notifications`

---

### 1. Send Notification (`POST /send`)

- [ ] **Admin Access, Send to All:** As an admin, send an `announcement` to all users (`recipients: ["all"]`).
  - **Expected:** Receive a `201 Created` with the new notification object. A notification should be created for each user.
- [ ] **Send to Specific Users:** Send a notification to a specific list of `selectedUserIds`.
  - **Expected:** Receive a `201 Created`. Notifications are created only for the specified users.
- [ ] **Send based on Filter:** Send a notification using a `filterBy` condition (e.g., `incomplete` profiles).
  - **Expected:** Receive a `201 Created`. Notifications are sent only to users matching the filter.
- [ ] **Missing Required Fields:** Attempt to send a notification without a `title` or `message`.
  - **Expected:** Receive a `400 Bad Request` with a validation error.
- [ ] **Invalid `type`:** Use a notification type that is not in the allowed enum (e.g., `personal`).
  - **Expected:** Receive a `400 Bad Request`.
- [ ] **Non-Admin Access:** As a regular user, attempt to send a notification.
  - **Expected:** Receive a `403 Forbidden`.

### 2. Get All Notifications (`GET /`)

- [ ] **Admin Access:** As an admin, fetch all notifications without any filters.
  - **Expected:** Receive a `200 OK` with a paginated list of all sent notifications.
- [ ] **Filter by `type`:** Filter the notifications by a valid type (e.g., `offer`, `system`).
  - **Expected:** The list should only contain notifications of the specified type.
- [ ] **Filter by `status`:** Filter by `sent` or `failed` status.
  - **Expected:** The list should be filtered correctly.
- [ ] **Search:** Use the `search` parameter with a keyword in the title or message.
  - **Expected:** The list should contain only notifications matching the search term.
- [ ] **Pagination and Sorting:** Test the `page`, `limit`, `sortBy`, and `order` parameters.
  - **Expected:** The response should be correctly paginated and sorted.
- [ ] **Non-Admin Access:** As a regular user, attempt to access this endpoint.
  - **Expected:** Receive a `403 Forbidden`.

### 3. Get Notification Statistics (`GET /stats`)

- [ ] **Admin Access:** As an admin, make a GET request to this endpoint.
  - **Expected:** Receive a `200 OK` with statistics (total, by type, by status, etc.).
- [ ] **Non-Admin Access:** As a regular user, attempt to access this endpoint.
  - **Expected:** Receive a `403 Forbidden`.

### 4. Get User Notifications (`GET /user`)

- [ ] **Authenticated User:** As a logged-in user, fetch their own notifications.
  - **Expected:** Receive a `200 OK` with a list of notifications sent to them.
- [ ] **Filter by `type`:** As a user, filter their notifications by type.
  - **Expected:** The list should be correctly filtered.
- [ ] **Unauthenticated User:** Attempt to access this endpoint without a valid token.
  - **Expected:** Receive a `401 Unauthorized`.

### 5. Get Notification by ID (`GET /:id`)

- [ ] **Admin Access:** As an admin, fetch a single notification by its ID.
  - **Expected:** Receive a `200 OK` with the notification details.
- [ ] **Invalid ID:** Use a non-existent notification ID.
  - **Expected:** Receive a `404 Not Found`.
- [ ] **Non-Admin Access:** As a regular user, attempt to fetch a notification by ID (this might be disallowed).
  - **Expected:** Receive a `403 Forbidden`.

### 6. Delete Notification (`DELETE /:id`)

- [ ] **Admin Access:** As an admin, delete a notification by its ID.
  - **Expected:** Receive a `200 OK` with a success message.
- [ ] **Invalid ID:** Attempt to delete a notification with a non-existent ID.
  - **Expected:** Receive a `404 Not Found`.
- [ ] **Non-Admin Access:** As a regular user, attempt to delete a notification.
  - **Expected:** Receive a `403 Forbidden`.

### 7. Bulk Delete Notifications (`POST /bulk-delete`)

- [ ] **Admin Access:** As an admin, provide an array of notification IDs to delete.
  - **Expected:** Receive a `200 OK` and the specified notifications are removed.
- [ ] **Empty or Invalid IDs:** Send an empty array or an array with invalid IDs.
  - **Expected:** Receive a `400 Bad Request` or a partial success message.
- [ ] **Non-Admin Access:** As a regular user, attempt to bulk delete notifications.
  - **Expected:** Receive a `403 Forbidden`.