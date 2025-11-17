from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import sys
from werkzeug.utils import secure_filename
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import (
    get_teacher_by_email, get_student_by_email, get_student_by_roll_number, get_teacher_subjects,
    get_all_students, get_classes_by_teacher, mark_attendance, get_attendance_by_class,
    create_assignment, get_assignments_by_teacher, grade_assignment, create_class,
    get_attendance_by_student, create_exam, get_exams_by_teacher, upload_exam_marks,
    get_exam_results, get_exam_results_by_student, submit_assignment, get_assignments_for_student
)



def create_app() -> Flask:
    app = Flask(__name__)

    # Basic config
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret-key")
    app.config["UPLOAD_FOLDER"] = "uploads"
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    # Enable CORS for frontend (supports both development and production)
    frontend_origins = os.environ.get("FRONTEND_ORIGINS", "").split(",")
    if not frontend_origins or frontend_origins == [""]:
        # Default to localhost for development
        frontend_origins = [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:5174",
            "http://127.0.0.1:5174",
        ]
    else:
        # Filter out empty strings
        frontend_origins = [origin.strip() for origin in frontend_origins if origin.strip()]
    
    CORS(
        app,
        resources={r"/api/*": {
            "origins": frontend_origins,
            "supports_credentials": True,
        }},
        expose_headers=["Content-Type", "Authorization"],
    )

    @app.get("/api/health")
    def health() -> tuple:
        return jsonify({"status": "ok", "service": "gla-ums-backend"}), 200

    @app.post("/api/auth/login")
    def login():
        data = request.get_json(silent=True) or {}
        email = (data.get("email") or "").strip().lower()
        student_id = (data.get("student_id") or "").strip()  # Support Student ID (roll_number)
        password = data.get("password") or ""

        if not password:
            return jsonify({"ok": False, "message": "Password is required."}), 400

        # Check if user is a teacher (requires email)
        if email:
            teacher = get_teacher_by_email(email)
            if teacher and teacher["password"] == password:
                return jsonify({
                    "ok": True, 
                    "user": {
                        "id": teacher["id"],
                        "name": teacher["name"],
                        "email": teacher["email"],
                        "role": "teacher",
                        "subject": teacher["subject"],
                        "department": teacher["department"]
                    }, 
                    "token": "teacher-token"
                }), 200

        # Check if user is a student (by email or Student ID/roll_number)
        student = None
        if email:
            student = get_student_by_email(email)
        elif student_id:
            student = get_student_by_roll_number(student_id)
        
        if student and student["password"] == password:
            return jsonify({
                "ok": True, 
                "user": {
                    "id": student["id"],
                    "name": student["name"],
                    "email": student["email"],
                    "role": "student",
                    "roll_number": student["roll_number"],
                    "class_name": student["class_name"]
                }, 
                "token": "student-token"
            }), 200

        return jsonify({"ok": False, "message": "Invalid credentials."}), 401

    # Teacher endpoints
    @app.get("/api/teacher/<int:teacher_id>/subjects")
    def get_teacher_subjects_api(teacher_id):
        subjects = get_teacher_subjects(teacher_id)
        return jsonify({"ok": True, "subjects": subjects}), 200

    @app.get("/api/teacher/<int:teacher_id>/classes")
    def get_teacher_classes_api(teacher_id):
        classes = get_classes_by_teacher(teacher_id)
        return jsonify({"ok": True, "classes": classes}), 200

    @app.get("/api/students")
    def get_students_api():
        # Default to 20 students for faculty portal view unless overridden
        try:
            limit_param = request.args.get("limit", default="20")
            limit = int(limit_param) if limit_param is not None else None
        except ValueError:
            limit = 20
        students = get_all_students(limit)
        return jsonify({"ok": True, "students": students, "limit": limit}), 200

    @app.post("/api/attendance/mark")
    def mark_attendance_api():
        data = request.get_json()
        student_id = data.get("student_id")
        class_id = data.get("class_id")
        status = data.get("status")
        teacher_id = data.get("teacher_id")
        date_str = data.get("date")  # Optional: if not provided, uses today's date

        if not all([student_id, class_id, status, teacher_id]):
            return jsonify({"ok": False, "message": "Missing required fields"}), 400

        success = mark_attendance(student_id, class_id, status, teacher_id, date_str)
        if success:
            return jsonify({"ok": True, "message": "Attendance marked successfully"}), 200
        else:
            return jsonify({"ok": False, "message": "Failed to mark attendance"}), 500

    @app.get("/api/attendance/class/<int:class_id>")
    def get_class_attendance_api(class_id):
        date_str = request.args.get("date")
        attendance = get_attendance_by_class(class_id, date_str)
        return jsonify({"ok": True, "attendance": attendance}), 200

    # Student attendance view (only what faculty has uploaded)
    @app.get("/api/attendance/student/<int:student_id>")
    def get_student_attendance_api(student_id):
        start_date = request.args.get("start")
        end_date = request.args.get("end")
        try:
            limit = int(request.args.get("limit", "50"))
        except ValueError:
            limit = 50

        records = get_attendance_by_student(student_id, start_date, end_date, limit)
        return jsonify({"ok": True, "attendance": records}), 200

    @app.post("/api/assignments/create")
    def create_assignment_api():
        file_path = None
        if request.content_type and request.content_type.startswith("multipart/form-data"):
            form = request.form
            title = form.get("title")
            description = form.get("description")
            subject_id = form.get("subject_id")
            teacher_id = form.get("teacher_id")
            due_date = form.get("due_date")
            max_marks = form.get("max_marks", 100)

            upload = request.files.get("file")
            if upload and upload.filename:
                fname = secure_filename(upload.filename)
                fname = f"{teacher_id}_{fname}"
                upload.save(os.path.join(app.config["UPLOAD_FOLDER"], fname))
                file_path = fname
        else:
            data = request.get_json(silent=True) or {}
            title = data.get("title")
            description = data.get("description")
            subject_id = data.get("subject_id")
            teacher_id = data.get("teacher_id")
            due_date = data.get("due_date")
            max_marks = data.get("max_marks", 100)
            file_path = data.get("file_path")

        if not all([title, subject_id, teacher_id, due_date]):
            return jsonify({"ok": False, "message": "Missing required fields"}), 400

        assignment_id = create_assignment(title, description, int(subject_id), int(teacher_id), due_date, int(max_marks), file_path)
        return jsonify({"ok": True, "assignment_id": assignment_id, "message": "Assignment created successfully"}), 201

    @app.post("/api/classes/create")
    def create_class_api():
        data = request.get_json()
        name = data.get("name")
        subject_id = data.get("subject_id")
        teacher_id = data.get("teacher_id")
        schedule_time = data.get("schedule_time")
        room_number = data.get("room_number")

        if not all([name, subject_id, teacher_id]):
            return jsonify({"ok": False, "message": "Missing required fields"}), 400

        new_id = create_class(name, subject_id, teacher_id, schedule_time, room_number)
        return jsonify({"ok": True, "class_id": new_id, "message": "Class created successfully"}), 201

    @app.get("/api/teacher/<int:teacher_id>/assignments")
    def get_teacher_assignments_api(teacher_id):
        assignments = get_assignments_by_teacher(teacher_id)
        for a in assignments:
            if a.get("file_path"):
                a["file_url"] = f"/uploads/{a['file_path']}"
        return jsonify({"ok": True, "assignments": assignments}), 200

    @app.post("/api/assignments/grade")
    def grade_assignment_api():
        data = request.get_json()
        assignment_id = data.get("assignment_id")
        student_id = data.get("student_id")
        marks = data.get("marks")
        feedback = data.get("feedback")
        teacher_id = data.get("teacher_id")

        if not all([assignment_id, student_id, marks, teacher_id]):
            return jsonify({"ok": False, "message": "Missing required fields"}), 400

        success = grade_assignment(assignment_id, student_id, marks, feedback, teacher_id)
        if success:
            return jsonify({"ok": True, "message": "Assignment graded successfully"}), 200
        else:
            return jsonify({"ok": False, "message": "Failed to grade assignment"}), 500

    @app.get('/uploads/<path:filename>')
    def uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=False)

    # Exam endpoints
    @app.post("/api/exams/create")
    def create_exam_api():
        data = request.get_json()
        name = data.get("name")
        subject_id = data.get("subject_id")
        teacher_id = data.get("teacher_id")
        exam_date = data.get("exam_date")
        max_marks = data.get("max_marks", 100)

        if not all([name, subject_id, teacher_id, exam_date]):
            return jsonify({"ok": False, "message": "Missing required fields"}), 400

        exam_id = create_exam(name, int(subject_id), int(teacher_id), exam_date, int(max_marks))
        return jsonify({"ok": True, "exam_id": exam_id, "message": "Exam created successfully"}), 201

    @app.get("/api/teacher/<int:teacher_id>/exams")
    def get_teacher_exams_api(teacher_id):
        exams = get_exams_by_teacher(teacher_id)
        return jsonify({"ok": True, "exams": exams}), 200

    @app.post("/api/exams/upload-marks")
    def upload_exam_marks_api():
        data = request.get_json()
        exam_id = data.get("exam_id")
        student_id = data.get("student_id")
        marks_obtained = data.get("marks_obtained")
        feedback = data.get("feedback", "")
        teacher_id = data.get("teacher_id")

        if not all([exam_id, student_id, marks_obtained is not None, teacher_id]):
            return jsonify({"ok": False, "message": "Missing required fields"}), 400

        success = upload_exam_marks(int(exam_id), int(student_id), int(marks_obtained), feedback, int(teacher_id))
        if success:
            return jsonify({"ok": True, "message": "Exam marks uploaded successfully"}), 200
        else:
            return jsonify({"ok": False, "message": "Failed to upload exam marks"}), 500

    @app.get("/api/exams/<int:exam_id>/results")
    def get_exam_results_api(exam_id):
        results = get_exam_results(exam_id)
        return jsonify({"ok": True, "results": results}), 200

    @app.get("/api/student/<int:student_id>/exam-results")
    def get_student_exam_results_api(student_id):
        results = get_exam_results_by_student(student_id)
        return jsonify({"ok": True, "results": results}), 200

    # Student assignment endpoints
    @app.get("/api/student/<int:student_id>/assignments")
    def get_student_assignments_api(student_id):
        assignments = get_assignments_for_student(student_id)
        for a in assignments:
            if a.get("file_path"):
                a["file_url"] = f"/uploads/{a['file_path']}"
            if a.get("submission_file"):
                a["submission_url"] = f"/uploads/{a['submission_file']}"
        return jsonify({"ok": True, "assignments": assignments}), 200

    @app.post("/api/assignments/submit")
    def submit_assignment_api():
        file_path = None
        if request.content_type and request.content_type.startswith("multipart/form-data"):
            form = request.form
            assignment_id = form.get("assignment_id")
            student_id = form.get("student_id")

            upload = request.files.get("file")
            if upload and upload.filename:
                fname = secure_filename(upload.filename)
                fname = f"submission_{student_id}_{assignment_id}_{fname}"
                upload.save(os.path.join(app.config["UPLOAD_FOLDER"], fname))
                file_path = fname
        else:
            data = request.get_json(silent=True) or {}
            assignment_id = data.get("assignment_id")
            student_id = data.get("student_id")
            file_path = data.get("file_path")

        if not all([assignment_id, student_id]):
            return jsonify({"ok": False, "message": "Missing required fields"}), 400

        success = submit_assignment(int(assignment_id), int(student_id), file_path)
        if success:
            return jsonify({"ok": True, "message": "Assignment submitted successfully"}), 200
        else:
            return jsonify({"ok": False, "message": "Failed to submit assignment"}), 500

    return app


