from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password
from rest_framework import serializers
from .models import *
from django.core.mail import send_mail
import random
from django.conf import settings


class UserLoginSerializer(serializers.Serializer):
    username=serializers.CharField()
    password=serializers.CharField()

    def validate(self,data):
        username=data["username"]
        password=data["password"]

        admin_user = User.objects.filter(username=username,is_superuser=True).first()
        if admin_user and admin_user.check_password(password):
            return {
                "username":admin_user.username,
                "role":"admin",
                "message":"Admin login successfull",
            }
        
        user = User.objects.filter(username=username).first()
        if user and user.check_password(password):
            hod = HOD.objects.filter(user=user).first()
            if hod:
                return {
                    "username": user.username,
                    "role": "hod",
                    "branch": hod.branch.name,
                    "message": "HOD login successful",
                }
            else:
                raise serializers.ValidationError("Your account not found.")
            
        raise serializers.ValidationError("Invalid credentials.Try again.")
    
 

class BranchSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=100)

    def create(self, validated_data):
        name = validated_data["name"]
        branch = Branch.objects.create(name=name)
        print("Branch ID:", branch.id)
        return branch
    

class HODRegisterSerializer(serializers.Serializer):

    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=15)
    branch = serializers.PrimaryKeyRelatedField(queryset=Branch.objects.all())
    print(username)

    def generate_random_password(self, length=12):
        words = ["Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Gamma", "Hawk", "Titan", "Zebra"]
        special_chars = "@!#$%&*"

        word1 = random.choice(words)
        word2 = random.choice(words)
        number = str(random.randint(10, 99))
        symbol = random.choice(special_chars)

        password = f"{word1}{symbol}{word2}{number}"
        return password

    def create(self, validated_data):
        username = validated_data["username"]
        email = validated_data["email"]
        phone = validated_data["phone"]
        branch = validated_data["branch"]

        random_password = self.generate_random_password()

        user = User.objects.create(username=username, email=email)
        user.set_password(random_password)
        user.save()

        hod = HOD.objects.create(user=user, branch=branch, phone=phone, role="hod")
        print(hod)


        send_mail(
            subject="HOD Registration Successful",
            message=f"Dear {username},\nYou have been registered as an HOD.\nUsername: {username}\nPassword: {random_password}\nPlease login.",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            fail_silently=False,
        )

        return hod
