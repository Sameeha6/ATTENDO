from django.urls import path
from . import views

urlpatterns = [
    path('attendo/', views.attendo, name='attendo'),
]