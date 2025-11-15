import { useState } from 'react'
import { Upload, FileAudio, Calendar, Clock, AlertCircle, Check, Play, Pause } from 'lucide-react'

export default function AudioUpload({ courses, selectedCourse }) {
  const [selectedCourseId, setSelectedCourseId] = useState(selectedCourse?.id || '')
  const [sessionDetails, setSessionDetails] = useState({
    name: '',
    date: '',
    duration: '',
    notes: ''
  })
  const [uploadedAudio, setUploadedAudio] = useState(null)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [dragActive, setDragActive] = useState(false)

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
      handleAudioFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleAudioFile(e.target.files[0])
    }
  }

  const handleAudioFile = (file) => {
    const validTypes = ['audio/mp3', 'audio/wav', 'audio/m4a', 'audio/mpeg']
    if (!validTypes.includes(file.type)) {
      setUploadStatus({ type: 'error', message: 'Please upload an audio file (MP3, WAV, or M4A)' })
      return
    }

    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      setUploadStatus({ type: 'error', message: 'File size must be less than 100MB' })
      return
    }

    setUploadedAudio(file)
    setUploadStatus({ type: 'success', message: `Audio file "${file.name}" ready for upload` })
  }

  const handleUploadAndProcess = async () => {
    if (!selectedCourseId || !uploadedAudio || !sessionDetails.name) {
      setUploadStatus({ 
        type: 'error', 
        message: 'Please select course, upload audio, and provide session name' 
      })
      return
    }

    setProcessing(true)
    setUploadStatus({ type: 'info', message: 'Processing audio... This may take a few minutes.' })

    // Mock processing steps
    const steps = [
      'Uploading audio file...',
      'Generating transcript...',
      'Identifying speakers...',
      'Analyzing participation...',
      'Computing scores...'
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setUploadStatus({ type: 'info', message: steps[i] })
    }

    // Final success
    setUploadStatus({ 
      type: 'success', 
      message: 'Session processed successfully! View results in Session Review.' 
    })
    setProcessing(false)
    
    // Reset form
    setUploadedAudio(null)
    setSessionDetails({ name: '', date: '', duration: '', notes: '' })
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Class Audio</h2>
        <p className="text-gray-600">
          Upload recorded class audio for AI-powered participation analysis.
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

      {/* Session Details */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Session Name *
          </label>
          <input
            type="text"
            value={sessionDetails.name}
            onChange={(e) => setSessionDetails({ ...sessionDetails, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Session 3 - Strategy Case Discussion"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            value={sessionDetails.date}
            onChange={(e) => setSessionDetails({ ...sessionDetails, date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (minutes)
          </label>
          <input
            type="number"
            value={sessionDetails.duration}
            onChange={(e) => setSessionDetails({ ...sessionDetails, duration: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="75"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Session Notes (optional)
        </label>
        <textarea
          value={sessionDetails.notes}
          onChange={(e) => setSessionDetails({ ...sessionDetails, notes: e.target.value })}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Any context that might help with analysis..."
        />
      </div>

      {/* Audio Upload */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors mb-6 ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <FileAudio className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          Drop your audio file here, or click to browse
        </p>
        <p className="text-gray-600 mb-4">
          Supports MP3, WAV, M4A files up to 100MB
        </p>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
          id="audio-upload"
        />
        <label
          htmlFor="audio-upload"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
        >
          Choose Audio File
        </label>
      </div>

      {/* Uploaded File Info */}
      {uploadedAudio && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{uploadedAudio.name}</p>
              <p className="text-sm text-gray-600">
                Size: {formatFileSize(uploadedAudio.size)} • Type: {uploadedAudio.type}
              </p>
            </div>
            <button
              onClick={() => setUploadedAudio(null)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Upload Status */}
      {uploadStatus && (
        <div className={`mb-6 p-4 rounded-md ${
          uploadStatus.type === 'error' 
            ? 'bg-red-50 text-red-800' 
            : uploadStatus.type === 'info'
            ? 'bg-blue-50 text-blue-800'
            : 'bg-green-50 text-green-800'
        }`}>
          <div className="flex items-center">
            {uploadStatus.type === 'error' ? (
              <AlertCircle className="h-5 w-5 mr-2" />
            ) : uploadStatus.type === 'info' ? (
              <Clock className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <Check className="h-5 w-5 mr-2" />
            )}
            {uploadStatus.message}
          </div>
        </div>
      )}

      {/* Processing Info */}
      <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
        <h3 className="text-lg font-medium text-yellow-900 mb-2">Processing Pipeline</h3>
        <p className="text-yellow-800 mb-3">
          Your audio will be processed through the following steps:
        </p>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Speech-to-text transcription</li>
          <li>• Speaker identification and diarization</li>
          <li>• Participation event classification</li>
          <li>• Quality assessment and scoring</li>
          <li>• Confidence analysis</li>
        </ul>
      </div>

      {/* Upload Button */}
      <div className="flex justify-end">
        <button
          onClick={handleUploadAndProcess}
          disabled={processing || !selectedCourseId || !uploadedAudio || !sessionDetails.name}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
        >
          {processing ? (
            <>
              <Clock className="h-5 w-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="h-5 w-5 mr-2" />
              Upload & Process Audio
            </>
          )}
        </button>
      </div>
    </div>
  )
}