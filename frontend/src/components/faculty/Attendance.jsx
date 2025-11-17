import { useState, useEffect } from 'react'
import { API_ENDPOINTS } from '../../config/api.js'

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedClass, setSelectedClass] = useState('')
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [attendanceData, setAttendanceData] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saveMessage, setSaveMessage] = useState(null)

  useEffect(() => {
    // Get user from localStorage
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      if (userData.role === 'teacher' && userData.id) {
        console.log('Loading data for teacher ID:', userData.id)
        loadTeacherData(userData.id)
      }
    }
  }, [])

  const loadTeacherData = async (teacherId) => {
    setLoading(true)
    try {
      // Load classes
      const classesRes = await fetch(API_ENDPOINTS.TEACHER_CLASSES(teacherId))
      const classesData = await classesRes.json()
      if (classesData.ok) setClasses(classesData.classes)

      // Fetch students from backend so IDs match database records
      const studentsRes = await fetch(`${API_ENDPOINTS.GET_STUDENTS}?limit=200`)
      const studentsJson = await studentsRes.json()
      if (studentsJson.ok && Array.isArray(studentsJson.students)) {
        const formattedStudents = studentsJson.students.map((student) => ({
          ...student,
          id: student.id, // database numeric ID
          student_id: student.roll_number || student.id, // display ID
          name: student.name || student.full_name || 'Unknown',
          email: student.email || '',
          program: student.class_name || '',
          semester: student.semester || '',
          batch: student.batch || ''
        }))
        setStudents(formattedStudents)
      } else {
        setStudents([])
      }
    } catch (error) {
      console.error('Error loading teacher data:', error)
    }
    setLoading(false)
  }

  const loadAttendance = async (classId, date = null) => {
    try {
      const url = `${API_ENDPOINTS.GET_CLASS_ATTENDANCE(classId)}${date ? `?date=${date}` : ''}`
      const res = await fetch(url)
      const data = await res.json()
      if (data.ok) {
        setAttendanceData(data.attendance)
      }
    } catch (error) {
      console.error('Error loading attendance:', error)
    }
  }

  const markAttendance = async (studentId, status) => {
    if (!selectedClass) {
      alert('Please select a class first')
      return
    }

    try {
      const res = await fetch(API_ENDPOINTS.MARK_ATTENDANCE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          class_id: selectedClass,
          status: status,
          teacher_id: user.id,
          date: selectedDate
        })
      })
      const data = await res.json()
      if (data.ok) {
        // Reload from backend to ensure we capture any policy adjustments (e.g., late -> absent)
        await loadAttendance(selectedClass, selectedDate)
      } else {
        alert('Failed to mark attendance: ' + (data.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error marking attendance:', error)
      alert('Error marking attendance')
    }
  }

  const markAllPresent = async () => {
    if (!selectedClass) {
      alert('Please select a class first')
      return
    }

    if (!confirm(`Mark all ${students.length} students as Present for ${selectedDate}?`)) {
      return
    }

    try {
      let successCount = 0
      let failCount = 0

      for (const student of students) {
        const res = await fetch('http://127.0.0.1:5000/api/attendance/mark', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            student_id: student.id,
            class_id: selectedClass,
            status: 'present',
            teacher_id: user.id,
            date: selectedDate
          })
        })
        const data = await res.json()
        if (data.ok) {
          successCount++
        } else {
          failCount++
        }
      }

      if (successCount > 0) {
        alert(`Successfully marked ${successCount} student(s) as Present${failCount > 0 ? ` (${failCount} failed)` : ''}`)
        loadAttendance(selectedClass, selectedDate)
      } else {
        alert('Failed to mark attendance for all students')
      }
    } catch (error) {
      console.error('Error marking all present:', error)
      alert('Error marking all students as present')
    }
  }

  const markAllAbsent = async () => {
    if (!selectedClass) {
      alert('Please select a class first')
      return
    }

    if (!confirm(`Mark all ${students.length} students as Absent for ${selectedDate}?`)) {
      return
    }

    try {
      let successCount = 0
      let failCount = 0

      for (const student of students) {
        const res = await fetch('http://127.0.0.1:5000/api/attendance/mark', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            student_id: student.id,
            class_id: selectedClass,
            status: 'absent',
            teacher_id: user.id,
            date: selectedDate
          })
        })
        const data = await res.json()
        if (data.ok) {
          successCount++
        } else {
          failCount++
        }
      }

      if (successCount > 0) {
        alert(`Successfully marked ${successCount} student(s) as Absent${failCount > 0 ? ` (${failCount} failed)` : ''}`)
        loadAttendance(selectedClass, selectedDate)
      } else {
        alert('Failed to mark attendance for all students')
      }
    } catch (error) {
      console.error('Error marking all absent:', error)
      alert('Error marking all students as absent')
    }
  }

  const saveAllAttendance = async () => {
    if (!selectedClass) {
      alert('Please select a class first')
      return
    }

    const unmarkedStudents = students.filter(student => {
      const status = getStudentStatus(student.id)
      return status === 'not-marked'
    })

    if (unmarkedStudents.length > 0) {
      if (!confirm(`You have ${unmarkedStudents.length} unmarked student(s). Do you want to mark them as Absent before saving?`)) {
        return
      }
      
      // Mark unmarked as absent
      for (const student of unmarkedStudents) {
        await markAttendance(student.id, 'absent')
      }
    }

    // Format date for display
    const dateObj = new Date(selectedDate)
    const isToday = selectedDate === new Date().toISOString().split('T')[0]
    const dateStr = isToday 
      ? 'Today' 
      : dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    
    setSaveMessage(`✅ Attendance uploaded successfully for ${dateStr}!`)
    loadAttendance(selectedClass, selectedDate)
    
    // Clear message after 5 seconds
    setTimeout(() => {
      setSaveMessage(null)
    }, 5000)
  }

  const getStudentStatus = (studentId) => {
    const attendance = attendanceData.find(a => a.student_id === studentId)
    return attendance?.status || 'not-marked'
  }

  const handleClassChange = (classId) => {
    setSelectedClass(classId)
    if (classId) {
      loadAttendance(classId, selectedDate)
    }
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)
    if (selectedClass) {
      loadAttendance(selectedClass, date)
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'present': return '#10b981'
      case 'absent': return '#ef4444'
      case 'late': return '#f59e0b'
      case 'not-marked': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getStatusCount = (status) => {
    return attendanceData.filter(a => a.status === status).length
  }

  return (
    <div className="attendance-page">
      <div className="page-header">
        <h2>Attendance Management</h2>
        <div className="header-actions">
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => handleDateChange(e.target.value)}
            className="date-picker"
          />
          <select 
            value={selectedClass} 
            onChange={(e) => handleClassChange(e.target.value)}
            className="class-selector"
          >
            <option value="">Select Class</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name} - {cls.subject_name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="stats-cards">
        <div className="stat-card present">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-number">{getStatusCount('present')}</div>
            <div className="stat-label">Present</div>
          </div>
        </div>
        <div className="stat-card absent">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <div className="stat-number">{getStatusCount('absent')}</div>
            <div className="stat-label">Absent</div>
          </div>
        </div>
        <div className="stat-card late">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <div className="stat-number">{getStatusCount('late')}</div>
            <div className="stat-label">Late</div>
          </div>
        </div>
        <div className="stat-card total">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-number">{students.length}</div>
            <div className="stat-label">Total</div>
          </div>
        </div>
      </div>

      {loading && <div style={{padding: 20, textAlign: 'center'}}>Loading students...</div>}

      {saveMessage && (
        <div style={{
          backgroundColor: '#10b981',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          marginBottom: '20px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
        }}>
          <span>✅</span>
          <span>{saveMessage}</span>
        </div>
      )}

      <div className="attendance-table">
        <div className="table-header">
          <h3>Student Attendance - {selectedDate} ({students.length} Students)</h3>
          <div className="table-actions">
            <button 
              className="btn-secondary" 
              onClick={markAllPresent}
              disabled={!selectedClass || students.length === 0}
              title="Mark all students as Present"
            >
              ✅ Mark All Present
            </button>
            <button 
              className="btn-secondary" 
              onClick={markAllAbsent}
              disabled={!selectedClass || students.length === 0}
              title="Mark all students as Absent"
              style={{ marginLeft: '8px', backgroundColor: '#ef4444' }}
            >
              ❌ Mark All Absent
            </button>
            <button 
              className="btn-primary" 
              onClick={saveAllAttendance}
              disabled={!selectedClass || students.length === 0}
              title="Save all attendance records"
            >
              💾 Save Attendance
            </button>
          </div>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 && !loading && (
                <tr>
                  <td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>
                    No students found. Please refresh or check your connection.
                  </td>
                </tr>
              )}
              {students.map((student, index) => {
                const status = getStudentStatus(student.id)
                // Use Student ID (same as in Student Portal "All Students" view)
                const studentId = student.student_id || student.id || ''
                const studentName = student.name || 'Unknown'
                
                return (
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
                        {studentId}
                      </strong>
                    </td>
                    <td>
                      <strong style={{ color: '#333', fontSize: '14px' }}>
                        {studentName}
                      </strong>
                    </td>
                    <td>
                      <span 
                        className="status-badge" 
                        style={{ 
                          backgroundColor: getStatusColor(status),
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '700',
                          color: '#ffffff'
                        }}
                      >
                        {status === 'not-marked' ? 'Not Marked' : 'Attendance Marked'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className={`btn-status ${status === 'present' ? 'active' : ''}`}
                          onClick={() => markAttendance(student.id, 'present')}
                          style={{
                            backgroundColor: status === 'present' ? '#10b981' : '#f0f0f0',
                            color: status === 'present' ? '#ffffff' : '#333',
                            border: status === 'present' ? '2px solid #10b981' : '2px solid #e0e0e0'
                          }}
                        >
                          Present
                        </button>
                        <button 
                          className={`btn-status ${status === 'absent' ? 'active' : ''}`}
                          onClick={() => markAttendance(student.id, 'absent')}
                          style={{
                            backgroundColor: status === 'absent' ? '#ef4444' : '#f0f0f0',
                            color: status === 'absent' ? '#ffffff' : '#333',
                            border: status === 'absent' ? '2px solid #ef4444' : '2px solid #e0e0e0',
                            marginLeft: '8px'
                          }}
                        >
                          Absent
                        </button>
                        <button 
                          className={`btn-status ${status === 'late' ? 'active' : ''}`}
                          onClick={() => markAttendance(student.id, 'late')}
                          style={{
                            backgroundColor: status === 'late' ? '#f59e0b' : '#f0f0f0',
                            color: status === 'late' ? '#ffffff' : '#333',
                            border: status === 'late' ? '2px solid #f59e0b' : '2px solid #e0e0e0',
                            marginLeft: '8px'
                          }}
                        >
                          Late
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
