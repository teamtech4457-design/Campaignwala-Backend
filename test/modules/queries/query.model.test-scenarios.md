# Manual Test Scenarios: Query Model

**Module:** `queries`
**Model:** `Query`

---

### 1. Schema Validation

- [ ] **Create with all required fields:** Create a new query with valid `user`, `email`, `subject`, and `message`.
  - **Expected:** The document is saved successfully.
- [ ] **Missing a required field:** Attempt to save a query without a required field like `subject`.
  - **Expected:** Receive a `ValidationError` for the missing field.
- [ ] **`subject` too long:** Attempt to save with a `subject` longer than 200 characters.
  - **Expected:** Receive a `ValidationError`.
- [ ] **`message` too long:** Attempt to save with a `message` longer than 5000 characters.
  - **Expected:** Receive a `ValidationError`.
- [ ] **Invalid `status`:** Attempt to save with a `status` not in the enum list.
  - **Expected:** Receive a `ValidationError`.
- [ ] **Invalid `priority`:** Attempt to save with a `priority` not in the enum list.
  - **Expected:** Receive a `ValidationError`.
- [ ] **Invalid `category`:** Attempt to save with a `category` not in the enum list.
  - **Expected:** Receive a `ValidationError`.

### 2. Sub-schema: Replies

- [ ] **Add a valid reply:** Add a reply to a query with a valid `message`.
  - **Expected:** The reply is added to the `replies` array successfully.
- [ ] **Add a reply without a message:** Attempt to add a reply with no `message`.
  - **Expected:** Receive a `ValidationError`.
- [ ] **Reply message too long:** Attempt to add a reply with a `message` longer than 2000 characters.
  - **Expected:** Receive a `ValidationError`.

### 3. Default Values

- [ ] **Create with only required fields:** Create a query with just the required fields.
  - **Expected:** The document is saved with the correct default values:
    - `status`: 'Open'
    - `hasReplied`: false
    - `priority`: 'Medium'
    - `category`: 'General'
    - `isResolved`: false

### 4. Pre-save Hook

- [ ] **`queryId` Generation:** Save a new `Query` document.
  - **Expected:** The `queryId` field is automatically generated with the format `QRY-XXXXXXXX-XXX` and is unique.
- [ ] **`hasReplied` and `status` update:** Create a query, then add a reply to its `replies` array and save.
  - **Expected:** When saved, `hasReplied` should become `true` and `status` should change from 'Open' to 'Replied'.
- [ ] **Status does not change if not 'Open':** Create a query, manually set its status to 'Closed', add a reply, and save.
  - **Expected:** The `status` should remain 'Closed'.

### 5. Virtual Properties

- [ ] **Access `replyCount`:** Create a query and add several replies. Access the `replyCount` virtual property.
  - **Expected:** It should return the correct number of replies in the `replies` array.
- [ ] **Access `formattedDate`:** Create a query and access its `formattedDate` virtual property.
  - **Expected:** It should return the `createdAt` date formatted as a string (e.g., 'DD/MM/YYYY').

### 6. Indexes

- [ ] **Verify indexes in the database:** Inspect the `queries` collection in MongoDB.
  - **Expected:** All indexes defined in the schema should exist, including the text index.

### 7. Timestamps

- [ ] **Create a new query:** Save a new document.
  - **Expected:** The `createdAt` and `updatedAt` fields are automatically set.
- [ ] **Update an existing query:** Fetch a query, modify it (e.g., add a reply), and save it.
  - **Expected:** The `updatedAt` field is updated, while `createdAt` remains the same.
