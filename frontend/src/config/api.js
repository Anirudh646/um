// API Configuration
// Use environment variable in production, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000'

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  STUDENT_ASSIGNMENTS: (studentId) => `${API_BASE_URL}/api/student/${studentId}/assignments`,
  SUBMIT_ASSIGNMENT: `${API_BASE_URL}/api/assignments/submit`,
  STUDENT_ATTENDANCE: (studentId) => `${API_BASE_URL}/api/attendance/student/${studentId}`,
  STUDENT_EXAM_RESULTS: (studentId) => `${API_BASE_URL}/api/student/${studentId}/exam-results`,
  TEACHER_SUBJECTS: (teacherId) => `${API_BASE_URL}/api/teacher/${teacherId}/subjects`,
  TEACHER_CLASSES: (teacherId) => `${API_BASE_URL}/api/teacher/${teacherId}/classes`,
  TEACHER_ASSIGNMENTS: (teacherId) => `${API_BASE_URL}/api/teacher/${teacherId}/assignments`,
  TEACHER_EXAMS: (teacherId) => `${API_BASE_URL}/api/teacher/${teacherId}/exams`,
  CREATE_ASSIGNMENT: `${API_BASE_URL}/api/assignments/create`,
  CREATE_CLASS: `${API_BASE_URL}/api/classes/create`,
  CREATE_EXAM: `${API_BASE_URL}/api/exams/create`,
  MARK_ATTENDANCE: `${API_BASE_URL}/api/attendance/mark`,
  GRADE_ASSIGNMENT: `${API_BASE_URL}/api/assignments/grade`,
  UPLOAD_EXAM_MARKS: `${API_BASE_URL}/api/exams/upload-marks`,
  GET_STUDENTS: `${API_BASE_URL}/api/students`,
  GET_CLASS_ATTENDANCE: (classId) => `${API_BASE_URL}/api/attendance/class/${classId}`,
  GET_EXAM_RESULTS: (examId) => `${API_BASE_URL}/api/exams/${examId}/results`,
}

export default API_ENDPOINTS

