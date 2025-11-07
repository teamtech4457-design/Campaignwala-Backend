# Manual Test Scenarios: Lead Model

**Module:** `leads`
**Model:** `Lead`

---

### 1. Schema Validation

- [ ] **Create with all required fields:** Create a new lead with valid `offerId`, `offerName`, `category`, `hrUserId`, `hrName`, `hrContact`, `customerName`, and `customerContact`.
  - **Expected:** The document is saved successfully.
- [ ] **Missing a required field:** Attempt to save a lead without one of the required fields (e.g., `offerId`).
  - **Expected:** Receive a `ValidationError` for the missing field.
- [ ] **Invalid `status`:** Attempt to save a lead with a `status` that is not in the enum list (e.g., `in-progress`).
  - **Expected:** Receive a `ValidationError`.
- [ ] **Invalid data types:** Attempt to save a lead with incorrect data types (e.g., a string for `commission1`).
  - **Expected:** Receive a `CastError` or `ValidationError`.

### 2. Default Values

- [ ] **Create with only required fields:** Create a lead providing only the required fields.
  - **Expected:** The document is saved with the correct default values:
    - `status`: 'pending'
    - `offer`: '' (empty string)
    - `commission1`: 0
    - `commission2`: 0
    - `commission1Paid`: false
    - `commission2Paid`: false
    - `sharedLink`: ''
    - `remarks`: ''
    - `rejectionReason`: ''

### 3. Pre-save Hook: `leadId` Generation

- [ ] **Create a new lead:** Save a new `Lead` document.
  - **Expected:** The `leadId` field is automatically generated with the format `LD-XXXXXXXX` and is unique.
- [ ] **Save an existing lead:** Fetch an existing lead, modify a field (e.g., `remarks`), and save it again.
  - **Expected:** The `leadId` remains unchanged.

### 4. Relationships / References

- [ ] **Populate `offerId`:** Create a lead with a valid `offerId` from an existing `Offer` document. Then, use `.populate('offerId')` in a query.
  - **Expected:** The `offerId` field in the result should be replaced with the full `Offer` document.
- [ ] **Populate `hrUserId`:** Create a lead with a valid `hrUserId` from an existing `User` document. Then, use `.populate('hrUserId')`.
  - **Expected:** The `hrUserId` field should be populated with the corresponding `User` document.

### 5. Timestamps

- [ ] **Create a new lead:** Save a new document.
  - **Expected:** The `createdAt` and `updatedAt` fields are automatically set.
- [ ] **Update an existing lead:** Fetch a lead, modify it, and save it.
  - **Expected:** The `updatedAt` field is updated, while `createdAt` remains the same.
