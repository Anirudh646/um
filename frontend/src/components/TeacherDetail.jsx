import { useState, useEffect } from 'react'
import './TeacherDetail.css'

export default function TeacherDetail({ teacher, student, onBack }) {
  const [activeTab, setActiveTab] = useState('assignments')
  const [assignments, setAssignments] = useState([])
  const [attendance, setAttendance] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [quizzes, setQuizzes] = useState([])
  const [studyMaterials, setStudyMaterials] = useState([])
  const [questionPapers, setQuestionPapers] = useState([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    // Load data when component mounts
    loadAssignments()
    loadAttendance()
    loadQuizzes()
    loadStudyMaterials()
    loadQuestionPapers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teacher])

  const loadAssignments = async () => {
    // Mock assignments - in real app, fetch from API
    const mockAssignments = [
      { id: 1, title: 'Assignment 1: Basics', dueDate: '2025-11-15', status: 'pending', marks: null },
      { id: 2, title: 'Assignment 2: Advanced', dueDate: '2025-11-20', status: 'submitted', marks: 85 },
      { id: 3, title: 'Assignment 3: Final Project', dueDate: '2025-11-25', status: 'pending', marks: null }
    ]
    setAssignments(mockAssignments)
  }

  const loadAttendance = async () => {
    // Mock attendance - in real app, fetch from API
    const mockAttendance = [
      { date: '2025-11-01', status: 'present' },
      { date: '2025-11-02', status: 'present' },
      { date: '2025-11-03', status: 'absent' },
      { date: '2025-11-04', status: 'present' },
      { date: '2025-11-05', status: 'late' },
      { date: '2025-11-06', status: 'present' },
      { date: '2025-11-07', status: 'present' },
      { date: '2025-11-08', status: 'present' }
    ]
    setAttendance(mockAttendance)
  }

  const loadQuizzes = async () => {
    // Mock quizzes - only show if teacher created them
    const mockQuizzes = [
      { id: 1, title: 'Quiz 1: Mid Term', date: '2025-11-10', duration: 30, status: 'completed', score: 92 },
      { id: 2, title: 'Quiz 2: Final Assessment', date: '2025-11-18', duration: 45, status: 'available' }
    ]
    setQuizzes(mockQuizzes)
  }

  const loadStudyMaterials = async () => {
    // Mock study materials
    const mockMaterials = [
      { id: 1, title: 'Chapter 1 Notes', type: 'PDF', uploadDate: '2025-10-15' },
      { id: 2, title: 'Lecture Slides Week 1-4', type: 'PPT', uploadDate: '2025-10-20' },
      { id: 3, title: 'Reference Book Chapter 5', type: 'PDF', uploadDate: '2025-10-25' },
      { id: 4, title: 'Video Lecture Links', type: 'LINK', uploadDate: '2025-11-01' }
    ]
    setStudyMaterials(mockMaterials)
  }

  const loadQuestionPapers = async () => {
    // Mock previous year question papers
    const mockPapers = [
      { id: 1, year: '2024', semester: 'V', type: 'Mid Term', file: '/papers/2024-mid.pdf' },
      { id: 2, year: '2024', semester: 'V', type: 'Final', file: '/papers/2024-final.pdf' },
      { id: 3, year: '2023', semester: 'V', type: 'Mid Term', file: '/papers/2023-mid.pdf' },
      { id: 4, year: '2023', semester: 'V', type: 'Final', file: '/papers/2023-final.pdf' }
    ]
    setQuestionPapers(mockPapers)
  }

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    // Simulate upload
    setTimeout(() => {
      alert(`${file.name} uploaded successfully!`)
      setUploading(false)
      if (type === 'assignment') {
        loadAssignments()
      }
    }, 1500)
  }

  const getAttendanceForDate = (date) => {
    return attendance.find(a => a.date === date)
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'present': return '#10b981'
      case 'absent': return '#ef4444'
      case 'late': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  return (
    <div className="teacher-detail-page">
      <div className="teacher-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Dashboard
        </button>
        <div className="teacher-profile">
          <div className="teacher-avatar-large">
            <img 
              src={teacher.profilePicture} 
              alt={teacher.name}
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
            <div style={{ display: 'none', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0b4d2b 0%, #0a4225 100%)', color: '#fff', fontWeight: '700', fontSize: '48px' }}>
              {teacher.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
          <div className="teacher-info">
            <h1>{teacher.name}</h1>
            <p className="teacher-subject">{teacher.subject}</p>
            <p className="teacher-dept">{teacher.department} • {teacher.subjectCode}</p>
            <p className="teacher-email">{teacher.email}</p>
          </div>
        </div>
      </div>

      <div className="teacher-tabs">
        <button 
          className={`tab ${activeTab === 'assignments' ? 'active' : ''}`}
          onClick={() => setActiveTab('assignments')}
        >
          📝 Upload Assignment
        </button>
        <button 
          className={`tab ${activeTab === 'attendance' ? 'active' : ''}`}
          onClick={() => setActiveTab('attendance')}
        >
          ✅ Check Attendance
        </button>
        <button 
          className={`tab ${activeTab === 'papers' ? 'active' : ''}`}
          onClick={() => setActiveTab('papers')}
        >
          📄 Question Papers
        </button>
        <button 
          className={`tab ${activeTab === 'quizzes' ? 'active' : ''}`}
          onClick={() => setActiveTab('quizzes')}
        >
          ❓ Quizzes
        </button>
        <button 
          className={`tab ${activeTab === 'materials' ? 'active' : ''}`}
          onClick={() => setActiveTab('materials')}
        >
          📚 Study Materials
        </button>
      </div>

      <div className="teacher-content">
        {activeTab === 'assignments' && (
          <div className="tab-content">
            <h2>Upload Assignment</h2>
            <div className="assignments-section">
              <div className="upload-area">
                <h3>Submit New Assignment</h3>
                <div className="file-upload">
                  <input 
                    type="file" 
                    id="assignment-upload" 
                    onChange={(e) => handleFileUpload(e, 'assignment')}
                    accept=".pdf,.doc,.docx"
                    disabled={uploading}
                  />
                  <label htmlFor="assignment-upload" className={`upload-button ${uploading ? 'uploading' : ''}`}>
                    {uploading ? 'Uploading...' : 'Choose File to Upload'}
                  </label>
                </div>
              </div>

              <div className="assignments-list">
                <h3>Your Assignments</h3>
                {assignments.map(assignment => (
                  <div key={assignment.id} className="assignment-item">
                    <div className="assignment-info">
                      <h4>{assignment.title}</h4>
                      <p>Due Date: {assignment.dueDate}</p>
                      {assignment.marks && <p className="marks">Marks: {assignment.marks}/100</p>}
                    </div>
                    <div className="assignment-status">
                      <span className={`status-badge ${assignment.status}`}>
                        {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="tab-content">
            <h2>Attendance Records</h2>
            <div className="attendance-section">
              <div className="date-selector">
                <label>Select Date:</label>
                <input 
                  type="date" 
                  value={selectedDate} 
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <div className="attendance-status">
                {getAttendanceForDate(selectedDate) ? (
                  <div className="status-card" style={{ backgroundColor: `${getStatusColor(getAttendanceForDate(selectedDate).status)}20` }}>
                    <h3>Status for {selectedDate}</h3>
                    <div className="status-indicator" style={{ color: getStatusColor(getAttendanceForDate(selectedDate).status) }}>
                      <span className="status-icon">
                        {getAttendanceForDate(selectedDate).status === 'present' ? '✓' : 
                         getAttendanceForDate(selectedDate).status === 'absent' ? '✗' : '⚠'}
                      </span>
                      <span className="status-text">
                        {getAttendanceForDate(selectedDate).status.charAt(0).toUpperCase() + getAttendanceForDate(selectedDate).status.slice(1)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="status-card">
                    <p>No attendance record found for this date</p>
                  </div>
                )}
              </div>

              <div className="attendance-calendar">
                <h3>Recent Attendance</h3>
                <div className="calendar-grid">
                  {attendance.map(record => (
                    <div key={record.date} className="calendar-day" style={{ borderColor: getStatusColor(record.status) }}>
                      <div className="day-date">{new Date(record.date).getDate()}</div>
                      <div className="day-status" style={{ color: getStatusColor(record.status) }}>
                        {record.status.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'papers' && (
          <div className="tab-content">
            <h2>Previous Year Question Papers</h2>
            <div className="papers-section">
              {questionPapers.map(paper => (
                <div key={paper.id} className="paper-card">
                  <div className="paper-info">
                    <h4>{paper.type} - {paper.year}</h4>
                    <p>Semester {paper.semester}</p>
                  </div>
                  <button className="download-button" onClick={() => alert(`Downloading ${paper.type} ${paper.year}...`)}>
                    📥 Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'quizzes' && (
          <div className="tab-content">
            <h2>Quizzes</h2>
            <div className="quizzes-section">
              {quizzes.length > 0 ? (
                quizzes.map(quiz => (
                  <div key={quiz.id} className="quiz-card">
                    <div className="quiz-info">
                      <h4>{quiz.title}</h4>
                      <p>Date: {quiz.date} • Duration: {quiz.duration} minutes</p>
                      {quiz.score && <p className="quiz-score">Score: {quiz.score}/100</p>}
                    </div>
                    <div className="quiz-actions">
                      {quiz.status === 'available' ? (
                        <button className="start-quiz-button" onClick={() => alert('Starting quiz...')}>
                          Start Quiz
                        </button>
                      ) : (
                        <span className="quiz-status completed">Completed</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-quizzes">
                  <p>No quizzes available yet. Teacher hasn't created any quizzes.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="tab-content">
            <h2>Study Materials</h2>
            <div className="materials-section">
              {studyMaterials.map(material => (
                <div key={material.id} className="material-card">
                  <div className="material-icon">
                    {material.type === 'PDF' ? '📄' : material.type === 'PPT' ? '📊' : '🔗'}
                  </div>
                  <div className="material-info">
                    <h4>{material.title}</h4>
                    <p>Type: {material.type} • Uploaded: {material.uploadDate}</p>
                  </div>
                  <button className="download-button" onClick={() => alert(`Downloading ${material.title}...`)}>
                    📥 Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

