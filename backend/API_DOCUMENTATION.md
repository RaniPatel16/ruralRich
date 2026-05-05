# 🚀 RuralReach API Documentation

This documentation provides details for all the API endpoints in the RuralReach Smart Logistics Platform.

**Base URL:** `https://ruralreach-backend-46ba.onrender.com/api`

---

## 🔐 Authentication
Endpoints for user registration and login.

### 1. Register User
*   **URL:** `/auth/register`
*   **Method:** `POST`
*   **Body:**
    ```json
    {
      "name": "Rani Patel",
      "email": "rani@example.com",
      "password": "password123",
      "role": "customer"
    }
    ```
*   **Roles:** `customer`, `agent`, `admin`

### 2. Login User
*   **URL:** `/auth/login`
*   **Method:** `POST`
*   **Body:**
    ```json
    {
      "email": "rani@example.com",
      "password": "password123"
    }
    ```

---

## 📍 Addresses (Requires Auth)
Manage shipping and delivery addresses.

### 3. Get All Addresses
*   **URL:** `/addresses`
*   **Method:** `GET`

### 4. Create Address
*   **URL:** `/addresses`
*   **Method:** `POST`
*   **Body:**
    ```json
    {
      "addressLine": "123 Rural Road",
      "city": "Village A",
      "coordinates": { "lat": 23.0225, "lng": 72.5714 }
    }
    ```

---

## 📦 Orders (Requires Auth)
Manage logistics orders.

### 5. Create Order
*   **URL:** `/orders`
*   **Method:** `POST`
*   **Body:**
    ```json
    {
      "addressId": "ADDRESS_ID_HERE",
      "items": ["Item 1", "Item 2"],
      "totalAmount": 500
    }
    ```

### 6. Get My Orders
*   **URL:** `/orders`
*   **Method:** `GET`

---

## 🚚 Delivery & Admin
Endpoints for logistics management.

### 7. Assign Agent (Admin Only)
*   **URL:** `/delivery/assign`
*   **Method:** `POST`

### 8. Update Status (Agent/Admin)
*   **URL:** `/delivery/:id/status`
*   **Method:** `PUT`
*   **Values:** `pending`, `assigned`, `in-transit`, `delivered`

---

## 🛠️ How to get your Public Postman Link:
1.  Open **Postman**.
2.  Create a **New Collection** named "RuralReach".
3.  Add the requests above.
4.  Right-click the collection -> **Share**.
5.  Go to the **"Public Link"** tab.
6.  Click **"Generate New Public Link"**.
7.  Copy that link—that is what you submit!
