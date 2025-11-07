# Manual Test Scenarios: Withdrawal Model

**Module:** `withdrawal`
**Model:** `Withdrawal`

---

### 1. Schema Validation

- [ ] **Create with required fields:** Create a new withdrawal request with a valid `userId` and `amount`.
  - **Expected:** The document is saved successfully.
- [ ] **Missing `userId`:** Attempt to save a request without a `userId`.
  - **Expected:** Receive a `ValidationError`.
- [ ] **Missing `amount`:** Attempt to save a request without an `amount`.
  - **Expected:** Receive a `ValidationError`.
- [ ] **Amount less than 1:** Attempt to save with an `amount` of 0 or less.
  - **Expected:** Receive a `ValidationError` with the message "Amount must be at least 1".
- [ ] **Invalid `status`:** Attempt to save with a `status` not in the enum list.
  - **Expected:** Receive a `ValidationError`.

### 2. Default Values

- [ ] **Create with only required fields:** Create a request with just `userId` and `amount`.
  - **Expected:** The document is saved with the correct default values:
    - `status`: 'pending'
    - `requestDate`: Current date/time
    - `reason`: 'Awaiting admin approval'

### 3. Pre-save Hook: `withdrawalId` Generation

- [ ] **Create a new request:** Save a new `Withdrawal` document.
  - **Expected:** The `withdrawalId` field is automatically generated with the format `WDR-XXXXXXXX-XXX` and is unique.
- [ ] **Save an existing request:** Fetch an existing request, modify it, and save it again.
  - **Expected:** The `withdrawalId` remains unchanged.

### 4. Relationships / References

- [ ] **Populate `userId`:** Create a request with a valid `userId` from a `User` document. Use `.populate('userId')` in a query.
  - **Expected:** The `userId` field should be replaced with the full `User` document.
- [ ] **Populate `processedBy`:** Update a request with a valid `processedBy` ID. Use `.populate('processedBy')`.
  - **Expected:** The `processedBy` field should be populated with the admin's `User` document.

### 5. Indexes

- [ ] **Verify indexes in the database:** Inspect the `withdrawals` collection in MongoDB.
  - **Expected:** The following indexes should exist:
    - `{ userId: 1 }`
    - `{ status: 1 }`
    - `{ requestDate: -1 }`
    - `{ withdrawalId: 1 }` (unique)

### 6. Timestamps

- [ ] **Create a new request:** Save a new document.
  - **Expected:** The `createdAt` and `updatedAt` fields are automatically set.
- [ ] **Update an existing request:** Fetch a request, modify it (e.g., change status), and save it.
  - **Expected:** The `updatedAt` field is updated, while `createdAt` remains the same.
