# University Management System (UMS)

A comprehensive web-based University Management System built with React (Frontend) and Flask (Backend) for managing students, teachers, attendance, assignments, and exams.

## 🚀 Features

### For Teachers:
- ✅ Upload attendance for their subjects
- ✅ Create assignments with document upload
- ✅ Grade assignments submitted by students
- ✅ Upload marks after exam completion
- ✅ View and update timetable for their specific subject
- ✅ Manage classes and students

### For Students:
- ✅ View attendance (updated in real-time when teacher uploads)
- ✅ View and download assignments
- ✅ Submit completed assignments
- ✅ View grades and marks
- ✅ View timetable
- ✅ Check exam results

## 🛠️ Tech Stack

### Frontend:
- React.js
- Vite
- CSS3

### Backend:
- Python 3.12+
- Flask
- SQLite Database
- Flask-CORS

## 📋 Prerequisites

- Node.js (v16 or higher)
- Python 3.12 or higher
- pip (Python package manager)

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd ums
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python reset_database.py
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

## 🚀 Running the Application

### Start Backend Server

```bash
cd backend
python app.py
```

Backend will run on `http://127.0.0.1:5000`

### Start Frontend Server

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📝 Login Credentials

See `LOGIN_CREDENTIALS.md` for all teacher and student login credentials.

### Sample Credentials:

**Teacher:**
- Email: `aditya.gautam@gla.edu`
- Password: `teacher001`

**Student:**
- Email: `aarav.sharma@student.gla.edu`
- Password: `student001`

## 📊 Database

The application uses SQLite database (`ums_database.db`). 

To reset and populate the database with sample data:
```bash
cd backend
python reset_database.py
```

This will create:
- 10 Teachers (all with Computer Science subjects from Diploma)
- 20 Students (all enrolled in Diploma - Computer Science)

## 📁 Project Structure

```
ums/
├── backend/
│   ├── app/
│   │   └── __init__.py      # Flask application
│   ├── database.py           # Database functions
│   ├── reset_database.py     # Database reset script
│   ├── app.py               # Application entry point
│   ├── requirements.txt     # Python dependencies
│   └── uploads/             # File uploads directory
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── data/           # Static data
│   │   └── main.jsx        # React entry point
│   ├── package.json        # Node dependencies
│   └── vite.config.js      # Vite configuration
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Attendance
- `POST /api/attendance/mark` - Mark attendance
- `GET /api/attendance/class/<class_id>` - Get class attendance
- `GET /api/attendance/student/<student_id>` - Get student attendance

### Assignments
- `POST /api/assignments/create` - Create assignment (Teacher)
- `GET /api/teacher/<teacher_id>/assignments` - Get teacher assignments
- `POST /api/assignments/submit` - Submit assignment (Student)
- `GET /api/student/<student_id>/assignments` - Get student assignments
- `POST /api/assignments/grade` - Grade assignment (Teacher)

### Exams
- `POST /api/exams/create` - Create exam
- `GET /api/teacher/<teacher_id>/exams` - Get teacher exams
- `POST /api/exams/upload-marks` - Upload exam marks
- `GET /api/student/<student_id>/exam-results` - Get student exam results

### Classes
- `POST /api/classes/create` - Create class
- `GET /api/teacher/<teacher_id>/classes` - Get teacher classes

## 👥 Default Users

### Teachers (10 Total)
All teachers have Computer Science subjects from Diploma program:
1. Aditya Gautam - PC Assembling and Troubleshooting
2. Rohan Singh - Python Programming
3. Shubhanvi Bansal - Cryptography and Network Security
4. Ankita Srivastava - Mobile Application Development
5. Dr. Rajesh Kumar - Data Structures and Algorithms
6. Prof. Priya Sharma - Web Development
7. Dr. Amit Singh - Database Management Systems
8. Prof. Sunita Verma - Operating Systems
9. Dr. Vikram Patel - Computer Networks
10. Prof. Neha Gupta - Software Engineering

### Students (20 Total)
All students enrolled in Diploma - Computer Science program (Roll Numbers: DCS2023001 to DCS2023020)

## 📄 License

This project is for educational purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Note:** Make sure to keep your database credentials and API keys secure. Never commit sensitive information to the repository.
