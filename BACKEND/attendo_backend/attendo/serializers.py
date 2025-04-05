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
    
    def update(self, instance, validated_data):
        """Handles updating an existing branch"""
        instance.name = validated_data.get("name", instance.name)  # Update name if provided
        instance.save()  # Save changes to the database
        return instance
    

class HODRegisterSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
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
    
class HODDetailSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(source="user.username") 
    email = serializers.EmailField(source="user.email")  
    branch = serializers.PrimaryKeyRelatedField(read_only=True)
    phone = serializers.CharField(max_length=15)
    role = serializers.CharField(max_length=50, read_only=True)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["branch"] = instance.branch.name if instance.branch else None  
        return data

    def update(self, instance, validated_data):
        user = instance.user
        user_data = validated_data.pop("user", {})  
        if "username" in user_data:
            user.username = user_data["username"]
        if "email" in user_data:
            user.email = user_data["email"]
        user.save()  

        instance.branch = validated_data.get("branch", instance.branch)
        instance.phone = validated_data.get("phone", instance.phone)
        instance.role = validated_data.get("role", instance.role)

        instance.save()  
        return instance
    
class FacultyRegisterSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(source="user.username",max_length=150)
    email = serializers.EmailField(source="user.email")
    phone_number = serializers.CharField(max_length=15)
    branch = serializers.PrimaryKeyRelatedField(queryset=Branch.objects.all())  
    branch_name = serializers.CharField(source="branch.name", read_only=True) 
    role = serializers.CharField(max_length=50, read_only=True)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def generate_random_password(self, length=12):
        words = ["Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Gamma", "Hawk", "Titan", "Zebra"]
        special_chars = "!@#$%^&*"

        if not words or not special_chars:
            raise ValueError("Word list or special character list is empty!")

        word1 = random.choice(words)
        word2 = random.choice(words)
        number = str(random.randint(10, 99))
        symbol = random.choice(special_chars)

        password = f"{word1}{symbol}{word2}{number}"
        return password

    def create(self, validated_data):
        user_data = validated_data.pop("user")  # user is a nested dictionary
        username = user_data["username"]
        email = user_data["email"]
        phone_number = validated_data["phone_number"]
        branch = validated_data["branch"] 

        print(validated_data)

        random_password = self.generate_random_password()
        user = User.objects.create(username=username, email=email)
        user.set_password(random_password)  
        user.save()
        faculty = Faculty.objects.create(user=user, phone_number=phone_number, branch=branch)
        try:
            send_mail(
                subject="Faculty Registration Successful",
                message=f"Dear {username},\n\nYou have been registered as a faculty member.\n\n"
                        f"Username: {username}\nPassword: {random_password}\n\n"
                        "Please log in and change your password for security reasons.",
                from_email=settings.EMAIL_HOST_USER,  
                recipient_list=[email],
                fail_silently=False,
            )
        except Exception as e:
            print(f"Error sending email: {str(e)}")  

        return faculty
    
    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", {})
        user = instance.user
        user.username = user_data.get("username", user.username)
        user.email = user_data.get("email", user.email)
        user.save()
        instance.phone_number = validated_data.get("phone_number", instance.phone_number)
        instance.branch = validated_data.get("branch", instance.branch)
        instance.save()

        return instance
    


class SubjectSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    academic_year = serializers.CharField(max_length=10)
    semester = serializers.CharField()
    branch = serializers.PrimaryKeyRelatedField(queryset=Branch.objects.all(), write_only=True)
    faculty = serializers.PrimaryKeyRelatedField(queryset=Faculty.objects.all(), write_only=True)
    branch_name = serializers.SerializerMethodField()
    faculty_name = serializers.SerializerMethodField()
    subject_code = serializers.CharField(max_length=20)
    subject_name = serializers.CharField(max_length=255)

    def get_branch_name(self, obj):
        return obj.branch.name 

    def get_faculty_name(self, obj):
        return obj.faculty.user.username 

    def create(self, validated_data):
        return Subject.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.academic_year = validated_data.get("academic_year", instance.academic_year)
        instance.semester = validated_data.get("semester", instance.semester)
        instance.branch = validated_data.get("branch", instance.branch)  
        instance.faculty = validated_data.get("faculty", instance.faculty) 
        instance.subject_code = validated_data.get("subject_code", instance.subject_code)
        instance.subject_name = validated_data.get("subject_name", instance.subject_name)
        instance.save()
        return instance
    
class TutorRegisterSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(source="user.username",max_length=50)
    email = serializers.EmailField(source="user.email")
    phone_number = serializers.CharField(max_length=15)
    branch = serializers.PrimaryKeyRelatedField(queryset=Branch.objects.all())  
    academic_year = serializers.CharField(max_length=10)

    def to_representation(self, instance):
        """Customize output to include branch name instead of just ID."""
        representation = super().to_representation(instance)
        representation['branch'] = instance.branch.name
        representation['username'] = instance.user.username 
        return representation
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value


    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def generate_random_password(self, length=12):
        """Generates a strong random password."""
        import random
        words = ["Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Gamma", "Hawk", "Titan", "Zebra"]
        special_chars = "!@#$%^&*"

        word1 = random.choice(words)
        word2 = random.choice(words)
        number = str(random.randint(10, 99)) 
        symbol = random.choice(special_chars)

        return f"{word1}{symbol}{word2}{number}"

    def create(self, validated_data):
        user_data = validated_data("user")
        username = user_data["username"]
        email = user_data["email"]
        phone_number = validated_data["phone_number"]
        branch = validated_data["branch"]
        academic_year = validated_data["academic_year"]

        random_password = self.generate_random_password()

        user = User.objects.create_user(username=username, email=email, password=random_password)
        user.save()

        tutor = Tutor.objects.create(
            user=user,
            phone_number=phone_number,
            branch=branch,
            academic_year=academic_year
        )

        subject = "Tutor Registration Successful"
        message = (
            f"Dear {username},\n\n"
            f"You have been successfully registered as a Tutor.\n"
            f"Username: {username}\n"
            f"Password: {random_password}\n\n"
            f"Please log in and change your password immediately.\n\n"
            f"Best regards,\nYour Team"
        )

        send_mail(subject, message, settings.EMAIL_HOST_USER, [email], fail_silently=False)

        return tutor

    

    def delete(self, tutor_instance):
        """Deletes a tutor instance"""
        if tutor_instance:
            tutor_instance.delete()
            return {"message": "Tutor deleted successfully"}
        return {"error": "Tutor not found"}
    
    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", {})
        
        username = user_data.get("username")
        email = user_data.get("email")

        if username:
            instance.user.username = username
        if email:
            instance.user.email = email
        instance.user.save()

        instance.phone_number = validated_data.get("phone_number", instance.phone_number)
        instance.branch = validated_data.get("branch", instance.branch)
        instance.academic_year = validated_data.get("academic_year", instance.academic_year)
        instance.save()

        return instance



