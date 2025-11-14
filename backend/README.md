# WeatherNow Backend API

Backend API for WeatherNow - Weather information service that provides current temperature, humidity, and daily forecasts.

## Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Architecture**: REST API

## Project Structure

```
src/
├── api/                    # API controllers
│   └── v1/                 # API Version 1
│       ├── external/       # Public endpoints
│       └── internal/       # Authenticated endpoints
├── routes/                 # Route definitions
│   └── v1/                 # Version 1 routes
├── middleware/             # Express middleware
├── services/               # Business logic services
├── utils/                  # Utility functions
├── config/                 # Configuration management
└── server.ts               # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`

### Development

Run the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### Build

Build for production:
```bash
npm run build
```

### Production

Start production server:
```bash
npm start
```

## API Endpoints

### Health Check
- **GET** `/health` - Service health status

### API Version 1
Base URL: `/api/v1`

#### External (Public) Endpoints
- Feature endpoints will be added here

## Environment Variables

| Variable | Description | Default |
|----------|-------------|----------|
| NODE_ENV | Environment mode | development |
| PORT | Server port | 3000 |
| API_VERSION | API version | v1 |
| CORS_ORIGINS | Allowed CORS origins | localhost:3000,3001,5173 |
| WEATHER_API_KEY | External weather API key | - |
| WEATHER_API_URL | External weather API URL | - |
| CACHE_TTL | Cache time-to-live (seconds) | 3600 |
| CACHE_CHECK_PERIOD | Cache check period (seconds) | 600 |

## Development Guidelines

### Code Standards
- Follow TypeScript strict mode
- Use 2 spaces for indentation
- Maximum line length: 120 characters
- Use single quotes for strings
- Always use semicolons

### File Naming
- Use camelCase for TypeScript files
- Use kebab-case for API route directories
- Controllers: `controller.ts`
- Services: `[entity]Service.ts`
- Types: `[entity]Types.ts`

### Import Organization
1. External library imports
2. Internal absolute imports (@/)
3. Relative imports

## Testing

Test files should be colocated with source files:
- Unit tests: `*.test.ts`
- Integration tests: `*Integration.ts`

## License

ISC