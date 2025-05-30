from django.urls import path
from .views import *


urlpatterns = [
    path("contactus/",ContactMessageView.as_view(),name="contactus"),
    path("login/", LoginView.as_view(), name="login"),
    path('forgot-password/', ForgotPasswordView.as_view()),
    path('hod/change-password/<int:hod_id>/', ChangePasswordView.as_view()),
    path('tutor/change-password/<int:tutor_id>/', TutorChangePasswordView.as_view()),
    path('faculty/change-password/<int:faculty_id>/', FacultyChangePasswordView.as_view()),
    path('student/change-password/<int:student_id>/', StudentChangePasswordView.as_view()),
    path('parent/change-password/<int:parent_id>/', ParentChangePasswordView.as_view()),

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
    path('students/<int:student_id>/', StudentRegisterView.as_view(), name='student-detail'),
    path('parents/', ParentCreateView.as_view(), name='parent-list-create'),
    path('parents/<int:pk>/', ParentDetailView.as_view(), name='parent-detail'),

    path('branch-count/', BranchCountView.as_view(), name='branch-count'),
    path('hod-user-counts/<int:hod_id>/', HODUserCountsView.as_view(), name='hod-user-counts'),
    path('tutor-user-counts/<int:tutor_id>/', TutorUserCountsView.as_view(), name='tutor-user-counts'),

    path("faculties-under-hod/<int:hod_id>/", FacultyUnderHODView.as_view()),
    path('tutors-under-hod/<int:hod_id>/', TutorsUnderHODView.as_view(), name='tutors-under-hod'),
    path('students-under-hod/<int:hod_id>/', StudentsUnderHODView.as_view(), name='students-under-hod'),
    path('parents-under-hod/<int:hod_id>/', ParentsUnderHODView.as_view(), name='parents-under-hod'),

    path('faculties-under-tutor/<int:tutor_id>/', FacultiesUnderTutorView.as_view()),
    path('student-under-tutor/<int:tutor_id>/', StudentsUnderTutorView.as_view()),
    path('parents-under-tutor/<int:tutor_id>/', ParentsUnderTutorView.as_view()),

    path('students/<int:student_id>/', StudentRegisterView.as_view(),name='studentdelete'),
    path('add-timetable/', TimetableListCreateView.as_view(), name='add-timetable'),
    path('subjects-and-semesters/', TutorSubjectsAndSemestersView.as_view(), name='tutor-subjects-and-semesters'),
    path('delete-timetable/<int:pk>/',TimetableDetailView.as_view(), name='timetable-delete'),

    path('request-hour-change/', RequestTimetableHourChangeView.as_view(), name='request-hour-change'),
    path('request-delete/<int:pk>/', deleteNotificationView.as_view()),
    path('timetables/', AllTimetablesView.as_view(), name='all-timetables'),
    path('request-hour-change/<int:request_id>/', ApproveTimetableChangeRequestView.as_view(), name='approve-timetable-change-request'),

    path('mark-attendance/', MarkAttendance.as_view(), name='mark-attendance'),
    path('student-attendance/', StudentAttendanceListView.as_view(), name='student-attendance-list'),
    path('attendance-edit-requests/', SubmitAttendanceEditRequestsView.as_view(), name='attendance-edit-requests'),
    path('notifications/<int:hod_id>/', HodNotificationView.as_view(), name='hod_notifications'),
    path('facultyhourreq/<int:faculty_id>/', FacultyNotificationStatusView.as_view(), name='faculty-notification-status'),
    path('facultyhourreq-delete/<int:pk>/', DeleteAttendanceEditRequestView.as_view(), name='facultyhourreq-delete'),
    path('approve-attendance-edit/<int:request_id>/', ApproveAttendanceEditRequestView.as_view(), name='approve-attendance-edit'),
    path('get-hod-for-branch/<str:branch_name>/', GetHodByBranchAPIView.as_view(), name='get_hod_for_branch'),

    path('parent-students/', ParentStudentsView.as_view(), name='parent-students'),
    path('notifications/parent/<int:parent_id>/', NotificationsUnderParentView.as_view(), name='parent-notifications'),
    path('notification-delete/<int:pk>/', deleteParentNotificationView.as_view()),
    
    path('facultybranchstds/<int:faculty_id>/', FacultySubjectsBranchesStudentsView.as_view(), name='faculty-students'),     
    path('attendance-report/<int:faculty_id>/', AttendanceReportPerSubjectView.as_view(), name='attendance-report-per-subject'),
    path('student-hour-attendance/<int:student_id>/', GetStudentAttendance.as_view(), name='student_attendance_details'),
    path('student-subject-report/<int:student_id>/', StudentSubjectReportView.as_view(), name='student-subject-report'),
    path('student-report-semester/', AttendanceReportPerSemesterView.as_view(), name='attendance-semester-report'),
    path('tutor-report-semester/', TutorAttendanceReportPerSemesterView.as_view(), name='tutor-attendance-semester-report'),
    path("parent-alerts/<int:parent_id>/", AlertsUnderParentView.as_view(), name="alerts-under-parent"),
    path('alert-delete/<int:pk>/', deleteParentAlertView.as_view()),
    path('student/attendance-notifications/', StudentAttendanceNotifications.as_view(), name='student-attendance-notifications'),
    path('student/delete-notification/<int:notification_id>/', DeleteNotificationView.as_view(), name='delete-notification'),
    
]
