from django.urls import path
from .views import LoginView,BranchListCreateView,HODRegisterView,BranchDetailView,FacultyRegisterView,FacultyDetailView,HODDetailView,SubjectListCreateView,SubjectDetailView,TutorRegisterView,TutorDetailView,StudentRegisterView,ContactMessageView,TutorSubjectsAndSemestersView,TimetableListCreateView,TimetableDetailView,AllTimetablesView,RequestTimetableHourChangeView,ApproveTimetableChangeRequestView

urlpatterns = [
    path("contactus/",ContactMessageView.as_view(),name="contactus"),
    path("login/", LoginView.as_view(), name="login"),
    path("branches/",BranchListCreateView.as_view(), name="branches"),
    path("hod/", HODRegisterView.as_view(), name="hod"),
    path("gethod/<int:pk>/", HODDetailView.as_view(), name="gethod"),
    path("editbranches/<int:pk>/",BranchDetailView.as_view(),name="editbranch"),
    path('addfaculty/', FacultyRegisterView.as_view(), name='addfaculty'),
    path('faculty/<int:faculty_id>/', FacultyDetailView.as_view(), name='faculty-detail'),
    path('subjects/', SubjectListCreateView.as_view(), name='subject-list-create'),
    path('subjects/<int:id>/', SubjectDetailView.as_view(), name='subject-detail'),
    path('add-tutor/', TutorRegisterView.as_view(), name='add-tutor'),
    path("tutors/<int:tutor_id>/", TutorDetailView.as_view(), name="tutor-detail"),
    path('students/', StudentRegisterView.as_view(), name='studentcreate'),
    path('students/<int:student_id>/', StudentRegisterView.as_view(),name='studentdelete'),
    path('add-timetable/', TimetableListCreateView.as_view(), name='add-timetable'),
    path('subjects-and-semesters/', TutorSubjectsAndSemestersView.as_view(), name='tutor-subjects-and-semesters'),
    path('delete-timetable/<int:pk>/',TimetableDetailView.as_view(), name='timetable-delete'),
    path('request-hour-change/', RequestTimetableHourChangeView.as_view(), name='request-hour-change'),
    path('timetables/', AllTimetablesView.as_view(), name='all-timetables'),
    path('request-hour-change/<int:request_id>/', ApproveTimetableChangeRequestView.as_view(), name='approve-timetable-change-request'),
    # path('students/', StudentRegisterView.as_view(), name='stdregister'),
    # path('mark-attendance/', MarkAttendance.as_view(), name='mark-attendance'),
    # path('student-attendance/', StudentAttendanceListView.as_view(), name='student-attendance-list'),
]
