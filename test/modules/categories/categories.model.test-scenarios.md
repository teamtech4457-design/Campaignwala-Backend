# Manual Test Scenarios: Category Model

**Module:** `categories`
**Model:** `Category`

---

### 1. Schema Validation

- [ ] **Create with all required fields:** Create a new category with valid `name` and `description`.
  - **Expected:** The document is saved successfully.
- [ ] **Missing `name`:** Attempt to save a category without the `name` field.
  - **Expected:** Receive a `ValidationError` with the message "Category name is required".
- [ ] **Missing `description`:** Attempt to save a category without the `description` field.
  - **Expected:** Receive a `ValidationError` with the message "Category description is required".
- [ ] **Duplicate `name`:** Attempt to save a category with a `name` that already exists.
  - **Expected:** Receive a `MongoError` (or similar) with a duplicate key error code (e.g., 11000).
- [ ] **`name` too short:** Attempt to save a category with a `name` less than 2 characters.
  - **Expected:** Receive a `ValidationError`.
- [ ] **`name` too long:** Attempt to save a category with a `name` longer than 100 characters.
  - **Expected:** Receive a `ValidationError`.
- [ ] **`description` too long:** Attempt to save a category with a `description` longer than 500 characters.
  - **Expected:** Receive a `ValidationError`.
- [ ] **Invalid `status`:** Attempt to save a category with a `status` other than 'active' or 'inactive'.
  - **Expected:** Receive a `ValidationError`.
- [ ] **Negative `count`:** Attempt to save a category with a negative number for `count`.
  - **Expected:** Receive a `ValidationError`.

### 2. Default Values

- [ ] **Create with only required fields:** Create a category with just `name` and `description`.
  - **Expected:** The document is saved with the correct default values:
    - `icon`: '' (empty string)
    - `iconImage`: '' (empty string)
    - `status`: 'active'
    - `count`: 0

### 3. Virtual Properties

- [ ] **Access `formattedDate`:** Create a category and then access its `formattedDate` virtual property.
  - **Expected:** The virtual property should return the `createdAt` date formatted as a string (e.g., 'DD/MM/YYYY').
- [ ] **Access `formattedDate` on a new, unsaved document:** Create a new category instance but do not save it. Access `formattedDate`.
  - **Expected:** It should return 'N/A' as `createdAt` is not yet set.

### 4. Indexes

- [ ] **Verify indexes in the database:** After the application starts, inspect the `categories` collection in MongoDB.
  - **Expected:** The following indexes should exist:
    - `name: 1` (unique)
    - `status: 1`
    - `createdAt: -1`
- [ ] **Query performance:** Perform queries that should use the indexes (e.g., find by `status`, sort by `createdAt`) and analyze the query performance.
  - **Expected:** The query should use the appropriate index and be performant.

### 5. Timestamps

- [ ] **Create a new category:** Save a new document.
  - **Expected:** The `createdAt` and `updatedAt` fields are automatically set.
- [ ] **Update an existing category:** Fetch a category, modify it, and save it.
  - **Expected:** The `updatedAt` field is updated, and `createdAt` remains unchanged.
