from django.db import models
# from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User


class Login(models.Model):
    username=models.CharField(max_length=100)
    password=models.CharField(max_length=100)
    def __str__(self):
        return self.username
    

class Branch(models.Model):
    name = models.CharField(max_length=100, unique=True)
    def _str_(self):
        return f"{self.name} ({self.id})"
    
class HOD(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True, related_name="hods")
    phone = models.CharField(max_length=15, unique=True, null=True, blank=True)
    email = models.EmailField(max_length=50, unique=True, null=True, blank=True)
    role = models.CharField(max_length=15, default="HOD")

    def _str_(self):
        return f"HOD: {self.user.username if self.user else 'No User Assigned'} ({self.branch.name if self.branch else 'No Branch'})"
    
class Faculty(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    email = models.EmailField(max_length=50, unique=True, null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True)
    branch = models.ForeignKey('Branch', on_delete=models.CASCADE, related_name="faculties")
    role = models.CharField(max_length=15, default="faculty")

    def str(self):
        return f"{self.user.username} - {self.branch.name if self.branch else 'No Branch Assigned'}"
    
class Subject(models.Model):
    academic_year = models.CharField(max_length=10,default=".")
    semester = models.CharField(max_length=5,default="")
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE,default="")
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE,default="")
    subject_code = models.CharField(max_length=20, unique=True,default="")
    subject_name = models.CharField(max_length=255,default="")

    def _str_(self):
        return f"{self.subject_code} - {self.subject_name}"
    
class Tutor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=10, null=True)
    branch = models.ForeignKey('Branch', on_delete=models.CASCADE, related_name="tutors")
    academic_year = models.CharField(max_length=10)
    role = models.CharField(max_length=15, default="tutor")

    def __str__(self):
        return self.user.username

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    student_id = models.CharField(max_length=20, null=True)
    email = models.EmailField(unique=True, null=True)
    phone_number = models.CharField(max_length=15, null=True)
    academic_year = models.CharField(max_length=10, null=True)
    branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True)
    semester = models.CharField(max_length=10, null=True)
    # role = models.CharField(max_length=15, default="student")


    def _str_(self):
        return f"{self.student_id} - {self.user.username}"
