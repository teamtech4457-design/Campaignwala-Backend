# Manual Test Scenarios: Slide Model

**Module:** `slides`
**Model:** `Slide`

---

### 1. Schema Validation

- [ ] **Create with all required fields:** Create a new slide with valid `offerTitle`, `category`, `OffersId`, and `backgroundImage`.
  - **Expected:** The document is saved successfully.
- [ ] **Missing a required field:** Attempt to save a slide without a required field like `offerTitle`.
  - **Expected:** Receive a `ValidationError` for the missing field.
- [ ] **`offerTitle` too long:** Attempt to save with an `offerTitle` longer than 200 characters.
  - **Expected:** Receive a `ValidationError`.
- [ ] **`description` too long:** Attempt to save with a `description` longer than 500 characters.
  - **Expected:** Receive a `ValidationError`.
- [ ] **Duplicate `OffersId`:** Attempt to save a slide with an `OffersId` that already exists.
  - **Expected:** Receive a `MongoError` (or similar) with a duplicate key error code (e.g., 11000).
- [ ] **Invalid `status`:** Attempt to save with a `status` not in the enum list ('active', 'inactive').
  - **Expected:** Receive a `ValidationError`.

### 2. Default Values

- [ ] **Create with only required fields:** Create a slide providing only the required fields.
  - **Expected:** The document is saved with the correct default values:
    - `order`: 0
    - `status`: 'active'
    - `views`: 0

### 3. Relationships / References

- [ ] **Populate `category`:** Create a slide with a valid `category` ID from an existing `Category` document. Then, use `.populate('category')` in a query.
  - **Expected:** The `category` field in the result should be replaced with the full `Category` document.

### 4. Indexes

- [ ] **Verify indexes in the database:** Inspect the `slides` collection in MongoDB.
  - **Expected:** The following indexes should exist:
    - `{ status: 1, order: 1 }`
    - `{ category: 1 }`
    - `{ OffersId: 1 }` (unique)

### 5. Timestamps

- [ ] **Create a new slide:** Save a new document.
  - **Expected:** The `createdAt` and `updatedAt` fields are automatically set.
- [ ] **Update an existing slide:** Fetch a slide, modify it, and save it.
  - **Expected:** The `updatedAt` field is updated, while `createdAt` remains the same.
