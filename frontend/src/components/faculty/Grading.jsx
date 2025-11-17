import { useState } from 'react'

export default function Grading() {
  const [selectedAssignment, setSelectedAssignment] = useState('all')
  const [selectedStudent, setSelectedStudent] = useState('all')
  
  const assignments = [
    { id: 1, title: 'Data Structures Lab Assignment', subject: 'CS-201', maxMarks: 100 },
    { id: 2, title: 'Algorithm Analysis Report', subject: 'CS-301', maxMarks: 50 },
    { id: 3, title: 'Database Design Project', subject: 'CS-401', maxMarks: 200 }
  ]

  const students = [
    { id: 1, name: 'John Doe', roll: 'CS2024001', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', roll: 'CS2024002', email: 'jane@example.com' },
    { id: 3, name: 'Mike Johnson', roll: 'CS2024003', email: 'mike@example.com' },
    { id: 4, name: 'Sarah Wilson', roll: 'CS2024004', email: 'sarah@example.com' }
  ]

  const submissions = [
    {
      id: 1,
      studentId: 1,
      assignmentId: 1,
      studentName: 'John Doe',
      roll: 'CS2024001',
      assignmentTitle: 'Data Structures Lab Assignment',
      submittedDate: '2024-01-14',
      status: 'submitted',
      marks: 85,
      feedback: 'Good implementation, minor improvements needed',
      graded: true
    },
    {
      id: 2,
      studentId: 2,
      assignmentId: 1,
      studentName: 'Jane Smith',
      roll: 'CS2024002',
      assignmentTitle: 'Data Structures Lab Assignment',
      submittedDate: '2024-01-13',
      status: 'submitted',
      marks: 92,
      feedback: 'Excellent work!',
      graded: true
    },
    {
      id: 3,
      studentId: 3,
      assignmentId: 1,
      studentName: 'Mike Johnson',
      roll: 'CS2024003',
      assignmentTitle: 'Data Structures Lab Assignment',
      submittedDate: '2024-01-15',
      status: 'submitted',
      marks: null,
      feedback: '',
      graded: false
    },
    {
      id: 4,
      studentId: 4,
      assignmentId: 2,
      studentName: 'Sarah Wilson',
      roll: 'CS2024004',
      assignmentTitle: 'Algorithm Analysis Report',
      submittedDate: '2024-01-18',
      status: 'submitted',
      marks: 78,
      feedback: 'Good analysis, work on presentation',
      graded: true
    }
  ]

  const [gradingData, setGradingData] = useState(submissions)

  const updateGrade = (submissionId, marks, feedback) => {
    setGradingData(prev => prev.map(sub => 
      sub.id === submissionId 
        ? { ...sub, marks, feedback, graded: true }
        : sub
    ))
  }

  const filteredSubmissions = gradingData.filter(sub => {
    const assignmentMatch = selectedAssignment === 'all' || sub.assignmentId.toString() === selectedAssignment
    const studentMatch = selectedStudent === 'all' || sub.studentId.toString() === selectedStudent
    return assignmentMatch && studentMatch
  })

  const getGradeColor = (marks, maxMarks) => {
    if (!marks) return '#6b7280'
    const percentage = (marks / maxMarks) * 100
    if (percentage >= 90) return '#10b981'
    if (percentage >= 80) return '#3b82f6'
    if (percentage >= 70) return '#f59e0b'
    return '#ef4444'
  }

  const getGradeLetter = (marks, maxMarks) => {
    if (!marks) return 'Ungraded'
    const percentage = (marks / maxMarks) * 100
    if (percentage >= 90) return 'A+'
    if (percentage >= 80) return 'A'
    if (percentage >= 70) return 'B'
    if (percentage >= 60) return 'C'
    if (percentage >= 50) return 'D'
    return 'F'
  }

  return (
    <div className="grading-page">
      <div className="page-header">
        <h2>Grading & Evaluation</h2>
        <div className="header-actions">
          <button className="btn-primary">Bulk Grade</button>
          <button className="btn-secondary">Export Grades</button>
        </div>
      </div>

      <div className="grading-filters">
        <div className="filter-group">
          <label>Assignment:</label>
          <select 
            value={selectedAssignment} 
            onChange={(e) => setSelectedAssignment(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Assignments</option>
            {assignments.map(assignment => (
              <option key={assignment.id} value={assignment.id}>
                {assignment.title}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Student:</label>
          <select 
            value={selectedStudent} 
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Students</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.name} ({student.roll})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grading-stats">
        <div className="stat-card">
          <div className="stat-number">{gradingData.filter(s => s.graded).length}</div>
          <div className="stat-label">Graded</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{gradingData.filter(s => !s.graded).length}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {gradingData.filter(s => s.graded).length > 0 
              ? Math.round(gradingData.filter(s => s.graded).reduce((sum, s) => sum + s.marks, 0) / gradingData.filter(s => s.graded).length)
              : 0
            }
          </div>
          <div className="stat-label">Average Score</div>
        </div>
      </div>

      <div className="submissions-table">
        <div className="table-header">
          <h3>Student Submissions</h3>
          <div className="table-actions">
            <button className="btn-secondary">Select All</button>
            <button className="btn-primary">Grade Selected</button>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Assignment</th>
                <th>Submitted</th>
                <th>Marks</th>
                <th>Grade</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map(submission => (
                <SubmissionRow 
                  key={submission.id}
                  submission={submission}
                  assignment={assignments.find(a => a.id === submission.assignmentId)}
                  onUpdateGrade={updateGrade}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function SubmissionRow({ submission, assignment, onUpdateGrade }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editMarks, setEditMarks] = useState(submission.marks || '')
  const [editFeedback, setEditFeedback] = useState(submission.feedback || '')

  const handleSave = () => {
    onUpdateGrade(submission.id, parseInt(editMarks), editFeedback)
    setIsEditing(false)
  }

  const getGradeColor = (marks, maxMarks) => {
    if (!marks) return '#6b7280'
    const percentage = (marks / maxMarks) * 100
    if (percentage >= 90) return '#10b981'
    if (percentage >= 80) return '#3b82f6'
    if (percentage >= 70) return '#f59e0b'
    return '#ef4444'
  }

  const getGradeLetter = (marks, maxMarks) => {
    if (!marks) return 'Ungraded'
    const percentage = (marks / maxMarks) * 100
    if (percentage >= 90) return 'A+'
    if (percentage >= 80) return 'A'
    if (percentage >= 70) return 'B'
    if (percentage >= 60) return 'C'
    if (percentage >= 50) return 'D'
    return 'F'
  }

  return (
    <tr>
      <td>
        <div className="student-info">
          <div className="student-name">{submission.studentName}</div>
          <div className="student-roll">{submission.roll}</div>
        </div>
      </td>
      <td>
        <div className="assignment-info">
          <div className="assignment-title">{submission.assignmentTitle}</div>
          <div className="assignment-subject">{assignment?.subject}</div>
        </div>
      </td>
      <td>{submission.submittedDate}</td>
      <td>
        {isEditing ? (
          <input 
            type="number" 
            value={editMarks}
            onChange={(e) => setEditMarks(e.target.value)}
            max={assignment?.maxMarks}
            className="marks-input"
          />
        ) : (
          <span 
            className="marks-display"
            style={{ color: getGradeColor(submission.marks, assignment?.maxMarks) }}
          >
            {submission.marks || 'Ungraded'}
          </span>
        )}
      </td>
      <td>
        <span 
          className="grade-badge"
          style={{ backgroundColor: getGradeColor(submission.marks, assignment?.maxMarks) }}
        >
          {getGradeLetter(submission.marks, assignment?.maxMarks)}
        </span>
      </td>
      <td>
        <span className={`status-badge ${submission.graded ? 'graded' : 'pending'}`}>
          {submission.graded ? 'Graded' : 'Pending'}
        </span>
      </td>
      <td>
        <div className="action-buttons">
          {isEditing ? (
            <>
              <button className="btn-save" onClick={handleSave}>Save</button>
              <button className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
            </>
          ) : (
            <button className="btn-edit" onClick={() => setIsEditing(true)}>Grade</button>
          )}
        </div>
      </td>
    </tr>
  )
}
