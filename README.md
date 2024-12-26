# Event Management API

A NestJS-based RESTful API for managing events, attendees, and registrations with real-time notifications.

## Features

- Event creation and management with attendee limits
- Attendee registration system with duplicate prevention
- Real-time notifications via WebSocket
- Email notifications using Bull queue
- Redis caching for improved performance
- Scheduled event reminders
- API documentation with Swagger
- PostgreSQL database with TypeORM

## Prerequisites

- Node.js ≥ 14
- PostgreSQL
- Redis
- SMTP server for email notifications

## Installation

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# Start PostgreSQL and Redis
docker-compose up -d

# Run migrations
npm run typeorm:run-migrations

# Start the application
npm run start:dev
```

## API Documentation

Access the Swagger documentation at `http://localhost:3000/api` after starting the application.

## API Endpoints

### Events
- `POST /events` - Create a new event
- `GET /events` - List all events
- `GET /events/:id` - Get event details

### Attendees
- `POST /attendees` - Register new attendee
- `GET /attendees` - List all attendees

### Registrations
- `POST /registrations` - Register attendee for event
- `GET /registrations/event/:id` - List registrations for event

## WebSocket Events

- `eventCreated` - Emitted when new event is created
- `spotsFilling` - Emitted when event spots are running low

## Architecture

- NestJS framework with TypeScript
- PostgreSQL database with TypeORM
- Redis for caching and Bull queue
- WebSocket for real-time notifications
- Bull queue for email processing
- Scheduled tasks with @nestjs/schedule

## Development

```bash
# Run tests
npm run test

# Run linter
npm run lint

# Format code
npm run format
```

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start:prod
```

## License

MIT# Event-Management-System
