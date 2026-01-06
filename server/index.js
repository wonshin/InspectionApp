import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function loadJSON(filename) {
  const filePath = join(__dirname, 'data', filename);
  return JSON.parse(readFileSync(filePath, 'utf-8'));
}

const sampleReports = loadJSON('sampleReports.json');
const checklist = loadJSON('checklist.json');
const failureModes = loadJSON('failureModes.json');

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/checklist', (req, res) => {
  res.json(checklist);
});

app.get('/api/failure-modes', (req, res) => {
  res.json(failureModes);
});

app.get('/api/reports', (req, res) => {
  res.json(sampleReports);
});

app.get('/api/reports/:id', (req, res) => {
  const report = sampleReports.find(r => r.id === req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }
  res.json(report);
});

app.post('/api/generate-comment', async (req, res) => {
  try {
    const { category, keywords, voiceInput, equipment } = req.body;

    if (!category || !keywords || keywords.length === 0) {
      return res.status(400).json({ error: 'Category and keywords are required' });
    }

    const relevantFailureModes = failureModes.failureModes.filter(
      fm => fm.category === category
    );

    const matchingFailureMode = relevantFailureModes.find(fm =>
      keywords.some(kw => fm.keywords.includes(kw.toLowerCase()))
    );

    const historicalExamples = sampleReports
      .flatMap(report => report.issues)
      .filter(issue => issue.category === category)
      .slice(0, 3);

    const prompt = `You are an experienced field service technician writing a technical inspection comment. Generate a professional, detailed comment based on the following information:

EQUIPMENT: ${equipment || 'Industrial equipment'}
CATEGORY: ${category}
KEYWORDS: ${keywords.join(', ')}
${voiceInput ? `VOICE NOTE: "${voiceInput}"` : ''}

${matchingFailureMode ? `RELEVANT FAILURE MODE:
- Common Causes: ${matchingFailureMode.commonCauses.join(', ')}
- Standard Actions: ${matchingFailureMode.standardActions.join(', ')}
- Criticality Indicators: ${matchingFailureMode.criticalityIndicators.join(', ')}
` : ''}

EXAMPLE COMMENTS FROM SIMILAR INSPECTIONS:
${historicalExamples.map((ex, i) => `${i + 1}. ${ex.comment}`).join('\n')}

Generate a technical comment that:
1. Describes the issue found using the keywords provided
2. Includes specific technical details (measurements, observations)
3. Explains the action taken or recommended
4. Follows the professional tone and structure of the examples
5. Incorporates information from the voice note if provided
6. Is 3-5 sentences long
7. Uses past tense for actions taken

Write ONLY the comment text, no preamble or explanation.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const generatedComment = message.content[0].text;

    res.json({
      comment: generatedComment,
      keywords: keywords,
      category: category,
      confidence: matchingFailureMode ? 'high' : 'medium'
    });

  } catch (error) {
    console.error('Error generating comment:', error);
    res.status(500).json({
      error: 'Failed to generate comment',
      details: error.message
    });
  }
});

app.post('/api/analyze-report', async (req, res) => {
  try {
    const { reportId } = req.body;

    const report = sampleReports.find(r => r.id === reportId);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const allReports = sampleReports;
    const categoryGroups = {};

    allReports.forEach(r => {
      r.issues.forEach(issue => {
        if (!categoryGroups[issue.category]) {
          categoryGroups[issue.category] = [];
        }
        categoryGroups[issue.category].push({
          reportId: r.id,
          severity: issue.severity,
          keywords: issue.keywords
        });
      });
    });

    const prompt = `You are analyzing equipment inspection reports to identify patterns and provide engineering insights.

CURRENT REPORT: ${report.id}
Equipment: ${report.equipment}
Issues found: ${report.issues.length}
${report.issues.map(i => `- ${i.category} (${i.severity}): ${i.keywords.join(', ')}`).join('\n')}

HISTORICAL DATA ACROSS ALL REPORTS:
${Object.entries(categoryGroups).map(([cat, issues]) =>
  `${cat}: ${issues.length} occurrences, ${issues.filter(i => i.severity === 'critical' || i.severity === 'high').length} high/critical`
).join('\n')}

Provide analysis in this exact JSON format:
{
  "repeatingIssues": [
    {
      "pattern": "brief description of pattern",
      "frequency": "how often it appears",
      "recommendation": "proactive action to take"
    }
  ],
  "correlatedIssues": [
    {
      "primary": "main issue category",
      "secondary": "related issue category",
      "insight": "explanation of correlation"
    }
  ],
  "criticalFlags": [
    {
      "issue": "description of critical issue",
      "urgency": "immediate/urgent/monitor",
      "reasoning": "why this is flagged"
    }
  ],
  "overallRisk": "low/medium/high",
  "summary": "2-3 sentence executive summary"
}

Return ONLY valid JSON, no markdown formatting or explanation.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    let analysis;
    try {
      const responseText = message.content[0].text.trim();
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      analysis = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    } catch (parseError) {
      analysis = {
        repeatingIssues: [],
        correlatedIssues: [],
        criticalFlags: [],
        overallRisk: 'medium',
        summary: 'Analysis generated successfully'
      };
    }

    res.json({
      reportId: report.id,
      analysis: analysis
    });

  } catch (error) {
    console.error('Error analyzing report:', error);
    res.status(500).json({
      error: 'Failed to analyze report',
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Loaded ${sampleReports.length} sample reports`);
  console.log(`✅ Checklist with ${checklist.categories.length} categories`);
  console.log(`🔧 Failure mode library with ${failureModes.failureModes.length} patterns`);
});
