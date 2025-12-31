# System Architecture - Voice-Based Inspection App

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Component Details](#component-details)
4. [Data Flow](#data-flow)
5. [AI/ML Pipeline](#aiml-pipeline)
6. [Security Architecture](#security-architecture)
7. [Deployment Architecture](#deployment-architecture)

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
├──────────────────────────────┬──────────────────────────────────┤
│   Web Application            │   Mobile Application             │
│   (Admin/Setup Portal)       │   (Field Inspection Tool)        │
│                              │                                   │
│   - React.js                 │   - React Native                 │
│   - Document Upload          │   - Offline-First                │
│   - Checklist Management     │   - Voice Recognition            │
│   - Knowledge Base UI        │   - Camera Integration           │
└──────────────────────────────┴──────────────────────────────────┘
                               │
                               │ HTTPS/REST API
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                    API GATEWAY LAYER                             │
├──────────────────────────────────────────────────────────────────┤
│   - Authentication & Authorization                               │
│   - Rate Limiting                                                │
│   - Request Routing                                              │
│   - API Versioning                                               │
└──────────────────────────────┬──────────────────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
┌───────▼────────┐  ┌─────────▼────────┐  ┌─────────▼────────┐
│  Web API       │  │  Mobile API      │  │  AI Processing   │
│  Service       │  │  Service         │  │  Service         │
│                │  │                  │  │                  │
│  - Checklist   │  │  - Sync          │  │  - Document      │
│    CRUD        │  │  - Inspection    │  │    Parsing       │
│  - Document    │  │    Records       │  │  - LLM API       │
│    Upload      │  │  - Voice-to-Text │  │  - Comment Gen   │
│  - Knowledge   │  │  - Comment Gen   │  │  - Vector Search │
│    Base Mgmt   │  │    Request       │  │                  │
└───────┬────────┘  └─────────┬────────┘  └─────────┬────────┘
        │                     │                      │
        └──────────────────┬──┴──────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                    DATA LAYER                                    │
├─────────────────────┬────────────────────┬──────────────────────┤
│  PostgreSQL         │  Vector Database   │  File Storage        │
│  (Primary Data)     │  (AI Embeddings)   │  (S3/Blob)          │
│                     │                    │                      │
│  - Users            │  - Document        │  - Uploaded PDFs     │
│  - Checklists       │    Embeddings      │  - Voice Recordings  │
│  - Inspections      │  - Comment         │  - Photos            │
│  - Knowledge Base   │    Embeddings      │  - Reports           │
└─────────────────────┴────────────────────┴──────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
├──────────────────────────────────────────────────────────────────┤
│  - OpenAI API (GPT-4 for comment generation)                     │
│  - Whisper API (Speech-to-text)                                  │
│  - Cloud Storage (AWS S3 / Azure Blob)                           │
└──────────────────────────────────────────────────────────────────┘
```

---

## Component Details

### 1. Web Application (Frontend)

**Technology**: React.js + TypeScript

**Modules**:
```
web-app/
├── src/
│   ├── components/
│   │   ├── DocumentUpload/
│   │   │   ├── UploadZone.tsx
│   │   │   ├── FileList.tsx
│   │   │   └── ProcessingStatus.tsx
│   │   ├── ChecklistBuilder/
│   │   │   ├── ChecklistEditor.tsx
│   │   │   ├── ItemEditor.tsx
│   │   │   └── KeywordSelector.tsx
│   │   ├── KnowledgeBase/
│   │   │   ├── ComponentTree.tsx
│   │   │   ├── FailureModeEditor.tsx
│   │   │   └── RecommendationManager.tsx
│   │   └── Dashboard/
│   │       └── AnalyticsDashboard.tsx
│   ├── services/
│   │   ├── api.service.ts
│   │   ├── document.service.ts
│   │   └── checklist.service.ts
│   ├── store/
│   │   ├── checklistSlice.ts
│   │   ├── knowledgeBaseSlice.ts
│   │   └── authSlice.ts
│   └── utils/
│       ├── fileValidation.ts
│       └── constants.ts
```

**Key Responsibilities**:
- Document upload and management
- Checklist creation and editing
- Knowledge base management
- User authentication
- Analytics dashboard

---

### 2. Mobile Application (Frontend)

**Technology**: React Native + TypeScript

**Modules**:
```
mobile-app/
├── src/
│   ├── screens/
│   │   ├── ChecklistList.tsx
│   │   ├── InspectionScreen.tsx
│   │   ├── ItemDetail.tsx
│   │   └── SyncScreen.tsx
│   ├── components/
│   │   ├── KeywordSelector.tsx
│   │   ├── SeverityPicker.tsx
│   │   ├── VoiceInput.tsx
│   │   ├── CommentDisplay.tsx
│   │   └── PhotoCapture.tsx
│   ├── services/
│   │   ├── sync.service.ts
│   │   ├── voice.service.ts
│   │   ├── api.service.ts
│   │   └── storage.service.ts
│   ├── database/
│   │   ├── schema.ts
│   │   ├── models/
│   │   │   ├── Checklist.ts
│   │   │   ├── InspectionSession.ts
│   │   │   └── InspectionRecord.ts
│   │   └── sync.ts
│   └── utils/
│       ├── offline.manager.ts
│       └── voiceToText.ts
```

**Key Responsibilities**:
- Offline checklist storage
- Voice recognition
- Inspection data capture
- Photo management
- Sync with backend

---

### 3. Backend API Services

**Technology**: Node.js + Express.js + TypeScript

**Project Structure**:
```
backend/
├── src/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── checklist.routes.ts
│   │   │   ├── document.routes.ts
│   │   │   ├── inspection.routes.ts
│   │   │   ├── knowledge.routes.ts
│   │   │   └── sync.routes.ts
│   │   ├── controllers/
│   │   │   ├── checklistController.ts
│   │   │   ├── documentController.ts
│   │   │   ├── inspectionController.ts
│   │   │   └── knowledgeController.ts
│   │   └── middleware/
│   │       ├── auth.middleware.ts
│   │       ├── validation.middleware.ts
│   │       └── upload.middleware.ts
│   ├── services/
│   │   ├── ai/
│   │   │   ├── documentProcessor.service.ts
│   │   │   ├── checklistGenerator.service.ts
│   │   │   ├── commentGenerator.service.ts
│   │   │   ├── knowledgeExtractor.service.ts
│   │   │   └── vectorStore.service.ts
│   │   ├── storage/
│   │   │   └── fileStorage.service.ts
│   │   ├── voice/
│   │   │   └── speechToText.service.ts
│   │   └── sync/
│   │       └── syncManager.service.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Checklist.ts
│   │   ├── ChecklistItem.ts
│   │   ├── CommentLibrary.ts
│   │   ├── KnowledgeBase.ts
│   │   ├── Document.ts
│   │   ├── InspectionSession.ts
│   │   └── InspectionRecord.ts
│   ├── database/
│   │   ├── connection.ts
│   │   ├── migrations/
│   │   └── seeds/
│   └── utils/
│       ├── logger.ts
│       ├── errors.ts
│       └── validators.ts
```

---

## Data Flow

### Flow 1: Checklist Creation from Historical Reports

```
┌──────────────┐
│ User uploads │
│ PDF reports  │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────────┐
│ Backend: File Storage           │
│ - Save to S3/Blob               │
│ - Create Document record in DB  │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ AI Service: Document Parser     │
│ - Extract text from PDF         │
│ - Split into chunks             │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ AI Service: LLM Processing      │
│ Prompt: "Extract inspection     │
│ items and categorize by         │
│ component"                      │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Generate Checklist Structure    │
│ - Component names               │
│ - Inspection points             │
│ - Sequence                      │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ AI Service: Comment Extraction  │
│ Prompt: "Extract comments,      │
│ identify 3 key keywords, and    │
│ categorize by severity"         │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Build Comment Library           │
│ - Keywords (max 3)              │
│ - Full comment text             │
│ - Severity mapping              │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Save to Database                │
│ - Checklist table               │
│ - ChecklistItem table           │
│ - CommentLibrary table          │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Web UI: Review Screen           │
│ - Display generated checklist   │
│ - Allow edits                   │
│ - Publish button                │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Mobile App: Sync                │
│ - Download checklist            │
│ - Store in local DB             │
└─────────────────────────────────┘
```

### Flow 2: Voice-Based Inspection Comment Generation

```
┌──────────────────────┐
│ Inspector clicks     │
│ checklist item       │
└──────┬───────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Mobile: Load Keywords           │
│ - Query local DB for keywords   │
│ - Load severity levels          │
│ - Display UI                    │
└──────┬──────────────────────────┘
       │
       ├─── Quick Mode ────┐
       │                   │
       │                   ▼
       │    ┌────────────────────────────┐
       │    │ User selects:              │
       │    │ - Keywords (1-3)           │
       │    │ - Severity level           │
       │    └────────┬───────────────────┘
       │             │
       │             ▼
       │    ┌────────────────────────────┐
       │    │ Generate Comment (Client)  │
       │    │ Template: "{keyword1} and  │
       │    │ {keyword2} observed with   │
       │    │ {severity} severity..."    │
       │    └────────┬───────────────────┘
       │             │
       │             └─────────┐
       │                       │
       └─── Voice Mode ────┐   │
                           │   │
                           ▼   │
        ┌────────────────────────────┐
        │ User clicks "Voice Input"  │
        │ - Start recording          │
        │ - Display waveform         │
        └────────┬───────────────────┘
                 │
                 ▼
        ┌────────────────────────────┐
        │ Voice-to-Text (Device)     │
        │ - iOS: Speech Framework    │
        │ - Android: Google Speech   │
        │ Alternative: Whisper API   │
        └────────┬───────────────────┘
                 │
                 ▼
        ┌────────────────────────────┐
        │ Display transcribed text   │
        │ - Allow edit               │
        │ - "Convert to Full         │
        │   Comment" button          │
        └────────┬───────────────────┘
                 │
                 ▼
        ┌────────────────────────────┐
        │ Send to Backend API        │
        │ POST /api/comments/enhance │
        │ Body: {                    │
        │   text: "...",             │
        │   component: "...",        │
        │   checklistItemId: ...     │
        │ }                          │
        └────────┬───────────────────┘
                 │
                 ▼
        ┌────────────────────────────┐
        │ AI Service: Enhance        │
        │ - Load knowledge base      │
        │ - Vector search similar    │
        │   historical comments      │
        │ - LLM prompt with context  │
        └────────┬───────────────────┘
                 │
                 ▼
        ┌────────────────────────────┐
        │ Generate Detailed Comment  │
        │ - Engineering terminology  │
        │ - Proper severity desc     │
        │ - Recommended actions      │
        └────────┬───────────────────┘
                 │
                 │
                 ▼                    ▼
        ┌────────────────────────────────┐
        │ Display Generated Comment      │
        │ - Allow final edits            │
        │ - Save button                  │
        └────────┬───────────────────────┘
                 │
                 ▼
        ┌────────────────────────────────┐
        │ Save to Local DB               │
        │ - InspectionRecord table       │
        │ - Mark for sync                │
        └────────┬───────────────────────┘
                 │
                 ▼
        ┌────────────────────────────────┐
        │ Sync to Server (when online)   │
        │ - Upload inspection records    │
        │ - Upload photos                │
        │ - Upload voice recordings      │
        └────────────────────────────────┘
```

---

## AI/ML Pipeline

### AI Components Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AI PROCESSING LAYER                      │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│  Document Processor  │  │ Knowledge Extractor  │  │  Comment Generator   │
│                      │  │                      │  │                      │
│  Input:              │  │  Input:              │  │  Input:              │
│  - PDF/DOCX files    │  │  - Engineering docs  │  │  - Voice/text input  │
│                      │  │                      │  │  - Context data      │
│  Process:            │  │  Process:            │  │                      │
│  1. Text extraction  │  │  1. Parse structure  │  │  Process:            │
│  2. Chunking         │  │  2. Extract entities │  │  1. Vector search    │
│  3. LLM analysis     │  │  3. Build taxonomy   │  │  2. Load context     │
│  4. Structured data  │  │  4. Relationships    │  │  3. LLM generation   │
│                      │  │                      │  │  4. Validation       │
│  Output:             │  │  Output:             │  │                      │
│  - Checklist items   │  │  - Component list    │  │  Output:             │
│  - Comment library   │  │  - Failure modes     │  │  - Detailed comment  │
│  - Keywords          │  │  - Recommendations   │  │  - Confidence score  │
└──────────┬───────────┘  └──────────┬───────────┘  └──────────┬───────────┘
           │                         │                         │
           └─────────────┬───────────┴─────────────┬───────────┘
                         │                         │
                         ▼                         ▼
              ┌──────────────────┐      ┌──────────────────┐
              │  Vector Database │      │   PostgreSQL     │
              │  (Embeddings)    │      │  (Structured)    │
              └──────────────────┘      └──────────────────┘
```

### AI Prompt Templates

#### 1. Checklist Generation Prompt
```
System: You are an expert in industrial equipment inspection.

Task: Analyze the following historical inspection reports and generate a structured checklist.

Reports: {document_text}

Instructions:
1. Identify all unique inspection points
2. Group by equipment component/system
3. Extract common patterns
4. Assign logical sequence order

Output Format (JSON):
{
  "checklist": [
    {
      "component": "Component name",
      "inspection_point": "What to inspect",
      "sequence": 1,
      "typical_issues": ["issue1", "issue2"]
    }
  ]
}
```

#### 2. Comment Library Extraction Prompt
```
System: You are extracting inspection comments to build a reusable library.

Task: Extract all inspection comments from the reports and structure them.

Reports: {document_text}

Instructions:
1. Extract each unique comment
2. Identify the component it relates to
3. Determine severity level (Normal/Minor/Major/Critical)
4. Extract 3 most representative keywords (max)
5. Calculate frequency if comment appears multiple times

Output Format (JSON):
{
  "comments": [
    {
      "component": "Bearing",
      "keywords": ["wear", "scoring", "discoloration"],
      "severity": "Major",
      "full_text": "Bearing shows significant wear with scoring and discoloration on the inner race, indicating advanced degradation.",
      "frequency": 5
    }
  ]
}
```

#### 3. Knowledge Base Extraction Prompt
```
System: You are extracting structured knowledge from engineering guidelines.

Task: Parse the engineering guideline document and extract component-failure mode-action mappings.

Document: {guideline_text}

Instructions:
1. Identify all equipment components mentioned
2. For each component, extract:
   - Possible failure modes
   - Severity classification criteria
   - Recommended actions for each failure mode
3. Standardize terminology

Output Format (JSON):
{
  "knowledge": [
    {
      "component": "Pump Bearing",
      "failure_modes": [
        {
          "mode": "Wear",
          "severity_criteria": {
            "minor": "Light surface wear < 0.5mm",
            "major": "Deep wear > 0.5mm",
            "critical": "Wear affecting structural integrity"
          },
          "recommended_actions": {
            "minor": "Monitor and schedule replacement",
            "major": "Replace at next shutdown",
            "critical": "Immediate replacement required"
          }
        }
      ]
    }
  ]
}
```

#### 4. Comment Enhancement Prompt
```
System: You are an expert mechanical inspector. Convert informal voice notes into professional engineering inspection comments.

Context:
- Component: {component_name}
- Historical similar comments: {similar_comments}
- Engineering guidelines: {relevant_guidelines}

User Input: {voice_text}

Instructions:
1. Interpret the user's observation
2. Use proper engineering terminology
3. Include severity assessment
4. Add recommended action if applicable
5. Maintain professional tone
6. Ensure technical accuracy

Output Format (JSON):
{
  "comment": "Professional comment text here",
  "severity": "Major",
  "confidence": 0.92,
  "recommended_action": "Action to take"
}

Example:
Input: "bearing looks pretty worn out, some scratches"
Output: "Bearing exhibits moderate wear with visible scoring on the outer race surface. Degradation level indicates replacement should be scheduled within the next maintenance cycle. Severity: Major."
```

---

## Security Architecture

### Authentication & Authorization

```
┌─────────────────────────────────────────────────────────────┐
│                     SECURITY LAYER                          │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐
│  User Login      │
└────────┬─────────┘
         │
         ▼
┌─────────────────────────────┐
│  JWT Token Generation       │
│  - Access Token (15 min)    │
│  - Refresh Token (7 days)   │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Role-Based Access Control  │
│  Roles:                     │
│  - Admin                    │
│  - Manager                  │
│  - Inspector                │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  API Request                │
│  Header: Authorization:     │
│  Bearer {token}             │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Middleware: Verify Token   │
│  - Check expiration         │
│  - Validate signature       │
│  - Load user permissions    │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Route Handler              │
│  - Check permissions        │
│  - Execute business logic   │
└─────────────────────────────┘
```

### Data Encryption

- **In Transit**: TLS 1.3 for all API communications
- **At Rest**:
  - Database: PostgreSQL encryption
  - File Storage: S3 server-side encryption (SSE-S3)
  - Mobile: SQLite encryption using SQLCipher

---

## Deployment Architecture

### Cloud Infrastructure (AWS Example)

```
┌─────────────────────────────────────────────────────────────┐
│                     AWS CLOUD                               │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  CloudFront CDN                                              │
│  - Static assets (web app)                                   │
│  - Global distribution                                       │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────┐
│  Application Load Balancer                                   │
│  - HTTPS termination                                         │
│  - Health checks                                             │
└────────────────────────┬─────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
    ┌────▼────┐     ┌────▼────┐    ┌────▼────┐
    │  ECS    │     │  ECS    │    │  ECS    │
    │ Container│     │ Container│    │ Container│
    │ (API)   │     │ (API)   │    │ (API)   │
    └────┬────┘     └────┬────┘    └────┬────┘
         │               │               │
         └───────────────┼───────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
    ┌────▼────────┐ ┌───▼──────┐  ┌────▼────────┐
    │   RDS       │ │   S3     │  │  Lambda     │
    │ PostgreSQL  │ │  Bucket  │  │ (AI Process)│
    │             │ │          │  │             │
    │ - Primary   │ │ - Docs   │  │ - Document  │
    │ - Read      │ │ - Images │  │   Parsing   │
    │   Replica   │ │ - Voice  │  │ - LLM API   │
    └─────────────┘ └──────────┘  └─────────────┘
```

### Environment Setup

**Development**:
- Local PostgreSQL
- LocalStack (S3 emulation)
- Docker Compose

**Staging**:
- AWS RDS (small instance)
- S3 bucket
- ECS Fargate (1-2 tasks)

**Production**:
- AWS RDS (multi-AZ, read replicas)
- S3 with CloudFront
- ECS Fargate (auto-scaling 3-10 tasks)
- Redis for caching
- CloudWatch for monitoring

---

## Performance Optimization

### Backend Optimizations
1. **Caching**: Redis for frequently accessed checklists
2. **Database Indexing**: On checklist_id, user_id, timestamps
3. **Connection Pooling**: pgBouncer for PostgreSQL
4. **Async Processing**: Bull queue for document processing
5. **CDN**: Static assets served via CloudFront

### Mobile App Optimizations
1. **Offline-First**: All data cached locally
2. **Lazy Loading**: Load checklists on demand
3. **Image Compression**: Compress photos before upload
4. **Batch Sync**: Sync multiple inspections together
5. **SQLite Indexing**: Index on session_id, synced status

---

## Monitoring & Observability

```
┌──────────────────────────────────────────────────────────┐
│                  MONITORING STACK                        │
├──────────────────────────────────────────────────────────┤
│  CloudWatch / DataDog / New Relic                        │
│                                                          │
│  Metrics:                                                │
│  - API response time                                     │
│  - Document processing time                              │
│  - AI inference latency                                  │
│  - Database query performance                            │
│  - Error rates                                           │
│                                                          │
│  Alerts:                                                 │
│  - API errors > 5% in 5 min                             │
│  - Document processing > 60s                             │
│  - Database connections > 80%                            │
│  - Disk usage > 85%                                      │
└──────────────────────────────────────────────────────────┘
```

---

## Scalability Considerations

1. **Horizontal Scaling**: Auto-scale API containers based on CPU/memory
2. **Database Scaling**: Read replicas for reporting queries
3. **File Storage**: S3 unlimited scalability
4. **AI Processing**: Lambda for parallel document processing
5. **Rate Limiting**: Prevent API abuse, 100 req/min per user

---

## Disaster Recovery

1. **Database Backups**: Automated daily backups, 30-day retention
2. **S3 Versioning**: Enabled for document recovery
3. **Multi-AZ Deployment**: RDS and ECS across availability zones
4. **Point-in-Time Recovery**: RDS PITR enabled
5. **Backup Testing**: Monthly restore drills

---

**Document Version**: 1.0
**Last Updated**: 2025-12-31
