import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

export default function ReportView() {
  const { id } = useParams()
  const [report, setReport] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    fetch(`/api/reports/${id}`)
      .then(res => res.json())
      .then(data => setReport(data))
      .catch(err => console.error('Error loading report:', err))
  }, [id])

  const generateAIInsights = async () => {
    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/analyze-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reportId: id })
      })

      const data = await response.json()
      setAnalysis(data.analysis)
    } catch (error) {
      console.error('Error generating insights:', error)
      alert('Failed to generate AI insights. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'immediate': return 'bg-red-100 text-red-800 border-red-300'
      case 'urgent': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'monitor': return 'bg-blue-100 text-blue-800 border-blue-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  if (!report) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading report...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="mb-6">
        <Link to="/portal" className="text-blue-600 hover:underline mb-2 inline-block">
          ← Back to Reports
        </Link>
        <h2 className="text-3xl font-bold text-gray-800">{report.id}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Equipment</div>
          <div className="text-lg font-bold text-gray-800">{report.equipment}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Technician</div>
          <div className="text-lg font-bold text-gray-800">{report.technician}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Date</div>
          <div className="text-lg font-bold text-gray-800">
            {new Date(report.date).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="text-sm text-gray-500">Location</div>
        <div className="text-lg font-medium text-gray-800">{report.location}</div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Issues Found ({report.issues.length})
        </h3>
        <div className="space-y-4">
          {report.issues.map((issue, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-gray-800">{issue.category}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(issue.severity)}`}>
                  {issue.severity.toUpperCase()}
                </span>
              </div>
              <p className="text-gray-700 mb-3 leading-relaxed">{issue.comment}</p>
              <div className="flex flex-wrap gap-2">
                {issue.keywords.map((keyword, kidx) => (
                  <span
                    key={kidx}
                    className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {!analysis && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">AI-Powered Engineering Insights</h3>
          <p className="text-gray-600 mb-4">
            Get AI-generated analysis including pattern detection, correlated issues, and critical flags.
          </p>
          <button
            onClick={generateAIInsights}
            disabled={isAnalyzing}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isAnalyzing ? '🤖 Analyzing Report...' : '✨ Generate AI Insights (Secondary Wow!)'}
          </button>
        </div>
      )}

      {analysis && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-lg p-6 border-2 border-purple-300">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-gray-800">AI Engineering Insights</h3>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                WOW! 🎉
              </span>
            </div>

            <div className="bg-white rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-medium text-gray-600">Overall Risk Assessment:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getRiskColor(analysis.overallRisk)}`}>
                  {analysis.overallRisk.toUpperCase()}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
            </div>

            {analysis.criticalFlags && analysis.criticalFlags.length > 0 && (
              <div className="bg-white rounded-lg p-4 mb-4">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  🚨 Critical Flags
                </h4>
                <div className="space-y-3">
                  {analysis.criticalFlags.map((flag, idx) => (
                    <div key={idx} className="border-l-4 border-red-500 pl-4 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getUrgencyColor(flag.urgency)}`}>
                          {flag.urgency}
                        </span>
                        <span className="font-medium text-gray-800">{flag.issue}</span>
                      </div>
                      <p className="text-sm text-gray-600">{flag.reasoning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.repeatingIssues && analysis.repeatingIssues.length > 0 && (
              <div className="bg-white rounded-lg p-4 mb-4">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  🔄 Repeating Patterns Detected
                </h4>
                <div className="space-y-3">
                  {analysis.repeatingIssues.map((pattern, idx) => (
                    <div key={idx} className="border border-gray-200 rounded p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-gray-800">{pattern.pattern}</span>
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                          {pattern.frequency}
                        </span>
                      </div>
                      <p className="text-sm text-blue-700">
                        <strong>Recommendation:</strong> {pattern.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.correlatedIssues && analysis.correlatedIssues.length > 0 && (
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  🔗 Correlated Issues
                </h4>
                <div className="space-y-3">
                  {analysis.correlatedIssues.map((corr, idx) => (
                    <div key={idx} className="border border-gray-200 rounded p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                          {corr.primary}
                        </span>
                        <span className="text-gray-400">↔</span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                          {corr.secondary}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{corr.insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
