import { useState, useEffect } from 'react'

const PREDEFINED_KEYWORDS = {
  'Cooling System': ['refrigerant', 'leak', 'pressure', 'compressor', 'condenser', 'evaporator', 'charge', 'performance'],
  'Mechanical': ['bearing', 'vibration', 'noise', 'alignment', 'lubrication', 'wear', 'valve', 'pump'],
  'Electrical': ['wiring', 'corrosion', 'connection', 'overheating', 'voltage', 'resistance', 'insulation', 'ground'],
  'Safety': ['guard', 'missing', 'damaged', 'hazard', 'barrier', 'emergency', 'lockout', 'signage'],
  'Controls': ['sensor', 'calibration', 'reading', 'parameter', 'alarm', 'setpoint', 'response', 'configuration'],
  'Filtration': ['filter', 'dirty', 'clogged', 'pressure', 'replacement', 'bypass', 'element', 'housing'],
  'Water Treatment': ['water', 'quality', 'pH', 'treatment', 'chemical', 'scale', 'corrosion', 'conductivity'],
  'Structural': ['corrosion', 'frame', 'mounting', 'support', 'crack', 'deterioration', 'seal', 'weatherproofing'],
  'Belt System': ['belt', 'alignment', 'tracking', 'tension', 'pulley', 'slippage', 'wear'],
  'Lubrication': ['oil', 'level', 'low', 'contamination', 'grease', 'leak', 'seal'],
  'Heat Transfer': ['fouling', 'efficiency', 'scale', 'cleaning', 'temperature', 'delta-T'],
  'Combustion': ['flame', 'sensor', 'ignition', 'shutdown', 'burner', 'gas', 'fuel']
}

export default function FieldInterface() {
  const [checklist, setChecklist] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedKeywords, setSelectedKeywords] = useState([])
  const [voiceInput, setVoiceInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [generatedComment, setGeneratedComment] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [equipment, setEquipment] = useState('')
  const [savedIssues, setSavedIssues] = useState([])
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    fetch('/api/checklist')
      .then(res => res.json())
      .then(data => setChecklist(data.categories))
      .catch(err => console.error('Error loading checklist:', err))
  }, [])

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice input not supported in this browser. Please use Chrome.')
      return
    }

    const recognition = new webkitSpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setVoiceInput(transcript)
      setIsListening(false)
    }

    recognition.onerror = () => {
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  const toggleKeyword = (keyword) => {
    setSelectedKeywords(prev =>
      prev.includes(keyword)
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    )
  }

  const generateComment = async () => {
    if (!selectedCategory || selectedKeywords.length === 0) {
      alert('Please select a category and at least one keyword')
      return
    }

    setIsGenerating(true)
    setGeneratedComment('')

    try {
      const response = await fetch('/api/generate-comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: selectedCategory,
          keywords: selectedKeywords,
          voiceInput: voiceInput,
          equipment: equipment
        })
      })

      const data = await response.json()
      setGeneratedComment(data.comment)
    } catch (error) {
      console.error('Error generating comment:', error)
      alert('Failed to generate comment. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const saveIssue = () => {
    if (!generatedComment || !selectedCategory) {
      alert('Please generate a comment first')
      return
    }

    const newIssue = {
      id: Date.now(),
      category: selectedCategory,
      keywords: selectedKeywords,
      comment: generatedComment,
      timestamp: new Date().toISOString()
    }

    setSavedIssues([...savedIssues, newIssue])

    setSelectedCategory('')
    setSelectedKeywords([])
    setVoiceInput('')
    setGeneratedComment('')

    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const currentKeywords = selectedCategory ? (PREDEFINED_KEYWORDS[selectedCategory] || []) : []

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {showSuccess && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Issue saved successfully!
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Field Inspection</h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Equipment ID/Name
          </label>
          <input
            type="text"
            value={equipment}
            onChange={(e) => setEquipment(e.target.value)}
            placeholder="e.g., HVAC Unit A-12"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Inspection Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value)
              setSelectedKeywords([])
              setGeneratedComment('')
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a category...</option>
            {checklist.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {selectedCategory && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Keywords (Primary Wow Moment)
            </label>
            <div className="flex flex-wrap gap-2">
              {currentKeywords.map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => toggleKeyword(keyword)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedKeywords.includes(keyword)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {keyword}
                </button>
              ))}
            </div>
            {selectedKeywords.length > 0 && (
              <div className="mt-2 text-sm text-blue-600">
                Selected: {selectedKeywords.join(', ')}
              </div>
            )}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Voice Input (Optional)
          </label>
          <div className="flex gap-2">
            <button
              onClick={startVoiceInput}
              disabled={isListening}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isListening
                  ? 'bg-red-500 text-white'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isListening ? '🎤 Listening...' : '🎤 Start Voice Input'}
            </button>
          </div>
          {voiceInput && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Voice note:</span> "{voiceInput}"
              </p>
            </div>
          )}
        </div>

        <button
          onClick={generateComment}
          disabled={isGenerating || !selectedCategory || selectedKeywords.length === 0}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? '🤖 Generating AI Comment...' : '✨ Generate AI Comment'}
        </button>
      </div>

      {generatedComment && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-2 border-green-500">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-gray-800">AI-Generated Comment</h3>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              WOW! 🎉
            </span>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-gray-800 leading-relaxed">{generatedComment}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={saveIssue}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              ✓ Save Issue
            </button>
            <button
              onClick={generateComment}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              🔄 Regenerate
            </button>
          </div>
        </div>
      )}

      {savedIssues.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Saved Issues ({savedIssues.length})
          </h3>
          <div className="space-y-3">
            {savedIssues.map((issue) => (
              <div key={issue.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-blue-600">{issue.category}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(issue.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{issue.comment}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {issue.keywords.map(kw => (
                    <span key={kw} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
