import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function WebPortal() {
  const [reports, setReports] = useState([])
  const [uploadStatus, setUploadStatus] = useState('')

  useEffect(() => {
    fetch('/api/reports')
      .then(res => res.json())
      .then(data => setReports(data))
      .catch(err => console.error('Error loading reports:', err))
  }, [])

  const handleUpload = () => {
    setUploadStatus('✅ 10 historical reports uploaded successfully!')
    setTimeout(() => setUploadStatus(''), 5000)
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

  const getHighestSeverity = (issues) => {
    const severityOrder = ['critical', 'high', 'medium', 'low']
    for (const severity of severityOrder) {
      if (issues.some(issue => issue.severity === severity)) {
        return severity
      }
    }
    return 'low'
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Inspection Reports Portal</h2>
        <p className="text-gray-600">
          Upload historical reports to train the AI, or view existing inspection reports with AI-generated insights.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Upload Historical Reports</h3>
        <p className="text-gray-600 mb-4">
          Upload past inspection reports to automatically generate checklists and failure mode libraries.
        </p>

        <div className="flex items-center gap-4">
          <button
            onClick={handleUpload}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            📁 Upload Reports (Demo)
          </button>
          {uploadStatus && (
            <span className="text-green-600 font-medium">{uploadStatus}</span>
          )}
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Demo Note:</strong> In production, this would analyze uploaded PDFs/documents and automatically
            generate the inspection checklist and failure mode library using Claude AI.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Recent Inspection Reports ({reports.length})
        </h3>

        <div className="space-y-3">
          {reports.map((report) => {
            const highestSeverity = getHighestSeverity(report.issues)
            return (
              <Link
                key={report.id}
                to={`/report/${report.id}`}
                className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow hover:border-blue-300"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-lg text-gray-800">{report.id}</h4>
                    <p className="text-sm text-gray-600">{report.equipment}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(highestSeverity)}`}>
                    {highestSeverity.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-gray-500">Technician:</span>{' '}
                    <span className="text-gray-800 font-medium">{report.technician}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Date:</span>{' '}
                    <span className="text-gray-800 font-medium">
                      {new Date(report.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Location:</span>{' '}
                    <span className="text-gray-800 font-medium">{report.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {report.issues.map((issue, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 px-2 py-1 rounded border border-gray-200"
                      >
                        {issue.category}
                      </span>
                    ))}
                  </div>
                  <span className="text-blue-600 text-sm font-medium">
                    View Details →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        {reports.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No reports available. Upload historical reports to get started.
          </div>
        )}
      </div>
    </div>
  )
}
