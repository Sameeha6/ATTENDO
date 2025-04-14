from django.db import models
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User

# Create your models here.
class Login(models.Model):
    username=models.CharField(max_length=100)
    password=models.CharField(max_length=100)
    def _str_(self):
        return self.username

class Branch(models.Model):
    name = models.CharField(max_length=100,blank=True,default="")

    def _str_(self):
        return f"{self.name}({self.id})"
    
class HOD(models.Model):
    username = models.CharField(max_length=150,null=True)
    email = models.EmailField(null=True)
    password = models.CharField(max_length=128,null=True)
    phone = models.CharField(max_length=15, null=True, blank=True)
    branch = models.ForeignKey('Branch', on_delete=models.CASCADE, null=True, blank=True, related_name="hods")
    role = models.CharField(max_length=15, default="HOD")

    def _str_(self):
        return f"HOD: {self.username} ({self.branch if self.branch else 'No Branch Assigned'})"

class Faculty(models.Model):
    username = models.CharField(max_length=150,null=True)
    password = models.CharField(max_length=128,null=True)
    email = models.EmailField(null=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name="faculties")
    role = models.CharField(max_length=15, default="faculty")

    def _str_(self):
        return f"{self.username} - {self.branch.name if self.branch else 'No Branch Assigned'}"

class Subject(models.Model):
    academic_year = models.CharField(max_length=10)
    semester = models.CharField(max_length=2)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE)
    subject_code = models.CharField(max_length=20, unique=True)
    subject_name = models.CharField(max_length=255)

    def _str_(self):
        return f"{self.subject_code} - {self.subject_name}"
    
class Tutor(models.Model):
    username = models.CharField(max_length=150,null=True)
    password = models.CharField(max_length=128,null=True)
    email = models.EmailField(null=True)
    phone_number = models.CharField(max_length=15, unique=True,default="")
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    academic_year = models.CharField(max_length=10)
    role = models.CharField(max_length=15, default="tutor")

    def _str_(self):
        return f"{self.username} ({self.branch.name})"
    
class Student(models.Model):
    username = models.CharField(max_length=150, unique=True, null=True)
    password = models.CharField(max_length=128, null=True) 
    student_id = models.CharField(max_length=20, null=True, unique=True)
    email = models.EmailField(unique=True, null=True)
    phone_number = models.CharField(max_length=15, null=True)
    academic_year = models.CharField(max_length=20, null=True)
    branch = models.ForeignKey('Branch', on_delete=models.SET_NULL, null=True)
    semester = models.CharField(max_length=10, null=True)
    role = models.CharField(max_length=15, default="student")

    def _str_(self):
        return f"{self.student_id} - {self.username}"

class Parent(models.Model):
    username = models.CharField(max_length=150, null=True)
    password = models.CharField(max_length=128, null=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, null=True)
    email = models.EmailField(null=True)
    phone_number = models.CharField(max_length=15, null=True)
    ward_name = models.CharField(max_length=20, null=True)
    ward_id = models.CharField(max_length=20, null=True)
    academic_year = models.CharField(max_length=20, null=True)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, null=True)
    semester = models.CharField(max_length=10, null=True)
    role = models.CharField(max_length=15, default="parent")

    def _str_(self):
        return f"{self.username} (Parent of {self.ward_name})"

class ContactMessage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)  
    subject = models.CharField(max_length=255)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return f"Message from {self.user.username} - {self.subject}"
        
class Timetable(models.Model):
    semester = models.CharField(max_length=2)
    day = models.CharField(max_length=10)
    time = models.TimeField()
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)

    def _str_(self):
        return f"{self.day} - {self.time} - Semester {self.semester} - {self.branch.name}"
    
class TimetableChangeRequest(models.Model):
    requester = models.ForeignKey(Faculty, on_delete=models.CASCADE, related_name="change_requests")
    timetable_entry = models.ForeignKey(Timetable, on_delete=models.CASCADE, related_name="change_requests")
    status = models.CharField(max_length=20, default="Pending") 
    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return f"{self.requester.username} → {self.timetable_entry} ({self.status})"
    
# class Attendance(models.Model):
#     student = models.ForeignKey(Student, on_delete=models.CASCADE)
#     date = models.DateField(default=timezone.now)
#     status = models.CharField(max_length=10, choices=[('Present', 'Present'), ('Absent', 'Absent')])

#     def _str_(self):
#         return f"{self.student.username} - {self.date} - {self.status}"