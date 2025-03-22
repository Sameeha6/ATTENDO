from django.urls import path
from .views import LoginView,BranchListCreateView,HODRegisterView

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("branches/",BranchListCreateView.as_view(), name="branches"),
    path("hod/", HODRegisterView.as_view(), name="hod")

]
