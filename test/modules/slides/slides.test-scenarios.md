# Manual Test Scenarios: Slides

**Module:** `slides`
**API Prefix:** `/api/slides`

---

### 1. Public User: Viewing Slides

- [ ] **Get All Slides (`GET /`):** As a public user, make a GET request.
  - **Expected:** Receive a `200 OK` with a list of all `active` slides, sorted by the `order` property.
- [ ] **Increment View Count (`PATCH /:id/view`):** When a slide is displayed in the UI, a PATCH request should be sent to its `/view` endpoint.
  - **Expected:** Receive a `200 OK`. If you then fetch the slide directly via `GET /:id`, its `views` count should be higher by one.

### 2. Admin: Slide Management

- [ ] **Create Slide (`POST /`):** As an admin, create a new slide with an image, title, and associated offer ID.
  - **Expected:** Receive a `201 Created` status with the new slide object. By default, its order should place it at the end.
- [ ] **Non-Admin Access:** As a regular user, attempt to create a slide.
  - **Expected:** Receive a `403 Forbidden` or `401 Unauthorized` status.
- [ ] **Update Slide (`PUT /:id`):** As an admin, change the status of a slide from `active` to `inactive`.
  - **Expected:** Receive a `200 OK` with the updated slide object.
- [ ] **Verify Inactive Status:** As a public user, fetch all slides again via `GET /`.
  - **Expected:** The `inactive` slide should no longer be in the list.
- [ ] **Update Slide Order (`PATCH /order/update`):** As an admin, create two or more slides. Send a PATCH request to `/order/update` with an array of `[{id, order}, {id, order}]` to swap their positions.
  - **Expected:** Receive a `200 OK`. When fetching all slides via `GET /`, they should appear in the new custom order.
- [ ] **Delete Slide (`DELETE /:id`):** As an admin, delete a slide.
  - **Expected:** Receive a `200 OK`. The slide should be completely removed from the system.
