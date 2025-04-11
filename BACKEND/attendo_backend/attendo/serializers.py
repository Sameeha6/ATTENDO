from django.contrib.auth import authenticate
from django.contrib.auth.models import User  
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from .models import* 
from django.core.mail import send_mail 
from django.conf import settings
import random
import string


# class UserLoginSerializer(serializers.Serializer):
#     username = serializers.CharField()
#     password = serializers.CharField(write_only=True)

#     def validate(self, data):
#         username = data.get("username")
#         password = data.get("password")

#         user = User.objects.filter(username=username).first()
#         if not user:
#             raise serializers.ValidationError("User does not exist.")

#         if user.is_superuser:
#             if not user.check_password(password):
#                 raise serializers.ValidationError("Invalid credentials for admin.")
#             return {
#                 "username": user.username,
#                 "role": "admin",
#                 "message": "Admin login successful",
#             }

#         if not user.check_password(password):
#             raise serializers.ValidationError("Invalid credentials. Please try again.")

#         hod = HOD.objects.filter(user=user).first()
#         if hod:
#             if not hod.is_approved:
#                 raise serializers.ValidationError("Your HOD account is pending approval.")
#             return {
#                 "username": user.username,
#                 "role": "hod",
#                 "branch": hod.branch.name,
#                 "message": "HOD login successful",
#             }

#         faculty = Faculty.objects.filter(user=user).first()
#         if faculty:
#             return {
#                 "username": user.username,
#                 "role": "faculty",
#                 "branch": faculty.branch.name,
#                 "subject": faculty.subject_name,
#                 "message": "Faculty login successful",
#             }

#         raise serializers.ValidationError("Your account is not associated with any role.")



class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get("username")
        password = data.get("password")

        # Admin login via Django User model
        # from django.contrib.auth.models import User
        user = User.objects.filter(username=username).first()
        if user and user.is_superuser:
            if not user.check_password(password):
                raise serializers.ValidationError("Invalid credentials for admin.")
            return {
                "username": user.username,
                "role": "admin",
                "message": "Admin login successful",
            }

        # HOD Login
        hod = HOD.objects.filter(username=username).first()
        if hod:
            if hod.password != password:
                raise serializers.ValidationError("Invalid HOD credentials.")
            if not hod.branch:
                raise serializers.ValidationError("No branch assigned to this HOD.")
            return {
                "hod_id":hod.id,
                "username": hod.username,
                "role": "hod",
                "branch": hod.branch.name,
                "message": "HOD login successful",
            }

        # Faculty Login
        faculty = Faculty.objects.filter(username=username).first()
        if faculty:
            if faculty.password != password:
                raise serializers.ValidationError("Invalid Faculty credentials.")
            return {
                "faculty_id":faculty.id,
                "username": faculty.username,
                "role": "faculty",
                "branch": faculty.branch.name,
                "message": "Faculty login successful",
            }

        # Tutor Login
        tutor = Tutor.objects.filter(username=username).first()
        if tutor:
            if tutor.password != password:
                raise serializers.ValidationError("Invalid Tutor credentials.")
            return {
                "tutor_id":tutor.id,
                "username": tutor.username,
                "role": "tutor",
                "branch": tutor.branch.name,
                "academic_year": tutor.academic_year,
                "message": "Tutor login successful",
            }

        raise serializers.ValidationError("User not found or invalid credentials.")


class HODRegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=15)
    branch = serializers.PrimaryKeyRelatedField(queryset=Branch.objects.all())

    def validate_username(self, value):
        if HOD.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def validate_email(self, value):
        if HOD.objects.filter(email=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def generate_random_password(self, length=12):
        words = ["Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Gamma", "Hawk", "Titan", "Zebra"]
        special_chars = "!@#$%^&*"
        word1 = random.choice(words)
        word2 = random.choice(words)
        number = str(random.randint(10, 99)) 
        symbol = random.choice(special_chars)
        return f"{word1}{symbol}{word2}{number}"

    def create(self, validated_data):
        username = validated_data["username"]
        email = validated_data["email"]
        phone = validated_data["phone"]
        branch = validated_data["branch"]

        # Generate random password
        raw_password = self.generate_random_password()
        hashed_password = make_password(raw_password)

        # Create HOD object with hashed password
        hod = HOD.objects.create(
            username=username,
            email=email,
            phone=phone,
            branch=branch,
            password=hashed_password
        )

        # Send email with raw password (not hashed)
        send_mail(
            subject="HOD Registration Successful",
            message=f"Dear {username},\nYou have been registered as an HOD.\nUsername: {username}\nPassword: {raw_password}\n\nPlease login.",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            fail_silently=False,
        )

        return hod

    

class BranchSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True) 
    name = serializers.CharField(max_length=100)
    # code = serializers.CharField(max_length=10)

    def create(self, validated_data):
        name = validated_data["name"]
        # code = validated_data["code"]
        branch = Branch.objects.create(name=name)
        print("Branch ID:", branch.id) 
        
        return branch
    
    def update(self, instance, validated_data):
        instance.name = validated_data.get("name", instance.name)
        # instance.code = validated_data.get("code", instance.code)
        instance.save()
        return instance
    



class HODUpdateSerializer(serializers.Serializer):
    branch = serializers.PrimaryKeyRelatedField(queryset=Branch.objects.all(), required=False)
    phone = serializers.CharField(max_length=15, required=False)

    def update(self, instance, validated_data):
        instance.branch = validated_data.get("branch", instance.branch)
        instance.phone = validated_data.get("phone", instance.phone)
        instance.save()
        return instance
    



class HODDetailSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    branch = serializers.PrimaryKeyRelatedField(read_only=True)
    phone = serializers.CharField(max_length=15)
    role = serializers.CharField(max_length=50, read_only=True)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["branch"] = instance.branch.name if instance.branch else None  
        return data

    def update(self, instance, validated_data):
        instance.username = validated_data.get("username", instance.username)
        instance.email = validated_data.get("email", instance.email)
        instance.phone = validated_data.get("phone", instance.phone)
        instance.branch = validated_data.get("branch", instance.branch)  
        instance.save()
        return instance
    



class FacultyRegisterSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    phone_number = serializers.CharField(max_length=15)
    branch = serializers.PrimaryKeyRelatedField(queryset=Branch.objects.all())  
    branch_name = serializers.CharField(source="branch.name", read_only=True) 

    def validate_username(self, value):
        if Faculty.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def validate_email(self, value):
        if Faculty.objects.filter(email=value).exists():
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
        random_password = make_password(self.generate_random_password())

        # Create Faculty directly
        faculty = Faculty.objects.create(
            username=validated_data["username"],
            email=validated_data["email"],
            phone_number=validated_data["phone_number"],
            branch=validated_data["branch"],
            password=random_password
            # If you later add a password field to Faculty, store random_password here.
        )

        # Send email
        try:
            send_mail(
                subject="Faculty Registration Successful",
                message=f"Dear {faculty.username},\n\nYou have been registered as a faculty member.\n\n"
                        f"Username: {faculty.username}\nPassword: {random_password}\n\n"
                        "Please log in and change your password for security reasons.",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[faculty.email],
                fail_silently=False,
            )
        except Exception as e:
            print(f"Error sending email: {str(e)}")

        return faculty




class FacultySerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    phone_number = serializers.CharField(max_length=15)
    branch = serializers.PrimaryKeyRelatedField(queryset=Branch.objects.all())
    branch_name = serializers.SerializerMethodField()

    def get_branch_name(self, obj):
        return obj.branch.name if obj.branch else None

    def create(self, validated_data):
        return Faculty.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.branch = validated_data.get('branch', instance.branch)
        instance.save()
        return instance




class SubjectSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    academic_year = serializers.CharField(max_length=10)
    semester = serializers.CharField(max_length=2)
    branch = serializers.PrimaryKeyRelatedField(queryset=Branch.objects.all(), write_only=True)
    faculty = serializers.PrimaryKeyRelatedField(queryset=Faculty.objects.all(), write_only=True)
    branch_name = serializers.SerializerMethodField()
    faculty_name = serializers.SerializerMethodField()
    subject_code = serializers.CharField(max_length=20)
    subject_name = serializers.CharField(max_length=255)

    def get_branch_name(self, obj):
        return obj.branch.name 

    def get_faculty_name(self, obj):
        return obj.faculty.username 

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
    username = serializers.CharField(max_length=50)
    email = serializers.EmailField()
    phone_number = serializers.CharField(max_length=15)
    branch = serializers.PrimaryKeyRelatedField(queryset=Branch.objects.all())
    academic_year = serializers.CharField(max_length=10)

    def to_representation(self, instance):
        """Customize output to include branch name instead of just ID."""
        return {
            "id": instance.id,
            "username": instance.username,
            "email": instance.email,
            "phone_number": instance.phone_number,
            "branch": instance.branch.id,
            "branch_name": instance.branch.name,
            "academic_year": instance.academic_year
        }

    def create(self, validated_data):
        return Tutor.objects.create(**validated_data)
    

    def validate_username(self, value):
        if Tutor.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def validate_email(self, value):
        if Tutor.objects.filter(email=value).exists():
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
        random_password = make_password(self.generate_random_password())

        # Create tutor directly
        tutor = Tutor.objects.create(
            username=validated_data["username"],
            email=validated_data["email"],
            phone_number=validated_data["phone_number"],
            branch=validated_data["branch"],
            academic_year=validated_data['academic_year'],
            password=random_password
            # If you later add a password field to tutor, store random_password here.
        )

        # Send email
        try:
            send_mail(
                subject="Tutor Registration Successful",
                message=f"Dear {tutor.username},\n\nYou have been registered as a tutor.\n\n"
                        f"Username: {tutor.username}\nPassword: {random_password}\n\n"
                        "Please log in and change your password for security reasons.",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[tutor.email],
                fail_silently=False,
            )
        except Exception as e:
            print(f"Error sending email: {str(e)}")

        return tutor



    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.branch = validated_data.get('branch', instance.branch)
        instance.academic_year = validated_data.get('academic_year', instance.academic_year)
        instance.save()
        return instance
    

class StudentRegisterSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True, required=False)
    student_id = serializers.CharField(max_length=20)
    email = serializers.EmailField()
    phone_number = serializers.CharField(max_length=15)
    academic_year = serializers.CharField(max_length=20)
    branch_id = serializers.IntegerField(write_only=True)
    semester = serializers.CharField()
    branch_name = serializers.CharField(source='branch.name', read_only=True)
    role = serializers.CharField(read_only=True)

    def validate_username(self, value):
        if Student.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def validate_email(self, value):
        if Student.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value

    def create(self, validated_data):
        password = validated_data.get('password')
        if not password:
          
            password = ''.join(random.choices(string.ascii_letters + string.digits, k=10))

        hashed_password = make_password(password)

        branch = Branch.objects.get(id=validated_data['branch_id'])

        student = Student.objects.create(
            username=validated_data['username'],
            password=hashed_password,
            student_id=validated_data['student_id'],
            email=validated_data['email'],
            phone_number=validated_data['phone_number'],
            academic_year=validated_data['academic_year'],
            branch=branch,
            semester=validated_data['semester'],
            role='student'
        )

      
        send_mail(
            subject='Your Student Account Details',
            message=(
                f'Hello {student.username},\n\n'
                f'Username: {student.username}\n'
                f'Password: {password}\n\n'
                'Please keep this information secure.'
            ),
            from_email='attendo0402@gmail.com',
            recipient_list=[student.email],
        )

        return student




class ContactMessageSerializer(serializers.Serializer):
    username = serializers.CharField(write_only=True)
    email = serializers.EmailField()
    subject = serializers.CharField(max_length=255)
    message = serializers.CharField()

    def create(self, validated_data):
        username = validated_data.get('username')
        email = validated_data.get('email')

        user = User.objects.filter(username=username, email=email).first()

        contact_message = ContactMessage.objects.create(
            user=user,  # can be None
            subject=validated_data['subject'],
            message=validated_data['message']
        )

        send_mail(
            subject=validated_data['subject'],
            message=validated_data['message'],
            from_email=email,
            recipient_list=['attendo0402@gmail.com'],
            fail_silently=False,
        )

        return contact_message
    



class ParentSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)

    # Input fields
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=128, required=False, write_only=True)
    student_id = serializers.CharField(write_only=True)
    branch_id = serializers.IntegerField(write_only=True)

    # Common fields
    email = serializers.EmailField()
    phone_number = serializers.CharField(max_length=15)
    ward_name = serializers.CharField(max_length=20)
    ward_id = serializers.CharField(max_length=20)
    academic_year = serializers.CharField(max_length=20)
    semester = serializers.CharField(max_length=10)

    # Output fields
    output_student_id = serializers.CharField(source='student.student_id')
    branch_name = serializers.CharField(source='branch.name', read_only=True)
    role = serializers.CharField(read_only=True)

    def create(self, validated_data):
        student_id_value = validated_data.pop('student_id')
        branch_id = validated_data.pop('branch_id')

        try:
            student = Student.objects.get(student_id=student_id_value)
        except Student.DoesNotExist:
            raise serializers.ValidationError({"student_id": "Student with this ID does not exist."})

        try:
            branch = Branch.objects.get(id=branch_id)
        except Branch.DoesNotExist:
            raise serializers.ValidationError({"branch_id": "Branch with this ID does not exist."})

        # Generate random password if not provided
        if not validated_data.get('password'):
            validated_data['password'] = ''.join(random.choices(string.ascii_letters + string.digits, k=10))

        parent = Parent.objects.create(
            student=student,
            branch=branch,
            **validated_data
        )

      
        send_mail(
            subject='Parent Account Created',
            message=f"Hi {parent.username},\n\nYour parent account has been created.\nUsername: {parent.username}\nPassword: {validated_data['password']}",
            from_email='noreply@yourdomain.com',
            recipient_list=[parent.email],
            fail_silently=True
        )

        return parent

    def update(self, instance, validated_data):
        student_id_value = validated_data.pop('student_id', None)
        branch_id = validated_data.pop('branch_id', None)

        if student_id_value:
            try:
                student = Student.objects.get(student_id=student_id_value)
                instance.student = student
            except Student.DoesNotExist:
                raise serializers.ValidationError({"student_id": "Student with this ID does not exist."})

        if branch_id:
            try:
                branch = Branch.objects.get(id=branch_id)
                instance.branch = branch
            except Branch.DoesNotExist:
                raise serializers.ValidationError({"branch_id": "Branch with this ID does not exist."})

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

class TimetableSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    semester = serializers.IntegerField()
    day = serializers.CharField(max_length=10)
    time = serializers.TimeField() 
    subject_id = serializers.IntegerField()
    faculty_id = serializers.IntegerField()
    branch_id = serializers.IntegerField()

    def create(self, validated_data):
        subject = Subject.objects.get(id=validated_data['subject_id'])
        faculty = Faculty.objects.get(id=validated_data['faculty_id'])
        branch = Branch.objects.get(id=validated_data['branch_id'])

        timetable = Timetable.objects.create(
            semester=validated_data['semester'],
            day=validated_data['day'],
            time=validated_data['time'],
            subject=subject,
            faculty=faculty,
            branch=branch
        )
        return timetable

    def update(self, instance, validated_data):
        instance.semester = validated_data.get('semester', instance.semester)
        instance.day = validated_data.get('day', instance.day)
        instance.time = validated_data.get('time', instance.time)

        if 'subject_id' in validated_data:
            instance.subject = Subject.objects.get(id=validated_data['subject_id'])
        if 'faculty_id' in validated_data:
            instance.faculty = Faculty.objects.get(id=validated_data['faculty_id'])
        if 'branch_id' in validated_data:
            instance.branch = Branch.objects.get(id=validated_data['branch_id'])

        instance.save()
        return instance

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'semester': instance.semester,
            'day': instance.day,
            'time': instance.time,
            'subject': {
                'id': instance.subject.id,
                'code': instance.subject.subject_code,
                'name': instance.subject.subject_name
            },
            'faculty': {
                'id': instance.faculty.id,
                'username': instance.faculty.username,
                'email': instance.faculty.email
            },
            'branch': {
                'id': instance.branch.id,
                'name': instance.branch.name,
                # 'code': instance.branch.code
            }
        }