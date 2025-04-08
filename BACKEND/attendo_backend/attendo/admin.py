from django.contrib import admin
from .models import Login,Branch,HOD,Faculty,Subject,Tutor,Student

admin.site.register(Login)
admin.site.register(Branch)
admin.site.register(HOD)
admin.site.register(Faculty)
admin.site.register(Subject)
admin.site.register(Tutor)
admin.site.register(Student)

# class StuAdmin(admin.ModelAdmin):
#     list_display = ["user","role"]
    
# admin.site.register(Student,StuAdmin)

# class FacAdmin(admin.ModelAdmin):
#     list_display = ["user","role"]
# admin.site.register(Faculty,FacAdmin)


