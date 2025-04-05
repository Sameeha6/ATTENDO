from django.urls import path
from .views import LoginView,BranchListCreateView,HODRegisterView,BranchDetailView,FacultyRegisterView,FacultyDetailView,HODDetailView,SubjectListCreateView,SubjectDetailView,AddTutorView,TutorDetailView

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("branches/",BranchListCreateView.as_view(), name="branches"),
    path("hod/", HODRegisterView.as_view(), name="hod"),
    path("gethod/<int:pk>/", HODDetailView.as_view(), name="gethod"),
    path("editbranches/<int:pk>/",BranchDetailView.as_view(),name="editbranch"),
    path('addfaculty/', FacultyRegisterView.as_view(), name='addfaculty'),
    path('faculty/<int:faculty_id>/', FacultyDetailView.as_view(), name='faculty-detail'),
    path('subjects/', SubjectListCreateView.as_view(), name='subject-list-create'),
    path('subjects/<int:id>/', SubjectDetailView.as_view(), name='subject-detail'),
    path('add-tutor/', AddTutorView.as_view(), name='add-tutor'),
    path("tutors/<int:tutor_id>/", TutorDetailView.as_view(), name="tutor-detail")
]
