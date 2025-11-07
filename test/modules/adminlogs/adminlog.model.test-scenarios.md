# Manual Test Scenarios: AdminLog Model

**Module:** `adminlogs`
**Model:** `AdminLog`

---

### 1. Schema Validation

- [ ] **Create with all required fields:** Create a new log with valid `adminName` and `action`.
  - **Expected:** The document is saved successfully.
- [ ] **Missing `adminName`:** Attempt to save a log without the `adminName` field.
  - **Expected:** Receive a `ValidationError` with the message "Admin name is required".
- [ ] **Missing `action`:** Attempt to save a log without the `action` field.
  - **Expected:** Receive a `ValidationError` with the message "Action is required".
- [ ] **`action` too long:** Attempt to save a log with an `action` string longer than 500 characters.
  - **Expected:** Receive a `ValidationError`.
- [ ] **`details` too long:** Attempt to save a log with a `details` string longer than 2000 characters.
  - **Expected:** Receive a `ValidationError`.
- [ ] **Invalid `actionType`:** Attempt to save a log with an `actionType` not in the enum list (e.g., `modified`).
  - **Expected:** Receive a `ValidationError`.
- [ ] **Invalid `module`:** Attempt to save a log with a `module` not in the enum list.
  - **Expected:** Receive a `ValidationError`.
- [ ] **Invalid `severity`:** Attempt to save a log with a `severity` not in the enum list.
  - **Expected:** Receive a `ValidationError`.
- [ ] **Invalid `status`:** Attempt to save a log with a `status` not in the enum list.
  - **Expected:** Receive a `ValidationError`.

### 2. Default Values

- [ ] **Create without optional fields:** Create a log with only the required fields (`adminName`, `action`).
  - **Expected:** The document is saved with the correct default values:
    - `adminRole`: 'Admin'
    - `actionType`: 'other'
    - `module`: 'other'
    - `severity`: 'info'
    - `ipAddress`: 'Unknown'
    - `metadata`: {}
    - `status`: 'success'

### 3. Pre-save Hook: `logId` Generation

- [ ] **Create a new log:** Save a new `AdminLog` document.
  - **Expected:** The `logId` field is automatically generated and is a unique string (e.g., `LOG-1678886400000-1234`).
- [ ] **Save an existing log:** Fetch an existing log, modify a field (e.g., `details`), and save it again.
  - **Expected:** The `logId` remains unchanged.

### 4. Indexes

- [ ] **Verify indexes in the database:** After the application starts, connect to the MongoDB database and inspect the `adminlogs` collection.
  - **Expected:** The following indexes should exist:
    - `adminId: 1`
    - `severity: 1`
    - `actionType: 1`
    - `module: 1`
    - `createdAt: -1`
    - `status: 1`
    - A text index on `adminName`, `action`, `details`, and `ipAddress`.
- [ ] **Query performance:** Perform queries that should use the indexes (e.g., find by `adminId`, sort by `createdAt`) and analyze the query performance (e.g., using `.explain("executionStats")`).
  - **Expected:** The query should use the appropriate index and be performant.

### 5. Timestamps

- [ ] **Create a new log:** Save a new document.
  - **Expected:** The `createdAt` and `updatedAt` fields are automatically set to the current time.
- [ ] **Update an existing log:** Fetch a log, modify it, and save it.
  - **Expected:** The `updatedAt` field is updated to the new save time, while `createdAt` remains the same.
