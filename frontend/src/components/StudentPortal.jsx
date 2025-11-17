import { useState, useEffect } from 'react'
import './StudentPortal.css'
import { teachersData } from '../data/teachers.js'
import TeacherDetail from './TeacherDetail.jsx'
import { API_ENDPOINTS } from '../config/api.js'

export default function StudentPortal({ student, onLogout }) {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [notifications, setNotifications] = useState([])
  const [selectedTeacher, setSelectedTeacher] = useState(null)

  useEffect(() => {
    if (student) {
      // Generate notifications based on student data
      const generatedNotifications = []
      
      // Only check courses if they exist (for backward compatibility with old data structure)
      if (student.courses && Array.isArray(student.courses)) {
        const lowAttendanceCourses = student.courses.filter(c => c.attendance < 75)
        if (lowAttendanceCourses.length > 0) {
          generatedNotifications.push({
            id: 1,
            type: 'attendance',
            title: 'Shortage Of Attendance',
            message: `We have noticed a shortage of attendance, particularly in the following subjects: ${lowAttendanceCourses.map(c => c.name).join(', ')}. Please improve your attendance.`,
            timestamp: new Date().toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short', year: 'numeric' })
          })
        }
      }

      generatedNotifications.push({
        id: 2,
        type: 'assignment',
        title: 'New Assignment Posted',
        message: 'Assignment 3 for Python Programming has been posted. Deadline: 15 Nov 2025',
        timestamp: new Date(Date.now() - 86400000).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short', year: 'numeric' })
      })

      setNotifications(generatedNotifications)
    }
  }, [student])

  if (!student) {
    return (
      <div className="student-portal">
        <div className="portal-error">
          <p>No student data found. Please login again.</p>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardContent student={student} notifications={notifications} setSelectedTeacher={setSelectedTeacher} />
      case 'courses':
        return <CoursesContent student={student} />
      case 'attendance':
        return <AttendanceContent student={student} />
      case 'assignments':
        return <AssignmentsContent student={student} />
      case 'results':
        return <ResultsContent student={student} />
      case 'students':
        return <StudentsListContent />
      case 'profile':
        return <ProfileContent student={student} setStudent={(updatedStudent) => {
          // Update student in localStorage
          localStorage.setItem('student', JSON.stringify(updatedStudent))
          // Update parent component state if needed
          window.dispatchEvent(new CustomEvent('studentUpdated', { detail: updatedStudent }))
        }} />
      case 'timetable':
        return <TimetableContent student={student} />
      default:
        return <DashboardContent student={student} notifications={notifications} setSelectedTeacher={setSelectedTeacher} />
    }
  }

  // If teacher is selected, show teacher detail page
  if (selectedTeacher) {
    return (
      <TeacherDetail 
        teacher={selectedTeacher} 
        student={student}
        onBack={() => setSelectedTeacher(null)}
      />
    )
  }

  return (
    <div className="student-portal">
      <div className="portal-sidebar">
        <div className="sidebar-header">
          <h3>GLA University</h3>
          <p>Student Portal</p>
        </div>
        
        <div className="student-profile">
          <div className="profile-avatar">
            {student.name.charAt(0)}
          </div>
          <div className="profile-info">
            <p className="profile-name">{student.name}</p>
            <p className="profile-id">{student.id}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <h4>ACADEMIC</h4>
            <button 
              className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveSection('dashboard')}
            >
              <span>📊</span> Dashboard
            </button>
            <button 
              className={`nav-item ${activeSection === 'courses' ? 'active' : ''}`}
              onClick={() => setActiveSection('courses')}
            >
              <span>🚀</span> My Courses
            </button>
            <button 
              className={`nav-item ${activeSection === 'attendance' ? 'active' : ''}`}
              onClick={() => setActiveSection('attendance')}
            >
              <span>📋</span> Attendance
            </button>
            <button 
              className={`nav-item ${activeSection === 'timetable' ? 'active' : ''}`}
              onClick={() => setActiveSection('timetable')}
            >
              <span>📅</span> Timetable
            </button>
          </div>

          <div className="nav-section">
            <h4>EXAM</h4>
            <button 
              className={`nav-item ${activeSection === 'results' ? 'active' : ''}`}
              onClick={() => setActiveSection('results')}
            >
              <span>📊</span> View Result
            </button>
            <button className="nav-item">
              <span>📊</span> CPI Calculator
            </button>
            <button className="nav-item">
              <span>📋</span> Online Exam
            </button>
          </div>

          <div className="nav-section">
            <h4>PLACEMENT</h4>
            <button className="nav-item">
              <span>📊</span> My Drive
            </button>
            <button className="nav-item">
              <span>📄</span> Drive Questions
            </button>
            <button className="nav-item">
              <span>📄</span> Placement Profile
            </button>
          </div>

          <div className="nav-section">
            <h4>OTHER</h4>
            <button className="nav-item">
              <span>🚀</span> Library Account
            </button>
            <button className="nav-item">
              <span>📊</span> Notice Corner
            </button>
            <button className="nav-item">
              <span>📊</span> Event Calendar
            </button>
          </div>

          <div className="nav-section">
            <h4>PROFILE</h4>
            <button 
              className={`nav-item ${activeSection === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveSection('profile')}
            >
              <span>👤</span> My Profile
            </button>
          </div>

          <div className="nav-section">
            <h4>STUDENTS</h4>
            <button 
              className={`nav-item ${activeSection === 'students' ? 'active' : ''}`}
              onClick={() => setActiveSection('students')}
            >
              <span>👥</span> All Students
            </button>
          </div>
        </nav>

        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className="portal-content">
        <div className="content-header">
          <div className="header-left">
            <h2>{activeSection === 'dashboard' ? 'Dashboard' : activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h2>
            <p>{student.program} - Semester {student.semester}</p>
          </div>
          <div className="header-right">
            <div className="notifications-icon">
              🔔
              {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
            </div>
            <div className="user-info">
              <div className="user-avatar">{student.name.charAt(0)}</div>
              <div>
                <p className="user-name">{student.name}</p>
                <p className="user-id">{student.id}</p>
              </div>
            </div>
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  )
}

// Dashboard Content Component
function DashboardContent({ student, notifications, setSelectedTeacher }) {
  const [timetableDate, setTimetableDate] = useState(new Date().toISOString().split('T')[0])
  const { weekdays, timeSlots, courses, getTimetableForDay } = getTimetableData()
  
  const selectedDateObj = new Date(timetableDate)
  const selectedDay = selectedDateObj.getDay()
  const isWeekend = selectedDay === 0 || selectedDay === 6
  const dashboardTimetable = getTimetableForDay(selectedDay)
  
  return (
    <div className="dashboard-content">
      {notifications.length > 0 && (
        <div className="notifications-section">
          <div className="section-header">
            <h3>Notifications <span className="badge">{notifications.length}</span></h3>
            <button className="collapse-btn">Collapse</button>
          </div>
          <div className="notification-card">
            <h4>{notifications[0].title}</h4>
            <p className="notification-greeting">Dear {student.name.toUpperCase()},</p>
            <p className="notification-message">
              {notifications[0].message} <a href="#" className="read-more">Read more</a>
            </p>
            <p className="notification-time">Update On {notifications[0].timestamp}</p>
          </div>
        </div>
      )}

      <div className="dashboard-grid">
        <div className="dashboard-card timetable-card">
          <div className="dashboard-timetable-header">
            <h3>Class Timetable</h3>
            <div className="timetable-date-picker-small">
              <input
                type="date"
                value={timetableDate}
                onChange={(e) => setTimetableDate(e.target.value)}
                className="date-selector-small"
              />
            </div>
          </div>
          
          {isWeekend ? (
            <div className="timetable-preview holiday-preview">
              <div className="holiday-icon-small">🎉</div>
              <p className="holiday-text-small">Enjoy Your Holiday!</p>
              <p className="holiday-day-small">{weekdays[selectedDay]}</p>
            </div>
          ) : (
            <div className="timetable-preview">
              <div className="timetable-day-header">
                <span className="day-name">{weekdays[selectedDay]}</span>
                <span className="date-text">{selectedDateObj.toLocaleDateString()}</span>
              </div>
              <div className="timetable-schedule-list">
                {timeSlots.map((slot, index) => {
                  const scheduledClass = dashboardTimetable.find(cls => cls.time === slot.time)
                  if (!scheduledClass) return null
                  
                  return (
                    <div key={index} className="timetable-item">
                      <div className="timetable-time-badge">{slot.time}</div>
                      <div className="timetable-class-info">
                        <div className="timetable-course-name">{scheduledClass.course.name}</div>
                        <div className="timetable-course-details">
                          <span 
                            className="timetable-course-code" 
                            style={{ backgroundColor: scheduledClass.course.color }}
                          >
                            {scheduledClass.course.code}
                          </span>
                          <span className="timetable-instructor">{scheduledClass.course.instructor}</span>
                          <span className="timetable-room">{scheduledClass.room}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="dashboard-card attendance-card">
          <h3>Attendance Overview - All Subjects</h3>
          <div className="attendance-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {(() => {
              // Show attendance for all 10 teachers
              const allTeachersAttendance = teachersData.map(teacher => {
                // Check if student has courses data (for backward compatibility)
                const enrolledCourse = student.courses && Array.isArray(student.courses) 
                  ? student.courses.find(c => c.code === teacher.subjectCode || c.instructor === teacher.name)
                  : null
                if (enrolledCourse) {
                  return {
                    name: teacher.subject,
                    attendance: enrolledCourse.attendance,
                    enrolled: true
                  }
                } else {
                  // Mock attendance for display (will be replaced with real data from backend)
                  return {
                    name: teacher.subject,
                    attendance: Math.floor(Math.random() * 30) + 60,
                    enrolled: false
                  }
                }
              })

              return allTeachersAttendance.map((item, index) => {
                // Color coding: Below 75% = Red, 75-89% = Blue, Above 90% = Green
                let attendanceColor = '#ef4444' // Red (below 75%)
                if (item.attendance >= 90) {
                  attendanceColor = '#10b981' // Green (above 90%)
                } else if (item.attendance >= 75) {
                  attendanceColor = '#3b82f6' // Blue (75-89%)
                }
                return (
                  <div key={index} className="attendance-item" style={{ opacity: item.enrolled ? 1 : 0.7 }}>
                    <div className="attendance-course">
                      <span className="course-name">
                        {item.name}
                        {!item.enrolled && <span style={{ fontSize: '10px', color: '#999', marginLeft: '6px' }}>(N/E)</span>}
                      </span>
                      <span className="attendance-percent" style={{ color: attendanceColor }}>
                        {item.attendance.toFixed(2)}%
                      </span>
                    </div>
                    <div className="attendance-bar">
                      <div 
                        className="attendance-progress" 
                        style={{ width: `${item.attendance}%`, backgroundColor: attendanceColor }}
                      ></div>
                    </div>
                  </div>
                )
              })
            })()}
          </div>
        </div>
      </div>

      <div className="academic-details">
        <h3>Academic Details - Faculty ({teachersData.length} Teachers)</h3>
        <div className="courses-grid">
          {teachersData.map((teacher) => (
            <div 
              key={teacher.id} 
              className="course-card teacher-card"
              onClick={() => setSelectedTeacher(teacher)}
              style={{ cursor: 'pointer' }}
            >
              <div className="instructor-avatar">
                <img 
                  src={teacher.profilePicture} 
                  alt={teacher.name}
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <div style={{ display: 'none', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0b4d2b 0%, #0a4225 100%)', color: '#fff', fontWeight: '700', fontSize: '20px' }}>
                  {teacher.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
              <div className="course-info">
                <p className="course-code">{teacher.subjectCode}</p>
                <p className="course-name">{teacher.name}</p>
                <p className="instructor-name">Subject: {teacher.subject}</p>
                <span className="more-details" style={{ cursor: 'pointer' }}>View Details →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Courses Content Component
function CoursesContent({ student }) {
  // Get all teachers with their course data
  const getAllTeachersCourses = () => {
    return teachersData.map(teacher => {
      // Find if student is enrolled in this teacher's course
      const enrolledCourse = student.courses.find(c => c.code === teacher.subjectCode || c.instructor === teacher.name)
      
      if (enrolledCourse) {
        // Use actual data from student's enrolled course
        return {
          code: teacher.subjectCode,
          name: teacher.subject,
          instructor: teacher.name,
          attendance: enrolledCourse.attendance,
          totalCredits: enrolledCourse.totalCredits || 0,
          completedCredits: typeof enrolledCourse.completedCredits === 'string' 
            ? parseFloat(enrolledCourse.completedCredits) 
            : (enrolledCourse.completedCredits || 0),
          enrolled: true
        }
      } else {
        // Generate default data for non-enrolled courses
        const defaultCredits = teacher.subjectCode.startsWith('MATH') ? 3 : 
                              teacher.subjectCode.startsWith('DCS50') ? 4 : 3
        const defaultCompleted = defaultCredits * 0.7 // 70% completed
        const defaultAttendance = Math.floor(Math.random() * 25) + 70 // 70-95% attendance
        
        return {
          code: teacher.subjectCode,
          name: teacher.subject,
          instructor: teacher.name,
          attendance: defaultAttendance,
          totalCredits: defaultCredits,
          completedCredits: defaultCompleted,
          enrolled: false
        }
      }
    })
  }

  const allCourses = getAllTeachersCourses()

  // Calculate total credits summary for enrolled courses only
  const enrolledCourses = allCourses.filter(c => c.enrolled)
  const totalCredits = enrolledCourses.reduce((sum, course) => sum + (course.totalCredits || 0), 0)
  const completedCredits = enrolledCourses.reduce((sum, course) => sum + (course.completedCredits || 0), 0)
  const remainingCredits = totalCredits - completedCredits
  const completionPercentage = totalCredits > 0 ? (completedCredits / totalCredits * 100).toFixed(1) : 0

  return (
    <div className="courses-content">
      <h2>My Courses - All Subjects</h2>
      
      {/* Credits Summary (Enrolled courses only) */}
      <div className="credits-summary">
        <div className="summary-card total">
          <h3>Total Credits</h3>
          <p className="credits-value">{totalCredits}</p>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Enrolled Courses</p>
        </div>
        <div className="summary-card completed">
          <h3>Completed</h3>
          <p className="credits-value">{completedCredits.toFixed(1)}</p>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Enrolled Courses</p>
        </div>
        <div className="summary-card remaining">
          <h3>Remaining</h3>
          <p className="credits-value">{remainingCredits.toFixed(1)}</p>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Enrolled Courses</p>
        </div>
        <div className="summary-card progress">
          <h3>Progress</h3>
          <p className="credits-value">{completionPercentage}%</p>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Enrolled Courses</p>
        </div>
      </div>

      {/* Courses List - All 10 Teachers */}
      <div className="courses-list">
        <h3 style={{ marginBottom: '20px', color: '#0b4d2b' }}>All Subjects ({allCourses.length} Teachers)</h3>
        {allCourses.map((course, index) => {
          // Color coding: Below 75% = Red, 75-89% = Blue, Above 90% = Green
          let attendanceColor = '#ef4444' // Red (below 75%)
          if (course.attendance >= 90) {
            attendanceColor = '#10b981' // Green (above 90%)
          } else if (course.attendance >= 75) {
            attendanceColor = '#3b82f6' // Blue (75-89%)
          }

          // Calculate credits for this course
          const courseTotalCredits = course.totalCredits || 0
          const courseCompletedCredits = course.completedCredits || 0
          const courseRemainingCredits = courseTotalCredits - courseCompletedCredits
          const courseProgress = courseTotalCredits > 0 
            ? (courseCompletedCredits / courseTotalCredits * 100).toFixed(1) 
            : 0

          return (
            <div key={index} className="course-detail-card" style={{ opacity: course.enrolled ? 1 : 0.85 }}>
              <div className="course-header">
                <h3>
                  {course.name}
                  {!course.enrolled && <span style={{ fontSize: '12px', color: '#999', marginLeft: '8px', fontWeight: 'normal' }}>(Not Enrolled)</span>}
                </h3>
                <div className="course-code-badge">{course.code}</div>
              </div>
              
              <div className="course-details">
                <p><strong>Instructor:</strong> {course.instructor}</p>
                <p>
                  <strong>Attendance:</strong> 
                  <span style={{ color: attendanceColor, fontWeight: '700', marginLeft: '8px' }}>
                    {course.attendance.toFixed(2)}%
                  </span>
                </p>
              </div>

              <div className="credits-section">
                <h4>Credits Information</h4>
                <div className="credits-breakdown">
                  <div className="credit-item">
                    <span className="credit-label">Total Credits:</span>
                    <span className="credit-value">{courseTotalCredits}</span>
                  </div>
                  <div className="credit-item completed-credit">
                    <span className="credit-label">Completed:</span>
                    <span className="credit-value" style={{ color: '#10b981' }}>
                      {courseCompletedCredits.toFixed(1)}
                    </span>
                  </div>
                  <div className="credit-item remaining-credit">
                    <span className="credit-label">Remaining:</span>
                    <span className="credit-value" style={{ color: '#ef4444' }}>
                      {courseRemainingCredits.toFixed(1)}
                    </span>
                  </div>
                </div>
                
                {course.enrolled && (
                  <>
                    <div className="credits-progress-bar">
                      <div 
                        className="credits-progress-fill" 
                        style={{ 
                          width: `${courseProgress}%`,
                          backgroundColor: courseProgress >= 90 ? '#10b981' : courseProgress >= 75 ? '#3b82f6' : '#ef4444'
                        }}
                      ></div>
                    </div>
                    <p className="progress-text">{courseProgress}% Completed</p>
                  </>
                )}
                {!course.enrolled && (
                  <p style={{ textAlign: 'center', color: '#999', fontStyle: 'italic', marginTop: '8px' }}>
                    Not currently enrolled in this course
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Attendance Content Component
function AttendanceContent({ student }) {
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    if (student && student.id) {
      loadStudentAttendance()
      // Refresh every 30 seconds to check for new attendance
      const interval = setInterval(loadStudentAttendance, 30000)
      return () => clearInterval(interval)
    }
  }, [student])

  const loadStudentAttendance = async () => {
    if (!student || !student.id) return
    
    setLoading(true)
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/attendance/student/${student.id}?limit=100`)
      const data = await res.json()
      if (data.ok && Array.isArray(data.attendance)) {
        setAttendanceRecords(data.attendance)
        
        // Find the most recent attendance record
        if (data.attendance.length > 0) {
          const latest = data.attendance[0]
          setLastUpdated(latest.date)
        }
      }
    } catch (error) {
      console.error('Error loading attendance:', error)
    }
    setLoading(false)
  }

  // Calculate attendance percentage for each subject
  const getSubjectAttendance = () => {
    const subjectMap = {}
    
    attendanceRecords.forEach(record => {
      const subjectName = record.subject_name || 'Unknown'
      if (!subjectMap[subjectName]) {
        subjectMap[subjectName] = { present: 0, absent: 0, late: 0, total: 0 }
      }
      subjectMap[subjectName].total++
      if (record.status === 'present') {
        subjectMap[subjectName].present++
      } else if (record.status === 'absent') {
        subjectMap[subjectName].absent++
      } else if (record.status === 'late') {
        subjectMap[subjectName].late++
        // Late counts as present for percentage
        subjectMap[subjectName].present++
      }
    })

    // Combine with all teachers to show all subjects
    return teachersData.map(teacher => {
      const subjectName = teacher.subject
      const stats = subjectMap[subjectName] || { present: 0, total: 0 }
      const percentage = stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(2) : 0
      
      return {
        code: teacher.subjectCode,
        name: subjectName,
        instructor: teacher.name,
        attendance: parseFloat(percentage),
        enrolled: stats.total > 0,
        lastUpdated: lastUpdated
      }
    })
  }

  const allTeachersAttendance = getSubjectAttendance()

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not available'
    const date = new Date(dateStr)
    const today = new Date()
    const isToday = dateStr === today.toISOString().split('T')[0]
    
    if (isToday) {
      return 'Today'
    } else {
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    }
  }

  return (
    <div className="attendance-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Attendance Details - All Subjects ({allTeachersAttendance.length} Teachers)</h2>
        {lastUpdated && (
          <div style={{
            backgroundColor: '#dbeafe',
            color: '#1e40af',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            📅 Last Updated: {formatDate(lastUpdated)}
          </div>
        )}
      </div>
      
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading attendance data...</div>
      )}
      
      <div className="attendance-table">
        <table>
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Subject Name</th>
              <th>Subject Code</th>
              <th>Instructor Name</th>
              <th>Attendance %</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {allTeachersAttendance.map((subject, index) => {
              // Color coding: Below 75% = Red, 75-89% = Blue, Above 90% = Green
              let statusClass = 'warning' // Red (below 75%)
              let statusText = 'Low'
              if (subject.attendance >= 90) {
                statusClass = 'good' // Green (above 90%)
                statusText = 'Excellent'
              } else if (subject.attendance >= 75) {
                statusClass = 'good' // Blue (75-89%) - using good class but will style differently
                statusText = 'Good'
              }
              
              const attendanceColor = subject.attendance >= 90 ? '#10b981' : 
                                     subject.attendance >= 75 ? '#3b82f6' : '#ef4444'

              return (
                <tr key={index} style={{ opacity: subject.enrolled ? 1 : 0.85 }}>
                  <td style={{ fontWeight: '700', color: '#0b4d2b', textAlign: 'center' }}>
                    {index + 1}
                  </td>
                  <td>
                    <strong style={{ color: '#333' }}>{subject.name}</strong>
                    {!subject.enrolled && (
                      <span style={{ 
                        fontSize: '11px', 
                        color: '#999', 
                        marginLeft: '8px',
                        fontStyle: 'italic'
                      }}>
                        (Not Enrolled)
                      </span>
                    )}
                  </td>
                  <td>
                    <span style={{ 
                      background: '#0b4d2b', 
                      color: 'white', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontWeight: '700',
                      fontSize: '12px'
                    }}>
                      {subject.code}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: '600', color: '#333' }}>{subject.instructor}</span>
                    </div>
                  </td>
                  <td style={{ 
                    color: attendanceColor,
                    fontWeight: '700',
                    fontSize: '16px'
                  }}>
                    {subject.attendance.toFixed(2)}%
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span className={`status-badge ${statusClass}`} style={{
                        backgroundColor: attendanceColor,
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: 'white'
                      }}>
                        {statusText}
                      </span>
                      {subject.enrolled && subject.lastUpdated && (
                        <span style={{ fontSize: '11px', color: '#666', fontStyle: 'italic' }}>
                          Updated: {formatDate(subject.lastUpdated)}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Students List Content Component
function StudentsListContent() {
  return (
    <div className="students-list-content">
      <h2>All Students - Complete Database ({studentsData.length} Students)</h2>
      
      <div className="students-table-wrapper">
        <div className="students-table">
          <table>
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Program</th>
                <th>Semester</th>
                <th>Batch</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {studentsData.map((student, index) => (
                <tr key={student.id}>
                  <td style={{ fontWeight: '700', color: '#0b4d2b', textAlign: 'center' }}>
                    {index + 1}
                  </td>
                  <td>
                    <strong style={{ 
                      color: '#0b4d2b',
                      fontSize: '14px',
                      fontWeight: '700'
                    }}>
                      {student.id}
                    </strong>
                  </td>
                  <td>
                    <strong style={{ color: '#333', fontSize: '14px' }}>
                      {student.name}
                    </strong>
                  </td>
                  <td style={{ color: '#666', fontSize: '13px' }}>
                    {student.program}
                  </td>
                  <td style={{ 
                    textAlign: 'center',
                    background: '#f0f9f4',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontWeight: '600',
                    color: '#0b4d2b'
                  }}>
                    {student.semester}
                  </td>
                  <td style={{ 
                    textAlign: 'center',
                    background: '#fff7ed',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontWeight: '600',
                    color: '#ea580c'
                  }}>
                    {student.batch}
                  </td>
                  <td style={{ color: '#666', fontSize: '12px' }}>
                    {student.email}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Profile Content Component
function ProfileContent({ student, setStudent }) {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: student.name || '',
    email: student.email || '',
    phone: student.phone || '',
    address: student.address || '',
    dateOfBirth: student.dateOfBirth || '',
    parentName: student.parentName || '',
    parentPhone: student.parentPhone || '',
    bloodGroup: student.bloodGroup || '',
    profileImage: student.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=0b4d2b&color=fff&size=200`
  })
  const [profileImageFile, setProfileImageFile] = useState(null)
  const [profileImagePreview, setProfileImagePreview] = useState(profileData.profileImage)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImagePreview(reader.result)
        setProfileData(prev => ({
          ...prev,
          profileImage: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    // Update student data
    const updatedStudent = {
      ...student,
      ...profileData
    }
    setStudent(updatedStudent)
    setIsEditing(false)
    alert('Profile updated successfully!')
  }

  const handleCancel = () => {
    // Reset to original data
    setProfileData({
      name: student.name || '',
      email: student.email || '',
      phone: student.phone || '',
      address: student.address || '',
      dateOfBirth: student.dateOfBirth || '',
      parentName: student.parentName || '',
      parentPhone: student.parentPhone || '',
      bloodGroup: student.bloodGroup || '',
      profileImage: student.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=0b4d2b&color=fff&size=200`
    })
    setProfileImagePreview(profileData.profileImage)
    setIsEditing(false)
  }

  return (
    <div className="profile-content">
      <div className="profile-header">
        <h2>My Profile</h2>
        {!isEditing ? (
          <button className="btn-edit-profile" onClick={() => setIsEditing(true)}>
            ✏️ Edit Profile
          </button>
        ) : (
          <div className="profile-actions">
            <button className="btn-save-profile" onClick={handleSave}>
              💾 Save Changes
            </button>
            <button className="btn-cancel-profile" onClick={handleCancel}>
              ❌ Cancel
            </button>
          </div>
        )}
      </div>

      <div className="profile-container">
        <div className="profile-left">
          <div className="profile-image-section">
            <div className="profile-image-wrapper">
              <img 
                src={profileImagePreview} 
                alt={student.name}
                className="profile-main-image"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=0b4d2b&color=fff&size=200`
                }}
              />
              {isEditing && (
                <label className="profile-image-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  <span>📷 Change Photo</span>
                </label>
              )}
            </div>
            <div className="profile-id-badge">
              <strong>Student ID:</strong> {student.id}
            </div>
          </div>
        </div>

        <div className="profile-right">
          <div className="profile-details">
            <div className="profile-section">
              <h3>Personal Information</h3>
              <div className="profile-grid">
                <div className="profile-field">
                  <label>Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      className="profile-input"
                    />
                  ) : (
                    <div className="profile-value">{student.name}</div>
                  )}
                </div>

                <div className="profile-field">
                  <label>Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      className="profile-input"
                    />
                  ) : (
                    <div className="profile-value">{student.email}</div>
                  )}
                </div>

                <div className="profile-field">
                  <label>Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      className="profile-input"
                    />
                  ) : (
                    <div className="profile-value">{student.phone || 'Not provided'}</div>
                  )}
                </div>

                <div className="profile-field">
                  <label>Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={profileData.dateOfBirth}
                      onChange={handleInputChange}
                      className="profile-input"
                    />
                  ) : (
                    <div className="profile-value">{student.dateOfBirth || 'Not provided'}</div>
                  )}
                </div>

                <div className="profile-field">
                  <label>Blood Group</label>
                  {isEditing ? (
                    <select
                      name="bloodGroup"
                      value={profileData.bloodGroup}
                      onChange={handleInputChange}
                      className="profile-input"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  ) : (
                    <div className="profile-value">{student.bloodGroup || 'Not provided'}</div>
                  )}
                </div>

                <div className="profile-field profile-field-full">
                  <label>Address</label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your address"
                      className="profile-input"
                      rows="3"
                    />
                  ) : (
                    <div className="profile-value">{student.address || 'Not provided'}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h3>Academic Information</h3>
              <div className="profile-grid">
                <div className="profile-field">
                  <label>Program</label>
                  <div className="profile-value">{student.program}</div>
                </div>

                <div className="profile-field">
                  <label>Semester</label>
                  <div className="profile-value">{student.semester}</div>
                </div>

                <div className="profile-field">
                  <label>Batch</label>
                  <div className="profile-value">{student.batch}</div>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h3>Parent/Guardian Information</h3>
              <div className="profile-grid">
                <div className="profile-field">
                  <label>Parent/Guardian Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="parentName"
                      value={profileData.parentName}
                      onChange={handleInputChange}
                      placeholder="Enter parent/guardian name"
                      className="profile-input"
                    />
                  ) : (
                    <div className="profile-value">{student.parentName || 'Not provided'}</div>
                  )}
                </div>

                <div className="profile-field">
                  <label>Parent/Guardian Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="parentPhone"
                      value={profileData.parentPhone}
                      onChange={handleInputChange}
                      placeholder="Enter parent/guardian phone"
                      className="profile-input"
                    />
                  ) : (
                    <div className="profile-value">{student.parentPhone || 'Not provided'}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Shared Timetable Utility Functions
function getTimetableData() {
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  
  const timeSlots = [
    { time: '10:00 AM', hour: 10 },
    { time: '11:00 AM', hour: 11 },
    { time: '12:00 PM', hour: 12 },
    { time: '01:00 PM', hour: 13 },
    { time: '02:00 PM', hour: 14 },
    { time: '03:00 PM', hour: 15 },
    { time: '04:00 PM', hour: 16 },
    { time: '05:00 PM', hour: 17 }
  ]
  
  // All 10 subjects from teachersData
  const courses = [
    { code: 'DCS5010', name: 'Pc Assembling And Troubleshooting', instructor: 'Aditya Gautam', color: '#3b82f6' },
    { code: 'DCS5027', name: 'Python Programming', instructor: 'Rohan Singh', color: '#10b981' },
    { code: 'DCS5107', name: 'Cryptography And Network Security', instructor: 'Shubhanvi Bansal', color: '#f59e0b' },
    { code: 'DCS5108', name: 'Mobile Application Development', instructor: 'Ankita Srivastava', color: '#8b5cf6' },
    { code: 'MATH501', name: 'Mathematics', instructor: 'Dr. Rajesh Kumar', color: '#ef4444' },
    { code: 'DCS5020', name: 'Data Structures', instructor: 'Prof. Priya Sharma', color: '#f59e0b' },
    { code: 'DCS5030', name: 'Database Management Systems', instructor: 'Dr. Amit Singh', color: '#6366f1' },
    { code: 'DCS5040', name: 'Operating Systems', instructor: 'Prof. Sunita Verma', color: '#ec4899' },
    { code: 'DCS5050', name: 'Computer Networks', instructor: 'Dr. Vikram Patel', color: '#14b8a6' },
    { code: 'DCS5060', name: 'Software Engineering', instructor: 'Prof. Neha Gupta', color: '#a855f7' }
  ]
  
  // Distribute all 10 subjects across the week with 5-6 subjects per day
  // Each subject appears multiple times throughout the week
  const getTimetableForDay = (dayIndex) => {
    if (dayIndex === 1) { // Monday - 6 subjects
      return [
        { time: '10:00 AM', course: courses[0], room: 'LAB-301' }, // DCS5010 - Pc Assembling And Troubleshooting
        { time: '11:00 AM', course: courses[1], room: 'LAB-302' }, // DCS5027 - Python Programming
        { time: '12:00 PM', course: courses[4], room: 'LEC-201' }, // MATH501 - Mathematics
        { time: '02:00 PM', course: courses[5], room: 'LAB-305' }, // DCS5020 - Data Structures
        { time: '03:00 PM', course: courses[6], room: 'LAB-306' }, // DCS5030 - Database Management Systems
        { time: '04:00 PM', course: courses[7], room: 'LAB-307' }, // DCS5040 - Operating Systems
      ]
    }
    if (dayIndex === 2) { // Tuesday - 6 subjects
      return [
        { time: '10:00 AM', course: courses[2], room: 'LAB-303' }, // DCS5107 - Cryptography And Network Security
        { time: '11:00 AM', course: courses[3], room: 'LAB-304' }, // DCS5108 - Mobile Application Development
        { time: '12:00 PM', course: courses[8], room: 'LAB-308' }, // DCS5050 - Computer Networks
        { time: '02:00 PM', course: courses[9], room: 'LAB-309' }, // DCS5060 - Software Engineering
        { time: '03:00 PM', course: courses[0], room: 'LAB-301' }, // DCS5010 - Pc Assembling (Lab Session)
        { time: '04:00 PM', course: courses[1], room: 'LAB-302' }, // DCS5027 - Python Programming (Practice)
      ]
    }
    if (dayIndex === 3) { // Wednesday - 5 subjects (with 3-hour gap: 12 PM - 2 PM)
      return [
        { time: '10:00 AM', course: courses[4], room: 'LEC-201' }, // MATH501 - Mathematics
        { time: '11:00 AM', course: courses[5], room: 'LAB-305' }, // DCS5020 - Data Structures
        // 3-HOUR GAP: 12 PM - 2 PM (No lectures)
        { time: '02:00 PM', course: courses[6], room: 'LAB-306' }, // DCS5030 - Database Management Systems
        { time: '03:00 PM', course: courses[7], room: 'LAB-307' }, // DCS5040 - Operating Systems
        { time: '04:00 PM', course: courses[8], room: 'LAB-308' }, // DCS5050 - Computer Networks
      ]
    }
    if (dayIndex === 4) { // Thursday - 6 subjects
      return [
        { time: '10:00 AM', course: courses[2], room: 'LAB-303' }, // DCS5107 - Cryptography And Network Security
        { time: '11:00 AM', course: courses[3], room: 'LAB-304' }, // DCS5108 - Mobile Application Development
        { time: '12:00 PM', course: courses[9], room: 'LAB-309' }, // DCS5060 - Software Engineering
        { time: '02:00 PM', course: courses[0], room: 'LAB-301' }, // DCS5010 - Pc Assembling (Lab)
        { time: '03:00 PM', course: courses[1], room: 'LAB-302' }, // DCS5027 - Python Programming
        { time: '04:00 PM', course: courses[4], room: 'LEC-201' }, // MATH501 - Mathematics (Tutorial)
      ]
    }
    if (dayIndex === 5) { // Friday - 5 subjects
      return [
        { time: '10:00 AM', course: courses[5], room: 'LAB-305' }, // DCS5020 - Data Structures
        { time: '11:00 AM', course: courses[6], room: 'LAB-306' }, // DCS5030 - Database Management Systems
        { time: '12:00 PM', course: courses[7], room: 'LAB-307' }, // DCS5040 - Operating Systems
        { time: '02:00 PM', course: courses[8], room: 'LAB-308' }, // DCS5050 - Computer Networks
        { time: '03:00 PM', course: courses[9], room: 'LAB-309' }, // DCS5060 - Software Engineering
      ]
    }
    return []
  }
  
  return { weekdays, timeSlots, courses, getTimetableForDay }
}

// Timetable Content Component
function TimetableContent({ student }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  
  const { weekdays, timeSlots, courses, getTimetableForDay } = getTimetableData()
  
  // Get day of week for selected date
  const selectedDateObj = new Date(selectedDate)
  const selectedDay = selectedDateObj.getDay() // 0-6
  
  // Check if it's weekend
  const isWeekend = selectedDay === 0 || selectedDay === 6
  
  // Get timetable for selected date
  const selectedTimetable = getTimetableForDay(selectedDay)
  
  if (isWeekend) {
    return (
      <div className="timetable-content">
        <div className="holiday-message">
          <div className="holiday-icon">🎉</div>
          <h2>Enjoy Your Holiday!</h2>
          <p className="holiday-text">
            No classes scheduled. Take a well-deserved break!
          </p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="timetable-content">
      
      <div className="timetable-container">
        <div className="timetable-table-wrapper">
          <table className="timetable-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Subject</th>
                <th>Course Code</th>
                <th>Instructor</th>
                <th>Room</th>
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot, index) => {
                const scheduledClass = selectedTimetable.find(cls => cls.time === slot.time)
                const has3HourGap = selectedDay === 3 && (slot.hour === 12 || slot.hour === 13 || slot.hour === 14)
                
                return (
                  <tr key={index} className={has3HourGap && !scheduledClass ? 'gap-period' : ''}>
                    <td className="time-cell">
                      <strong>{slot.time}</strong>
                      {has3HourGap && !scheduledClass && (
                        <span className="gap-label">(3-Hour Gap)</span>
                      )}
                    </td>
                    <td className={scheduledClass ? 'class-cell' : 'empty-cell'}>
                      {scheduledClass ? (
                        <>
                          <div className="class-name">{scheduledClass.course.name}</div>
                        </>
                      ) : (
                        <span className="empty-text">-</span>
                      )}
                    </td>
                    <td className={scheduledClass ? 'class-cell' : 'empty-cell'}>
                      {scheduledClass ? (
                        <span className="course-code-badge" style={{ backgroundColor: scheduledClass.course.color }}>
                          {scheduledClass.course.code}
                        </span>
                      ) : (
                        <span className="empty-text">-</span>
                      )}
                    </td>
                    <td className={scheduledClass ? 'class-cell' : 'empty-cell'}>
                      {scheduledClass ? (
                        <span className="instructor-name">{scheduledClass.course.instructor}</span>
                      ) : (
                        <span className="empty-text">-</span>
                      )}
                    </td>
                    <td className={scheduledClass ? 'class-cell' : 'empty-cell'}>
                      {scheduledClass ? (
                        <span className="room-badge">{scheduledClass.room}</span>
                      ) : (
                        <span className="empty-text">-</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        
        <div className="timetable-legend">
          <h3>Course Colors</h3>
          <div className="legend-items">
            {courses.map((course, index) => (
              <div key={index} className="legend-item">
                <div className="legend-color" style={{ backgroundColor: course.color }}></div>
                <span>{course.code} - {course.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Assignments Content Component
function AssignmentsContent({ student }) {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [uploadFile, setUploadFile] = useState(null)

  useEffect(() => {
    if (student && student.id) {
      loadAssignments()
    }
  }, [student])

  const loadAssignments = async () => {
    if (!student || !student.id) return
    
    setLoading(true)
    try {
      const res = await fetch(API_ENDPOINTS.STUDENT_ASSIGNMENTS(student.id))
      const data = await res.json()
      if (data.ok && Array.isArray(data.assignments)) {
        setAssignments(data.assignments)
      }
    } catch (error) {
      console.error('Error loading assignments:', error)
    }
    setLoading(false)
  }

  const handleFileSelect = (e, assignmentId) => {
    const file = e.target.files[0]
    if (file) {
      setUploadFile(file)
      setSelectedAssignment(assignmentId)
    }
  }

  const submitAssignment = async (assignmentId) => {
    if (!uploadFile) {
      alert('Please select a file to upload')
      return
    }

    const formData = new FormData()
    formData.append('assignment_id', assignmentId)
    formData.append('student_id', student.id)
    formData.append('file', uploadFile)

    try {
      const res = await fetch(API_ENDPOINTS.SUBMIT_ASSIGNMENT, {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.ok) {
        alert('Assignment submitted successfully!')
        setUploadFile(null)
        setSelectedAssignment(null)
        loadAssignments()
      } else {
        alert('Failed to submit assignment: ' + (data.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error submitting assignment:', error)
      alert('Error submitting assignment')
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not set'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const getStatus = (assignment) => {
    if (assignment.submission_id) {
      if (assignment.marks_obtained !== null) {
        return { text: 'Graded', class: 'graded', color: '#10b981' }
      }
      return { text: 'Submitted', class: 'submitted', color: '#3b82f6' }
    }
    const dueDate = new Date(assignment.due_date)
    const today = new Date()
    if (dueDate < today) {
      return { text: 'Overdue', class: 'overdue', color: '#ef4444' }
    }
    return { text: 'Pending', class: 'pending', color: '#f59e0b' }
  }

  return (
    <div className="assignments-content">
      <h2>Assignments</h2>
      {loading && <div style={{ textAlign: 'center', padding: '20px' }}>Loading assignments...</div>}
      <div className="assignments-list">
        {assignments.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            No assignments available at the moment.
          </div>
        )}
        {assignments.map((assignment) => {
          const status = getStatus(assignment)
          return (
            <div key={assignment.id} className="assignment-card" style={{
              border: `2px solid ${status.color}`,
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px',
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                <div>
                  <h3 style={{ margin: '0 0 8px 0', color: '#0b4d2b' }}>{assignment.title}</h3>
                  <p style={{ margin: '4px 0', color: '#666' }}><strong>Subject:</strong> {assignment.subject_name} ({assignment.subject_code})</p>
                  <p style={{ margin: '4px 0', color: '#666' }}><strong>Teacher:</strong> {assignment.teacher_name}</p>
                  {assignment.description && (
                    <p style={{ margin: '8px 0', color: '#555' }}>{assignment.description}</p>
                  )}
                </div>
                <span className={`assignment-status ${status.class}`} style={{
                  backgroundColor: status.color,
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '700'
                }}>
                  {status.text}
                </span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                <div>
                  <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>Due Date:</strong> {formatDate(assignment.due_date)}</p>
                  <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>Max Marks:</strong> {assignment.max_marks}</p>
                </div>
                {assignment.submission_id && (
                  <div>
                    <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>Submitted:</strong> {formatDate(assignment.submitted_at)}</p>
                    {assignment.marks_obtained !== null && (
                      <p style={{ margin: '4px 0', fontSize: '14px' }}>
                        <strong>Marks:</strong> {assignment.marks_obtained}/{assignment.max_marks}
                        {assignment.feedback && <span style={{ display: 'block', fontSize: '12px', color: '#666', marginTop: '4px' }}>Feedback: {assignment.feedback}</span>}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {assignment.file_url && (
                <div style={{ marginBottom: '15px' }}>
                  <a href={`http://127.0.0.1:5000${assignment.file_url}`} target="_blank" rel="noopener noreferrer" style={{
                    color: '#3b82f6',
                    textDecoration: 'none',
                    fontWeight: '600'
                  }}>
                    📄 Download Assignment File
                  </a>
                </div>
              )}

              {!assignment.submission_id && (
                <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '15px' }}>
                  <input
                    type="file"
                    id={`file-${assignment.id}`}
                    onChange={(e) => handleFileSelect(e, assignment.id)}
                    style={{ display: 'none' }}
                    accept=".pdf,.doc,.docx,.txt"
                  />
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <label htmlFor={`file-${assignment.id}`} style={{
                      padding: '8px 16px',
                      backgroundColor: '#f0f0f0',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      border: '2px solid #0b4d2b',
                      color: '#0b4d2b'
                    }}>
                      {uploadFile && selectedAssignment === assignment.id ? uploadFile.name : 'Choose File'}
                    </label>
                    {uploadFile && selectedAssignment === assignment.id && (
                      <button
                        onClick={() => submitAssignment(assignment.id)}
                        style={{
                          padding: '8px 20px',
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        📤 Submit Assignment
                      </button>
                    )}
                  </div>
                </div>
              )}

              {assignment.submission_file && (
                <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                  <a href={`http://127.0.0.1:5000/uploads/${assignment.submission_file}`} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>
                    📎 View Submitted File
                  </a>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Results Content Component
function ResultsContent({ student }) {
  return (
    <div className="results-content">
      <h2>View Results</h2>
      <div className="results-message">
        <p>Results will be available after the examination period.</p>
        <p>Semester: {student.semester}</p>
        <p>Program: {student.program}</p>
      </div>
    </div>
  )
}

