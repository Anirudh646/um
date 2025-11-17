import { useEffect, useState } from 'react'
import { API_ENDPOINTS } from '../../config/api.js'

export default function Assignments() {
  const [activeTab, setActiveTab] = useState('all')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [user, setUser] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(false)
  
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    maxMarks: 100,
    subjectId: ''
  })

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const u = JSON.parse(savedUser)
      setUser(u)
      if (u.role === 'teacher') {
        loadSubjects(u.id)
        loadAssignments(u.id)
      }
    }
  }, [])

  const loadSubjects = async (teacherId) => {
    try {
      const res = await fetch(API_ENDPOINTS.TEACHER_SUBJECTS(teacherId))
      const data = await res.json()
      if (data.ok) setSubjects(data.subjects)
    } catch (e) {}
  }

  const loadAssignments = async (teacherId) => {
    setLoading(true)
    try {
      const res = await fetch(API_ENDPOINTS.TEACHER_ASSIGNMENTS(teacherId))
      const data = await res.json()
      if (data.ok) setAssignments(data.assignments)
    } catch (e) {}
    setLoading(false)
  }

  const handleCreateAssignment = async (e) => {
    e.preventDefault()
    if (!user) return
    try {
      const res = await fetch(API_ENDPOINTS.CREATE_ASSIGNMENT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newAssignment.title,
          description: newAssignment.description,
          subject_id: Number(newAssignment.subjectId),
          teacher_id: user.id,
          due_date: newAssignment.dueDate,
          max_marks: Number(newAssignment.maxMarks) || 100
        })
      })
      const data = await res.json()
      if (data.ok) {
        setShowCreateForm(false)
        setNewAssignment({ title: '', description: '', dueDate: '', maxMarks: 100, subjectId: '' })
        loadAssignments(user.id)
      } else {
        alert(data.message || 'Failed to create assignment')
      }
    } catch (e) {
      alert('Network error creating assignment')
    }
  }

  const quickAddMathAssignments = async () => {
    if (!user) return
    const math = subjects.find(s => (s.name || '').toLowerCase().includes('math'))
    if (!math) {
      alert('No Mathematics subject found for this teacher.')
      return
    }
    const payloads = [
      {
        title: 'Mathematics Homework 1',
        description: 'Problems on algebra and linear equations',
        subject_id: math.id,
        teacher_id: user.id,
        due_date: new Date(Date.now()+3*86400000).toISOString().slice(0,10),
        max_marks: 50,
      },
      {
        title: 'Mathematics Quiz 1',
        description: 'Short quiz on calculus basics',
        subject_id: math.id,
        teacher_id: user.id,
        due_date: new Date(Date.now()+5*86400000).toISOString().slice(0,10),
        max_marks: 25,
      }
    ]
    try {
      for (const p of payloads) {
        await fetch('http://127.0.0.1:5000/api/assignments/create', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p)
        })
      }
      loadAssignments(user.id)
      alert('Two Mathematics assignments added')
    } catch (e) {
      alert('Failed to add sample assignments')
    }
  }

  const filteredAssignments = activeTab === 'all' 
    ? assignments 
    : assignments.filter(assignment => (assignment.status || 'active') === activeTab)

  const getTypeIcon = (type) => {
    switch(type) {
      case 'homework': return '📝'
      case 'lab': return '🔬'
      case 'project': return '📋'
      case 'quiz': return '❓'
      case 'report': return '📄'
      default: return '📝'
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return '#10b981'
      case 'graded': return '#6b7280'
      case 'draft': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  return (
    <div className="assignments-page">
      <div className="page-header">
        <h2>Assignment Management</h2>
        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => setShowCreateForm(true)}
          >
            + Create Assignment
          </button>
          <button 
            className="btn-secondary"
            onClick={quickAddMathAssignments}
          >
            + Add 2 Math Assignments
          </button>
        </div>
      </div>

      <div className="assignment-tabs">
        <button 
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Assignments ({assignments.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active ({assignments.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'graded' ? 'active' : ''}`}
          onClick={() => setActiveTab('graded')}
        >
          Graded (0)
        </button>
      </div>

      {showCreateForm && (
        <div className="create-assignment-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Assignment</h3>
              <button 
                className="close-btn"
                onClick={() => setShowCreateForm(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateAssignment} className="assignment-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Assignment Title</label>
                  <input 
                    type="text" 
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <select 
                    value={newAssignment.subjectId}
                    onChange={(e) => setNewAssignment({...newAssignment, subjectId: e.target.value})}
                    required
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                  rows="4"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Due Date</label>
                  <input 
                    type="date" 
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Max Marks</label>
                  <input 
                    type="number" 
                    value={newAssignment.maxMarks}
                    onChange={(e) => setNewAssignment({...newAssignment, maxMarks: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && <div>Loading assignments...</div>}

      <div className="assignments-grid">
        {filteredAssignments.map(assignment => (
          <div key={assignment.id} className="assignment-card">
            <div className="assignment-header">
              <div className="assignment-title">
                <span className="type-icon">{getTypeIcon('homework')}</span>
                {assignment.title}
              </div>
              <div className={`assignment-status ${assignment.status || 'active'}`}>
                {(assignment.status || 'active').charAt(0).toUpperCase() + (assignment.status || 'active').slice(1)}
              </div>
            </div>

            <div className="assignment-details">
              <div className="detail-item">
                <span className="detail-label">Subject:</span>
                <span className="detail-value">{assignment.subject_name || ''}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Due Date:</span>
                <span className="detail-value">{assignment.due_date}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Max Marks:</span>
                <span className="detail-value">{assignment.max_marks}</span>
              </div>
            </div>

            <div className="assignment-actions">
              <button className="btn-secondary">Edit</button>
              <button className="btn-danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
