# API Documentation - BAPAS Bandung

Base URL: `http://localhost:3000/api`

## Authentication

Semua endpoint yang memerlukan autentikasi harus menyertakan header:
```
Authorization: Bearer <token>
```

### POST /auth/login
Login user (admin/operator)

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "name": "Administrator",
    "role": "admin"
  }
}
```

### GET /auth/verify
Verify token validity (requires auth)

**Response:**
```json
{
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

## Queue Management

### GET /queue
Get queues with filters

**Query Parameters:**
- `status` (optional): waiting, called, serving, completed, cancelled
- `date` (optional): YYYY-MM-DD
- `service_id` (optional): integer

**Response:**
```json
[
  {
    "id": 1,
    "queue_number": "P202411080001",
    "service_id": 1,
    "service_name": "Pendaftaran Klien Baru",
    "client_name": "John Doe",
    "client_phone": "08123456789",
    "client_nik": "1234567890123456",
    "status": "waiting",
    "counter_number": null,
    "operator_id": null,
    "operator_name": null,
    "created_at": "2024-11-08 10:30:00"
  }
]
```

### POST /queue
Create new queue (public - no auth required)

**Request:**
```json
{
  "service_id": 1,
  "client_name": "John Doe",
  "client_phone": "08123456789",
  "client_nik": "1234567890123456"
}
```

**Response:**
```json
{
  "id": 1,
  "queue_number": "P202411080001",
  "service_id": 1,
  "service_name": "Pendaftaran Klien Baru",
  "client_name": "John Doe",
  "estimated_time": 30,
  "status": "waiting",
  "created_at": "2024-11-08 10:30:00"
}
```

### POST /queue/:id/call
Call a queue (requires operator auth)

**Request:**
```json
{
  "counter_number": 1
}
```

**Response:**
```json
{
  "id": 1,
  "queue_number": "P202411080001",
  "status": "called",
  "counter_number": 1,
  "called_at": "2024-11-08 10:35:00"
}
```

### POST /queue/:id/serve
Start serving a queue (requires operator auth)

**Response:**
```json
{
  "id": 1,
  "status": "serving",
  "serving_at": "2024-11-08 10:36:00"
}
```

### POST /queue/:id/complete
Complete a queue (requires operator auth)

**Request:**
```json
{
  "notes": "Layanan selesai dengan baik"
}
```

**Response:**
```json
{
  "id": 1,
  "status": "completed",
  "completed_at": "2024-11-08 10:50:00"
}
```

### POST /queue/:id/cancel
Cancel a queue (requires operator auth)

**Request:**
```json
{
  "notes": "Klien tidak hadir"
}
```

## Services

### GET /services
Get active services (public)

**Response:**
```json
[
  {
    "id": 1,
    "name": "Pendaftaran Klien Baru",
    "description": "Pendaftaran untuk klien baru BAPAS",
    "estimated_time": 30,
    "is_active": 1
  }
]
```

### GET /services/all
Get all services including inactive (requires admin auth)

### POST /services
Create service (requires admin auth)

**Request:**
```json
{
  "name": "Konsultasi",
  "description": "Layanan konsultasi",
  "estimated_time": 20
}
```

### PUT /services/:id
Update service (requires admin auth)

**Request:**
```json
{
  "name": "Konsultasi Updated",
  "description": "Layanan konsultasi dengan petugas",
  "estimated_time": 25,
  "is_active": true
}
```

### DELETE /services/:id
Delete service (requires admin auth)

## Users

### GET /users
Get all users (requires admin auth)

**Response:**
```json
[
  {
    "id": 1,
    "username": "admin",
    "name": "Administrator",
    "role": "admin",
    "created_at": "2024-11-08 08:00:00"
  }
]
```

### POST /users
Create user (requires admin auth)

**Request:**
```json
{
  "username": "operator1",
  "password": "password123",
  "name": "Operator Satu",
  "role": "operator"
}
```

### PUT /users/:id
Update user (requires admin auth)

**Request:**
```json
{
  "username": "operator1",
  "password": "newpassword123",
  "name": "Operator Satu Updated",
  "role": "operator"
}
```

Note: Password is optional when updating. If not provided, password won't be changed.

### DELETE /users/:id
Delete user (requires admin auth)

## Settings

### GET /settings
Get all settings (public)

**Response:**
```json
{
  "office_name": "BAPAS Bandung",
  "office_address": "Jl. Contoh No. 123, Bandung",
  "office_phone": "022-1234567",
  "working_hours": "08:00 - 16:00",
  "display_refresh_interval": "5000"
}
```

### PUT /settings/:key
Update single setting (requires admin auth)

**Request:**
```json
{
  "value": "BAPAS Kota Bandung",
  "description": "Nama kantor"
}
```

### POST /settings/bulk
Bulk update settings (requires admin auth)

**Request:**
```json
{
  "office_name": "BAPAS Kota Bandung",
  "office_phone": "022-7654321",
  "working_hours": "08:00 - 17:00"
}
```

## Counters

### GET /counters
Get all counters

**Response:**
```json
[
  {
    "id": 1,
    "counter_number": 1,
    "name": "Loket 1",
    "is_active": 1,
    "operator_id": null,
    "operator_name": null
  }
]
```

### POST /counters
Create counter (requires admin auth)

**Request:**
```json
{
  "counter_number": 4,
  "name": "Loket 4"
}
```

### PUT /counters/:id
Update counter (requires admin auth)

**Request:**
```json
{
  "counter_number": 4,
  "name": "Loket 4 - VIP",
  "is_active": true,
  "operator_id": 2
}
```

### DELETE /counters/:id
Delete counter (requires admin auth)

## Dashboard

### GET /dashboard/stats
Get dashboard statistics (requires auth)

**Response:**
```json
{
  "today": {
    "total": 25,
    "waiting": 5,
    "serving": 2,
    "completed": 18
  },
  "byService": [
    {
      "name": "Pendaftaran Klien Baru",
      "count": 10
    },
    {
      "name": "Konsultasi",
      "count": 8
    }
  ]
}
```

## WebSocket Events

Connect to: `http://localhost:3000`

### Events Emitted by Server:

- `queue:new` - New queue created
- `queue:called` - Queue called
- `queue:serving` - Queue being served
- `queue:completed` - Queue completed
- `queue:cancelled` - Queue cancelled

**Event Data:**
```json
{
  "id": 1,
  "queue_number": "P202411080001",
  "service_name": "Pendaftaran Klien Baru",
  "client_name": "John Doe",
  "status": "called",
  "counter_number": 1
}
```

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message description"
}
```

**Common HTTP Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Rate Limiting

Currently no rate limiting implemented. Consider adding in production.

## CORS

CORS is enabled for all origins in development. Configure appropriately for production.
