"""
Script to reset and populate database with 10 teachers and 20 students
All teachers have Computer Science subjects from Diploma
"""
import sqlite3
import os
from database import DATABASE_PATH, get_db_connection, init_database

def delete_all_data():
    """Delete all data from database tables"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Delete in order to respect foreign key constraints
    tables = [
        'exam_results',
        'exams',
        'assignment_submissions',
        'assignments',
        'attendance',
        'classes',
        'subjects',
        'students',
        'teachers'
    ]
    
    for table in tables:
        cursor.execute(f'DELETE FROM {table}')
        print(f'Deleted all records from {table}')
    
    conn.commit()
    conn.close()
    print("\nAll database data deleted successfully!\n")

def create_new_data():
    """Create 10 teachers and 20 students with Computer Science subjects"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
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
    
    # Insert teachers
    teacher_ids = []
    for teacher in teachers_data:
        cursor.execute('''
            INSERT INTO teachers (name, email, password, subject, department)
            VALUES (?, ?, ?, ?, ?)
        ''', teacher)
        teacher_ids.append(cursor.lastrowid)
        print(f'Created teacher: {teacher[0]} - {teacher[3]}')
    
    # 20 Students
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
    student_ids = []
    for student in students_data:
        cursor.execute('''
            INSERT INTO students (name, email, password, roll_number, class_name)
            VALUES (?, ?, ?, ?, ?)
        ''', student)
        student_ids.append(cursor.lastrowid)
        print(f'Created student: {student[0]} - {student[3]}')
    
    # Create subjects for each teacher
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
    
    subject_ids = []
    for i, teacher_id in enumerate(teacher_ids):
        subject_name = teachers_data[i][3]
        subject_code = subject_codes[i]
        cursor.execute('''
            INSERT INTO subjects (name, code, teacher_id)
            VALUES (?, ?, ?)
        ''', (subject_name, subject_code, teacher_id))
        subject_ids.append(cursor.lastrowid)
        print(f'Created subject: {subject_name} ({subject_code}) for teacher {teachers_data[i][0]}')
    
    conn.commit()
    conn.close()
    
    print("\n" + "="*80)
    print("Database populated successfully!")
    print("="*80)
    print(f"\nCreated {len(teachers_data)} teachers")
    print(f"Created {len(students_data)} students")
    print(f"Created {len(subject_ids)} subjects")
    print("\n")

def generate_credentials_file():
    """Generate a credentials file for teachers and students"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get all teachers
    cursor.execute('SELECT name, email, password, subject FROM teachers ORDER BY name')
    teachers = cursor.fetchall()
    
    # Get all students
    cursor.execute('SELECT name, email, password, roll_number FROM students ORDER BY roll_number')
    students = cursor.fetchall()
    
    conn.close()
    
    # Generate credentials document
    credentials = []
    credentials.append("# Login Credentials for UMS Application\n")
    credentials.append("## Teachers (10 Total)\n")
    credentials.append("All teachers have Computer Science subjects from Diploma program.\n")
    credentials.append("\n| # | Name | Email | Password | Subject |\n")
    credentials.append("|---|------|-------|----------|----------|\n")
    
    for i, teacher in enumerate(teachers, 1):
        name, email, password, subject = teacher
        credentials.append(f"| {i} | {name} | {email} | {password} | {subject} |\n")
    
    credentials.append("\n## Students (20 Total)\n")
    credentials.append("All students are enrolled in Diploma - Computer Science program.\n")
    credentials.append("\n| # | Name | Email | Password | Roll Number |\n")
    credentials.append("|---|------|-------|----------|-------------|\n")
    
    for i, student in enumerate(students, 1):
        name, email, password, roll_number = student
        credentials.append(f"| {i} | {name} | {email} | {password} | {roll_number} |\n")
    
    credentials.append("\n## Login Instructions\n")
    credentials.append("### For Teachers:\n")
    credentials.append("1. Click on 'Login' button\n")
    credentials.append("2. Select 'Teacher Login'\n")
    credentials.append("3. Enter your **Email** (e.g., aditya.gautam@gla.edu)\n")
    credentials.append("4. Enter your **Password** (e.g., teacher001)\n")
    credentials.append("5. Click 'Login'\n")
    credentials.append("\n### For Students:\n")
    credentials.append("1. Click on 'Login' button\n")
    credentials.append("2. Select 'Student Login'\n")
    credentials.append("3. Enter your **Email** (e.g., aarav.sharma@student.gla.edu)\n")
    credentials.append("4. Enter your **Password** (e.g., student001)\n")
    credentials.append("5. Click 'Login'\n")
    
    credentials.append("\n## Teacher Capabilities\n")
    credentials.append("- Upload attendance for their subject\n")
    credentials.append("- Create assignments with document upload\n")
    credentials.append("- Grade assignments submitted by students\n")
    credentials.append("- Upload marks after exam completion\n")
    credentials.append("- View and update timetable for their specific subject\n")
    
    credentials.append("\n## Student Capabilities\n")
    credentials.append("- Upload assignments\n")
    credentials.append("- View attendance (updated when teacher uploads it)\n")
    credentials.append("- View timetable\n")
    credentials.append("- View grades and marks\n")
    
    # Write to file
    with open('LOGIN_CREDENTIALS.md', 'w', encoding='utf-8') as f:
        f.writelines(credentials)
    
    print("="*80)
    print("Credentials file generated: LOGIN_CREDENTIALS.md")
    print("="*80)

if __name__ == '__main__':
    print("="*80)
    print("RESETTING DATABASE")
    print("="*80)
    print("\nStep 1: Initializing database structure...")
    init_database()
    
    print("\nStep 2: Deleting all existing data...")
    delete_all_data()
    
    print("\nStep 3: Creating new data (10 teachers, 20 students)...")
    create_new_data()
    
    print("\nStep 4: Generating credentials file...")
    generate_credentials_file()
    
    print("\n" + "="*80)
    print("DATABASE RESET COMPLETE!")
    print("="*80)
    print("\nNext steps:")
    print("1. Check LOGIN_CREDENTIALS.md for all login credentials")
    print("2. Restart your backend server if it's running")
    print("3. Test login with the new credentials")
    print("="*80)

