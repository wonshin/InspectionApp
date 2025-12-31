# API Specification - Voice-Based Inspection App

## Overview

RESTful API specification for the Voice-Based Inspection App backend services.

**Base URL**: `https://api.inspection-app.com/v1`

**Authentication**: JWT Bearer Token

---

## Table of Contents

1. [Authentication](#authentication)
2. [Web App APIs](#web-app-apis)
   - [Document Management](#document-management)
   - [Checklist Management](#checklist-management)
   - [Knowledge Base](#knowledge-base)
3. [Mobile App APIs](#mobile-app-apis)
   - [Sync APIs](#sync-apis)
   - [Inspection APIs](#inspection-apis)
   - [Comment Generation](#comment-generation)
4. [Common APIs](#common-apis)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)

---

## Authentication

### Register User

```http
POST /auth/register
```

**Request Body**:
```json
{
  "email": "inspector@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "inspector",
  "phone": "+1234567890"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "inspector@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "inspector"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### Login

```http
POST /auth/login
```

**Request Body**:
```json
{
  "email": "inspector@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "inspector@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "inspector"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### Refresh Token

```http
POST /auth/refresh
```

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

## Web App APIs

### Document Management

#### Upload Documents

Upload historical reports or engineering guidelines for AI processing.

```http
POST /documents/upload
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data
```

**Request Body** (multipart/form-data):
```
file: (binary) - PDF, DOCX, or TXT file
fileType: "historical_report" | "engineering_guideline"
equipmentTypeId: "uuid" (optional)
description: "string" (optional)
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "documentId": "650e8400-e29b-41d4-a716-446655440000",
    "filename": "pump_inspection_report_2024.pdf",
    "fileType": "historical_report",
    "fileSize": 2457600,
    "status": "pending",
    "uploadedAt": "2025-12-31T10:30:00Z"
  }
}
```

---

#### Process Document

Trigger AI processing for uploaded document.

```http
POST /documents/{documentId}/process
Authorization: Bearer {accessToken}
```

**Request Body**:
```json
{
  "processingType": "checklist_generation" | "comment_extraction" | "knowledge_extraction",
  "options": {
    "extractKeywords": true,
    "maxKeywordsPerComment": 3
  }
}
```

**Response** (202 Accepted):
```json
{
  "success": true,
  "data": {
    "documentId": "650e8400-e29b-41d4-a716-446655440000",
    "status": "processing",
    "estimatedCompletionTime": "2025-12-31T10:32:00Z"
  }
}
```

---

#### Get Document Processing Status

```http
GET /documents/{documentId}/status
Authorization: Bearer {accessToken}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "documentId": "650e8400-e29b-41d4-a716-446655440000",
    "status": "completed",
    "processingMetadata": {
      "pagesProcessed": 45,
      "checklistItemsGenerated": 23,
      "commentsExtracted": 156,
      "processingTimeMs": 28500
    },
    "processedAt": "2025-12-31T10:31:45Z"
  }
}
```

---

#### List Documents

```http
GET /documents?fileType={type}&status={status}&page={page}&limit={limit}
Authorization: Bearer {accessToken}
```

**Query Parameters**:
- `fileType`: (optional) "historical_report" | "engineering_guideline"
- `status`: (optional) "pending" | "processing" | "completed" | "failed"
- `page`: (optional) Page number (default: 1)
- `limit`: (optional) Items per page (default: 20)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "documents": [
      {
        "id": "650e8400-e29b-41d4-a716-446655440000",
        "filename": "pump_inspection_report_2024.pdf",
        "fileType": "historical_report",
        "status": "completed",
        "uploadedAt": "2025-12-31T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

---

### Checklist Management

#### Create Checklist

```http
POST /checklists
Authorization: Bearer {accessToken}
```

**Request Body**:
```json
{
  "name": "Centrifugal Pump Inspection Checklist",
  "equipmentTypeId": "550e8400-e29b-41d4-a716-446655440000",
  "description": "Standard inspection checklist for centrifugal pumps",
  "items": [
    {
      "componentName": "Bearing",
      "inspectionPoint": "Check for wear, scoring, or discoloration",
      "sequenceOrder": 1,
      "severityLevels": ["Normal", "Minor", "Major", "Critical"],
      "keywords": ["wear", "scoring", "discoloration"]
    },
    {
      "componentName": "Shaft",
      "inspectionPoint": "Inspect for cracks, bending, or surface damage",
      "sequenceOrder": 2,
      "severityLevels": ["Normal", "Minor", "Major", "Critical"],
      "keywords": ["crack", "bending", "damage"]
    }
  ]
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "checklistId": "750e8400-e29b-41d4-a716-446655440000",
    "name": "Centrifugal Pump Inspection Checklist",
    "version": "1.0",
    "status": "draft",
    "itemCount": 2,
    "createdAt": "2025-12-31T11:00:00Z"
  }
}
```

---

#### Generate Checklist from Documents

AI-powered checklist generation from uploaded documents.

```http
POST /checklists/generate
Authorization: Bearer {accessToken}
```

**Request Body**:
```json
{
  "name": "Auto-Generated Pump Checklist",
  "equipmentTypeId": "550e8400-e29b-41d4-a716-446655440000",
  "sourceDocumentIds": [
    "650e8400-e29b-41d4-a716-446655440000",
    "650e8400-e29b-41d4-a716-446655440001"
  ],
  "options": {
    "maxKeywordsPerItem": 3,
    "groupByComponent": true
  }
}
```

**Response** (202 Accepted):
```json
{
  "success": true,
  "data": {
    "jobId": "850e8400-e29b-41d4-a716-446655440000",
    "status": "processing",
    "estimatedCompletionTime": "2025-12-31T11:05:00Z"
  }
}
```

---

#### Get Checklist

```http
GET /checklists/{checklistId}
Authorization: Bearer {accessToken}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "750e8400-e29b-41d4-a716-446655440000",
    "name": "Centrifugal Pump Inspection Checklist",
    "version": "1.0",
    "status": "published",
    "equipmentType": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Centrifugal Pump"
    },
    "items": [
      {
        "id": "item-001",
        "componentName": "Bearing",
        "inspectionPoint": "Check for wear, scoring, or discoloration",
        "sequenceOrder": 1,
        "severityLevels": ["Normal", "Minor", "Major", "Critical"],
        "keywords": [
          { "keyword": "wear", "displayOrder": 1 },
          { "keyword": "scoring", "displayOrder": 2 },
          { "keyword": "discoloration", "displayOrder": 3 }
        ]
      }
    ],
    "publishedAt": "2025-12-31T11:30:00Z"
  }
}
```

---

#### Update Checklist

```http
PUT /checklists/{checklistId}
Authorization: Bearer {accessToken}
```

**Request Body**:
```json
{
  "name": "Updated Checklist Name",
  "description": "Updated description",
  "items": [
    {
      "id": "item-001",
      "componentName": "Bearing",
      "inspectionPoint": "Updated inspection point",
      "keywords": ["updated", "keywords", "list"]
    }
  ]
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "checklistId": "750e8400-e29b-41d4-a716-446655440000",
    "version": "1.1",
    "updatedAt": "2025-12-31T12:00:00Z"
  }
}
```

---

#### Publish Checklist

Make checklist available to mobile app.

```http
POST /checklists/{checklistId}/publish
Authorization: Bearer {accessToken}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "checklistId": "750e8400-e29b-41d4-a716-446655440000",
    "status": "published",
    "publishedAt": "2025-12-31T12:15:00Z"
  }
}
```

---

#### List Checklists

```http
GET /checklists?status={status}&equipmentTypeId={id}&page={page}&limit={limit}
Authorization: Bearer {accessToken}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "checklists": [
      {
        "id": "750e8400-e29b-41d4-a716-446655440000",
        "name": "Centrifugal Pump Inspection Checklist",
        "version": "1.0",
        "status": "published",
        "itemCount": 15,
        "equipmentType": "Centrifugal Pump",
        "publishedAt": "2025-12-31T11:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 8,
      "totalPages": 1
    }
  }
}
```

---

### Knowledge Base

#### Create Knowledge Entry

```http
POST /knowledge-base
Authorization: Bearer {accessToken}
```

**Request Body**:
```json
{
  "component": "Pump Bearing",
  "failureMode": "Wear",
  "severityLevel": "Major",
  "severityCriteria": "Wear depth > 0.5mm affecting performance",
  "description": "Advanced bearing wear requiring replacement",
  "recommendedActions": {
    "minor": "Monitor and schedule replacement within 3 months",
    "major": "Replace at next scheduled shutdown",
    "critical": "Immediate replacement required - risk of catastrophic failure"
  },
  "sourceGuidelineId": "650e8400-e29b-41d4-a716-446655440000"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "950e8400-e29b-41d4-a716-446655440000",
    "component": "Pump Bearing",
    "failureMode": "Wear",
    "createdAt": "2025-12-31T13:00:00Z"
  }
}
```

---

#### Extract Knowledge from Document

AI-powered knowledge extraction from engineering guidelines.

```http
POST /knowledge-base/extract
Authorization: Bearer {accessToken}
```

**Request Body**:
```json
{
  "sourceDocumentId": "650e8400-e29b-41d4-a716-446655440000",
  "options": {
    "extractRecommendedActions": true,
    "standardizeSeverityLevels": true
  }
}
```

**Response** (202 Accepted):
```json
{
  "success": true,
  "data": {
    "jobId": "960e8400-e29b-41d4-a716-446655440000",
    "status": "processing",
    "estimatedCompletionTime": "2025-12-31T13:05:00Z"
  }
}
```

---

#### Search Knowledge Base

```http
GET /knowledge-base/search?component={name}&failureMode={mode}&severity={level}
Authorization: Bearer {accessToken}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "entries": [
      {
        "id": "950e8400-e29b-41d4-a716-446655440000",
        "component": "Pump Bearing",
        "failureMode": "Wear",
        "severityLevel": "Major",
        "description": "Advanced bearing wear requiring replacement",
        "recommendedActions": {
          "major": "Replace at next scheduled shutdown"
        }
      }
    ],
    "total": 1
  }
}
```

---

## Mobile App APIs

### Sync APIs

#### Get Sync Data

Download all necessary data for offline operation.

```http
GET /sync/checklists?lastSyncTimestamp={timestamp}
Authorization: Bearer {accessToken}
```

**Query Parameters**:
- `lastSyncTimestamp`: (optional) ISO 8601 timestamp of last sync

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "checklists": [
      {
        "id": "750e8400-e29b-41d4-a716-446655440000",
        "name": "Centrifugal Pump Inspection Checklist",
        "version": "1.0",
        "equipmentTypeId": "550e8400-e29b-41d4-a716-446655440000",
        "items": [
          {
            "id": "item-001",
            "componentName": "Bearing",
            "inspectionPoint": "Check for wear, scoring, or discoloration",
            "sequenceOrder": 1,
            "severityLevels": ["Normal", "Minor", "Major", "Critical"],
            "keywords": [
              { "keyword": "wear", "displayOrder": 1 },
              { "keyword": "scoring", "displayOrder": 2 },
              { "keyword": "discoloration", "displayOrder": 3 }
            ]
          }
        ],
        "updatedAt": "2025-12-31T11:30:00Z"
      }
    ],
    "syncTimestamp": "2025-12-31T14:00:00Z"
  }
}
```

---

#### Upload Inspection Data

Sync inspection sessions and records to server.

```http
POST /sync/inspections
Authorization: Bearer {accessToken}
```

**Request Body**:
```json
{
  "sessions": [
    {
      "localId": "local-session-001",
      "checklistId": "750e8400-e29b-41d4-a716-446655440000",
      "equipmentTypeId": "550e8400-e29b-41d4-a716-446655440000",
      "equipmentIdentifier": "PUMP-001",
      "location": "Building A, Room 204",
      "inspectorName": "John Doe",
      "startTime": "2025-12-31T08:00:00Z",
      "endTime": "2025-12-31T09:30:00Z",
      "status": "completed",
      "records": [
        {
          "localId": "local-record-001",
          "checklistItemId": "item-001",
          "selectedKeywords": ["wear", "scoring"],
          "severityLevel": "Major",
          "inputMethod": "quick_select",
          "aiGeneratedComment": "Bearing shows wear and scoring...",
          "finalComment": "Bearing shows significant wear and scoring on inner race",
          "aiConfidenceScore": 0.92,
          "recordedAt": "2025-12-31T08:15:00Z"
        }
      ]
    }
  ]
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "synced": {
      "sessions": 1,
      "records": 1,
      "photos": 0
    },
    "mapping": {
      "local-session-001": "a50e8400-e29b-41d4-a716-446655440000",
      "local-record-001": "a60e8400-e29b-41d4-a716-446655440000"
    },
    "syncedAt": "2025-12-31T14:15:00Z"
  }
}
```

---

### Inspection APIs

#### Start Inspection Session

```http
POST /inspections/sessions
Authorization: Bearer {accessToken}
```

**Request Body**:
```json
{
  "checklistId": "750e8400-e29b-41d4-a716-446655440000",
  "equipmentTypeId": "550e8400-e29b-41d4-a716-446655440000",
  "equipmentIdentifier": "PUMP-001",
  "location": "Building A, Room 204"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "sessionId": "a50e8400-e29b-41d4-a716-446655440000",
    "status": "in_progress",
    "startTime": "2025-12-31T08:00:00Z"
  }
}
```

---

#### Save Inspection Record

```http
POST /inspections/sessions/{sessionId}/records
Authorization: Bearer {accessToken}
```

**Request Body**:
```json
{
  "checklistItemId": "item-001",
  "selectedKeywords": ["wear", "scoring"],
  "severityLevel": "Major",
  "inputMethod": "quick_select",
  "finalComment": "Bearing shows significant wear and scoring on inner race"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "recordId": "a60e8400-e29b-41d4-a716-446655440000",
    "recordedAt": "2025-12-31T08:15:00Z"
  }
}
```

---

#### Complete Inspection Session

```http
POST /inspections/sessions/{sessionId}/complete
Authorization: Bearer {accessToken}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "sessionId": "a50e8400-e29b-41d4-a716-446655440000",
    "status": "completed",
    "endTime": "2025-12-31T09:30:00Z",
    "totalRecords": 15
  }
}
```

---

### Comment Generation

#### Generate Quick Comment

Generate comment from selected keywords and severity.

```http
POST /comments/generate/quick
Authorization: Bearer {accessToken}
```

**Request Body**:
```json
{
  "checklistItemId": "item-001",
  "componentName": "Bearing",
  "selectedKeywords": ["wear", "scoring"],
  "severityLevel": "Major"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "generatedComment": "Bearing exhibits significant wear and scoring on the inner race surface. Severity level: Major. Replacement recommended at next scheduled maintenance.",
    "confidenceScore": 0.95,
    "processingTimeMs": 1200
  }
}
```

---

#### Enhance Voice Comment

Convert voice transcript to detailed engineering comment.

```http
POST /comments/generate/voice
Authorization: Bearer {accessToken}
```

**Request Body**:
```json
{
  "checklistItemId": "item-001",
  "componentName": "Bearing",
  "voiceTranscript": "bearing looks pretty worn out with some scratches on the inside",
  "context": {
    "equipmentType": "Centrifugal Pump",
    "inspectionPoint": "Check for wear, scoring, or discoloration"
  }
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "originalTranscript": "bearing looks pretty worn out with some scratches on the inside",
    "enhancedComment": "Bearing exhibits moderate to severe wear with visible scoring on the inner race surface. Surface degradation indicates advanced mechanical stress. Severity: Major. Recommended action: Replace bearing at next scheduled shutdown to prevent potential failure.",
    "detectedSeverity": "Major",
    "detectedKeywords": ["wear", "scoring", "degradation"],
    "confidenceScore": 0.88,
    "processingTimeMs": 2800
  }
}
```

---

#### Voice-to-Text Conversion

Convert audio recording to text.

```http
POST /voice/transcribe
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data
```

**Request Body** (multipart/form-data):
```
audio: (binary) - Audio file (mp3, m4a, wav)
language: "en" (optional, default: "en")
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "transcript": "bearing looks pretty worn out with some scratches on the inside",
    "confidence": 0.94,
    "language": "en",
    "duration": 3.2,
    "processingTimeMs": 1500
  }
}
```

---

## Common APIs

### Get Equipment Types

```http
GET /equipment-types
Authorization: Bearer {accessToken}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Centrifugal Pump",
      "category": "pump",
      "description": "Standard centrifugal pump for liquid transfer"
    }
  ]
}
```

---

### Upload Photo

```http
POST /photos/upload
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data
```

**Request Body** (multipart/form-data):
```
photo: (binary) - Image file
inspectionRecordId: "uuid"
caption: "string" (optional)
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "photoId": "b60e8400-e29b-41d4-a716-446655440000",
    "filePath": "https://s3.amazonaws.com/inspection-app/photos/...",
    "thumbnailPath": "https://s3.amazonaws.com/inspection-app/thumbnails/...",
    "uploadedAt": "2025-12-31T08:20:00Z"
  }
}
```

---

## Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or expired token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `DUPLICATE_ERROR` | 409 | Resource already exists |
| `PROCESSING_ERROR` | 500 | AI processing failed |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Rate Limiting

### Rate Limit Headers

All API responses include rate limit headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704024000
```

### Limits by Endpoint Category

| Category | Limit | Window |
|----------|-------|--------|
| Authentication | 10 requests | 1 minute |
| Document Upload | 20 requests | 1 hour |
| Comment Generation | 100 requests | 1 minute |
| Sync APIs | 50 requests | 1 minute |
| General APIs | 100 requests | 1 minute |

### Rate Limit Exceeded Response

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again in 30 seconds.",
    "retryAfter": 30
  }
}
```

---

## Pagination

### Standard Pagination Parameters

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

### Pagination Response Format

```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

---

## Versioning

API versioning through URL path:
- Current: `/v1/...`
- Future: `/v2/...`

---

## WebSocket API (Optional - Real-time Updates)

### Connect to WebSocket

```javascript
const ws = new WebSocket('wss://api.inspection-app.com/v1/ws');

// Send authentication
ws.send(JSON.stringify({
  type: 'auth',
  token: 'Bearer eyJhbGciOiJIUzI1NiIs...'
}));

// Listen for document processing updates
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'document_processing_update') {
    console.log('Processing status:', data.status);
  }
};
```

### Event Types

- `document_processing_update`: Document processing status changes
- `checklist_published`: New checklist published
- `sync_required`: Server data updated, sync recommended

---

**Document Version**: 1.0
**Last Updated**: 2025-12-31
**API Version**: v1
