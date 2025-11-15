import { useState, useEffect } from 'react'
import { Upload, Users, FileAudio, BarChart3, LogOut, Plus } from 'lucide-react'
import CourseManagement from './CourseManagement'
import RosterUpload from './RosterUpload'
import AudioUpload from './AudioUpload'
import SessionReview from './SessionReview'
import StudentReports from './StudentReports'
import { supabase } from '../lib/supabase'

export default function Dashboard({ user, onSignOut }) {
  const [activeTab, setActiveTab] = useState('courses')
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [courses, setCourses] = useState([])

  useEffect(() => {
    // Mock courses for demo
    setCourses([
      { 
        id: 1, 
        name: 'Strategic Management MBA', 
        term: 'Fall 2024',
        students: 45,
        sessions: 12,
        lastSession: '2024-11-14'
      },
      { 
        id: 2, 
        name: 'Business Ethics', 
        term: 'Fall 2024',
        students: 32,
        sessions: 8,
        lastSession: '2024-11-13'
      }
    ])
  }, [])

  const tabs = [
    { id: 'courses', label: 'Courses', icon: Users },
    { id: 'roster', label: 'Upload Roster', icon: Upload },
    { id: 'audio', label: 'Upload Audio', icon: FileAudio },
    { id: 'review', label: 'Review Sessions', icon: BarChart3 },
    { id: 'reports', label: 'Student Reports', icon: FileAudio }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Tally</h1>
              <span className="ml-2 text-sm text-gray-500">Participation Grading</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user.email}</span>
              <button
                onClick={onSignOut}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <nav className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Navigation</h2>
                <ul className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <li key={tab.id}>
                        <button
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                            activeTab === tab.id
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <Icon className="h-5 w-5 mr-3" />
                          {tab.label}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow">
              {activeTab === 'courses' && (
                <CourseManagement 
                  courses={courses} 
                  setCourses={setCourses}
                  onSelectCourse={setSelectedCourse}
                />
              )}
              {activeTab === 'roster' && (
                <RosterUpload courses={courses} selectedCourse={selectedCourse} />
              )}
              {activeTab === 'audio' && (
                <AudioUpload courses={courses} selectedCourse={selectedCourse} />
              )}
              {activeTab === 'review' && (
                <SessionReview courses={courses} selectedCourse={selectedCourse} />
              )}
              {activeTab === 'reports' && (
                <StudentReports courses={courses} selectedCourse={selectedCourse} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}