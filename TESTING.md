# Manual Testing Scenarios

This document outlines manual test cases for features that are difficult to automate or require visual/manual verification.

## General

- [ ] **Health Check:** Navigate to the base URL (`/`) and verify the API status message is displayed.
- [ ] **Swagger Docs:** Navigate to `/api-docs` and ensure the Swagger UI loads correctly and displays all endpoints.

---

## Authentication (users)

### Send OTP
- [ ] **Valid Phone:** Enter a valid, unregistered 10-digit phone number.
  - **Expected:** Receive a success message. An OTP is logged or sent.
- [ ] **Invalid Phone:** Enter a phone number with letters or fewer than 10 digits.
  - **Expected:** Receive a 400 Bad Request error.
- [ ] **Throttling:** Attempt to send an OTP to the same number multiple times in a short period.
  - **Expected:** Receive a 429 Too Many Requests error after a certain threshold.

### Registration
- [ ] **Successful Registration:** Use a valid phone number and the correct OTP.
  - **Expected:** User is created. Receive a success message and a JWT token.
- [ ] **Incorrect OTP:** Use a valid phone number but an incorrect OTP.
  - **Expected:** Receive a 400 Bad Request error.
- [ ] **Existing User:** Attempt to register with a phone number that is already registered.
  - **Expected:** Receive a 409 Conflict error.

---

## Categories (categories)

### Create Category
- [ ] **Admin:** As an admin user, create a new category with a name and description.
  - **Expected:** Category is created successfully.
- [ ] **Non-Admin:** As a regular user, attempt to create a category.
  - **Expected:** Receive a 403 Forbidden error.

---

*(Add sections for other modules like Offers, Leads, Wallet, etc. following this template)*
