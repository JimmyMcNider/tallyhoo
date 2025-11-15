import { useState } from 'react'
import { BarChart3, Eye, Edit3, Check, X, AlertCircle, Play, Volume2 } from 'lucide-react'

export default function SessionReview({ courses, selectedCourse }) {
  const [selectedCourseId, setSelectedCourseId] = useState(selectedCourse?.id || '')
  const [selectedSession, setSelectedSession] = useState(null)
  const [editingScore, setEditingScore] = useState(null)
  const [tempScore, setTempScore] = useState('')

  // Mock sessions data
  const mockSessions = [
    {
      id: 1,
      name: 'Strategic Management - Week 3',
      date: '2024-11-14',
      duration: 75,
      status: 'processed',
      confidence: 0.87,
      studentsAnalyzed: 42,
      totalEvents: 156
    },
    {
      id: 2,
      name: 'Case Discussion - Market Entry',
      date: '2024-11-12',
      duration: 90,
      status: 'review_needed',
      confidence: 0.72,
      studentsAnalyzed: 38,
      totalEvents: 134
    }
  ]

  // Mock student participation data
  const mockStudentData = [
    {
      id: 1,
      name: 'John Smith',
      participationEvents: 8,
      aiScore: 85,
      confidence: 0.92,
      quality: 'High',
      frequency: 'Optimal',
      flagged: false,
      contributions: [
        { type: 'Analytical Question', text: 'How does this strategy align with Porter\'s five forces?', timestamp: '00:12:34', confidence: 0.95 },
        { type: 'Building on Others', text: 'I agree with Sarah\'s point, and I\'d add that market timing is crucial here.', timestamp: '00:23:16', confidence: 0.89 }
      ]
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      participationEvents: 12,
      aiScore: 92,
      confidence: 0.88,
      quality: 'High',
      frequency: 'High',
      flagged: true,
      flagReason: 'Potential over-participation',
      contributions: [
        { type: 'New Insight', text: 'The cultural factors in this market are often overlooked in traditional analysis.', timestamp: '00:08:22', confidence: 0.94 },
        { type: 'Challenge/Disagreement', text: 'I\'m not sure I agree with that conclusion based on the data presented.', timestamp: '00:45:12', confidence: 0.82 }
      ]
    },
    {
      id: 3,
      name: 'Michael Chen',
      participationEvents: 2,
      aiScore: 45,
      confidence: 0.65,
      quality: 'Medium',
      frequency: 'Low',
      flagged: true,
      flagReason: 'Low confidence in speaker identification',
      contributions: [
        { type: 'Clarifying Question', text: 'Could you explain that concept again?', timestamp: '00:32:18', confidence: 0.71 }
      ]
    }
  ]

  const handleScoreEdit = (studentId, currentScore) => {
    setEditingScore(studentId)
    setTempScore(currentScore.toString())
  }

  const handleScoreSave = (studentId) => {
    // In real app, save to backend
    console.log(`Updating score for student ${studentId} to ${tempScore}`)
    setEditingScore(null)
    setTempScore('')
  }

  const handleScoreCancel = () => {
    setEditingScore(null)
    setTempScore('')
  }

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800'
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Review & Approval</h2>
        <p className="text-gray-600">
          Review AI-generated participation scores and approve final grades.
        </p>
      </div>

      {/* Course Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Course
        </label>
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Choose a course...</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name} ({course.term})
            </option>
          ))}
        </select>
      </div>

      {selectedCourseId && (
        <>
          {/* Sessions List */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Processed Sessions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockSessions.map((session) => (
                <div
                  key={session.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedSession?.id === session.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedSession(session)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{session.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      session.status === 'processed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {session.status === 'processed' ? 'Ready' : 'Review Needed'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{session.date} • {session.duration} min</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{session.studentsAnalyzed} students</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getConfidenceColor(session.confidence)}`}>
                      {Math.round(session.confidence * 100)}% confidence
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Scores Table */}
          {selectedSession && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Student Participation Scores - {selectedSession.name}
                </h3>
                <div className="flex space-x-2">
                  <button className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
                    Approve All
                  </button>
                  <button className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm">
                    Export CSV
                  </button>
                </div>
              </div>

              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Events
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        AI Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Confidence
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quality
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockStudentData.map((student) => (
                      <tr key={student.id} className={student.flagged ? 'bg-yellow-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {student.name}
                                {student.flagged && (
                                  <AlertCircle className="h-4 w-4 text-yellow-500 inline ml-2" />
                                )}
                              </div>
                              {student.flagged && (
                                <div className="text-xs text-yellow-600">{student.flagReason}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.participationEvents}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingScore === student.id ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                value={tempScore}
                                onChange={(e) => setTempScore(e.target.value)}
                                className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                                min="0"
                                max="100"
                              />
                              <button
                                onClick={() => handleScoreSave(student.id)}
                                className="text-green-600 hover:text-green-800"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={handleScoreCancel}
                                className="text-red-600 hover:text-red-800"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <span className={`text-sm font-medium ${getScoreColor(student.aiScore)}`}>
                                {student.aiScore}
                              </span>
                              <button
                                onClick={() => handleScoreEdit(student.id, student.aiScore)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${getConfidenceColor(student.confidence)}`}>
                            {Math.round(student.confidence * 100)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div>Quality: {student.quality}</div>
                            <div className="text-xs text-gray-500">Frequency: {student.frequency}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            <Eye className="h-4 w-4 inline" /> Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Session Summary */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{selectedSession.studentsAnalyzed}</div>
                  <div className="text-sm text-gray-600">Students Analyzed</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{selectedSession.totalEvents}</div>
                  <div className="text-sm text-gray-600">Total Events</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {mockStudentData.filter(s => s.flagged).length}
                  </div>
                  <div className="text-sm text-gray-600">Flagged Students</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round(selectedSession.confidence * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Avg Confidence</div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}