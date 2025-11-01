# Manual Test Scenarios: Categories

**Module:** `categories`
**API Prefix:** `/api/categories`

---

### 1. Get All Categories (`GET /`)

- [ ] **Public Access:** As a non-authenticated user, make a GET request.
  - **Expected:** Receive a `200 OK` status with a list of all active categories.
- [ ] **Filtering by Status:** Use the `?status=inactive` query parameter.
  - **Expected:** Receive a `200 OK` status with a list of inactive categories.

### 2. Create Category (`POST /`)

- [ ] **Admin Access:** As an admin, send a POST request with valid `name` and `description`.
  - **Expected:** Receive a `201 Created` status with the new category object.
- [ ] **Non-Admin Access:** As a regular user, attempt to create a category.
  - **Expected:** Receive a `403 Forbidden` or `401 Unauthorized` status.
- [ ] **Duplicate Name:** As an admin, attempt to create a category with a name that already exists.
  - **Expected:** Receive a `400 Bad Request` status with a descriptive error message.
- [ ] **Missing Fields:** As an admin, attempt to create a category without a `name` or `description`.
  - **Expected:** Receive a `400 Bad Request` status.

### 3. Update Category (`PUT /:id`)

- [ ] **Admin Access:** As an admin, update an existing category's `name`.
  - **Expected:** Receive a `200 OK` status with the updated category object.
- [ ] **Non-Admin Access:** As a regular user, attempt to update a category.
  - **Expected:** Receive a `403 Forbidden` or `401 Unauthorized` status.
- [ ] **Invalid ID:** As an admin, attempt to update a category with a non-existent ID.
  - **Expected:** Receive a `404 Not Found` status.

### 4. Delete Category (`DELETE /:id`)

- [ ] **Admin Access:** As an admin, delete an existing category.
  - **Expected:** Receive a `200 OK` status with a success message.
- [ ] **Verify Deletion:** Attempt to GET the deleted category's ID.
  - **Expected:** Receive a `404 Not Found` status.
- [ ] **Non-Admin Access:** As a regular user, attempt to delete a category.
  - **Expected:** Receive a `403 Forbidden` or `401 Unauthorized` status.
