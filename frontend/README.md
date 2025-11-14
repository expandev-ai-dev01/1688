# WeatherNow

App que consulta uma API de clima e exibe temperatura, umidade e previsão do dia.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── app/              # Application configuration
├── assets/           # Static assets and styles
├── core/             # Core components and utilities
├── domain/           # Business domain modules
└── pages/            # Page components
```

## Tech Stack

- React 19.2.0
- TypeScript 5.6.3
- Vite 5.4.11
- TailwindCSS 3.4.14
- React Router 7.9.3
- TanStack Query 5.90.2
- Axios 1.12.2
- Zustand 5.0.8

## API Configuration

The application connects to a backend API. Configure the API URL in `.env`:

```
VITE_API_URL=http://localhost:3000
VITE_API_VERSION=v1
VITE_API_TIMEOUT=30000
```