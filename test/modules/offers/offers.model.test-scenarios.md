# Manual Test Scenarios: Offer Model

**Module:** `offers`
**Model:** `Offer`

---

### 1. Schema Validation

- [ ] **Create with all required fields:** Create a new offer with a valid `name` and `category`.
  - **Expected:** The document is saved successfully.
- [ ] **Missing `name`:** Attempt to save an offer without the `name` field.
  - **Expected:** Receive a `ValidationError` with the message "Offer name is required".
- [ ] **Missing `category`:** Attempt to save an offer without the `category` field.
  - **Expected:** Receive a `ValidationError` with the message "Category is required".
- [ ] **`name` too long:** Attempt to save with a `name` longer than 200 characters.
  - **Expected:** Receive a `ValidationError`.
- [ ] **`description` too long:** Attempt to save with a `description` longer than 1000 characters.
  - **Expected:** Receive a `ValidationError`.
- [ ] **`termsAndConditions` too long:** Attempt to save with `termsAndConditions` longer than 5000 characters.
  - **Expected:** Receive a `ValidationError`.
- [ ] **Invalid `latestStage`:** Attempt to save with a `latestStage` not in the enum list (e.g., 'In Review').
  - **Expected:** Receive a `ValidationError`.

### 2. Default Values

- [ ] **Create with only required fields:** Create an offer with just `name` and `category`.
  - **Expected:** The document is saved with the correct default values:
    - `latestStage`: 'Pending'
    - `image`: '' (empty string)
    - `video`: ''
    - `videoLink`: ''
    - `isApproved`: false

### 3. Pre-save Hook: `offersId` Generation

- [ ] **Create a new offer:** Save a new `Offer` document.
  - **Expected:** The `offersId` field is automatically generated with the format `OFF-XXXXXXXX-XXXXX` and is unique.
- [ ] **Save an existing offer:** Fetch an existing offer, modify it, and save it again.
  - **Expected:** The `offersId` remains unchanged.

### 4. Virtual Properties

- [ ] **Access `formattedDate`:** Create an offer and then access its `formattedDate` virtual property.
  - **Expected:** The virtual property should return the `createdAt` date formatted as a string (e.g., 'DD/MM/YYYY').

### 5. Indexes

- [ ] **Verify indexes in the database:** Inspect the `offers` collection in MongoDB.
  - **Expected:** The following indexes should exist:
    - `category: 1`
    - `status: 1`
    - `isApproved: 1`
    - `createdAt: -1`
    - `offersId: 1` (unique)
    - A text index on `name` and `description`.

### 6. Timestamps

- [ ] **Create a new offer:** Save a new document.
  - **Expected:** The `createdAt` and `updatedAt` fields are automatically set.
- [ ] **Update an existing offer:** Fetch an offer, modify it, and save it.
  - **Expected:** The `updatedAt` field is updated, while `createdAt` remains the same.
