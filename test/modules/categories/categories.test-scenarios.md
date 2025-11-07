# Manual Test Scenarios: Categories

**Module:** `categories`
**API Prefix:** `/api/categories`

---

### 1. Get All Categories (`GET /`)

- [ ] **No Filters:** Make a GET request without any query parameters.
  - **Expected:** Receive a `200 OK` with a paginated list of all categories.
- [ ] **Filter by `status=active`:** Fetch only active categories.
  - **Expected:** Receive a `200 OK` with a list of categories where `status` is 'active'.
- [ ] **Filter by `status=inactive`:** Fetch only inactive categories.
  - **Expected:** Receive a `200 OK` with a list of categories where `status` is 'inactive'.
- [ ] **Search:** Use the `search` query parameter with a keyword present in a category's name or description.
  - **Expected:** The list should only contain categories matching the search term.
- [ ] **Pagination:** Test the `page` and `limit` query parameters to ensure pagination is working correctly.
  - **Expected:** The response should be correctly paginated.
- [ ] **Sorting:** Test `sortBy` and `order` (e.g., `name`, `asc`) to ensure sorting works.
  - **Expected:** The list should be sorted as specified.

### 2. Get Category Statistics (`GET /stats`)

- [ ] **Admin/Authenticated Access:** As an authenticated user (if required), make a GET request.
  - **Expected:** Receive a `200 OK` with statistics (total, active, inactive counts).
- [ ] **Unauthenticated Access:** Attempt to access without authentication.
  - **Expected:** Receive a `401 Unauthorized` if authentication is required.

### 3. Get Category by ID (`GET /:id`)

- [ ] **Valid ID:** Use the ID of an existing category.
  - **Expected:** Receive a `200 OK` with the full details of the category.
- [ ] **Invalid ID:** Use a non-existent or malformed category ID.
  - **Expected:** Receive a `404 Not Found`.

### 4. Create Category (`POST /`)

- [ ] **Admin/Authenticated Access, Valid Data:** As an admin, create a new category with all required fields (`name`, `description`).
  - **Expected:** Receive a `201 Created` with the newly created category object.
- [ ] **Duplicate Name:** Attempt to create a category with a name that already exists.
  - **Expected:** Receive a `400 Bad Request` with a 'duplicate' error message.
- [ ] **Missing Required Fields:** Send a request without the `name` or `description`.
  - **Expected:** Receive a `400 Bad Request` with a validation error.
- [ ] **With Image:** Create a category and include an `iconImage` (e.g., base64 string).
  - **Expected:** The category is created, and the image is stored correctly.
- [ ] **Non-Admin Access:** As a regular user, attempt to create a category.
  - **Expected:** Receive a `403 Forbidden`.

### 5. Update Category (`PUT /:id`)

- [ ] **Admin Access, Valid Data:** As an admin, update an existing category's `name`, `description`, `status`, or `iconImage`.
  - **Expected:** Receive a `200 OK` with the updated category object.
- [ ] **Invalid ID:** Attempt to update a category with a non-existent ID.
  - **Expected:** Receive a `404 Not Found`.
- [ ] **Duplicate Name:** Attempt to update a category's name to one that already exists on another category.
  - **Expected:** Receive a `400 Bad Request`.
- [ ] **Non-Admin Access:** As a regular user, attempt to update a category.
  - **Expected:** Receive a `403 Forbidden`.

### 6. Delete Category (`DELETE /:id`)

- [ ] **Admin Access, Valid ID:** As an admin, delete an existing category.
  - **Expected:** Receive a `200 OK` with a success message and the ID of the deleted category.
- [ ] **Invalid ID:** Attempt to delete a category with a non-existent ID.
  - **Expected:** Receive a `404 Not Found`.
- [ ] **Category in Use:** Attempt to delete a category that is currently associated with other items (e.g., offers). (This depends on the backend logic).
  - **Expected:** Either the deletion is blocked (`400 Bad Request`) or a soft delete is performed.
- [ ] **Non-Admin Access:** As a regular user, attempt to delete a category.
  - **Expected:** Receive a `403 Forbidden`.