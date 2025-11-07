# Manual Test Scenarios: Queries

**Module:** `queries`
**API Prefix:** `/api/queries`

---

### 1. Public User: Submitting and Viewing Queries

- [ ] **Submit a Query (`POST /`):** As a public user, send a POST request with your name, email, subject, and message.
  - **Expected:** Receive a `201 Created` status with the new query object. The query status should be 'Open'.
- [ ] **Submit Query with Missing Info:** Attempt to submit a query without a subject or message.
  - **Expected:** Receive a `400 Bad Request` status.
- [ ] **View Own Queries (`GET /email/:email`):** Using the same email from the first step, make a GET request to the `/email/{your-email}` endpoint.
  - **Expected:** Receive a `200 OK` with a list containing the query you just submitted.
- [ ] **View Others' Queries:** Try to guess another user's email and use it in the `/email/` endpoint.
  - **Expected:** You should only see queries associated with that email, confirming data is properly segregated.

### 2. Admin: Managing Queries

- [ ] **View All Queries (`GET /`):** As an admin, make a GET request.
  - **Expected:** Receive a `200 OK` with a list of all queries from all users.
- [ ] **Non-Admin Access:** As a regular user, attempt to access `GET /`.
  - **Expected:** Receive a `403 Forbidden` or `401 Unauthorized` status.
- [ ] **Reply to a Query (`POST /:id/reply`):** As an admin, select a query ID and post a reply to it.
  - **Expected:** Receive a `200 OK`. The query's `status` should change from 'Open' to 'Replied', and the `replies` array should contain the new message.
- [ ] **Verify User Can See Reply:** As the original user, view your query again via the `/email/:email` endpoint.
  - **Expected:** The query details should now include the admin's reply.
- [ ] **Close a Query (`PATCH /:id/status`):** As an admin, update the query's status to 'Closed'.
  - **Expected:** Receive a `200 OK`. The query's `status` should be 'Closed' and `isResolved` should be `true`.
- [ ] **Delete a Query (`DELETE /:id`):** As an admin, delete a query.
  - **Expected:** Receive a `200 OK`. The query should no longer appear in the `GET /` list.
