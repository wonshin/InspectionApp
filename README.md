# Voice-Based Inspection App

> AI-powered equipment inspection platform with voice recognition and automated comment generation

## Overview

The Voice-Based Inspection App is a comprehensive dual-platform system (Web + Mobile) designed to revolutionize equipment inspection processes. It uses artificial intelligence to generate inspection checklists from historical reports, build engineering knowledge bases, and assist field inspectors with voice-to-text and AI-powered comment generation.

### Key Features

#### Web Application (Admin Portal)
- **Checklist Setup Assistant**
  - Upload historical inspection reports (PDF, DOCX)
  - AI automatically generates standardized checklists
  - Build comment library from historical data
  - Extract keywords for quick selection

- **Engineering Guideline Knowledge Base**
  - Upload engineering standard documents
  - AI extracts component → failure mode → severity → recommended actions
  - Searchable knowledge base
  - Standardized terminology

#### Mobile Application (Field Tool)
- **Smart Inspection Workflow**
  - View checklists offline
  - Quick comment generation via keyword selection
  - Voice input for complex observations
  - AI converts voice notes to detailed engineering comments
  - Photo capture and annotation

- **Offline-First Architecture**
  - Work without internet connection
  - Automatic sync when online
  - Conflict resolution

## Documentation

### 📋 Core Documentation
- **[PROJECT_SPECIFICATION.md](./PROJECT_SPECIFICATION.md)** - Complete feature specifications, user stories, data models
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture, technology stack, AI pipeline
- **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** - Complete database design with SQL schema
- **[API_SPECIFICATION.md](./API_SPECIFICATION.md)** - RESTful API endpoints and request/response formats
- **[IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md)** - 15-week implementation plan with tasks

### Quick Links
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)

## Technology Stack

### Backend
- **Runtime**: Node.js + Express.js + TypeScript
- **Database**: PostgreSQL 15+ with pgVector extension
- **AI/ML**: OpenAI GPT-4, Whisper API, LangChain
- **Storage**: AWS S3 or Azure Blob Storage
- **Caching**: Redis
- **Queue**: Bull (Redis-based)

### Web Frontend
- **Framework**: React.js + TypeScript
- **UI Library**: Material-UI / Ant Design
- **State Management**: Redux Toolkit
- **Build Tool**: Vite

### Mobile App
- **Framework**: React Native + TypeScript
- **Local Database**: WatermelonDB / SQLite
- **Voice Recognition**:
  - iOS: Apple Speech Framework
  - Android: Google Speech Recognition
- **Navigation**: React Navigation

## System Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   Web App       │         │   Mobile App    │
│   (Admin)       │         │   (Inspector)   │
└────────┬────────┘         └────────┬────────┘
         │                           │
         └──────────┬────────────────┘
                    │
         ┌──────────▼──────────┐
         │    API Gateway      │
         └──────────┬──────────┘
                    │
    ┌───────────────┼───────────────┐
    │               │               │
┌───▼────┐   ┌─────▼─────┐   ┌────▼─────┐
│Web API │   │Mobile API │   │AI Service│
└───┬────┘   └─────┬─────┘   └────┬─────┘
    │              │              │
    └──────────────┼──────────────┘
                   │
         ┌─────────▼─────────┐
         │   PostgreSQL      │
         │   + pgVector      │
         └───────────────────┘
```

## Key Workflows

### 1. Checklist Creation
1. Upload historical reports to web app
2. AI processes documents and extracts inspection items
3. System generates checklist with keywords
4. Admin reviews and publishes
5. Mobile app syncs checklist for offline use

### 2. Field Inspection
1. Inspector opens checklist on mobile device
2. For each item:
   - **Quick Mode**: Select keywords + severity → Auto-generate comment
   - **Voice Mode**: Speak observation → AI converts to detailed comment
3. Attach photos if needed
4. Complete inspection
5. Sync to server when online

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis
- AWS account (for S3) or Azure
- OpenAI API key

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd InspectionApp

# Set up backend
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run migrate
npm run dev

# Set up web app (in another terminal)
cd web-app
npm install
cp .env.example .env
npm run dev

# Set up mobile app (in another terminal)
cd mobile-app
npm install
npx react-native run-ios
# or
npx react-native run-android
```

See [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md) for detailed setup instructions.

## Project Structure

```
InspectionApp/
├── backend/                  # Node.js API server
│   ├── src/
│   │   ├── api/             # API routes and controllers
│   │   ├── services/        # Business logic and AI services
│   │   ├── models/          # Database models
│   │   └── utils/           # Utilities
│   ├── migrations/          # Database migrations
│   └── tests/               # Backend tests
│
├── web-app/                 # React web application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── store/           # Redux store
│   │   └── utils/           # Utilities
│   └── public/              # Static assets
│
├── mobile-app/              # React Native mobile app
│   ├── src/
│   │   ├── screens/         # Screen components
│   │   ├── components/      # Reusable components
│   │   ├── services/        # API and sync services
│   │   ├── database/        # Local database
│   │   └── utils/           # Utilities
│   └── assets/              # Images, fonts
│
└── docs/                    # Documentation
    ├── PROJECT_SPECIFICATION.md
    ├── ARCHITECTURE.md
    ├── DATABASE_SCHEMA.md
    ├── API_SPECIFICATION.md
    └── IMPLEMENTATION_ROADMAP.md
```

## Development Roadmap

### Phase 1: Foundation (Weeks 1-2) ✅
- Project setup
- Authentication system
- Database schema

### Phase 2: Web - Document Processing (Weeks 3-4)
- Document upload
- AI checklist generation
- Comment library extraction

### Phase 3: Web - Knowledge Base (Weeks 5-6)
- Guideline processing
- Knowledge base management

### Phase 4: Mobile - Core Features (Weeks 7-9)
- Checklist viewing
- Inspection workflow
- Offline sync

### Phase 5: Mobile - Voice & AI (Weeks 10-12)
- Voice recognition
- AI comment generation
- Voice-to-comment pipeline

### Phase 6: Testing & Integration (Weeks 13-14)
- End-to-end testing
- Performance optimization
- UAT

### Phase 7: Deployment (Week 15)
- Production deployment
- App store submission
- Launch

## Success Metrics

- **Efficiency**: 40% reduction in inspection time
- **Quality**: 90% of AI-generated comments require no editing
- **Adoption**: 80% of inspectors use voice input feature
- **Accuracy**: AI checklist generation captures 95% of historical items
- **Rating**: 4.5+ stars in app stores

## API Overview

### Authentication
```http
POST /v1/auth/login
POST /v1/auth/register
POST /v1/auth/refresh
```

### Document Management
```http
POST   /v1/documents/upload
POST   /v1/documents/{id}/process
GET    /v1/documents
```

### Checklist Management
```http
POST   /v1/checklists
POST   /v1/checklists/generate
GET    /v1/checklists
PUT    /v1/checklists/{id}
POST   /v1/checklists/{id}/publish
```

### Mobile APIs
```http
GET    /v1/sync/checklists
POST   /v1/sync/inspections
POST   /v1/comments/generate/quick
POST   /v1/comments/generate/voice
POST   /v1/voice/transcribe
```

See [API_SPECIFICATION.md](./API_SPECIFICATION.md) for complete API documentation.

## Security

- **Authentication**: JWT with refresh tokens
- **Authorization**: Role-based access control (Admin, Manager, Inspector)
- **Data Encryption**:
  - In transit: TLS 1.3
  - At rest: Database encryption, S3 SSE
- **Mobile**: Secure token storage using Keychain/Keystore

## Performance

- API response time: <500ms (p95)
- AI comment generation: <3 seconds
- Mobile app startup: <2 seconds
- Offline sync success: >95%
- System uptime: 99.9%

## Contributing

This is a proprietary project. Please contact the project maintainers for contribution guidelines.

## License

Copyright © 2025. All rights reserved.

## Support

For questions or issues:
- Email: support@inspection-app.com
- Documentation: [docs folder](./docs/)
- Issue Tracker: [GitHub Issues]

## Team

- **Backend**: Node.js + AI/ML engineers
- **Frontend**: React.js + React Native developers
- **DevOps**: AWS/Azure specialist
- **QA**: Testing engineers
- **Product**: Project manager

## Acknowledgments

- OpenAI for GPT-4 and Whisper APIs
- PostgreSQL + pgVector for vector search
- React and React Native communities

---

**Status**: Specification Complete ✅
**Next Step**: Begin Phase 1 implementation
**Version**: 1.0.0
**Last Updated**: 2025-12-31