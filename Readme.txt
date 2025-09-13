react-azure-sso/
├── src/
│   ├── api/
│   │   └── auth.ts
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── components/
│   │   └── ProtectedRoute.tsx
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Admin.tsx
│   │   ├── NoAccess.tsx
│   │   └── Timeout.tsx
│   ├── App.tsx
│   ├── main.tsx
│   ├── queryClient.ts
│   └── types.ts
├── package.json
├── tsconfig.json
└── vite.config.ts



📝 Flow Explanation
Login: React calls /login → backend returns access token + refresh token cookie.

User Info: React fetches /me → backend provides roles and user details.

Protected Routes: React checks roles; backend optionally validates JWT.

Silent Background Refresh: While user is active, React calls /refresh every few minutes to extend session without interrupting workflow.

Token Expiry Handling: Axios interceptor catches 401 → calls /refresh → retries API.

Timeout Page: If refresh fails or user inactive → redirect to /timeout.

Logout: Calls /logout → clears refresh token cookie and resets React state.

✅ Key Features Illustrated:

Access token stored in React memory (short-lived)

Refresh token stored in HttpOnly cookie (secure, long-lived)

Silent refresh only when tab visible

React role-based route protection + optional backend validation

Timeout page for expired sessions


