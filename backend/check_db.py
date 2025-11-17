import sqlite3
import os

# Check if database exists
if os.path.exists('ums_database.db'):
    print("Database exists!")
    
    # Connect to database
    conn = sqlite3.connect('ums_database.db')
    cursor = conn.cursor()
    
    # Check if teachers table exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='teachers'")
    if cursor.fetchone():
        print("Teachers table exists!")
        
        # Get teacher count
        cursor.execute("SELECT COUNT(*) FROM teachers")
        count = cursor.fetchone()[0]
        print(f"Number of teachers: {count}")
        
        if count > 0:
            # Get all teachers
            cursor.execute("SELECT name, email, password, subject FROM teachers")
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
        else:
            print("No teachers found in database!")
    else:
        print("Teachers table does not exist!")
    
    conn.close()
else:
    print("Database does not exist!")
