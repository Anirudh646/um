import sqlite3
import os
from datetime import datetime, date

DATABASE_PATH = 'ums_database.db'

def init_database():
    """Initialize database with all required tables"""
    conn = sqlite3.connect(DATABASE_PATH)
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

def create_sample_data():
    """Create sample data for testing"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Sample teachers with subjects
    teachers_data = [
        ('Dr. Rajesh Kumar', 'rajesh.kumar@gla.edu', 'password123', 'Mathematics', 'Engineering'),
        ('Prof. Priya Sharma', 'priya.sharma@gla.edu', 'password123', 'Physics', 'Science'),
        ('Dr. Amit Singh', 'amit.singh@gla.edu', 'password123', 'Chemistry', 'Science'),
        ('Prof. Sunita Verma', 'sunita.verma@gla.edu', 'password123', 'Computer Science', 'Engineering'),
        ('Dr. Vikram Patel', 'vikram.patel@gla.edu', 'password123', 'English Literature', 'Arts'),
        ('Prof. Neha Gupta', 'neha.gupta@gla.edu', 'password123', 'Business Studies', 'Commerce'),
        ('Dr. Ravi Tiwari', 'ravi.tiwari@gla.edu', 'password123', 'History', 'Arts'),
        ('Prof. Kavita Joshi', 'kavita.joshi@gla.edu', 'password123', 'Biology', 'Science'),
        ('Dr. Suresh Kumar', 'suresh.kumar@gla.edu', 'password123', 'Economics', 'Commerce'),
        ('Prof. Meera Singh', 'meera.singh@gla.edu', 'password123', 'Psychology', 'Arts')
    ]
    
    # Insert teachers
    cursor.executemany('''
        INSERT OR IGNORE INTO teachers (name, email, password, subject, department)
        VALUES (?, ?, ?, ?, ?)
    ''', teachers_data)
    
    # Sample students
    students_data = [
        ('Arjun Sharma', 'arjun.sharma@student.gla.edu', 'student123', 'CS001', 'Computer Science'),
        ('Priya Patel', 'priya.patel@student.gla.edu', 'student123', 'CS002', 'Computer Science'),
        ('Rahul Kumar', 'rahul.kumar@student.gla.edu', 'student123', 'CS003', 'Computer Science'),
        ('Sneha Singh', 'sneha.singh@student.gla.edu', 'student123', 'CS004', 'Computer Science'),
        ('Vikram Tiwari', 'vikram.tiwari@student.gla.edu', 'student123', 'CS005', 'Computer Science'),
        ('Ananya Verma', 'ananya.verma@student.gla.edu', 'student123', 'CS006', 'Computer Science'),
        ('Karan Joshi', 'karan.joshi@student.gla.edu', 'student123', 'CS007', 'Computer Science'),
        ('Divya Gupta', 'divya.gupta@student.gla.edu', 'student123', 'CS008', 'Computer Science'),
        ('Rohit Sharma', 'rohit.sharma@student.gla.edu', 'student123', 'CS009', 'Computer Science'),
        ('Pooja Patel', 'pooja.patel@student.gla.edu', 'student123', 'CS010', 'Computer Science'),
        ('Amit Kumar', 'amit.kumar@student.gla.edu', 'student123', 'CS011', 'Computer Science'),
        ('Kavya Singh', 'kavya.singh@student.gla.edu', 'student123', 'CS012', 'Computer Science'),
        ('Raj Tiwari', 'raj.tiwari@student.gla.edu', 'student123', 'CS013', 'Computer Science'),
        ('Shreya Verma', 'shreya.verma@student.gla.edu', 'student123', 'CS014', 'Computer Science'),
        ('Manish Joshi', 'manish.joshi@student.gla.edu', 'student123', 'CS015', 'Computer Science'),
        ('Riya Gupta', 'riya.gupta@student.gla.edu', 'student123', 'CS016', 'Computer Science'),
        ('Suresh Sharma', 'suresh.sharma@student.gla.edu', 'student123', 'CS017', 'Computer Science'),
        ('Neha Patel', 'neha.patel@student.gla.edu', 'student123', 'CS018', 'Computer Science'),
        ('Vishal Kumar', 'vishal.kumar@student.gla.edu', 'student123', 'CS019', 'Computer Science'),
        ('Deepika Singh', 'deepika.singh@student.gla.edu', 'student123', 'CS020', 'Computer Science')
    ]
    
    # Insert students
    cursor.executemany('''
        INSERT OR IGNORE INTO students (name, email, password, roll_number, class_name)
        VALUES (?, ?, ?, ?, ?)
    ''', students_data)
    
    # Create subjects for each teacher
    cursor.execute('SELECT id, subject FROM teachers')
    teachers = cursor.fetchall()
    
    for teacher in teachers:
        cursor.execute('''
            INSERT OR IGNORE INTO subjects (name, code, teacher_id)
            VALUES (?, ?, ?)
        ''', (teacher[1], f'{teacher[1].replace(" ", "").upper()[:3]}101', teacher[0]))
    
    # Create sample classes
    cursor.execute('SELECT id, subject_id, teacher_id FROM subjects LIMIT 5')
    subjects = cursor.fetchall()
    
    for i, subject in enumerate(subjects):
        cursor.execute('''
            INSERT OR IGNORE INTO classes (name, subject_id, teacher_id, schedule_time, room_number)
            VALUES (?, ?, ?, ?, ?)
        ''', (f'{subject[1]} Class', subject[1], subject[2], 
              f'Monday {9+i}:00 AM', f'Room {101+i}'))
    
    conn.commit()
    conn.close()
    print("Sample data created successfully!")

if __name__ == "__main__":
    init_database()
    create_sample_data()
    
    # Now show the credentials
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Get all teachers
    cursor.execute('SELECT name, email, password, subject FROM teachers')
    teachers = cursor.fetchall()
    
    print("\nTEACHER CREDENTIALS:")
    print("=" * 60)
    for i, teacher in enumerate(teachers, 1):
        name, email, password, subject = teacher
        print(f"{i}. {name}")
        print(f"   Email: {email}")
        print(f"   Password: {password}")
        print(f"   Subject: {subject}")
        print("-" * 40)
    
    # Get all students
    cursor.execute('SELECT name, email, password, roll_number FROM students')
    students = cursor.fetchall()
    
    print("\nSTUDENT CREDENTIALS:")
    print("=" * 60)
    for i, student in enumerate(students, 1):
        name, email, password, roll_number = student
        print(f"{i}. {name}")
        print(f"   Email: {email}")
        print(f"   Password: {password}")
        print(f"   Roll Number: {roll_number}")
        print("-" * 40)
    
    conn.close()
