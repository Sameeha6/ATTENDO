from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserLoginSerializer,BranchSerializer,HODRegisterSerializer
from .models import*


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
                "hod": branch.hods.first().id if branch.hods.exists() else None,
                "username": branch.hods.first().user.username if branch.hods.exists() else None,
                "phone": branch.hods.first().phone if branch.hods.exists() else None
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

