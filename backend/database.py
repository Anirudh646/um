import sqlite3
import os
from datetime import datetime, date, timedelta
from typing import List, Dict, Optional

DATABASE_PATH = 'ums_database.db'

def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_database():
    """Initialize database with all required tables"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create teachers table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS teachers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            subject TEXT NOT NULL,
            department TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create students table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            roll_number TEXT UNIQUE NOT NULL,
            class_name TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create subjects table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS subjects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            code TEXT UNIQUE NOT NULL,
            teacher_id INTEGER,
            FOREIGN KEY (teacher_id) REFERENCES teachers (id)
        )
    ''')

    # Ensure one subject per teacher
    cursor.execute('''
        CREATE UNIQUE INDEX IF NOT EXISTS idx_subjects_teacher ON subjects(teacher_id)
    ''')
    
    # Create classes table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS classes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            subject_id INTEGER NOT NULL,
            teacher_id INTEGER NOT NULL,
            schedule_time TEXT,
            room_number TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (subject_id) REFERENCES subjects (id),
            FOREIGN KEY (teacher_id) REFERENCES teachers (id)
        )
    ''')
    
    # Create attendance table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS attendance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            class_id INTEGER NOT NULL,
            date DATE NOT NULL,
            status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late')),
            marked_by INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES students (id),
            FOREIGN KEY (class_id) REFERENCES classes (id),
            FOREIGN KEY (marked_by) REFERENCES teachers (id),
            UNIQUE(student_id, class_id, date)
        )
    ''')
    
    # Create assignments table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS assignments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            subject_id INTEGER NOT NULL,
            teacher_id INTEGER NOT NULL,
            due_date DATE,
            max_marks INTEGER DEFAULT 100,
            file_path TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (subject_id) REFERENCES subjects (id),
            FOREIGN KEY (teacher_id) REFERENCES teachers (id)
        )
    ''')
    
    # Create assignment_submissions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS assignment_submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            assignment_id INTEGER NOT NULL,
            student_id INTEGER NOT NULL,
            file_path TEXT,
            submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            marks_obtained INTEGER,
            feedback TEXT,
            graded_by INTEGER,
            graded_at TIMESTAMP,
            FOREIGN KEY (assignment_id) REFERENCES assignments (id),
            FOREIGN KEY (student_id) REFERENCES students (id),
            FOREIGN KEY (graded_by) REFERENCES teachers (id),
            UNIQUE(assignment_id, student_id)
        )
    ''')
    
    # Create exams table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS exams (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            subject_id INTEGER NOT NULL,
            teacher_id INTEGER NOT NULL,
            exam_date DATE NOT NULL,
            max_marks INTEGER DEFAULT 100,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (subject_id) REFERENCES subjects (id),
            FOREIGN KEY (teacher_id) REFERENCES teachers (id)
        )
    ''')
    
    # Create exam_results table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS exam_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            exam_id INTEGER NOT NULL,
            student_id INTEGER NOT NULL,
            marks_obtained INTEGER NOT NULL,
            feedback TEXT,
            graded_by INTEGER NOT NULL,
            graded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (exam_id) REFERENCES exams (id),
            FOREIGN KEY (student_id) REFERENCES students (id),
            FOREIGN KEY (graded_by) REFERENCES teachers (id),
            UNIQUE(exam_id, student_id)
        )
    ''')
    
    conn.commit()
    conn.close()

def cleanup_unauthorized_teachers():
    """Remove all teachers that are not in the allowed list from student portal"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Allowed teacher emails (10 teachers with Computer Science subjects)
    allowed_emails = [
        'aditya.gautam@gla.edu',
        'rohan.singh@gla.edu',
        'shubhanvi.bansal@gla.edu',
        'ankita.srivastava@gla.edu',
        'rajesh.kumar@gla.edu',
        'priya.sharma@gla.edu',
        'amit.singh@gla.edu',
        'sunita.verma@gla.edu',
        'vikram.patel@gla.edu',
        'neha.gupta@gla.edu'
    ]
    
    # Delete teachers not in allowed list
    placeholders = ','.join(['?'] * len(allowed_emails))
    cursor.execute(f'''
        DELETE FROM teachers 
        WHERE email NOT IN ({placeholders})
    ''', allowed_emails)
    
    deleted_count = cursor.rowcount
    conn.commit()
    conn.close()
    
    if deleted_count > 0:
        print(f"Removed {deleted_count} unauthorized teacher(s) from database")
    
    return deleted_count

def create_sample_data():
    """Create sample data for testing"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # First, clean up any unauthorized teachers
    cleanup_unauthorized_teachers()
    
    # 10 Teachers - All with Computer Science subjects from Diploma
    teachers_data = [
        ('Aditya Gautam', 'aditya.gautam@gla.edu', 'teacher001', 'PC Assembling and Troubleshooting', 'Computer Science'),
        ('Rohan Singh', 'rohan.singh@gla.edu', 'teacher002', 'Python Programming', 'Computer Science'),
        ('Shubhanvi Bansal', 'shubhanvi.bansal@gla.edu', 'teacher003', 'Cryptography and Network Security', 'Computer Science'),
        ('Ankita Srivastava', 'ankita.srivastava@gla.edu', 'teacher004', 'Mobile Application Development', 'Computer Science'),
        ('Dr. Rajesh Kumar', 'rajesh.kumar@gla.edu', 'teacher005', 'Data Structures and Algorithms', 'Computer Science'),
        ('Prof. Priya Sharma', 'priya.sharma@gla.edu', 'teacher006', 'Web Development', 'Computer Science'),
        ('Dr. Amit Singh', 'amit.singh@gla.edu', 'teacher007', 'Database Management Systems', 'Computer Science'),
        ('Prof. Sunita Verma', 'sunita.verma@gla.edu', 'teacher008', 'Operating Systems', 'Computer Science'),
        ('Dr. Vikram Patel', 'vikram.patel@gla.edu', 'teacher009', 'Computer Networks', 'Computer Science'),
        ('Prof. Neha Gupta', 'neha.gupta@gla.edu', 'teacher010', 'Software Engineering', 'Computer Science')
    ]
    
    # Insert or update teachers (ensures they exist with correct data)
    for teacher in teachers_data:
        cursor.execute('''
            INSERT OR REPLACE INTO teachers (name, email, password, subject, department)
            VALUES (?, ?, ?, ?, ?)
        ''', teacher)
    
    # 20 Students - All in Diploma Computer Science program
    students_data = [
        ('Aarav Sharma', 'aarav.sharma@student.gla.edu', 'student001', 'DCS2023001', 'Diploma - Computer Science'),
        ('Priya Patel', 'priya.patel@student.gla.edu', 'student002', 'DCS2023002', 'Diploma - Computer Science'),
        ('Rahul Verma', 'rahul.verma@student.gla.edu', 'student003', 'DCS2023003', 'Diploma - Computer Science'),
        ('Sneha Reddy', 'sneha.reddy@student.gla.edu', 'student004', 'DCS2023004', 'Diploma - Computer Science'),
        ('Karan Malhotra', 'karan.malhotra@student.gla.edu', 'student005', 'DCS2023005', 'Diploma - Computer Science'),
        ('Ananya Gupta', 'ananya.gupta@student.gla.edu', 'student006', 'DCS2023006', 'Diploma - Computer Science'),
        ('Vikram Singh', 'vikram.singh@student.gla.edu', 'student007', 'DCS2023007', 'Diploma - Computer Science'),
        ('Meera Joshi', 'meera.joshi@student.gla.edu', 'student008', 'DCS2023008', 'Diploma - Computer Science'),
        ('Arjun Kumar', 'arjun.kumar@student.gla.edu', 'student009', 'DCS2023009', 'Diploma - Computer Science'),
        ('Isha Agarwal', 'isha.agarwal@student.gla.edu', 'student010', 'DCS2023010', 'Diploma - Computer Science'),
        ('Rohan Mehta', 'rohan.mehta@student.gla.edu', 'student011', 'DCS2023011', 'Diploma - Computer Science'),
        ('Sanya Shah', 'sanya.shah@student.gla.edu', 'student012', 'DCS2023012', 'Diploma - Computer Science'),
        ('Vishal Kapoor', 'vishal.kapoor@student.gla.edu', 'student013', 'DCS2023013', 'Diploma - Computer Science'),
        ('Kavya Agarwal', 'kavya.agarwal@student.gla.edu', 'student014', 'DCS2023014', 'Diploma - Computer Science'),
        ('Aditya Nair', 'aditya.nair@student.gla.edu', 'student015', 'DCS2023015', 'Diploma - Computer Science'),
        ('Nisha Iyer', 'nisha.iyer@student.gla.edu', 'student016', 'DCS2023016', 'Diploma - Computer Science'),
        ('Manish Menon', 'manish.menon@student.gla.edu', 'student017', 'DCS2023017', 'Diploma - Computer Science'),
        ('Divya Rao', 'divya.rao@student.gla.edu', 'student018', 'DCS2023018', 'Diploma - Computer Science'),
        ('Siddharth Kumar', 'siddharth.kumar@student.gla.edu', 'student019', 'DCS2023019', 'Diploma - Computer Science'),
        ('Riya Narayan', 'riya.narayan@student.gla.edu', 'student020', 'DCS2023020', 'Diploma - Computer Science')
    ]
    
    # Insert students
    cursor.executemany('''
        INSERT OR IGNORE INTO students (name, email, password, roll_number, class_name)
        VALUES (?, ?, ?, ?, ?)
    ''', students_data)
    
    # Create subjects for each teacher with proper codes
    subject_codes = [
        'DCS5010',  # PC Assembling and Troubleshooting
        'DCS5027',  # Python Programming
        'DCS5107',  # Cryptography and Network Security
        'DCS5108',  # Mobile Application Development
        'DCS5020',  # Data Structures and Algorithms
        'DCS5035',  # Web Development
        'DCS5030',  # Database Management Systems
        'DCS5040',  # Operating Systems
        'DCS5050',  # Computer Networks
        'DCS5060'   # Software Engineering
    ]
    
    cursor.execute('SELECT id, subject FROM teachers ORDER BY id')
    teachers = cursor.fetchall()
    
    for i, teacher in enumerate(teachers):
        if i < len(subject_codes):
            cursor.execute('''
                INSERT OR IGNORE INTO subjects (name, code, teacher_id)
                VALUES (?, ?, ?)
            ''', (teacher[1], subject_codes[i], teacher[0]))
    
    # Create sample classes
    cursor.execute('SELECT id, teacher_id FROM subjects LIMIT 5')
    subjects = cursor.fetchall()
    
    for i, subject in enumerate(subjects):
        cursor.execute('''
            INSERT OR IGNORE INTO classes (name, subject_id, teacher_id, schedule_time, room_number)
            VALUES (?, ?, ?, ?, ?)
        ''', (f'Subject {subject[0]} Class', subject[0], subject[1], 
              f'Monday {9+i}:00 AM', f'Room {101+i}'))
    
    conn.commit()
    conn.close()

# Database helper functions
def get_teacher_by_email(email: str) -> Optional[Dict]:
    """Get teacher by email"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM teachers WHERE email = ?', (email,))
    teacher = cursor.fetchone()
    conn.close()
    return dict(teacher) if teacher else None

def get_student_by_email(email: str) -> Optional[Dict]:
    """Get student by email"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM students WHERE email = ?', (email,))
    student = cursor.fetchone()
    conn.close()
    return dict(student) if student else None

def get_student_by_roll_number(roll_number: str) -> Optional[Dict]:
    """Get student by roll number (Student ID)"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM students WHERE roll_number = ?', (roll_number,))
    student = cursor.fetchone()
    conn.close()
    return dict(student) if student else None

def get_teacher_subjects(teacher_id: int) -> List[Dict]:
    """Get subjects taught by a teacher"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT s.*, t.name as teacher_name 
        FROM subjects s 
        JOIN teachers t ON s.teacher_id = t.id 
        WHERE s.teacher_id = ?
    ''', (teacher_id,))
    subjects = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return subjects

def get_all_students(limit: int | None = None) -> List[Dict]:
    """Get students, optionally limited to a maximum count"""
    conn = get_db_connection()
    cursor = conn.cursor()
    if limit is None:
        cursor.execute('SELECT * FROM students ORDER BY name')
        rows = cursor.fetchall()
    else:
        cursor.execute('SELECT * FROM students ORDER BY name LIMIT ?', (int(limit),))
        rows = cursor.fetchall()
    students = [dict(row) for row in rows]
    conn.close()
    return students

def get_classes_by_teacher(teacher_id: int) -> List[Dict]:
    """Get classes taught by a teacher"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT c.*, s.name as subject_name, s.code as subject_code
        FROM classes c
        JOIN subjects s ON c.subject_id = s.id
        WHERE c.teacher_id = ?
        ORDER BY c.created_at DESC
    ''', (teacher_id,))
    classes = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return classes

def create_class(name: str, subject_id: int, teacher_id: int, schedule_time: str | None = None, room_number: str | None = None) -> int:
    """Create a class for a teacher and subject"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO classes (name, subject_id, teacher_id, schedule_time, room_number)
        VALUES (?, ?, ?, ?, ?)
    ''', (name, subject_id, teacher_id, schedule_time, room_number))
    class_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return class_id

def mark_attendance(student_id: int, class_id: int, status: str, teacher_id: int, date_str: str | None = None) -> bool:
    """Mark attendance for a student.
    
    Late policy: If a student is marked 'late' 3 times in the same ISO week
    for the same class, the 3rd and subsequent 'late' in that week are
    automatically converted to 'absent'.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Use provided date or default to today
        attendance_date = date_str if date_str else date.today().isoformat()
        # Normalize to YYYY-MM-DD
        attendance_date_dt = datetime.fromisoformat(attendance_date).date()
        attendance_date = attendance_date_dt.isoformat()
        
        status_to_store = status
        if status.lower() == 'late':
            # Count existing 'late' marks in same ISO week for this student/class
            # ISO year-week pair
            iso_year, iso_week, _ = attendance_date_dt.isocalendar()
            cursor.execute('''
                SELECT COUNT(*) FROM attendance
                WHERE student_id = ? AND class_id = ?
                  AND status = 'late'
                  AND strftime('%Y', date) = ?
                  AND strftime('%W', date) = ?
            ''', (student_id, class_id, f"{iso_year:04d}", f"{iso_week:02d}"))
            late_count_this_week = int(cursor.fetchone()[0])
            # If this would be the 3rd or more late in the week, convert to absent
            if late_count_this_week >= 2:
                status_to_store = 'absent'
        
        cursor.execute('''
            INSERT OR REPLACE INTO attendance (student_id, class_id, date, status, marked_by)
            VALUES (?, ?, ?, ?, ?)
        ''', (student_id, class_id, attendance_date, status_to_store, teacher_id))
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(f"Error marking attendance: {e}")
        conn.close()
        return False

def get_attendance_by_class(class_id: int, date_str: str = None) -> List[Dict]:
    """Get attendance for a class on a specific date"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if date_str is None:
        date_str = date.today().isoformat()
    
    cursor.execute('''
        SELECT a.*, s.name as student_name, s.roll_number
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        WHERE a.class_id = ? AND a.date = ?
        ORDER BY s.name
    ''', (class_id, date_str))
    
    attendance = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return attendance

def get_attendance_by_student(student_id: int, start_date: str | None = None, end_date: str | None = None, limit: int = 50) -> List[Dict]:
    """Get attendance records for a student.
    
    If no date range is provided, returns most recent records up to `limit`.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        if start_date and end_date:
            cursor.execute('''
                SELECT a.*, c.name AS class_name, s.name AS subject_name
                FROM attendance a
                JOIN classes c ON a.class_id = c.id
                JOIN subjects s ON c.subject_id = s.id
                WHERE a.student_id = ? AND a.date BETWEEN ? AND ?
                ORDER BY a.date DESC
            ''', (student_id, start_date, end_date))
        else:
            cursor.execute('''
                SELECT a.*, c.name AS class_name, s.name AS subject_name
                FROM attendance a
                JOIN classes c ON a.class_id = c.id
                JOIN subjects s ON c.subject_id = s.id
                WHERE a.student_id = ?
                ORDER BY a.date DESC
                LIMIT ?
            ''', (student_id, int(limit)))
        rows = [dict(r) for r in cursor.fetchall()]
        conn.close()
        return rows
    except Exception as e:
        conn.close()
        return []

def create_assignment(title: str, description: str, subject_id: int, teacher_id: int, 
                     due_date: str, max_marks: int, file_path: str = None) -> int:
    """Create a new assignment"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO assignments (title, description, subject_id, teacher_id, due_date, max_marks, file_path)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (title, description, subject_id, teacher_id, due_date, max_marks, file_path))
    assignment_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return assignment_id

def get_assignments_by_teacher(teacher_id: int) -> List[Dict]:
    """Get assignments created by a teacher"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT a.*, s.name as subject_name
        FROM assignments a
        JOIN subjects s ON a.subject_id = s.id
        WHERE a.teacher_id = ?
        ORDER BY a.created_at DESC
    ''', (teacher_id,))
    assignments = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return assignments

def grade_assignment(assignment_id: int, student_id: int, marks: int, feedback: str, teacher_id: int) -> bool:
    """Grade an assignment"""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('''
            UPDATE assignment_submissions 
            SET marks_obtained = ?, feedback = ?, graded_by = ?, graded_at = CURRENT_TIMESTAMP
            WHERE assignment_id = ? AND student_id = ?
        ''', (marks, feedback, teacher_id, assignment_id, student_id))
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        conn.close()
        return False

def create_exam(name: str, subject_id: int, teacher_id: int, exam_date: str, max_marks: int = 100) -> int:
    """Create a new exam"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO exams (name, subject_id, teacher_id, exam_date, max_marks)
        VALUES (?, ?, ?, ?, ?)
    ''', (name, subject_id, teacher_id, exam_date, max_marks))
    exam_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return exam_id

def get_exams_by_teacher(teacher_id: int) -> List[Dict]:
    """Get exams created by a teacher"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT e.*, s.name as subject_name, s.code as subject_code
        FROM exams e
        JOIN subjects s ON e.subject_id = s.id
        WHERE e.teacher_id = ?
        ORDER BY e.exam_date DESC
    ''', (teacher_id,))
    exams = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return exams

def upload_exam_marks(exam_id: int, student_id: int, marks_obtained: int, feedback: str, teacher_id: int) -> bool:
    """Upload exam marks for a student"""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('''
            INSERT OR REPLACE INTO exam_results (exam_id, student_id, marks_obtained, feedback, graded_by, graded_at)
            VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ''', (exam_id, student_id, marks_obtained, feedback, teacher_id))
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(f"Error uploading exam marks: {e}")
        conn.close()
        return False

def get_exam_results(exam_id: int) -> List[Dict]:
    """Get all results for an exam"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT er.*, s.name as student_name, s.roll_number, s.email as student_email
        FROM exam_results er
        JOIN students s ON er.student_id = s.id
        WHERE er.exam_id = ?
        ORDER BY s.name
    ''', (exam_id,))
    results = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return results

def get_exam_results_by_student(student_id: int) -> List[Dict]:
    """Get all exam results for a student"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT er.*, e.name as exam_name, e.exam_date, e.max_marks, s.name as subject_name, s.code as subject_code
        FROM exam_results er
        JOIN exams e ON er.exam_id = e.id
        JOIN subjects s ON e.subject_id = s.id
        WHERE er.student_id = ?
        ORDER BY e.exam_date DESC
    ''', (student_id,))
    results = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return results

def submit_assignment(assignment_id: int, student_id: int, file_path: str = None) -> bool:
    """Submit an assignment by a student"""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('''
            INSERT OR REPLACE INTO assignment_submissions (assignment_id, student_id, file_path, submitted_at)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        ''', (assignment_id, student_id, file_path))
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(f"Error submitting assignment: {e}")
        conn.close()
        return False

def get_assignments_for_student(student_id: int) -> List[Dict]:
    """Get all assignments available for a student with their submission status"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT 
            a.*,
            s.name as subject_name,
            s.code as subject_code,
            t.name as teacher_name,
            sub.id as submission_id,
            sub.file_path as submission_file,
            sub.submitted_at,
            sub.marks_obtained,
            sub.feedback,
            sub.graded_at
        FROM assignments a
        JOIN subjects s ON a.subject_id = s.id
        JOIN teachers t ON a.teacher_id = t.id
        LEFT JOIN assignment_submissions sub ON a.id = sub.assignment_id AND sub.student_id = ?
        ORDER BY a.due_date DESC, a.created_at DESC
    ''', (student_id,))
    assignments = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return assignments

# Initialize database when module is imported
# Note: Sample data creation is now handled by reset_database.py script
# Uncomment the line below only if you want to auto-create sample data on import
init_database()
# create_sample_data()  # Disabled - use reset_database.py instead
