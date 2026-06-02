# API Reference

All client traffic goes through the gateway at `http://localhost:8080`.

## Standard response envelope

```json
{
  "success": true,
  "message": "Login successful",
  "data": { },
  "timestamp": "2026-05-29T10:15:30Z"
}
```

Errors use the same envelope with `success: false`; validation/business errors
carry an `ErrorResponse` in `data`:

```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "code": "VALIDATION_ERROR",
    "detail": "Validation failed",
    "fieldErrors": { "email": "must be a well-formed email address" },
    "timestamp": "2026-05-29T10:15:30Z"
  },
  "timestamp": "2026-05-29T10:15:30Z"
}
```

## Auth — `/api/auth` (public)

| Method | Path                 | Body                                       |
|--------|----------------------|--------------------------------------------|
| POST   | `/api/auth/register` | `{username,email,password,fullName,phone}` |
| POST   | `/api/auth/login`    | `{username,password}`                      |
| POST   | `/api/auth/refresh`  | `{refreshToken}`                           |
| POST   | `/api/auth/logout`   | `{refreshToken}`                           |

## Users — `/api/users` (require `Authorization: Bearer <accessToken>`)

| Method | Path                     | Access            |
|--------|--------------------------|-------------------|
| GET    | `/api/users/me`          | any authenticated |
| PUT    | `/api/users/me`          | any authenticated |
| PUT    | `/api/users/me/password` | any authenticated |
| POST   | `/api/users`             | ADMIN / CEO       |
| GET    | `/api/users`             | ADMIN / CEO       |
| GET    | `/api/users/{id}`        | ADMIN / CEO       |
| DELETE | `/api/users/{id}`        | ADMIN / CEO       |

## OpenAPI

- Aggregated at the gateway: `http://localhost:8080/swagger-ui.html`
- Per service: `:8081/swagger-ui.html` (auth), `:8082/swagger-ui.html` (user)
