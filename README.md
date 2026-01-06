# Field Inspection Assistant - AI-Powered Demo

A prototype demonstrating AI-assisted field inspection reporting with real-time comment generation and engineering insights.

## 🎯 Goal

Demoable prototype showcasing how AI can reduce field report completion time and improve data quality through intelligent assistance.

## ✨ Wow Moments

### Primary Wow Moment: AI Comment Generation (Field)
**Keyword selection + voice input → AI-generated complete technical comment**

- Technicians select keywords from pre-defined categories
- Optional voice input for additional context
- Claude AI generates a complete, professional technical comment in seconds
- Comments include specific measurements, observations, and recommended actions

### Secondary Wow Moment: AI Engineering Insights (Web Portal)
**AI-enriched report with pattern detection and critical issue flagging**

- Automatic pattern detection across historical reports
- Correlated issue identification
- Critical flag detection with urgency levels
- Overall risk assessment and executive summary

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Anthropic API key ([Get one here](https://console.anthropic.com/))

### Setup

1. **Install dependencies:**
   ```bash
   npm run setup
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_actual_api_key_here
   PORT=3001
   ```

3. **Start the application:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   - Field Interface: http://localhost:3000
   - Web Portal: http://localhost:3000/portal

## 📱 Demo Flow

### 1. Web Portal - Upload Historical Reports (Pre-staged)
- Navigate to: http://localhost:3000/portal
- Click "Upload Reports (Demo)" to simulate upload
- View the 10 pre-loaded historical inspection reports
- Each report shows equipment, technician, date, location, and issues found

### 2. Field Interface - AI-Assisted Reporting (PRIMARY WOW!)
- Navigate to: http://localhost:3000
- Enter equipment ID (e.g., "HVAC Unit A-12")
- Select an inspection category (e.g., "Cooling System")
- **Select keywords** by clicking the keyword buttons (e.g., "refrigerant", "leak", "pressure")
- **Optional:** Click "Start Voice Input" and speak additional context
- Click "✨ Generate AI Comment"
- **WOW!** Watch as Claude AI generates a complete, professional technical comment in seconds
- Click "Save Issue" to add to the report
- Repeat for multiple issues

### 3. Web Portal - View AI-Enriched Reports (SECONDARY WOW!)
- Navigate to: http://localhost:3000/portal
- Click on any report to view details
- Click "✨ Generate AI Insights (Secondary Wow!)"
- **WOW!** See AI-generated analysis including:
  - Overall risk assessment
  - Critical flags with urgency levels
  - Repeating pattern detection across reports
  - Correlated issue identification
  - Engineering recommendations

## 🏗️ Architecture

### Tech Stack
- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **AI:** Anthropic Claude API (Sonnet 3.5)
- **Voice Input:** Web Speech API (Chrome only)

### Project Structure
```
InspectionApp/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── FieldInterface.jsx    # Primary wow moment
│   │   │   ├── WebPortal.jsx         # Report listing
│   │   │   └── ReportView.jsx        # Secondary wow moment
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/                 # Node.js backend
│   ├── data/
│   │   ├── sampleReports.json       # 10 historical reports
│   │   ├── checklist.json           # AI-generated checklist
│   │   └── failureModes.json        # Failure mode library
│   └── index.js            # Express server + Claude API
└── package.json
```

### Key Features

#### AI Comment Generation (`/api/generate-comment`)
- Takes category, keywords, and optional voice input
- Retrieves relevant failure modes from library
- Finds similar historical examples
- Generates professional technical comment using Claude AI
- Includes measurements, observations, and actions taken

#### AI Report Analysis (`/api/analyze-report`)
- Analyzes individual report in context of all historical data
- Detects repeating patterns across reports
- Identifies correlated issues (e.g., vibration → bearing failure)
- Flags critical issues with urgency levels
- Provides overall risk assessment and executive summary

## 📊 Sample Data

### 10 Historical Reports Include:
- HVAC units, pumps, conveyors, chillers, compressors, boilers, fans, cooling towers, VFDs, heat exchangers
- Multiple issue categories: Cooling, Mechanical, Electrical, Safety, Controls, etc.
- Severity levels: Critical, High, Medium, Low
- Realistic technical comments from field inspections

### Pre-Generated Assets:
- **Checklist:** 8 categories with 5 inspection items each
- **Failure Mode Library:** 10 common failure patterns with causes, actions, and criticality indicators

## 🎨 UI/UX Highlights

### Field Interface
- Clean, mobile-friendly design
- Color-coded keyword selection (blue = selected)
- One-click voice input with visual feedback
- Real-time AI generation with loading states
- Success notifications for saved issues
- Issue summary with timestamps

### Web Portal
- Report listing with severity badges
- Quick filtering by status and category
- Detailed report view with all issues
- AI insights in collapsible sections
- Color-coded urgency levels

## 🔒 Security Notes

- This is a prototype for demonstration purposes
- In production, add:
  - User authentication and authorization
  - API rate limiting
  - Input validation and sanitization
  - Secure API key management (vault/secrets manager)
  - HTTPS/TLS encryption
  - Audit logging

## 🎯 Demo Script

**Setup (2 min):**
1. Start the app: `npm run dev`
2. Open browser to http://localhost:3000

**Primary Wow (3 min):**
1. "Imagine you're a field technician inspecting an HVAC unit"
2. Enter equipment: "HVAC Unit A-12"
3. Select category: "Cooling System"
4. Click keywords: "refrigerant", "leak", "pressure"
5. Click voice input: "Found leak at compressor outlet valve"
6. Click "Generate AI Comment"
7. **Show the magic:** Complete technical comment appears instantly!
8. Highlight: Measurements, specific location, action taken, recommendation
9. Save the issue

**Secondary Wow (3 min):**
1. Navigate to Web Portal
2. Click on a report (e.g., RPT-001)
3. Show the standard report view
4. Click "Generate AI Insights"
5. **Show the magic:** AI analysis appears with:
   - Critical flags
   - Repeating patterns
   - Correlated issues
   - Engineering recommendations
6. Explain: "AI is analyzing THIS report in context of ALL 10 historical reports"

## 🚧 Future Enhancements

- Offline support for field use
- Photo attachment and AI image analysis
- Predictive maintenance recommendations
- Integration with CMMS systems
- Multi-language support
- Mobile native apps (iOS/Android)
- Advanced analytics dashboard
- Custom checklist builder
- Equipment history tracking
- Automated work order generation

## 📝 License

Prototype - Not licensed for production use

## 🙏 Acknowledgments

Built with Claude AI assistance using the Anthropic API.