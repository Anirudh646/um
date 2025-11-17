import sqlite3

# Connect to database
conn = sqlite3.connect('ums_database.db')
cursor = conn.cursor()

# Get all teachers
cursor.execute('SELECT name, email, password, subject, department FROM teachers')
teachers = cursor.fetchall()

print("TEACHER CREDENTIALS:")
print("=" * 80)

for i, teacher in enumerate(teachers, 1):
    name, email, password, subject, department = teacher
    print(f"{i}. Name: {name}")
    print(f"   Email: {email}")
    print(f"   Password: {password}")
    print(f"   Subject: {subject}")
    print(f"   Department: {department}")
    print("-" * 50)

# Also show students
cursor.execute('SELECT name, email, password, roll_number, class_name FROM students')
students = cursor.fetchall()

print("\nSTUDENT CREDENTIALS:")
print("=" * 80)

for i, student in enumerate(students, 1):
    name, email, password, roll_number, class_name = student
    print(f"{i}. Name: {name}")
    print(f"   Email: {email}")
    print(f"   Password: {password}")
    print(f"   Roll Number: {roll_number}")
    print(f"   Class: {class_name}")
    print("-" * 50)

conn.close()
