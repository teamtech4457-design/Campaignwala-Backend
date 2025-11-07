# Manual Test Scenarios: Notification Model

**Module:** `notifications`
**Model:** `Notification`

---

### 1. Schema Validation

- [ ] **Create with all required fields:** Create a new notification with valid `type`, `title`, and `message`.
  - **Expected:** The document is saved successfully.
- [ ] **Missing `type`:** Attempt to save a notification without the `type` field.
  - **Expected:** Receive a `ValidationError` with the message "Notification type is required".
- [ ] **Missing `title`:** Attempt to save without the `title` field.
  - **Expected:** Receive a `ValidationError` with the message "Title is required".
- [ ] **Missing `message`:** Attempt to save without the `message` field.
  - **Expected:** Receive a `ValidationError` with the message "Message is required".
- [ ] **`title` too long:** Attempt to save with a `title` longer than 200 characters.
  - **Expected:** Receive a `ValidationError`.
- [ ] **`message` too long:** Attempt to save with a `message` longer than 2000 characters.
  - **Expected:** Receive a `ValidationError`.
- [ ] **Invalid `type`:** Attempt to save with a `type` not in the enum list (e.g., `reminder`).
  - **Expected:** Receive a `ValidationError`.
- [ ] **Invalid `status`:** Attempt to save with a `status` not in the enum list.
  - **Expected:** Receive a `ValidationError`.

### 2. Default Values

- [ ] **Create with only required fields:** Create a notification with just `type`, `title`, and `message`.
  - **Expected:** The document is saved with the correct default values:
    - `recipients`: [] (empty array)
    - `recipientCount`: 0
    - `targetSegments`: []
    - `status`: 'sent'
    - `sentDate`: Current date/time
    - `deliveryStats`: `{ sent: 0, delivered: 0, failed: 0 }`

### 3. Pre-save Hook: `notificationId` Generation

- [ ] **Create a new notification:** Save a new `Notification` document.
  - **Expected:** The `notificationId` field is automatically generated with the format `NOTIF-XXXXXXXX-XXX` and is unique.
- [ ] **Save an existing notification:** Fetch an existing notification, modify it, and save it again.
  - **Expected:** The `notificationId` remains unchanged.

### 4. Indexes

- [ ] **Verify indexes in the database:** Inspect the `notifications` collection in MongoDB.
  - **Expected:** The following indexes should exist:
    - `type: 1`
    - `status: 1`
    - `sentDate: -1`
    - `notificationId: 1`
    - `sentBy: 1`
    - A text index on `title` and `message`.

### 5. Timestamps

- [ ] **Create a new notification:** Save a new document.
  - **Expected:** The `createdAt` and `updatedAt` fields are automatically set.
- [ ] **Update an existing notification:** Fetch a notification, modify it, and save it.
  - **Expected:** The `updatedAt` field is updated, while `createdAt` remains the same.
