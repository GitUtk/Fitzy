# Fitzy Backend API Docs

## Base URL

```
http://localhost:8000
```

### GET /health

Checks backend and MongoDB status.

### Response
```json
{
  "status": "ok",
  "service": "backend",
  "database": "up"
}