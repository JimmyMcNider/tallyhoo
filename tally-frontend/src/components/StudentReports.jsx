import { useState } from 'react'
import { Send, FileText, Download, Users, TrendingUp, MessageSquare, Star } from 'lucide-react'

export default function StudentReports({ courses, selectedCourse }) {
  const [selectedCourseId, setSelectedCourseId] = useState(selectedCourse?.id || '')
  const [reportType, setReportType] = useState('individual')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [emailStatus, setEmailStatus] = useState(null)

  // Mock students with aggregated data
  const mockStudents = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      overallScore: 85,
      trend: 'improving',
      sessionsAttended: 12,
      totalContributions: 89,
      strongSuits: ['Analytical thinking', 'Building on others\' ideas'],
      improvementAreas: ['Voice projection', 'Frequency of participation'],
      lastReportSent: '2024-10-15'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      overallScore: 92,
      trend: 'stable',
      sessionsAttended: 12,
      totalContributions: 134,
      strongSuits: ['Original insights', 'Challenging assumptions'],
      improvementAreas: ['Allowing others space to contribute'],
      lastReportSent: '2024-10-15'
    },
    {
      id: 3,
      name: 'Michael Chen',
      email: 'm.chen@email.com',
      overallScore: 68,
      trend: 'concerning',
      sessionsAttended: 11,
      totalContributions: 23,
      strongSuits: ['Thoughtful questions', 'Active listening'],
      improvementAreas: ['Speaking up more frequently', 'Confidence building'],
      lastReportSent: null
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      overallScore: 88,
      trend: 'improving',
      sessionsAttended: 12,
      totalContributions: 98,
      strongSuits: ['Synthesizing ideas', 'Practical applications'],
      improvementAreas: ['Challenging different viewpoints'],
      lastReportSent: '2024-10-15'
    }
  ]

  const generateIndividualReport = (student) => {
    return `
# Participation Report for ${student.name}

## Overall Performance
Your current participation score: **${student.overallScore}/100**

## Session Summary
- Sessions attended: ${student.sessionsAttended}
- Total contributions: ${student.totalContributions}
- Average contributions per session: ${Math.round(student.totalContributions / student.sessionsAttended)}

## Strengths
${student.strongSuits.map(strength => `- ${strength}`).join('\n')}

## Areas for Growth
${student.improvementAreas.map(area => `- ${area}`).join('\n')}

## Recommendations
Based on your participation pattern, we suggest:
${student.trend === 'improving' 
  ? '- Continue your positive momentum\n- Consider taking on more challenging discussion points'
  : student.trend === 'concerning'
  ? '- Aim to contribute at least 2-3 times per session\n- Prepare 1-2 questions or insights before class'
  : '- Maintain your excellent contribution level\n- Help facilitate others\' participation'
}

Your participation adds value to our class discussions. Keep up the great work!
    `.trim()
  }

  const handleSendReport = async (student) => {
    setEmailStatus({ type: 'sending', message: `Sending report to ${student.name}...` })
    
    // Mock email sending
    setTimeout(() => {
      setEmailStatus({ type: 'success', message: `Report sent successfully to ${student.email}` })
      setTimeout(() => setEmailStatus(null), 3000)
    }, 2000)
  }

  const handleSendAllReports = async () => {
    const studentsToSend = mockStudents.filter(s => !s.lastReportSent || reportType === 'all')
    setEmailStatus({ type: 'sending', message: `Sending reports to ${studentsToSend.length} students...` })
    
    setTimeout(() => {
      setEmailStatus({ type: 'success', message: `All reports sent successfully!` })
      setTimeout(() => setEmailStatus(null), 3000)
    }, 3000)
  }

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'stable':
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />
      case 'concerning':
        return <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />
      default:
        return null
    }
  }

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Reports</h2>
        <p className="text-gray-600">
          Generate and send participation feedback reports to students.
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
          {/* Report Options */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Report Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="individual"
                      checked={reportType === 'individual'}
                      onChange={(e) => setReportType(e.target.value)}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-sm">Individual Review & Send</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="batch"
                      checked={reportType === 'batch'}
                      onChange={(e) => setReportType(e.target.value)}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-sm">Batch Send All</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Email Status */}
          {emailStatus && (
            <div className={`mb-6 p-4 rounded-md ${
              emailStatus.type === 'sending' 
                ? 'bg-blue-50 text-blue-800'
                : 'bg-green-50 text-green-800'
            }`}>
              <div className="flex items-center">
                {emailStatus.type === 'sending' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                {emailStatus.message}
              </div>
            </div>
          )}

          {/* Batch Actions */}
          {reportType === 'batch' && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Batch Send Reports</h3>
                  <p className="text-sm text-gray-600">
                    Send participation reports to all students at once.
                  </p>
                </div>
                <button
                  onClick={handleSendAllReports}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send All Reports
                </button>
              </div>
            </div>
          )}

          {/* Students List */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Student Participation Summary</h3>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trend
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sessions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Report
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`text-sm font-medium ${getScoreColor(student.overallScore)}`}>
                          {student.overallScore}
                        </span>
                        <span className="text-gray-500 ml-1">/100</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTrendIcon(student.trend)}
                        <span className="ml-2 text-sm text-gray-600 capitalize">
                          {student.trend}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.sessionsAttended}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.lastReportSent || 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => setSelectedStudent(selectedStudent?.id === student.id ? null : student)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FileText className="h-4 w-4 inline mr-1" />
                        Preview
                      </button>
                      {reportType === 'individual' && (
                        <button
                          onClick={() => handleSendReport(student)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Send className="h-4 w-4 inline mr-1" />
                          Send
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Report Preview */}
          {selectedStudent && (
            <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Report Preview - {selectedStudent.name}
                </h3>
                <div className="space-x-2">
                  <button
                    onClick={() => handleSendReport(selectedStudent)}
                    className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Report
                  </button>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="inline-flex items-center px-3 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                  {generateIndividualReport(selectedStudent)}
                </pre>
              </div>
            </div>
          )}

          {/* Summary Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{mockStudents.length}</div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {mockStudents.filter(s => s.overallScore >= 85).length}
              </div>
              <div className="text-sm text-gray-600">High Performers</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {mockStudents.filter(s => s.overallScore >= 70 && s.overallScore < 85).length}
              </div>
              <div className="text-sm text-gray-600">Average Performers</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {mockStudents.filter(s => s.overallScore < 70).length}
              </div>
              <div className="text-sm text-gray-600">Need Support</div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}