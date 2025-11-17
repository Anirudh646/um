import { useState, useEffect } from 'react'

export default function Classes() {
  const [selectedDay, setSelectedDay] = useState('today')
  const [schedule, setSchedule] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [subjects, setSubjects] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [newClass, setNewClass] = useState({ name: '', subject_id: '', schedule_time: '', room_number: '' })

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      if (userData.role === 'teacher') {
        fetchTeacherClasses(userData.id)
        fetchTeacherSubjects(userData.id)
      } else {
        setSchedule([])
      }
    } else {
      setSchedule([])
    }
  }, [])

  const fetchTeacherClasses = async (teacherId) => {
    setLoading(true)
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/teacher/${teacherId}/classes`)
      const data = await res.json()
      if (data.ok && Array.isArray(data.classes)) {
        setSchedule(data.classes)
      } else {
        setSchedule([])
      }
    } catch (err) {
      setSchedule([])
    }
    setLoading(false)
  }

  const fetchTeacherSubjects = async (teacherId) => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/teacher/${teacherId}/subjects`)
      const data = await res.json()
      if (data.ok) setSubjects(data.subjects)
    } catch (e) {}
  }

  const createClass = async (e) => {
    e.preventDefault()
    if (!user) return
    try {
      const res = await fetch('http://127.0.0.1:5000/api/classes/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newClass.name,
          subject_id: Number(newClass.subject_id),
          teacher_id: user.id,
          schedule_time: newClass.schedule_time,
          room_number: newClass.room_number,
        })
      })
      const data = await res.json()
      if (data.ok) {
        setShowForm(false)
        setNewClass({ name: '', subject_id: '', schedule_time: '', room_number: '' })
        fetchTeacherClasses(user.id)
      } else {
        alert(data.message || 'Failed to create class')
      }
    } catch (e) {
      alert('Network error creating class')
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'ongoing': return '#10b981'
      case 'upcoming': return '#3b82f6'
      case 'completed': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'ongoing': return '🟢'
      case 'upcoming': return '⏰'
      case 'completed': return '✅'
      default: return '⏰'
    }
  }

  const today = new Date().toLocaleString('en-us', { weekday: 'long' });
  const filteredSchedule = selectedDay === 'today'
    ? schedule.filter(cls => cls.day === today)
    : schedule

  return (
    <div className="classes-page">
      <div className="page-header">
        <h2>Class Schedule</h2>
        <div className="header-actions">
          <div className="day-selector">
            <button
              className={`day-btn ${selectedDay === 'today' ? 'active' : ''}`}
              onClick={() => setSelectedDay('today')}
            >
              Today
            </button>
            <button
              className={`day-btn ${selectedDay === 'week' ? 'active' : ''}`}
              onClick={() => setSelectedDay('week')}
            >
              This Week
            </button>
          </div>
          <button className="btn-primary" onClick={() => setShowForm(true)}>Add New Class</button>
        </div>
      </div>

      {showForm && (
        <div className="create-assignment-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Class</h3>
              <button className="close-btn" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={createClass} className="assignment-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Class Name</label>
                  <input value={newClass.name} onChange={(e)=>setNewClass({...newClass, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <select value={newClass.subject_id} onChange={(e)=>setNewClass({...newClass, subject_id: e.target.value})} required>
                    <option value="">Select Subject</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Schedule Time</label>
                  <input placeholder="Mon 09:00 AM" value={newClass.schedule_time} onChange={(e)=>setNewClass({...newClass, schedule_time: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Room Number</label>
                  <input placeholder="Room 101" value={newClass.room_number} onChange={(e)=>setNewClass({...newClass, room_number: e.target.value})} />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={()=>setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Class</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? <div>Loading classes...</div> : null}
      {!loading && (!user || schedule.length === 0) ? <div style={{margin:16}}>No classes found for this faculty.</div> : null}

      <div className="schedule-grid">
        {filteredSchedule.map(cls => (
          <div key={cls.id} className="class-card">
            <div className="class-header">
              <div className="class-subject">{cls.subject_name || cls.subject || 'Unnamed Subject'}</div>
              <div className={`class-status ${cls.status || ''}`}>
                <span className="status-icon">{getStatusIcon(cls.status)}</span>
                <span className="status-text">{cls.status ? cls.status.charAt(0).toUpperCase() + cls.status.slice(1) : 'n/a'}</span>
              </div>
            </div>
            <div className="class-details">
              <div className="detail-item">
                <span className="detail-icon">🕐</span>
                <span className="detail-text">{cls.schedule_time || cls.time || '-'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">🏫</span>
                <span className="detail-text">{cls.room_number || cls.room || cls.classroom || '-'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">👥</span>
                <span className="detail-text">{cls.students || cls.student_count || 0} students</span>
              </div>
            </div>
            <div className="class-actions">
              <button className="btn-secondary">Edit</button>
            </div>
          </div>
        ))}
      </div>

      <div className="quick-stats">
        <div className="stat-item">
          <div className="stat-number">{schedule.filter(cls => cls.status === 'ongoing').length}</div>
          <div className="stat-label">Ongoing Classes</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{schedule.filter(cls => cls.status === 'upcoming').length}</div>
          <div className="stat-label">Upcoming Classes</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{schedule.filter(cls => cls.status === 'completed').length}</div>
          <div className="stat-label">Completed Today</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{schedule.reduce((sum, cls) => sum + (cls.students || cls.student_count || 0), 0)}</div>
          <div className="stat-label">Total Students</div>
        </div>
      </div>
    </div>
  )
}
