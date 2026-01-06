import { Routes, Route, Link } from 'react-router-dom'
import FieldInterface from './pages/FieldInterface'
import WebPortal from './pages/WebPortal'
import ReportView from './pages/ReportView'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Field Inspection Assistant</h1>
            <div className="space-x-4">
              <Link to="/" className="hover:underline">Field</Link>
              <Link to="/portal" className="hover:underline">Portal</Link>
            </div>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<FieldInterface />} />
        <Route path="/portal" element={<WebPortal />} />
        <Route path="/report/:id" element={<ReportView />} />
      </Routes>
    </div>
  )
}

export default App
