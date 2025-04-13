from django.contrib import admin
from .models import Login,Branch,HOD,Faculty,Subject,Tutor,Student,ContactMessage,Timetable



# admin.site.unregister(Student)
# admin.site.unregister(Faculty)
admin.site.register(ContactMessage)
admin.site.register(Login)
admin.site.register(Branch)
admin.site.register(HOD)
# admin.site.register(Faculty)
admin.site.register(Subject)
admin.site.register(Tutor)
# admin.site.register(Student)
admin.site.register(Timetable)


class StuAdmin(admin.ModelAdmin):
    list_display = ["role"]
    
admin.site.register(Student,StuAdmin)

class FacAdmin(admin.ModelAdmin):
    list_display = ["role"]
admin.site.register(Faculty,FacAdmin)


