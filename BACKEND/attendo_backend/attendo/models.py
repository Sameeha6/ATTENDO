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
    role = models.CharField(max_length=15, default="HOD")

    def _str_(self):
        return f"HOD: {self.user.username if self.user else 'No User Assigned'} ({self.branch.name if self.branch else 'No Branch'})"