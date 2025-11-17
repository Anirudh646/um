// Teachers data matching the courses taught
export const teachersData = [
  {
    id: 1,
    name: 'Aditya Gautam',
    email: 'aditya.gautam@gla.edu',
    subject: 'Pc Assembling And Troubleshooting',
    subjectCode: 'DCS5010',
    department: 'Computer Science',
    profilePicture: 'https://ui-avatars.com/api/?name=Aditya+Gautam&background=0b4d2b&color=fff&size=200',
    courses: ['DCS5010']
  },
  {
    id: 2,
    name: 'Rohan Singh',
    email: 'rohan.singh@gla.edu',
    subject: 'Python Programming',
    subjectCode: 'DCS5027',
    department: 'Computer Science',
    profilePicture: 'https://ui-avatars.com/api/?name=Rohan+Singh&background=3b82f6&color=fff&size=200',
    courses: ['DCS5027']
  },
  {
    id: 3,
    name: 'Shubhanvi Bansal',
    email: 'shubhanvi.bansal@gla.edu',
    subject: 'Cryptography And Network Security',
    subjectCode: 'DCS5107',
    department: 'Computer Science',
    profilePicture: 'https://ui-avatars.com/api/?name=Shubhanvi+Bansal&background=8b5cf6&color=fff&size=200',
    courses: ['DCS5107']
  },
  {
    id: 4,
    name: 'Ankita Srivastava',
    email: 'ankita.srivastava@gla.edu',
    subject: 'Mobile Application Development',
    subjectCode: 'DCS5108',
    department: 'Computer Science',
    profilePicture: 'https://ui-avatars.com/api/?name=Ankita+Srivastava&background=10b981&color=fff&size=200',
    courses: ['DCS5108']
  },
  {
    id: 5,
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@gla.edu',
    subject: 'Mathematics',
    subjectCode: 'MATH501',
    department: 'Engineering',
    profilePicture: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=ef4444&color=fff&size=200',
    courses: ['MATH501']
  },
  {
    id: 6,
    name: 'Prof. Priya Sharma',
    email: 'priya.sharma@gla.edu',
    subject: 'Data Structures',
    subjectCode: 'DCS5020',
    department: 'Computer Science',
    profilePicture: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=f59e0b&color=fff&size=200',
    courses: ['DCS5020']
  },
  {
    id: 7,
    name: 'Dr. Amit Singh',
    email: 'amit.singh@gla.edu',
    subject: 'Database Management Systems',
    subjectCode: 'DCS5030',
    department: 'Computer Science',
    profilePicture: 'https://ui-avatars.com/api/?name=Amit+Singh&background=6366f1&color=fff&size=200',
    courses: ['DCS5030']
  },
  {
    id: 8,
    name: 'Prof. Sunita Verma',
    email: 'sunita.verma@gla.edu',
    subject: 'Operating Systems',
    subjectCode: 'DCS5040',
    department: 'Computer Science',
    profilePicture: 'https://ui-avatars.com/api/?name=Sunita+Verma&background=ec4899&color=fff&size=200',
    courses: ['DCS5040']
  },
  {
    id: 9,
    name: 'Dr. Vikram Patel',
    email: 'vikram.patel@gla.edu',
    subject: 'Computer Networks',
    subjectCode: 'DCS5050',
    department: 'Computer Science',
    profilePicture: 'https://ui-avatars.com/api/?name=Vikram+Patel&background=14b8a6&color=fff&size=200',
    courses: ['DCS5050']
  },
  {
    id: 10,
    name: 'Prof. Neha Gupta',
    email: 'neha.gupta@gla.edu',
    subject: 'Software Engineering',
    subjectCode: 'DCS5060',
    department: 'Computer Science',
    profilePicture: 'https://ui-avatars.com/api/?name=Neha+Gupta&background=a855f7&color=fff&size=200',
    courses: ['DCS5060']
  }
]

// Helper function to get teacher by ID
export const getTeacherById = (teacherId) => {
  return teachersData.find(teacher => teacher.id === teacherId)
}

// Helper function to get teacher by subject code
export const getTeacherBySubjectCode = (subjectCode) => {
  return teachersData.find(teacher => teacher.courses.includes(subjectCode))
}

