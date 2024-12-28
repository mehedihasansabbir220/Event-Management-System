# Event Management System

A comprehensive event management system built with NestJS, featuring real-time updates, email notifications, and robust health monitoring.

## Features

### Core Features
- Event Management (CRUD operations)
- Attendee Management
- Registration System
- Real-time Updates via WebSocket
- Email Notifications
- Health Monitoring
- Caching with Redis
- Background Jobs Processing

### Technical Stack
- NestJS - Backend Framework
- PostgreSQL - Database
- Redis - Caching & Queue Management
- Bull - Job Queue
- Socket.io - Real-time Communication
- TypeORM - Database ORM
- Swagger - API Documentation

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v13 or higher)
- Redis (v6 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/mehedihasansabbir220/Event-Management-System.git
cd event-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=event_management
REDIS_HOST=localhost
REDIS_PORT=6379
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=password
EMAIL_FROM=noreply@example.com
CORS_ORIGIN=http://localhost:3000
```

4. Start the application:
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## API Documentation

Access Swagger documentation at: `http://localhost:3000/api-docs`

### Key Endpoints

#### Events
- `POST /events` - Create event
- `GET /events` - List events
- `GET /events/:id` - Get event details
- `PATCH /events/:id` - Update event
- `DELETE /events/:id` - Delete event

#### Attendees
- `POST /attendees` - Create attendee
- `GET /attendees` - List attendees
- `GET /attendees/:id` - Get attendee details
- `DELETE /attendees/:id` - Delete attendee

#### Registrations
- `POST /registrations` - Create registration
- `GET /registrations/:eventId` - List event registrations
- `DELETE /registrations/:id` - Cancel registration

#### Health Checks
- `GET /health` - Overall system health
- `GET /health/database` - Database health
- `GET /health/redis` - Redis health
- `GET /health/email` - Email service health

### WebSocket Events

#### Client Events (Listen)
- `eventCreated` - New event created
- `spotsFilling` - Event spots running low
- `eventCancelled` - Event cancelled

#### Connection Example
```javascript
const socket = io('http://localhost:3000');

socket.on('eventCreated', (event) => {
  console.log('New event:', event);
});

socket.on('spotsFilling', ({ eventId, remainingSpots }) => {
  console.log(`Event ${eventId} has ${remainingSpots} spots remaining`);
});
```

## Database Schema

### Event
```sql
CREATE TABLE event (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  date TIMESTAMP NOT NULL,
  location VARCHAR,
  max_attendees INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Attendee
```sql
CREATE TABLE attendee (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL
);
```

### Registration
```sql
CREATE TABLE registration (
  id UUID PRIMARY KEY,
  event_id UUID REFERENCES event(id),
  attendee_id UUID REFERENCES attendee(id),
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Features Details

### Caching
- Event details cached with 1-hour TTL
- Cache invalidation on event updates/deletions
- Redis-based caching system

### Background Jobs
- Email notifications processed asynchronously
- Event reminders scheduled via cron jobs
- Queue monitoring available

### Health Monitoring
- System resources monitoring
- Service health checks
- Performance metrics
- Integration with monitoring systems

### Real-time Features
- WebSocket connections for live updates
- Event capacity notifications
- Connection status monitoring

## Error Handling

The system includes comprehensive error handling:
- Validation errors (400)
- Not found errors (404)
- Conflict errors (409)
- Server errors (500)

Example error response:
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Set production environment variables

3. Start the application:
```bash
npm run start:dev
```

### Production Considerations
- Use proper SSL/TLS certificates
- Configure proper CORS settings
- Set up proper monitoring
- Use PM2 or similar process manager
- Configure proper logging

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email mehedisabbir220@gmail.com or create an issue in the repository.
