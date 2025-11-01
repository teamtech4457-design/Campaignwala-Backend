# Manual Test Scenarios: Notifications

**Module:** `notifications`
**API Prefix:** `/api/notifications`

---

### 1. Admin: Send Notification (`POST /send`)

- [ ] **Send to All:** As an admin, send an announcement to all users (`recipients: ["all"]`).
  - **Expected:** Receive a `201 Created` status. The response should show a high `recipientCount`.
- [ ] **Send to Specific Users:** As an admin, send a notification to a hand-picked list of user IDs.
  - **Expected:** Receive a `201 Created`. The `recipientCount` should match the number of IDs sent.
- [ ] **Send with Filter:** As an admin, send a notification using a filter (e.g., `filterBy: 'incomplete'`).
  - **Expected:** Receive a `201 Created`. The `recipientCount` should match the number of users with incomplete profiles.
- [ ] **Non-Admin Access:** As a regular user, attempt to send a notification.
  - **Expected:** Receive a `403 Forbidden` or `401 Unauthorized` status.

### 2. User: View Notifications (`GET /user`)

- [ ] **View Own Notifications:** As a regular user who was a recipient of the notifications in step 1, make a GET request to `/user`.
  - **Expected:** Receive a `200 OK` with a list of notifications intended for you or for "all".
- [ ] **Unauthenticated Access:** Attempt to access `/user` without a token.
  - **Expected:** Receive a `401 Unauthorized` status.
- [ ] **No Notifications:** As a new user who has not been sent any notifications, access `/user`.
  - **Expected:** Receive a `200 OK` with an empty `notifications` array.

### 3. Admin: Manage Notifications

- [ ] **Get All Notifications (`GET /`):** As an admin, make a GET request.
  - **Expected:** Receive a `200 OK` with a list of all notifications sent system-wide.
- [ ] **Get Stats (`GET /stats`):** As an admin, make a GET request.
  - **Expected:** Receive a `200 OK` with statistics about notifications (total, by type, etc.).
- [ ] **Delete Notification (`DELETE /:id`):** As an admin, delete a specific notification by its ID.
  - **Expected:** Receive a `200 OK` with a success message.
- [ ] **Verify Deletion:** As a user who previously received that notification, access `/user` again.
  - **Expected:** The deleted notification should no longer appear in the user's list.
- [ ] **Bulk Delete (`POST /bulk-delete`):** As an admin, delete several notifications at once by sending an array of IDs.
  - **Expected:** Receive a `200 OK` with a message indicating the number of deleted items.
