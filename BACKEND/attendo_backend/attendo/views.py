from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,permissions
from .serializers import *
from rest_framework.decorators import api_view
from .models import *
from django.db import transaction
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from datetime import datetime, timedelta
from django.db.models import Q



class LoginView(APIView):
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response({
                "message": "Login successful",
                "data": serializer.validated_data
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ForgotPasswordView(APIView):
    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")

        hod = HOD.objects.filter(username=username, email=email).first()
        if not hod:
            return Response({"error": "HOD not found with provided username and email"}, status=404)

        temp_password = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
        hod.password = make_password(temp_password)
        hod.save()

        send_mail(
            subject="Password Reset - AttenDo",
            message=f"Hi {hod.username},\n\nYour temporary password is: {temp_password}\nPlease login and change your password immediately.",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[hod.email],
            fail_silently=False,
        )

        return Response({"message": "Temporary password sent to your email."}, status=200)

class ChangePasswordView(APIView):   
    def put(self, request, hod_id):
            current_password = request.data.get("current_password")
            new_password = request.data.get("new_password")

            hod = HOD.objects.filter(id=hod_id).first()
            if not hod:
                return Response({"error": "HOD not found."}, status=404)

            if not check_password(current_password, hod.password):
                return Response({"error": "Current password is incorrect."}, status=400)

            hod.password = make_password(new_password)
            hod.save()
            return Response({"message": "Password changed successfully."}, status=200)
        
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
    

# class RegisterParentView(APIView):
#     def get(self, request):
#         parents = Parent.objects.all()
#         serializer = ParentSerializer(parents, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)
    
#     def post(self, request):
#         serializer = ParentSerializer(data=request.data)
#         if serializer.is_valid():
#             parent = serializer.save()
#             return Response({"message": "Parent registered successfully", "parent_id": parent.id}, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def put(self, request, pk):
#         try:
#             parent = Parent.objects.get(pk=pk)
#         except Parent.DoesNotExist:
#             return Response({"error": "Parent not found"}, status=status.HTTP_404_NOT_FOUND)
#         serializer = ParentSerializer(parent, data=request.data, partial=True)
#         if serializer.is_valid():
#             updated_parent = serializer.save()
#             return Response({"message": "Parent updated successfully", "parent_id": updated_parent.id}, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#     def get(self, request, pk):
#         try:
#             parent = Parent.objects.get(pk=pk)
#         except Parent.DoesNotExist:
#             return Response({"error": "Parent not found"}, status=status.HTTP_404_NOT_FOUND)
#         serializer = ParentSerializer(parent)
#         return Response(serializer.data, status=status.HTTP_200_OK)
    


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
    def get(self, request):
        tutor_id = request.GET.get('tutor_id')
        if not tutor_id:
            return Response({"error": "Missing tutor_id"}, status=400)

        try:
            tutor = Tutor.objects.get(id=int(tutor_id))
        except (ValueError, Tutor.DoesNotExist):
            return Response({"error": "Tutor not found"}, status=404)

        timetables = Timetable.objects.filter(branch=tutor.branch)
        serializer = TimetableSerializer(timetables, many=True)
        return Response(serializer.data, status=200)

    def post(self, request):
        serializer = TimetableSerializer(data=request.data)
        if serializer.is_valid():
            tt = serializer.save()
            return Response(
                TimetableSerializer(tt).data,
                status=status.HTTP_201_CREATED
            )
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


class AllTimetablesView(APIView):
    def get(self, request):
        timetables = Timetable.objects.all()
        serializer = TimetableSerializer(timetables, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class RequestTimetableHourChangeView(APIView):
    def get(self, request):
        requests = TimetableChangeRequest.objects.all()
        serializer = TimetableChangeRequestSerializer(requests, many=True)
        return Response(serializer.data)

    def post(self, request):
        timetable_id = request.data.get('timetable_id')
        faculty_id = request.data.get('faculty_id')
        if not timetable_id or not faculty_id:
            return Response({"error": "Missing timetable_id or faculty_id"}, status=400)
        try:
            timetable = Timetable.objects.get(id=timetable_id)
            requester = Faculty.objects.get(id=faculty_id)
        except (Timetable.DoesNotExist, Faculty.DoesNotExist):
            return Response({"error": "Invalid timetable or faculty ID"}, status=404)
        if timetable.faculty.id == requester.id:
            return Response({"error": "You are already assigned to this subject."}, status=400)
        faculty_branch = requester.branch  
        hod = faculty_branch.hods 
        if TimetableChangeRequest.objects.filter(requester=requester, timetable_entry=timetable, status="Pending").exists():
            return Response({"error": "A request is already pending for this slot."}, status=400)
        
        request_obj = TimetableChangeRequest.objects.create(
            requester=requester,
            timetable_entry=timetable
        )
        serializer = TimetableChangeRequestSerializer(request_obj)
        return Response(serializer.data, status=201)
    
class deleteNotificationView(APIView):
    def delete(self, request, pk):
        try:
            notification = TimetableChangeRequest.objects.get(pk=pk)
            notification.delete()
            return Response({"message": "Notification deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except TimetableChangeRequest.DoesNotExist:
            return Response({"message": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)
    
class ApproveTimetableChangeRequestView(APIView):
    def put(self, request, request_id):
        try:
            timetable_change_request = TimetableChangeRequest.objects.get(id=request_id)
            
            new_status = request.data.get('status')

            if new_status not in ['Approved', 'Rejected']:
                return Response({"error": "Invalid status provided."}, status=status.HTTP_400_BAD_REQUEST)

            branch = timetable_change_request.requester.branch
            hod = branch.hods.first()
            if not hod:
                return Response({"error": "No HOD assigned to this branch."}, status=status.HTTP_400_BAD_REQUEST)

            timetable_change_request.status = new_status
            timetable_change_request.save()

            serializer = TimetableChangeRequestSerializer(timetable_change_request)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except TimetableChangeRequest.DoesNotExist:
            return Response({"error": "Timetable change request not found."}, status=status.HTTP_404_NOT_FOUND)
        

# class MarkAttendance(APIView): 
#     def post(self, request):
#         attendance_data = request.data
#         updated_attendance = []

#         for entry in attendance_data:
#             student_id = entry.get('student_id')
#             status = entry.get('status')
#             date = entry.get('date')
#             if not student_id or not status or not date:
#                 return Response(
#                     {"error": "Missing required fields: student_id, status, or date."},
#                     status=status.HTTP_400_BAD_REQUEST
#                 )
#             if status not in ['Present', 'Absent']:
#                 return Response(
#                     {"error": "Invalid status value. It should be 'Present' or 'Absent'."},
#                     status=status.HTTP_400_BAD_REQUEST
#                 )
#             try:
#                 attendance, created = Attendance.objects.get_or_create(
#                     student_id=student_id,
#                     date=date,
#                 )
#                 attendance.status = status
#                 attendance.save()
#                 updated_attendance.append(attendance)
#             except ValidationError as e:
#                 return Response(
#                     {"error": str(e)},
#                     status=status.HTTP_400_BAD_REQUEST
#                 )
        
#         return Response({"message": "Attendance successfully updated.", "updated_attendance": len(updated_attendance)}, status=status.HTTP_200_OK)

#     def get(self, request):
#         try:
           
#             attendance_records = Attendance.objects.all()

          
#             data = [{
#                 "student_id": record.student_id,
#                 "status": record.status,
#                 "date": record.date
#             } for record in attendance_records]

#             return Response({"attendance": data}, status=status.HTTP_200_OK)

#         except Exception as e:
#             return Response({"error": f"Error retrieving attendance data: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


class FacultyUnderHODView(APIView):
    def get(self, request, hod_id):
        try:
            hod = HOD.objects.get(id=hod_id, role="HOD")
            if hod.role != "HOD":
                return Response({"error": "The specified user is not an HOD."}, status=status.HTTP_400_BAD_REQUEST)
            faculty_under_hod = Faculty.objects.select_related('branch').filter(branch=hod.branch).exclude(id=hod.id)
            serializer = FacultySerializer(faculty_under_hod, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Faculty.DoesNotExist:
            return Response({"error": "HOD not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class TutorsUnderHODView(APIView):
    def get(self, request, hod_id):
        try:
            hod = HOD.objects.get(id=hod_id, role="HOD")
            tutors = Tutor.objects.select_related('branch').filter(branch=hod.branch, role="tutor")
            serializer = TutorRegisterSerializer(tutors, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Faculty.DoesNotExist:
            return Response({"error": "HOD not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class StudentsUnderHODView(APIView):
    def get(self, request, hod_id):
        try:
            hod = HOD.objects.get(id=hod_id, role="HOD")
            students = Student.objects.filter(branch=hod.branch)
            serializer = StudentRegisterSerializer(students, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Faculty.DoesNotExist:
            return Response({"error": "HOD not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class FacultiesUnderTutorView(APIView):
    def get(self, request, tutor_id):
        try:
            tutor = Tutor.objects.get(id=tutor_id,role="tutor")
            branch = tutor.branch
            faculties = Faculty.objects.filter(branch=branch)
            serializer = FacultySerializer(faculties, many=True)
            return Response(serializer.data)
        except Tutor.DoesNotExist:
            return Response({'error': 'Tutor not found'}, status=404)

class StudentsUnderTutorView(APIView):
    def get(self, request, tutor_id):
        try:
            tutor = Tutor.objects.get(id=tutor_id,role="tutor")
            branch = tutor.branch
            academic_year=tutor.academic_year
            Students = Student.objects.filter(branch=branch,academic_year=academic_year)
            serializer = StudentRegisterSerializer(Students, many=True)
            return Response(serializer.data)
        except Faculty.DoesNotExist:
            return Response({'error': 'Tutor not found'}, status=404)
        


class BranchCountView(APIView):
    def get(self, request):
        data = {
            'branch_count': Branch.objects.count(),
            'hod_count': HOD.objects.count(),
            'tutor_count': Tutor.objects.count(),
            'faculty_count': Faculty.objects.count(),
            'student_count': Student.objects.count(),
            'parent_count': Parent.objects.count(),
        }
        return Response(data)
    
class HODUserCountsView(APIView):
    def get(self, request, hod_id):
        hod = get_object_or_404(HOD, id=hod_id)
        branch = hod.branch
        if not branch:
            return Response({
                "error": "This HOD is not assigned to any branch."
            }, status=400)
        faculty_count = Faculty.objects.filter(branch=branch).count()
        tutor_count = Tutor.objects.filter(branch=branch).count()
        parent_count = Parent.objects.filter(branch=branch).count()
        student_count = Student.objects.filter(branch=branch).count()
        return Response({
            "branch": branch.name,
            "faculty_count": faculty_count,
            "tutor_count": tutor_count,
            "parent_count": parent_count,
            "student_count": student_count
        })
    
class TutorUserCountsView(APIView):
    def get(self, request, tutor_id):
        tutor = get_object_or_404(Tutor, id=tutor_id)
        branch = tutor.branch
        academic_year = tutor.academic_year
        faculty_count = Faculty.objects.filter(branch=branch).count()
        student_count = Student.objects.filter(branch=branch, academic_year=academic_year).count()
        parent_count = Parent.objects.filter(branch=branch, academic_year=academic_year).count()
        return Response({
            "tutor": tutor.username,
            "branch": branch.name,
            "academic_year": academic_year,
            "faculty_count": faculty_count,
            "student_count": student_count,
            "parent_count": parent_count
        })


class ParentCreateView(APIView):
    def get(self, request):
        parents = Parent.objects.all()
        serializer = ParentSerializer(parents, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ParentSerializer(data=request.data)
        if serializer.is_valid():
            parent = serializer.save()
            return Response({"message": "Parent created successfully", "parent_id": parent.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class ParentDetailView(APIView):
    def get(self, request, pk):
        try:
            parent = Parent.objects.get(pk=pk)
        except Parent.DoesNotExist:
            return Response({"error": "Parent not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ParentSerializer(parent)
        return Response(serializer.data, status=status.HTTP_200_OK)
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
    def delete(self, request, pk):
        try:
            parent = Parent.objects.get(pk=pk)
        except Parent.DoesNotExist:
            return Response({"error": "Parent not found"}, status=status.HTTP_404_NOT_FOUND)
        parent.delete()
        return Response({"message": "Parent deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    
class ParentsUnderHODView(APIView):
    def get(self, request, hod_id):
        try:
            hod = HOD.objects.get(id=hod_id, role="HOD")
            parents = Parent.objects.filter(branch=hod.branch)
            serializer = ParentSerializer(parents, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Faculty.DoesNotExist:
            return Response({"error": "HOD not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class ParentsUnderTutorView(APIView):
    def get(self, request, tutor_id):
        try:
            tutor = Tutor.objects.get(id=tutor_id,role="tutor")
            branch = tutor.branch
            parents = Parent.objects.filter(branch=branch)
            serializer = ParentSerializer(parents, many=True)
            return Response(serializer.data)
        except Faculty.DoesNotExist:
            return Response({'error': 'Tutor not found'}, status=404)
        
# class MarkAttendance(APIView):
#     def post(self, request):
#         attendance_data = request.data
#         updated_attendance = []

#         for entry in attendance_data:
#             student_id = entry.get('student_id')
#             attendance_status = entry.get('status')
#             date_str = entry.get('date')  
#             academic_year = entry.get('academic_year')  
#             hour = entry.get('hour')    

#             if not student_id or not attendance_status or not date_str:
#                 return Response(
#                     {"error": "Missing required fields: student_id, status, or date."},
#                     status=status.HTTP_400_BAD_REQUEST
#                 )
#             if attendance_status not in ['Present', 'Absent']:
#                 return Response(
#                     {"error": "Invalid status value. It should be 'Present' or 'Absent'."},
#                     status=status.HTTP_400_BAD_REQUEST
#                 )
#             try:
#                 date = datetime.strptime(date_str, '%Y-%m-%d').date()
#                 student = get_object_or_404(Student, student_id=student_id)
#                 attendance, created = Attendance.objects.get_or_create(
#                     student=student,
#                     date=date,
#                     hour= hour,
#                    defaults={
#                         'status': attendance_status,
#                         'academic_year': academic_year,
#                         }
#                 )
#                 if not created:
#                     attendance.status = attendance_status
#                     attendance.academic_year = academic_year
#                     attendance.hour = hour
#                     attendance.save()
#                 updated_attendance.append(attendance)

#                 if attendance_status == 'Absent':
#                     parents = student.parents.all()
#                     for parent in parents:
#                         # Notification.objects.create(
#                         #     parent=parent,
#                         #     message=f"{student.username} was absent on {date}"
#                         # )
#                         Notification.objects.create(
#                             parent=parent,
#                             message=f"{student.username} was absent on {date} ({hour})",
#                             type="absent",
#                             hour=hour
#                         )

#                     previous_dates = [
#                         date - timedelta(days=1),
#                         date - timedelta(days=2)
#                     ]
#                     absents = Attendance.objects.filter(
#                         student=student,
#                         date__in=previous_dates + [date],
#                         status='Absent'
#                     ).values_list('date', flat=True)

#                     if all(d in absents for d in [date] + previous_dates):
#                         for parent in student.parents.all():
#                             existing = Notification.objects.filter(
#                                 parent=parent,
#                                 message__icontains="3 consecutive days",
#                             ).filter(
#                                 message__icontains=str(date)
#                             )
#                             if not existing.exists():
#                                 date_str = date.strftime("%Y-%m-%d")
#                                 # Notification.objects.create(
#                                 #     parent=parent,
#                                 #     message=f"{student.username} was absent for 3 consecutive days including {date_str}"
#                                 # )
#                                 Notification.objects.create(
#                                     parent=parent,
#                                     message=f"{student.username} was absent for 3 consecutive days including {date_str}",
#                                     type="absent_3_days",
#                                     hour=None
#                                 )
#             except ValidationError as e:
#                 return Response(
#                     {"error": str(e)},
#                     status=status.HTTP_400_BAD_REQUEST
#                 )
#         return Response({"message": "Success"}, status=status.HTTP_200_OK)
    
class MarkAttendance(APIView):
    def post(self, request):
        attendance_data = request.data
        updated_attendance = []

        for entry in attendance_data:
            student_id = entry.get('student_id')
            attendance_status = entry.get('status')
            date_str = entry.get('date')  
            academic_year = entry.get('academic_year')  
            hour = entry.get('hour')                     
            subject_id = entry.get('subject_id')
            branch_id = entry.get('branch') 
            semester = entry.get('semester')   

            if not student_id or not attendance_status or not date_str or not subject_id:
                return Response(
                    {"error": "Missing required fields: student_id, status, date, or subject_id."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if attendance_status not in ['Present', 'Absent']:
                return Response(
                    {"error": "Invalid status value. It should be 'Present' or 'Absent'."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                date = datetime.strptime(date_str, '%Y-%m-%d').date()

                student = get_object_or_404(Student, student_id=student_id, semester=semester)
                subject = get_object_or_404(Subject, id=subject_id)
                branch = get_object_or_404(Branch, id=branch_id)

               
                attendance, created = Attendance.objects.get_or_create(
                    student=student,
                    date=date,
                    subject=subject,
                    hour=hour,
                    defaults={
                        'status': attendance_status,
                        'academic_year': academic_year,
                        'branch': branch, 
                        'semester': semester,
                    }
                )

             
                if not created:
                    attendance.status = attendance_status
                    attendance.academic_year = academic_year
                    attendance.hour = hour
                    attendance.branch = branch
                    attendance.semester = semester
                    attendance.save()

                updated_attendance.append(attendance)

                
                attendance_summary, created = AttendanceSummary.objects.get_or_create(
                    student=student,
                    semester=semester,
                    defaults={
                        'total_hours': 0,
                        'present_hours': 0,
                        'percentage': 0.0,
                    }
                )

                attendance_summary.total_hours += 1
                if attendance_status == 'Present':
                    attendance_summary.present_hours += 1

                attendance_summary.percentage = (
                    attendance_summary.present_hours / attendance_summary.total_hours
                ) * 100
                attendance_summary.save()

               
                parents = student.parents.all()

                if 70 <= attendance_summary.percentage < 75:
                    for parent in parents:
                        Notification.objects.create(
                            parent=parent,
                            message=f"Alert: {student.username}'s attendance for Semester {semester} is below 75%. Current: {attendance_summary.percentage:.2f}%"
                        )

                elif 76 <= attendance_summary.percentage <= 80:
                    for parent in parents:
                        Notification.objects.create(
                            parent=parent,
                            message=f"Warning: {student.username}'s attendance for Semester {semester} is close to 75%. Current: {attendance_summary.percentage:.2f}%"
                        )

              
                if attendance_status == 'Absent':
                    for parent in parents:
                        Notification.objects.create(
                            parent=parent,
                            message=f"{student.username} was absent on {date} for {hour}",
                            type="absent",
                            hour=hour
                        )

                    previous_dates = [date - timedelta(days=1), date - timedelta(days=2)]

                    absents = Attendance.objects.filter(
                        student=student,
                        subject=subject,
                        date__in=previous_dates + [date],
                        status='Absent'
                    ).values_list('date', flat=True)

                   
                    if all(d in absents for d in [date] + previous_dates):
                        for parent in parents:
                            existing = Notification.objects.filter(
                                parent=parent,
                                message__icontains="3 consecutive days"
                            ).filter(message__icontains=str(date))

                            if not existing.exists():
                                Notification.objects.create(
                                    parent=parent,
                                    message=f"{student.username} was absent for 3 consecutive days including {date.strftime('%Y-%m-%d')} for {subject}",
                                    type="absent_3_days"
                                )

            except ValidationError as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )

        return Response({"message": "Success"}, status=status.HTTP_200_OK)

    
class StudentAttendanceListView(APIView):
    def get(self, request):
        try:
            students = Student.objects.select_related('branch').all()
            data = []

            for student in students:
                attendance_records = Attendance.objects.filter(student=student).values('date', 'status','academic_year','hour','student').order_by('-date')

                student_data = {
                    "student_id": student.student_id,
                    "username": student.username,
                    "email": student.email,
                    "phone_number": student.phone_number,
                    "academic_year": student.academic_year,
                    "semester": student.semester,
                    "branch_name": student.branch.name if student.branch else None,
                    "attendance": list(attendance_records)  
                }

                data.append(student_data)

            return Response({"students": data}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetHodByBranchAPIView(APIView):
    def get(self, request, *args, **kwargs):
        branch_name = kwargs.get('branch_name')
        if not branch_name:
            return Response({'error': 'Branch name is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            branch = Branch.objects.get(name=branch_name)
            hod = branch.hods.first()  
            if hod:
                return Response({'hod_id': hod.id}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'No HOD assigned to this branch'}, status=status.HTTP_404_NOT_FOUND)
        except Branch.DoesNotExist:
            return Response({'error': 'Branch not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SubmitAttendanceEditRequestsView(APIView):
    def post(self, request):
        requests_data = request.data.get('requests', [])
        hod_id = request.data.get('hod_id')
        notifications = []
        data = []
        for req_data in requests_data:
            try:
                student = Student.objects.get(student_id=req_data['student_id'])
                branch = Branch.objects.get(name=req_data['branch'])
                faculty = Faculty.objects.get(id=req_data['requested_by'])
                hod = HOD.objects.get(id=hod_id)
                edit_request = AttendanceEditRequest.objects.create(
                    student=student,
                    date=req_data['date'],
                    hour=req_data['hour'],
                    new_status=req_data['new_status'],
                    branch=branch,
                    requested_by=faculty,
                    hod=hod
                )
                message = (
                    f"{faculty.username} requested to change attendance for "
                    f"{student.username} on {edit_request.date} (Hour {edit_request.hour}) "
                    f"to '{edit_request.new_status}'."
                )
                notification = HodNotification(
                    recipient=hod,
                    message=message,
                    related_request=edit_request
                )
                notifications.append(notification)
                request_data = {
                    "request_id": edit_request.id,
                    "student_id": student.student_id,
                    "student_name": student.username,
                    "requested_by": faculty.username,
                    "branch_name": branch.name,
                    "hod_name": hod.username,
                    "date": edit_request.date,
                    "hour": edit_request.hour,
                    "new_status": edit_request.new_status,
                    "status": edit_request.status
                }
                data.append(request_data)
            except (Student.DoesNotExist, Branch.DoesNotExist, Faculty.DoesNotExist, HOD.DoesNotExist) as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        HodNotification.objects.bulk_create(notifications)

        return Response({"message": "Attendance edit requests and notifications sent successfully.", "requests": data}, status=status.HTTP_200_OK)
    
class HodNotificationView(APIView):
    def get(self, request, hod_id):
        try:
            hod = HOD.objects.get(id=hod_id)
            branch = hod.branch  
            notifications = HodNotification.objects.filter(recipient=hod)
            relevant_notifications = []

            for notification in notifications:
                related_request = notification.related_request
                if related_request and related_request.branch == branch:
                    relevant_notifications.append(notification)

            notification_data = [
                {
                    "id": notification.id,
                    "message": notification.message,
                    "is_read": notification.is_read,
                    "created_at": notification.created_at,
                    "related_request": {
                        "student_name": notification.related_request.student.username,
                        "student_id": notification.related_request.student.student_id,
                        "date": notification.related_request.date,
                        "hour": notification.related_request.hour,
                        "new_status": notification.related_request.new_status,
                        "status": notification.related_request.status,
                        "requested_by": notification.related_request.requested_by.username,
                    }
                }
                for notification in relevant_notifications
            ]
            return Response({"notifications": notification_data}, status=status.HTTP_200_OK)

        except HOD.DoesNotExist:
            return Response({"error": "HOD not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class FacultyNotificationStatusView(APIView):
    def get(self, request, faculty_id):
        try:
            faculty = Faculty.objects.get(id=faculty_id)
            requests = AttendanceEditRequest.objects.filter(
                requested_by=faculty,
                status__in=['Approved', 'Rejected','Pending']
            ).order_by('-date', '-hour')
            data = [
                {
                    "id": req.id,
                    "student": req.student.username,
                    "date": req.date,
                    "hour": req.hour,
                    "new_status": req.new_status,
                    "status": req.status,
                    "responded_by": req.hod.username if req.hod else None
                }
                for req in requests
            ]
            return Response({"notifications": data}, status=status.HTTP_200_OK)

        except Faculty.DoesNotExist:
            return Response({"error": "Faculty not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class DeleteAttendanceEditRequestView(APIView):
    def delete(self, request, pk):
        try:
            request_obj = AttendanceEditRequest.objects.get(pk=pk)
            request_obj.delete()
            return Response({"message": "Notification deleted."}, status=204)
        except AttendanceEditRequest.DoesNotExist:
            return Response({"error": "Not found."}, status=404)

        
class ApproveAttendanceEditRequestView(APIView):
    def post(self, request, request_id):
        try:
            edit_request = get_object_or_404(AttendanceEditRequest, id=request_id)
            if edit_request.status != 'Pending':
                return Response({"error": "Request has already been processed."}, status=status.HTTP_400_BAD_REQUEST)
            if 'approve' in request.data:
                edit_request.status = 'Approved'
                edit_request.save()
                student_attendance = get_object_or_404(Attendance, student=edit_request.student, date=edit_request.date, hour=edit_request.hour)
                student_attendance.status = edit_request.new_status
                student_attendance.save()
                return Response({"message": "Attendance edit request approved and attendance updated successfully."}, status=status.HTTP_200_OK)

            elif 'reject' in request.data:
                edit_request.status = 'Rejected'
                edit_request.save()
                return Response({"message": "Attendance edit request rejected."}, status=status.HTTP_200_OK)

            else:
                return Response({"error": "No action specified."}, status=status.HTTP_400_BAD_REQUEST)

        except AttendanceEditRequest.DoesNotExist:
            return Response({"error": "Attendance edit request not found."}, status=status.HTTP_404_NOT_FOUND)
        except Attendance.DoesNotExist:
            return Response({"error": "Student attendance record not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class ParentStudentsView(APIView):
    def get(self, request):
        parent_id = request.query_params.get("parent_id")  
        if not parent_id:
            return Response({"error": "Parent ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            parent = Parent.objects.get(id=parent_id)
            students = parent.students.all()
            serialized_students = StudentRegisterSerializer(students, many=True)
            return Response(serialized_students.data, status=status.HTTP_200_OK)
        except Parent.DoesNotExist:
            return Response({"error": "Parent not found"}, status=status.HTTP_404_NOT_FOUND)
        
class NotificationsUnderParentView(APIView):
    def get(self, request, parent_id):
        try:
            parent = get_object_or_404(Parent, id=parent_id)
            student_id = request.query_params.get("student_id")
            notifications = Notification.objects.filter(parent=parent)
            if student_id:
                student = parent.students.filter(student_id=student_id).first()
                if student:
                    notifications = notifications.filter(message__icontains=student.username)
                else:
                    return Response({"error": "Student not associated with this parent"}, status=403)
            serializer = NotificationSerializer(notifications.order_by('-timestamp'), many=True)
            return Response(serializer.data)
        except Parent.DoesNotExist:
            return Response({'error': 'Parent not found'}, status=404)
        
class FacultySubjectsBranchesStudentsView(APIView):
    def get(self, request, faculty_id):
        try:
            faculty = Faculty.objects.get(id=faculty_id)
            subjects = Subject.objects.filter(faculty=faculty)
            if not subjects.exists():
                return Response({"message": "No subjects assigned to this faculty."}, status=status.HTTP_404_NOT_FOUND)
            branches = Branch.objects.filter(subject__in=subjects).distinct()
            if not branches.exists():
                return Response({"message": "No branches found for faculty's subjects."}, status=status.HTTP_404_NOT_FOUND)
            students = Student.objects.filter(branch__in=branches)
            subject_data = SubjectSerializer(subjects, many=True).data
            branch_data = BranchSerializer(branches, many=True).data
            student_data = StudentRegisterSerializer(students, many=True).data
            return Response({
                "subjects": subject_data,
                "branches": branch_data,
                "students": student_data,
            }, status=status.HTTP_200_OK)
        except Faculty.DoesNotExist:
            return Response({"error": "Faculty not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class AttendanceReportPerSubjectView(APIView):
    def get(self, request, faculty_id):
        try:
            branch_name = request.query_params.get('branch_name')
            academic_year = request.query_params.get('academic_year')
            semester = request.query_params.get('semester')
            subject_name = request.query_params.get('subject_name')

          
            attendance_records = Attendance.objects.filter(
                subject__faculty__id=faculty_id,  # <-- fixed this line
                student__branch__name=branch_name,   # <-- notice student__branch__name
                academic_year=academic_year,
                # semester=semester,
                subject__subject_name=subject_name
            )

            student_data = {}

            for record in attendance_records:
                student_id = record.student.student_id
                if student_id not in student_data:
                    student_data[student_id] = {
                        "student_id": student_id,
                        "student_name": record.student.username,
                        "present_hours": 0,
                        "total_hours": 0,
                    }

                student_data[student_id]["total_hours"] += 1
                if record.status == 'Present':
                    student_data[student_id]["present_hours"] += 1

            # Prepare the final result
            result = []
            for student in student_data.values():
                if student["total_hours"] > 0:
                    attendance_percentage = (student["present_hours"] / student["total_hours"]) * 100
                else:
                    attendance_percentage = 0

                student["attendance_percentage"] = round(attendance_percentage, 2)
                result.append(student)

            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": f"An unexpected error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

        
class GetStudentAttendance(APIView):
    def get(self, request, student_id):
        print(f"Looking for student_id: {student_id}")
        student = get_object_or_404(Student, id=student_id)
        attendance_records = Attendance.objects.filter(student=student)
        semester = request.GET.get('semester')
        month = request.GET.get('month')
        if semester:
            attendance_records = attendance_records.filter(semester=semester)
        if month:
            try:
                month_int = int(month)
                attendance_records = attendance_records.filter(date__month=month_int)
            except ValueError:
                return Response({"error": "Invalid month value"}, status=status.HTTP_400_BAD_REQUEST)
        attendance_data = []
        for record in attendance_records:
            attendance_data.append({
                "student_id": record.student.student_id,
                "status": record.status,
                "date": record.date,
                "hour": record.hour,
                "academic_year": record.academic_year,
                "branch": record.branch.name,
                "semester": record.semester,
                "subject": record.subject.subject_name,
            })
        return Response({"attendance": attendance_data}, status=status.HTTP_200_OK)

class StudentSubjectReportView(APIView):
    def get(self, request, student_id):
        try:
            academic_year = request.query_params.get('academic_year')
            semester = request.query_params.get('semester')
            if not academic_year or not semester:
                return Response(
                    {"error": "academic_year and semester are required parameters."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            attendance_records = Attendance.objects.filter(
                student__id=student_id,
                academic_year=academic_year,
                semester=semester
            )
            subjects = attendance_records.values_list('subject__subject_name', flat=True).distinct()
            result = []
            for subject in subjects:
                subject_records = attendance_records.filter(subject__subject_name=subject)
                total_hours = subject_records.count()
                present_hours = subject_records.filter(status='Present').count()
                if total_hours > 0:
                    attendance_percentage = (present_hours / total_hours) * 100
                else:
                    attendance_percentage = 0
                result.append({
                    "subject_name": subject,
                    "total_hours": total_hours,
                    "present_hours": present_hours,
                    "attendance_percentage": round(attendance_percentage, 2)
                })
            return Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class AttendanceReportPerSemesterView(APIView):
    def get(self, request):
        try:
            student_id = request.GET.get('student_id')
            if not student_id:
                return Response({"error": "Missing student_id in query params."}, status=status.HTTP_400_BAD_REQUEST)
            print(f"Fetching attendance for student_id: {student_id}")
            student = get_object_or_404(Student, id=student_id)
            # Filter out attendance records where semester is None
            attendance_records = Attendance.objects.filter(student=student, semester__isnull=False)
            semester_data = {}
            for record in attendance_records:
                semester = record.semester
                if semester not in semester_data:
                    semester_data[semester] = {
                        "student_id": student.id,
                        "semester": semester,
                        "present_hours": 0,
                        "total_hours": 0,
                    }

                semester_data[semester]["total_hours"] += 1
                if record.status.lower() == "present":
                    semester_data[semester]["present_hours"] += 1

            # Calculate attendance percentage
            result = []
            for data in semester_data.values():
                total = data["total_hours"]
                present = data["present_hours"]
                percentage = (present / total) * 100 if total > 0 else 0
                data["attendance_percentage"] = round(percentage, 2)
                result.append(data)

            return Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Server Error: {str(e)}")  # Output the error to terminal/log
            return Response({"error": f"Server error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)