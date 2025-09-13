# React + Spring Boot MSAL SSO Integration Checklist

## Project Overview

This project integrates **React frontend** with **Spring Boot MSAL SSO backend** using:

- Access token (short-lived, in memory)
- Refresh token (HttpOnly cookie, long-lived)
- Role-based protected routes
- Silent background token refresh
- Timeout page for expired sessions
- Logout functionality

---

## 🗂 Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | GET | Initiates login, returns access token and sets refresh token cookie |
| `/api/auth/me` | GET | Returns current logged-in user info + roles |
| `/api/auth/refresh` | POST | Refresh access token using refresh token cookie |
| `/api/auth/logout` | POST | Clears refresh token cookie and logs out user |

---

## 🔹 React Frontend Checklist

1. **Login Page**
   - [ ] Login button calls `/api/auth/login`
   - [ ] Access token stored in React state
   - [ ] Refresh token stored in HttpOnly cookie
   - [ ] Redirects to `/admin` after login

2. **User Info**
   - [ ] `/me` fetches user info and roles
   - [ ] React context stores `user` and `isAuthenticated`

3. **Protected Routes**
   - [ ] `/admin` accessible only to users with `Admin` role
   - [ ] Unauthorized users redirected to `/no-access`

4. **Timeout Handling**
   - [ ] Axios interceptor triggers `/refresh` on 401
   - [ ] User redirected to `/timeout` if refresh fails
   - [ ] Login button on `/timeout` works

5. **Silent Background Refresh**
   - [ ] Refresh token called every 4 min if tab is visible
   - [ ] React user state remains valid
   - [ ] Stops when tab hidden (`document.visibilityState !== "visible"`)

6. **Logout**
   - [ ] Calls `/api/auth/logout`
   - [ ] Clears refresh token cookie
   - [ ] React user state cleared
   - [ ] Redirect to `/login`

---

## 🔹 Spring Boot Backend Checklist

1. **Login**
   - [ ] Returns access token in JSON
   - [ ] Sets HttpOnly refresh token cookie
   - [ ] MSAL login works

2. **Refresh**
   - [ ] Reads refresh token from cookie
   - [ ] Validates refresh token
   - [ ] Returns new access token + refresh token cookie
   - [ ] Returns 401 if refresh token invalid

3. **Current User**
   - [ ] Returns user info + roles
   - [ ] Requires valid access token

4. **Logout**
   - [ ] Clears refresh token cookie
   - [ ] Optional: invalidate server-side session

5. **Security**
   - [ ] JWT validated for protected endpoints
   - [ ] Roles enforced for role-based endpoints
   - [ ] CSRF disabled if API-only usage

---

## 🔹 Integration Flow

1. **Login:** React → `/login` → backend issues access + refresh tokens  
2. **Fetch User:** React → `/me` → populate user context  
3. **Protected Route:** React checks roles → backend optionally validates JWT  
4. **Silent Refresh:** React background refresh every 4 min if tab visible  
5. **Token Expiry:** Axios interceptor calls `/refresh` → retries request  
6. **Timeout:** Refresh fails → redirect to `/timeout`  
7. **Logout:** React → `/logout` → clears refresh token + user context

---

## 🔹 Test Cases

1. Normal flow: Login → fetch `/me` → access `/admin` → logout  
2. Token expiry: Expire access token → Axios interceptor triggers `/refresh` → original request retried  
3. Inactive user: Tab hidden → background refresh stops → `/timeout` after expiry  
4. Unauthorized role: Non-admin user tries `/admin` → `/no-access`  
5. Edge cases:
   - Refresh token invalid → `/refresh` returns 401 → redirect `/timeout`
   - Refresh token cookie missing → redirect `/timeout`
   - Access token missing → `/me` or protected endpoints fail

---

## 🔹 How to Use

1. Start Spring Boot backend (dev/uat/prod profile).  
2. Start React frontend (`npm install` → `npm run dev`).  
3. Open `/login` → check login flow.  
4. Check silent refresh in console (network tab → `/refresh`).  
5. Try `/admin`, `/no-access`, and `/timeout` pages.  
6. Test logout functionality.

---

## 🔹 Notes

- Access token is **in-memory only**, never stored in localStorage/sessionStorage.  
- Refresh token is **HttpOnly cookie**, only backend can read.  
- Background refresh only works if **tab is visible**.  
- Role-based checks are enforced both in React and optionally on Spring Boot backend.  
