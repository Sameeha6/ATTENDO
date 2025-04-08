from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserLoginSerializer,BranchSerializer,HODRegisterSerializer,FacultyRegisterSerializer,HODDetailSerializer,SubjectSerializer,TutorRegisterSerializer,StudentRegisterSerializer
from .models import*
from django.shortcuts import get_object_or_404
from django.db import transaction


class LoginView(APIView):
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)

        if serializer.is_valid():
            return Response({
                "message": "Login successful",
                "data": serializer.validated_data
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class BranchListCreateView(APIView):
    def get(self, request):
        branches = Branch.objects.all()

        branch_data = [
            {
                "id": branch.id,
                "name": branch.name,
                "hod": {
                    "id":branch.hods.first().id if branch.hods.exists() else None,
                    "user": branch.hods.first().user.username if branch.hods.exists() and branch.hods.first() else None,
                    "phone":branch.hods.first().phone if branch.hods.exists() else None,
                    "email":branch.hods.first().user.email if branch.hods.exists() else None
                }if branch.hods.exists() else None
            }
            for branch in branches
        ]

        return Response(branch_data, status=status.HTTP_200_OK)

    
    def post(self, request):
        serializer = BranchSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class HODRegisterView(APIView): 
    
    def post(self, request):
        serializer = HODRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "HOD registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class HODDetailView(APIView): 
    def get(self, request, pk):
        hod = get_object_or_404(HOD, pk=pk)
        serializer = HODDetailSerializer(hod)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        """Update details of a specific HOD"""
        hod = get_object_or_404(HOD, pk=pk)
        serializer = HODDetailSerializer(hod, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """Delete a specific HOD without deleting the branch"""
        print("Delete method called")  # Debugging

        hod = get_object_or_404(HOD, pk=pk)
        print(f"Found HOD: {hod.user.username}")  # Debugging

        hod.delete()
        print("HOD deleted successfully")  # Debugging

        return Response({"message": "HOD deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    

class BranchDetailView(APIView):

    def get(self, request, pk):
        try:
            branch = Branch.objects.get(pk=pk)
        except Branch.DoesNotExist:
            return Response({"error": "Branch not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = BranchSerializer(branch)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        try:
            branch = Branch.objects.get(pk=pk)
        except Branch.DoesNotExist:
            return Response({"error": "Branch not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = BranchSerializer(branch, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            branch = Branch.objects.get(pk=pk)
        except Branch.DoesNotExist:
            return Response({"error": "Branch not found"}, status=status.HTTP_404_NOT_FOUND)

        if hasattr(branch, 'hod') and branch.hod:
            branch.hod.delete()
        
        branch.delete()
        return Response({"message": "Branch deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
class FacultyRegisterView(APIView):

    def get(self, request):
        """Retrieve all faculty members with branch details."""
        faculties = Faculty.objects.select_related("branch").all()   
        serializer = FacultyRegisterSerializer(faculties, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = FacultyRegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    faculty = serializer.save()
                    return Response(
                        {
                            "message": "Faculty registered successfully!",
                            "faculty_id": faculty.id,
                            "branch_name": faculty.branch.name  
                        },
                        status=status.HTTP_201_CREATED
                    )
            except Exception as e:
                return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        print(serializer.errors)  
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class FacultyDetailView(APIView):
    """Retrieve or delete a specific faculty member by ID."""

    def get(self, request, faculty_id):
        """Retrieve a faculty member's details by ID."""
        faculty = get_object_or_404(Faculty, id=faculty_id)
        serializer = FacultyRegisterSerializer(faculty)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, faculty_id):
        """Update a faculty member's details by ID."""
        faculty = get_object_or_404(Faculty, id=faculty_id)
        serializer = FacultyRegisterSerializer(faculty, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, faculty_id):
        """Delete a faculty member by ID."""
        faculty = get_object_or_404(Faculty, id=faculty_id)
        try:
            with transaction.atomic():
                faculty.delete()
            return Response({"message": "Faculty deleted successfully!"}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR  
            )

class SubjectListCreateView(APIView):
    def get(self, request):
        subjects = Subject.objects.all()
        serializer = SubjectSerializer(subjects, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = SubjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class SubjectDetailView(APIView):
    def get_object(self, id):
        try:
            return Subject.objects.get(id=id)  
        except Subject.DoesNotExist:
            return None

    def get(self, request, id):  
        subject = self.get_object(id)
        if subject is None:
            return Response({'error': 'Subject not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = SubjectSerializer(subject)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, id): 
        subject = self.get_object(id)
        if subject is None:
            return Response({'error': 'Subject not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = SubjectSerializer(subject, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id): 
        subject = self.get_object(id)
        if subject is None:
            return Response({'error': 'Subject not found'}, status=status.HTTP_404_NOT_FOUND)
        subject.delete()
        return Response({'message': 'Subject deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    
class AddTutorView(APIView):

    def get(self, request):
        tutors = Tutor.objects.all()
        serializer = TutorRegisterSerializer(tutors, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = TutorRegisterSerializer(data=request.data)
        if serializer.is_valid():
            tutor = serializer.save()
            return Response({"message": "Tutor added successfully", "tutor": TutorRegisterSerializer(tutor).data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TutorDetailView(APIView):

    def get(self, request, tutor_id):
        tutor = get_object_or_404(Tutor, id=tutor_id)
        serializer = TutorRegisterSerializer(tutor)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request, tutor_id):
        try:
            tutor = Tutor.objects.get(id=tutor_id)
            serializer = TutorRegisterSerializer()
            response = serializer.delete(tutor)
            return Response(response, status=status.HTTP_200_OK)
        except Tutor.DoesNotExist:
            return Response({"error": "Tutor not found"}, status=status.HTTP_404_NOT_FOUND)
        

    def put(self, request, tutor_id):
        """ Updates a tutor record """
        tutor = get_object_or_404(Tutor, id=tutor_id)  
        serializer = TutorRegisterSerializer(tutor, data=request.data) 

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StudentRegisterView(APIView):

    def post(self, request):
        serializer = StudentRegisterSerializer(data=request.data)
        if serializer.is_valid():
            student = serializer.save()
            student_data = {
                'username': student.user.username,
                'student_id': student.student_id,
                'email': student.email,
                'phone_number': student.phone_number,
                'academic_year': student.academic_year,
                'semester': student.semester,
                'branch': {
                    'id': student.branch.id,
                    'name': student.branch.name,
                    # 'code': student.branch.code
                } if student.branch else None
            }
            return Response({
                'message': 'Student registered successfully. Login details sent to email.',
                'student': student_data
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, student_id=None):
        if student_id:
            try:
                student = Student.objects.get(id=student_id)
                data = {
                    "id": student.id,
                    "username": student.user.username,
                    "student_id": student.student_id,
                    "email": student.email,
                    "phone_number": student.phone_number,
                    "academic_year": student.academic_year,
                    "semester": student.semester,
                    "branch": {
                        "id": student.branch.id,
                        "name": student.branch.name,
                        # "code": student.branch.code
                    } if student.branch else None
                }
                return Response(data, status=status.HTTP_200_OK)
            except Student.DoesNotExist:
                return Response({'error': 'Student not found.'}, status=status.HTTP_404_NOT_FOUND)
        else:
            # Return all students
            students = Student.objects.all()
            data = []
            for student in students:
                data.append({
                    "id": student.id,
                    "username": student.user.username,
                    "student_id": student.student_id,
                    "email": student.email,
                    "phone_number": student.phone_number,
                    "academic_year": student.academic_year,
                    "semester": student.semester,
                    "branch": {
                        "id": student.branch.id,
                        "name": student.branch.name,
                        # "code": student.branch.code
                    } if student.branch else None
                })
            return Response(data, status=status.HTTP_200_OK)

    def put(self, request, student_id):
        try:
            student = Student.objects.get(id=student_id)
            user = student.user

            data = request.data
            user.username = data.get("username", user.username)
            user.email = data.get("email", user.email)
            user.save()

            student.student_id = data.get("student_id", student.student_id)
            student.email = data.get("email", student.email)
            student.phone_number = data.get("phone_number", student.phone_number)
            student.academic_year = data.get("academic_year", student.academic_year)
            student.semester = data.get("semester", student.semester)

            branch_id = data.get("branch_id")
            if branch_id:
                try:
                    branch = Branch.objects.get(id=branch_id)
                    student.branch = branch
                except Branch.DoesNotExist:
                    return Response({"error": "Invalid branch ID"}, status=status.HTTP_400_BAD_REQUEST)

            student.save()

            return Response({"message": "Student updated successfully."}, status=status.HTTP_200_OK)
        except Student.DoesNotExist:
            return Response({"error": "Student not found."}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, student_id):
        try:
            student = Student.objects.get(id=student_id)
            user = student.user
            student.delete()
            user.delete()
            return Response({'message': 'Student deleted successfully.'}, status=status.HTTP_200_OK)
        except Student.DoesNotExist:
            return Response({'error': 'Student not found.'}, status=status.HTTP_404_NOT_FOUND)
