import { useState } from 'react'
import { Upload, Download, Users, Check, AlertCircle } from 'lucide-react'

export default function RosterUpload({ courses, selectedCourse }) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [students, setStudents] = useState([])
  const [uploadStatus, setUploadStatus] = useState(null)
  const [selectedCourseId, setSelectedCourseId] = useState(selectedCourse?.id || '')

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setUploadStatus({ type: 'error', message: 'Please upload a CSV file' })
      return
    }

    setUploadedFile(file)
    
    // Mock CSV parsing - in real app, you'd parse the actual file
    const mockStudents = [
      { id: 1, name: 'John Smith', email: 'john.smith@email.com', studentId: 'STU001' },
      { id: 2, name: 'Sarah Johnson', email: 'sarah.j@email.com', studentId: 'STU002' },
      { id: 3, name: 'Michael Chen', email: 'm.chen@email.com', studentId: 'STU003' },
      { id: 4, name: 'Emily Davis', email: 'emily.davis@email.com', studentId: 'STU004' },
      { id: 5, name: 'David Wilson', email: 'd.wilson@email.com', studentId: 'STU005' }
    ]
    
    setStudents(mockStudents)
    setUploadStatus({ type: 'success', message: `Successfully parsed ${mockStudents.length} students` })
  }

  const handleUploadRoster = () => {
    if (!selectedCourseId) {
      setUploadStatus({ type: 'error', message: 'Please select a course first' })
      return
    }

    // Mock upload process
    setTimeout(() => {
      setUploadStatus({ type: 'success', message: 'Roster uploaded successfully!' })
    }, 1000)
  }

  const downloadTemplate = () => {
    const csvContent = 'Name,Email,Student ID\nJohn Smith,john.smith@email.com,STU001\nSarah Johnson,sarah.j@email.com,STU002'
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'roster-template.csv'
    a.click()
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Student Roster</h2>
        <p className="text-gray-600">
          Upload a CSV file with your student list to enable participation tracking.
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

      {/* Template Download */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-medium text-blue-900 mb-2">CSV Format Requirements</h3>
        <p className="text-blue-800 mb-3">
          Your CSV should include columns for: Name, Email, Student ID
        </p>
        <button
          onClick={downloadTemplate}
          className="inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm leading-4 font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Template
        </button>
      </div>

      {/* File Upload */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          Drop your CSV file here, or click to browse
        </p>
        <p className="text-gray-600 mb-4">Supports CSV files up to 10MB</p>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
        >
          Choose File
        </label>
      </div>

      {/* Upload Status */}
      {uploadStatus && (
        <div className={`mt-4 p-4 rounded-md ${
          uploadStatus.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'
        }`}>
          <div className="flex items-center">
            {uploadStatus.type === 'error' ? (
              <AlertCircle className="h-5 w-5 mr-2" />
            ) : (
              <Check className="h-5 w-5 mr-2" />
            )}
            {uploadStatus.message}
          </div>
        </div>
      )}

      {/* Preview */}
      {students.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Preview Students</h3>
          <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-sm font-medium text-gray-700">Name</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-700">Email</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-700">Student ID</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b border-gray-100">
                    <td className="py-2 text-sm text-gray-900">{student.name}</td>
                    <td className="py-2 text-sm text-gray-600">{student.email}</td>
                    <td className="py-2 text-sm text-gray-600">{student.studentId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              <Users className="h-4 w-4 inline mr-1" />
              {students.length} students ready to upload
            </p>
            <button
              onClick={handleUploadRoster}
              disabled={!selectedCourseId}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Upload Roster
            </button>
          </div>
        </div>
      )}
    </div>
  )
}