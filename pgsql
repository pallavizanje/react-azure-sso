+---------------------+          +----------------------+
|      React App      |          |  Spring Boot Backend |
| (TypeScript + RQ)   |          |  (springboot-azure-  |
|                     |          |       sso)          |
+---------------------+          +----------------------+
        |                                     |
        | 1. Login Button Click               |
        |----------------------------------->|
        |                                     |
        |           2. /login                |
        |----------------------------------->|
        |                                     |
        | <----------------------------------|
        |   Access Token (in memory)         |
        |   Refresh Token (HttpOnly Cookie)  |
        |                                     |
        |                                     |
        | 3. Fetch Current User (/me)        |
        |----------------------------------->|
        |                                     |
        | <----------------------------------|
        | User info + roles                   |
        |                                     |
        |                                     |
        | 4. Navigate to Protected Route     |
        |   (e.g., /admin)                   |
        |----------------------------------->|
        |                                     |
        | Backend optionally validates JWT    |
        | and user roles                       |
        |                                     |
        | <----------------------------------|
        | Page content                        |
        |                                     |
        |                                     |
        | 5. Silent Background Refresh        |
        | (every 4 min if page visible)      |
        |----------------------------------->|
        | /refresh                            |
        |                                     |
        | <----------------------------------|
        | New access token                    |
        | (refresh token in cookie remains)  |
        |                                     |
        |                                     |
        | 6. Access Token Expired            |
        |----------------------------------->|
        | /any API call                       |
        |                                     |
        | <----------------------------------|
        | 401 Unauthorized                     |
        |                                     |
        | 7. Axios Interceptor Calls /refresh |
        |----------------------------------->|
        |                                     |
        | <----------------------------------|
        | New access token                    |
        |                                     |
        | Retry original API request          |
        |                                     |
        |                                     |
        | 8. Logout                           |
        |----------------------------------->|
        | /logout                             |
        |                                     |
        | <----------------------------------|
        | Refresh token cleared               |
        | React clears user context           |
        |                                     |
        +-------------------------------------+
