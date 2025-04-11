from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,permissions
from .serializers import *
from rest_framework.decorators import api_view
from .models import Branch,HOD,Faculty,Subject,Tutor,Timetable
from django.db import transaction
from rest_framework.exceptions import NotFound

from rest_framework.permissions import IsAuthenticated

from django.shortcuts import get_object_or_404



class LoginView(APIView):
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)

        if serializer.is_valid():
            return Response({
                "message": "Login successful",
                "data": serializer.validated_data
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class HODRegisterView(APIView):
    # def get(self, request):
    #     hods = HOD.objects.all()
    #     serializer = HODRegisterSerializer(hods, many=True)
    #     return Response(serializer.data, status=status.HTTP_200_OK)
    
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
        print("Delete method called")  

        hod = get_object_or_404(HOD, pk=pk)
        print(f"Found HOD: {hod.username}")  

        hod.delete()
        print("HOD deleted successfully")  

        return Response({"message": "HOD deleted successfully"}, status=status.HTTP_204_NO_CONTENT)



class BranchListCreateView(APIView):
    def get(self, request):
        branches = Branch.objects.all()

        branch_data = []
        for branch in branches:
            hod = branch.hods.first()  # Get the first HOD if exists
            branch_data.append({
                "id": branch.id,
                "name": branch.name,
                # "code": branch.code,
                "hod": {
                    "id": hod.id,
                    "username": hod.username,
                    "email":hod.email,
                    "phone": hod.phone
                } if hod else None
            })

        return Response(branch_data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = BranchSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



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
        serializer = FacultySerializer(faculties, many=True)
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
    def get(self, request, faculty_id):
        faculty = get_object_or_404(Faculty, id=faculty_id)
        serializer = FacultySerializer(faculty)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, faculty_id):
        faculty = get_object_or_404(Faculty, id=faculty_id)
        serializer = FacultySerializer(faculty, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, faculty_id):
        faculty = get_object_or_404(Faculty, id=faculty_id)
        try:
            with transaction.atomic():
                faculty.delete()
            return Response({"message": "Faculty deleted successfully!"}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

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
    

class TutorRegisterView(APIView):
    """API View to handle CRUD operations for Tutor"""

    def get(self, request, tutor_id=None):
        """Retrieve all tutors or a single tutor by ID"""
        if tutor_id:
            tutor = get_object_or_404(Tutor, id=tutor_id)
            serializer = TutorRegisterSerializer(tutor)
            return Response(serializer.data, status=status.HTTP_200_OK)
        tutors = Tutor.objects.all()
        serializer = TutorRegisterSerializer(tutors, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """Register a new tutor"""
        serializer = TutorRegisterSerializer(data=request.data)
        if serializer.is_valid():
            tutor = serializer.save()
            return Response({
                "message": "Tutor registered successfully.",
                "tutor": TutorRegisterSerializer(tutor).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, tutor_id):
        """Update an existing tutor by ID"""
        tutor = get_object_or_404(Tutor, id=tutor_id)
        serializer = TutorRegisterSerializer(tutor, data=request.data)
        if serializer.is_valid():
            updated_tutor = serializer.save()
            return Response({
                "message": "Tutor updated successfully.",
                "tutor": TutorRegisterSerializer(updated_tutor).data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, tutor_id):
        """Delete a tutor by ID"""
        tutor = get_object_or_404(Tutor, id=tutor_id)
        tutor.delete()
        return Response({"message": "Tutor deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    



class TutorDetailView(APIView):

    def get(self, request, tutor_id):
        """Retrieve tutor details."""
        tutor = get_object_or_404(Tutor, id=tutor_id)
        serializer = TutorRegisterSerializer(tutor)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, tutor_id):
        """Update tutor details."""
        tutor = get_object_or_404(Tutor, id=tutor_id)
        serializer = TutorRegisterSerializer(tutor, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, tutor_id):
        """Delete a tutor."""
        tutor = get_object_or_404(Tutor, id=tutor_id)
        try:
            with transaction.atomic():
                tutor.delete()
            return Response({"message": "Tutor deleted successfully!"}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class StudentRegisterView(APIView):
    def post(self, request):
        serializer = StudentRegisterSerializer(data=request.data)
        if serializer.is_valid():
            student = serializer.save()
            student_data = {
                'username': student.username,
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
                    "username": student.username,
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
            students = Student.objects.all()
            data = []
            for student in students:
                data.append({
                    "id": student.id,
                    "username": student.username,
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
            data = request.data

            student.username = data.get("username", student.username)
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
            student.delete()
            return Response({'message': 'Student deleted successfully.'}, status=status.HTTP_200_OK)
        except Student.DoesNotExist:
            return Response({'error': 'Student not found.'}, status=status.HTTP_404_NOT_FOUND)


class ContactMessageView(APIView):
    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Your message has been sent successfully.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class RegisterParentView(APIView):


    def get(self, request):
        parents = Parent.objects.all()
        serializer = ParentSerializer(parents, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    def post(self, request):
        serializer = ParentSerializer(data=request.data)
        if serializer.is_valid():
            parent = serializer.save()
            return Response({"message": "Parent registered successfully", "parent_id": parent.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            parent = Parent.objects.get(pk=pk)
        except Parent.DoesNotExist:
            return Response({"error": "Parent not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ParentSerializer(parent, data=request.data, partial=True)
        if serializer.is_valid():
            updated_parent = serializer.save()
            return Response({"message": "Parent updated successfully", "parent_id": updated_parent.id}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    def get(self, request, pk):
        try:
            parent = Parent.objects.get(pk=pk)
        except Parent.DoesNotExist:
            return Response({"error": "Parent not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ParentSerializer(parent)
        return Response(serializer.data, status=status.HTTP_200_OK)
    


# class AddTimetableTutorView(APIView):
#     permission_classes = [permissions.IsAuthenticated]

#     def post(self, request):
#         try:
#             tutor = get_object_or_404(Tutor, username=request.user.username)
#         except:
#             return Response({"error": "Tutor not found or not authenticated."}, status=status.HTTP_403_FORBIDDEN)

#         # Force the timetable to be assigned only to the tutor's branch
#         data = request.data.copy()
#         data['branch_id'] = tutor.branch.id

#         serializer = TimetableSerializer(data=data)
#         if serializer.is_valid():
#             timetable = serializer.save()

#             return Response({
#                 "message": "Timetable added successfully",
#                 "data": TimetableSerializer(timetable).data
#             }, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class TimetableListCreateView(APIView):
    # permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Get logged in tutor (faculty)
            
            tutor = Faculty.objects.get(user=request.user)
        except Faculty.DoesNotExist:
            return Response({"error": "Tutor not found."}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()
        # Force the branch ID to be the tutor's branch
        data['branch_id'] = tutor.branch.id

        serializer = TimetableSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class TutorSubjectsAndSemestersView(APIView):
    permission_classes = []

    def get(self, request):
        tutor_id = request.GET.get("tutor_id")

        if not tutor_id:
            return Response({"error": "Missing tutor_id"}, status=400)

        try:
            tutor = Tutor.objects.get(id=int(tutor_id))
        except (ValueError, Tutor.DoesNotExist):
            return Response({"error": "Tutor not found"}, status=404)

        subjects = Subject.objects.filter(branch=tutor.branch)
        semesters = sorted(set(subjects.values_list('semester', flat=True)))

        subjects_by_semester = {}

        for semester in semesters:
            subjects_in_semester = subjects.filter(semester=semester)

            subject_list = []
            for subj in subjects_in_semester:
                subject_list.append({
                    "id": subj.id,
                    "subject_code": subj.subject_code,
                    "subject_name": subj.subject_name,
                    "faculty": {
                        "id": subj.faculty.id,
                        "username": subj.faculty.username,
                        "email": subj.faculty.email
                    } if subj.faculty else None
                })

            subjects_by_semester[semester] = subject_list

        return Response({
            "semesters": semesters,
            "subjects_by_semester": subjects_by_semester,
            "branch": {
                "id": tutor.branch.id,
                "name": tutor.branch.name,
               
            }
        })
    
class TimetableDetailView(APIView):
   
    permission_classes = [] 

    def get(self, request, pk):
        try:
            timetable = Timetable.objects.get(pk=pk)
        except Timetable.DoesNotExist:
            return Response({"error": "Timetable not found"}, status=404)

        serializer = TimetableSerializer(timetable)
        return Response(serializer.data, status=200)

    def put(self, request, pk):
        try:
            timetable = Timetable.objects.get(pk=pk)
        except Timetable.DoesNotExist:
            return Response({"error": "Timetable not found"}, status=404)

        serializer = TimetableSerializer(timetable, data=request.data)
        if serializer.is_valid():
            updated_tt = serializer.save()
            return Response(TimetableSerializer(updated_tt).data, status=200)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        try:
            timetable = Timetable.objects.get(pk=pk)
        except Timetable.DoesNotExist:
            return Response({"error": "Timetable not found"}, status=404)

        timetable.delete()
        return Response({"success": "Timetable deleted"}, status=204)
    
class TimetableByFacultyView(APIView):
    def get(self, request):
        faculty_id = request.GET.get('faculty_id')
        
        if not faculty_id:
            return Response({"error": "Missing faculty_id"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            faculty = Faculty.objects.select_related("branch").get(id=faculty_id)
        except Faculty.DoesNotExist:
            return Response({"error": "Faculty not found"}, status=status.HTTP_404_NOT_FOUND)
        
        timetables = Timetable.objects.filter(branch=faculty.branch)
        serializer = TimetableSerializer(timetables, many=True)
        
        return Response({
            "branch": {
                "id": faculty.branch.id,
                "name": faculty.branch.name,
                # "code": faculty.branch.code
            },
            "timetable": serializer.data
        }, status=status.HTTP_200_OK)