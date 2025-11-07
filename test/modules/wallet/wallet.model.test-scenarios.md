# Manual Test Scenarios: Wallet Model

**Module:** `wallet`
**Model:** `Wallet`

---

### 1. Schema Validation

- [ ] **Create with required fields:** Create a new wallet with a valid `userId`.
  - **Expected:** The document is saved successfully.
- [ ] **Missing `userId`:** Attempt to save a wallet without a `userId`.
  - **Expected:** Receive a `ValidationError`.
- [ ] **Duplicate `userId`:** Attempt to save a wallet with a `userId` that already has a wallet.
  - **Expected:** Receive a `MongoError` (or similar) with a duplicate key error code (e.g., 11000).
- [ ] **Negative `balance`:** Attempt to save a wallet with a negative `balance`.
  - **Expected:** Receive a `ValidationError`.

### 2. Default Values

- [ ] **Create with only `userId`:** Create a wallet providing only the required `userId`.
  - **Expected:** The document is saved with the correct default values:
    - `balance`: 0
    - `totalEarned`: 0
    - `totalWithdrawn`: 0
    - `transactions`: [] (empty array)

### 3. Transactions Sub-schema

- [ ] **Add a valid `credit` transaction:** Add a transaction to the `transactions` array with `type: 'credit'` and a positive `amount`.
  - **Expected:** The transaction is added successfully.
- [ ] **Add a valid `debit` transaction:** Add a transaction with `type: 'debit'`.
  - **Expected:** The transaction is added successfully.
- [ ] **Missing transaction `type`:** Attempt to add a transaction without a `type`.
  - **Expected:** Receive a `ValidationError`.
- [ ] **Missing transaction `amount`:** Attempt to add a transaction without an `amount`.
  - **Expected:** Receive a `ValidationError`.
- [ ] **Invalid transaction `type`:** Attempt to add a transaction with a `type` other than 'credit' or 'debit'.
  - **Expected:** Receive a `ValidationError`.

### 4. Relationships / References

- [ ] **Populate `userId`:** Create a wallet with a valid `userId` from a `User` document. Use `.populate('userId')` in a query.
  - **Expected:** The `userId` field should be replaced with the full `User` document.
- [ ] **Populate `leadId` in transaction:** Add a transaction with a valid `leadId` from a `Lead` document. Use `.populate('transactions.leadId')`.
  - **Expected:** The `leadId` field within the transaction should be populated with the `Lead` document.

### 5. Timestamps

- [ ] **Create a new wallet:** Save a new document.
  - **Expected:** The `createdAt` and `updatedAt` fields are automatically set.
- [ ] **Update an existing wallet:** Fetch a wallet, modify it (e.g., add a transaction), and save it.
  - **Expected:** The `updatedAt` field is updated, while `createdAt` remains the same.
