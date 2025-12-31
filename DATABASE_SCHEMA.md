# Database Schema - Voice-Based Inspection App

## Overview

This document defines the complete database schema for the Voice-Based Inspection App. The system uses PostgreSQL as the primary relational database and pgVector for AI embeddings.

---

## Entity Relationship Diagram

```
┌─────────────┐
│    users    │
└──────┬──────┘
       │
       │ (created_by)
       │
       ▼
┌──────────────────┐         ┌────────────────────┐
│ equipment_types  │◄────────│   checklists       │
└──────────────────┘         └─────────┬──────────┘
                                       │
                                       │ (checklist_id)
                                       │
                                       ▼
                             ┌─────────────────────┐
                             │  checklist_items    │
                             └─────────┬───────────┘
                                       │
                ┌──────────────────────┼──────────────────────┐
                │                      │                      │
                ▼                      ▼                      ▼
       ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
       │ comment_library │   │ inspection_     │   │ item_keywords   │
       │                 │   │ sessions        │   │                 │
       └─────────────────┘   └────────┬────────┘   └─────────────────┘
                                      │
                                      │ (session_id)
                                      │
                                      ▼
                            ┌──────────────────────┐
                            │ inspection_records   │
                            └──────────┬───────────┘
                                       │
                                       ▼
                            ┌──────────────────────┐
                            │ record_photos        │
                            └──────────────────────┘

┌──────────────────┐         ┌────────────────────┐
│ uploaded_docs    │────────►│ knowledge_base     │
└──────────────────┘         └────────────────────┘
```

---

## Table Definitions

### 1. users

Stores user accounts for web and mobile app access.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) NOT NULL DEFAULT 'inspector',
    -- Roles: 'admin', 'manager', 'inspector'
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

---

### 2. equipment_types

Defines types of equipment that can be inspected.

```sql
CREATE TABLE equipment_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    manufacturer VARCHAR(200),
    model VARCHAR(200),
    category VARCHAR(100),
    -- e.g., 'pump', 'motor', 'compressor', 'turbine'
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_equipment_types_category ON equipment_types(category);
```

---

### 3. checklists

Master checklist templates for inspections.

```sql
CREATE TABLE checklists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_type_id UUID REFERENCES equipment_types(id) ON DELETE CASCADE,
    name VARCHAR(300) NOT NULL,
    version VARCHAR(50) DEFAULT '1.0',
    description TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    -- Status: 'draft', 'published', 'archived'
    created_by UUID REFERENCES users(id),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_checklists_equipment_type ON checklists(equipment_type_id);
CREATE INDEX idx_checklists_status ON checklists(status);
CREATE INDEX idx_checklists_created_by ON checklists(created_by);
```

---

### 4. checklist_items

Individual inspection items within a checklist.

```sql
CREATE TABLE checklist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    checklist_id UUID REFERENCES checklists(id) ON DELETE CASCADE,
    component_name VARCHAR(200) NOT NULL,
    -- e.g., 'Bearing', 'Shaft', 'Seal', 'Impeller'
    inspection_point TEXT NOT NULL,
    -- e.g., 'Check for wear, scoring, or discoloration'
    sequence_order INTEGER NOT NULL,
    -- Order in which items appear
    severity_levels JSONB DEFAULT '["Normal", "Minor", "Major", "Critical"]',
    -- Configurable severity options
    is_required BOOLEAN DEFAULT true,
    notes TEXT,
    -- Internal notes for inspectors
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_checklist_items_checklist ON checklist_items(checklist_id);
CREATE INDEX idx_checklist_items_sequence ON checklist_items(checklist_id, sequence_order);
```

---

### 5. item_keywords

Predefined keywords for quick comment generation (max 3 per item).

```sql
CREATE TABLE item_keywords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    checklist_item_id UUID REFERENCES checklist_items(id) ON DELETE CASCADE,
    keyword VARCHAR(100) NOT NULL,
    display_order INTEGER NOT NULL,
    -- Order in which keywords appear (1, 2, or 3)
    usage_count INTEGER DEFAULT 0,
    -- Track how often this keyword is used
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_item_keywords_item ON item_keywords(checklist_item_id);
CREATE INDEX idx_item_keywords_order ON item_keywords(checklist_item_id, display_order);
```

---

### 6. comment_library

Library of historical comments extracted from uploaded reports.

```sql
CREATE TABLE comment_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    component_name VARCHAR(200) NOT NULL,
    failure_mode VARCHAR(200),
    -- e.g., 'wear', 'corrosion', 'cracking', 'misalignment'
    severity_level VARCHAR(50),
    -- 'Normal', 'Minor', 'Major', 'Critical'
    keywords TEXT[],
    -- Array of keywords (max 3)
    full_comment_text TEXT NOT NULL,
    frequency_score INTEGER DEFAULT 1,
    -- How many times this comment appeared in historical data
    source_document_id UUID REFERENCES uploaded_documents(id),
    embedding vector(1536),
    -- OpenAI ada-002 embeddings for semantic search
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_comment_library_component ON comment_library(component_name);
CREATE INDEX idx_comment_library_severity ON comment_library(severity_level);
CREATE INDEX idx_comment_library_keywords ON comment_library USING GIN(keywords);
-- Vector similarity search index
CREATE INDEX idx_comment_library_embedding ON comment_library
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

---

### 7. knowledge_base

Structured knowledge extracted from engineering guideline documents.

```sql
CREATE TABLE knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    component VARCHAR(200) NOT NULL,
    failure_mode VARCHAR(200) NOT NULL,
    severity_level VARCHAR(50),
    severity_criteria TEXT,
    -- Description of what constitutes this severity
    description TEXT,
    recommended_actions JSONB,
    -- Array of recommended actions based on severity
    -- Example: {"minor": "Monitor", "major": "Schedule repair", "critical": "Immediate action"}
    source_guideline_id UUID REFERENCES uploaded_documents(id),
    embedding vector(1536),
    -- For semantic search
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_knowledge_base_component ON knowledge_base(component);
CREATE INDEX idx_knowledge_base_failure_mode ON knowledge_base(failure_mode);
CREATE INDEX idx_knowledge_base_severity ON knowledge_base(severity_level);
CREATE INDEX idx_knowledge_base_embedding ON knowledge_base
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

---

### 8. uploaded_documents

Tracks all uploaded documents (reports and guidelines).

```sql
CREATE TABLE uploaded_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename VARCHAR(500) NOT NULL,
    original_filename VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    -- 'historical_report' or 'engineering_guideline'
    file_path TEXT NOT NULL,
    -- S3 path or local path
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    processing_status VARCHAR(50) DEFAULT 'pending',
    -- Status: 'pending', 'processing', 'completed', 'failed'
    processing_error TEXT,
    processing_metadata JSONB,
    -- Store processing results, page count, etc.
    uploaded_by UUID REFERENCES users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_uploaded_docs_type ON uploaded_documents(file_type);
CREATE INDEX idx_uploaded_docs_status ON uploaded_documents(processing_status);
CREATE INDEX idx_uploaded_docs_uploaded_by ON uploaded_documents(uploaded_by);
```

---

### 9. inspection_sessions

Represents a single inspection session (one equipment inspection).

```sql
CREATE TABLE inspection_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    checklist_id UUID REFERENCES checklists(id),
    equipment_type_id UUID REFERENCES equipment_types(id),
    equipment_identifier VARCHAR(200),
    -- Specific equipment ID/serial number being inspected
    location VARCHAR(300),
    -- Physical location of equipment
    inspector_id UUID REFERENCES users(id),
    inspector_name VARCHAR(200),
    -- Denormalized for offline capability
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'in_progress',
    -- Status: 'in_progress', 'completed', 'submitted'
    synced_to_server BOOLEAN DEFAULT false,
    -- For mobile offline tracking
    synced_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    -- General session notes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_inspection_sessions_checklist ON inspection_sessions(checklist_id);
CREATE INDEX idx_inspection_sessions_inspector ON inspection_sessions(inspector_id);
CREATE INDEX idx_inspection_sessions_status ON inspection_sessions(status);
CREATE INDEX idx_inspection_sessions_synced ON inspection_sessions(synced_to_server);
CREATE INDEX idx_inspection_sessions_start_time ON inspection_sessions(start_time);
```

---

### 10. inspection_records

Individual inspection item records within a session.

```sql
CREATE TABLE inspection_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES inspection_sessions(id) ON DELETE CASCADE,
    checklist_item_id UUID REFERENCES checklist_items(id),
    component_name VARCHAR(200),
    -- Denormalized for reporting
    inspection_point TEXT,
    -- Denormalized for reporting
    selected_keywords TEXT[],
    -- Keywords selected by inspector (max 3)
    severity_level VARCHAR(50),
    input_method VARCHAR(50),
    -- 'quick_select' or 'voice_input'
    voice_transcript TEXT,
    -- Original voice-to-text if voice was used
    ai_generated_comment TEXT,
    -- Comment generated by AI
    final_comment TEXT NOT NULL,
    -- Final comment after user edits
    ai_confidence_score DECIMAL(3,2),
    -- Confidence score from AI (0.00 to 1.00)
    voice_recording_path TEXT,
    -- S3 path to voice recording file
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    synced_to_server BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_inspection_records_session ON inspection_records(session_id);
CREATE INDEX idx_inspection_records_item ON inspection_records(checklist_item_id);
CREATE INDEX idx_inspection_records_severity ON inspection_records(severity_level);
CREATE INDEX idx_inspection_records_synced ON inspection_records(synced_to_server);
```

---

### 11. record_photos

Photos attached to inspection records.

```sql
CREATE TABLE record_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inspection_record_id UUID REFERENCES inspection_records(id) ON DELETE CASCADE,
    filename VARCHAR(500) NOT NULL,
    file_path TEXT NOT NULL,
    -- S3 path or local path
    file_size_bytes BIGINT,
    thumbnail_path TEXT,
    caption TEXT,
    sequence_order INTEGER,
    -- Order of photos for this record
    taken_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    synced_to_server BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_record_photos_record ON record_photos(inspection_record_id);
CREATE INDEX idx_record_photos_synced ON record_photos(synced_to_server);
```

---

### 12. sync_queue

Tracks pending sync operations for mobile app.

```sql
CREATE TABLE sync_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL,
    -- 'inspection_session', 'inspection_record', 'photo'
    entity_id UUID NOT NULL,
    operation VARCHAR(50) NOT NULL,
    -- 'create', 'update', 'delete'
    user_id UUID REFERENCES users(id),
    payload JSONB,
    -- Full data payload
    status VARCHAR(50) DEFAULT 'pending',
    -- 'pending', 'syncing', 'completed', 'failed'
    retry_count INTEGER DEFAULT 0,
    last_error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    synced_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_sync_queue_status ON sync_queue(status);
CREATE INDEX idx_sync_queue_user ON sync_queue(user_id);
CREATE INDEX idx_sync_queue_entity ON sync_queue(entity_type, entity_id);
```

---

### 13. ai_processing_logs

Logs all AI processing operations for auditing and debugging.

```sql
CREATE TABLE ai_processing_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operation_type VARCHAR(100) NOT NULL,
    -- 'document_parsing', 'checklist_generation', 'comment_enhancement', etc.
    input_data JSONB,
    output_data JSONB,
    model_used VARCHAR(100),
    -- e.g., 'gpt-4', 'whisper-1'
    tokens_used INTEGER,
    processing_time_ms INTEGER,
    status VARCHAR(50),
    -- 'success', 'failed'
    error_message TEXT,
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ai_logs_operation ON ai_processing_logs(operation_type);
CREATE INDEX idx_ai_logs_status ON ai_processing_logs(status);
CREATE INDEX idx_ai_logs_created_at ON ai_processing_logs(created_at);
```

---

## Views

### v_inspection_summary

Provides a summary view of inspections with aggregated data.

```sql
CREATE VIEW v_inspection_summary AS
SELECT
    s.id,
    s.equipment_identifier,
    s.location,
    s.inspector_name,
    s.start_time,
    s.end_time,
    s.status,
    c.name AS checklist_name,
    et.name AS equipment_type,
    COUNT(r.id) AS total_items_inspected,
    COUNT(CASE WHEN r.severity_level = 'Critical' THEN 1 END) AS critical_count,
    COUNT(CASE WHEN r.severity_level = 'Major' THEN 1 END) AS major_count,
    COUNT(CASE WHEN r.severity_level = 'Minor' THEN 1 END) AS minor_count,
    COUNT(CASE WHEN r.severity_level = 'Normal' THEN 1 END) AS normal_count
FROM inspection_sessions s
LEFT JOIN checklists c ON s.checklist_id = c.id
LEFT JOIN equipment_types et ON s.equipment_type_id = et.id
LEFT JOIN inspection_records r ON s.id = r.session_id
GROUP BY s.id, s.equipment_identifier, s.location, s.inspector_name,
         s.start_time, s.end_time, s.status, c.name, et.name;
```

---

## Functions

### 1. Update timestamp trigger

Automatically update the `updated_at` column.

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_equipment_types_updated_at BEFORE UPDATE ON equipment_types
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_checklists_updated_at BEFORE UPDATE ON checklists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_checklist_items_updated_at BEFORE UPDATE ON checklist_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comment_library_updated_at BEFORE UPDATE ON comment_library
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_base_updated_at BEFORE UPDATE ON knowledge_base
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_uploaded_documents_updated_at BEFORE UPDATE ON uploaded_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inspection_sessions_updated_at BEFORE UPDATE ON inspection_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inspection_records_updated_at BEFORE UPDATE ON inspection_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

### 2. Vector similarity search function

Search for similar comments using embeddings.

```sql
CREATE OR REPLACE FUNCTION find_similar_comments(
    query_embedding vector(1536),
    similarity_threshold float DEFAULT 0.7,
    max_results int DEFAULT 5
)
RETURNS TABLE (
    id UUID,
    component_name VARCHAR(200),
    full_comment_text TEXT,
    keywords TEXT[],
    severity_level VARCHAR(50),
    similarity_score float
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        cl.id,
        cl.component_name,
        cl.full_comment_text,
        cl.keywords,
        cl.severity_level,
        1 - (cl.embedding <=> query_embedding) AS similarity_score
    FROM comment_library cl
    WHERE 1 - (cl.embedding <=> query_embedding) > similarity_threshold
    ORDER BY cl.embedding <=> query_embedding
    LIMIT max_results;
END;
$$ LANGUAGE plpgsql;
```

---

## Seed Data

### Default Severity Levels

```sql
-- Insert default severity levels used across the app
INSERT INTO app_settings (key, value) VALUES
('severity_levels', '["Normal", "Minor", "Major", "Critical"]');
```

### Sample Equipment Types

```sql
INSERT INTO equipment_types (name, description, category) VALUES
('Centrifugal Pump', 'Standard centrifugal pump for liquid transfer', 'pump'),
('Electric Motor', 'AC induction motor', 'motor'),
('Air Compressor', 'Rotary screw air compressor', 'compressor'),
('Gearbox', 'Speed reduction gearbox', 'gearbox');
```

---

## Migration Strategy

### Initial Setup
1. Install PostgreSQL 15+
2. Install pgVector extension:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   CREATE EXTENSION IF NOT EXISTS "pg_trgm";
   ```
3. Run schema creation scripts in order
4. Apply indexes
5. Create views and functions
6. Insert seed data

### Version Control
- Use migration tool: **Knex.js** or **TypeORM migrations**
- Each migration file numbered sequentially
- Include both `up` and `down` migrations

---

## Backup & Maintenance

### Backup Strategy
```sql
-- Daily automated backup
pg_dump -h localhost -U postgres -d inspection_app > backup_$(date +%Y%m%d).sql

-- Backup with compression
pg_dump -h localhost -U postgres -d inspection_app | gzip > backup_$(date +%Y%m%d).sql.gz
```

### Regular Maintenance
```sql
-- Vacuum and analyze weekly
VACUUM ANALYZE;

-- Reindex monthly
REINDEX DATABASE inspection_app;

-- Update statistics
ANALYZE;
```

---

## Performance Tuning

### Recommended PostgreSQL Settings
```
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1  # For SSD
effective_io_concurrency = 200
work_mem = 4MB
```

---

**Document Version**: 1.0
**Last Updated**: 2025-12-31
