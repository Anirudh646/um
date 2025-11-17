#!/usr/bin/env python3
"""
Script to cleanup unauthorized teachers from database.
Removes all teachers except the 10 allowed ones from student portal.
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import cleanup_unauthorized_teachers

if __name__ == "__main__":
    print("Cleaning up unauthorized teachers...")
    deleted = cleanup_unauthorized_teachers()
    print(f"Cleanup complete. Removed {deleted} teacher(s).")
    print("\nAllowed teachers (10 total):")
    print("1. Aditya Gautam - aditya.gautam@gla.edu")
    print("2. Rohan Singh - rohan.singh@gla.edu")
    print("3. Shubhanvi Bansal - shubhanvi.bansal@gla.edu")
    print("4. Ankita Srivastava - ankita.srivastava@gla.edu")
    print("5. Dr. Rajesh Kumar - rajesh.kumar@gla.edu")
    print("6. Prof. Priya Sharma - priya.sharma@gla.edu")
    print("7. Dr. Amit Singh - amit.singh@gla.edu")
    print("8. Prof. Sunita Verma - sunita.verma@gla.edu")
    print("9. Dr. Vikram Patel - vikram.patel@gla.edu")
    print("10. Prof. Neha Gupta - neha.gupta@gla.edu")

