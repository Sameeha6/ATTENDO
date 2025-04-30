from django.contrib import admin
from .models import *



# admin.site.unregister(Student)
# admin.site.unregister(Faculty)
admin.site.register(ContactMessage)
admin.site.register(Login)
admin.site.register(Branch)
admin.site.register(HOD)
# admin.site.register(Faculty)
admin.site.register(Subject)
admin.site.register(Tutor)
admin.site.register(Parent)
# admin.site.register(Student)
admin.site.register(Timetable)
admin.site.register(TimetableChangeRequest)
# admin.site.register(Attendance)
admin.site.register(Notification)
admin.site.register(HodNotification)
admin.site.register(AttendanceEditRequest)
admin.site.register(Alert)
admin.site.register(AttendanceSummary)

class StuAdmin(admin.ModelAdmin):
    list_display = ["role"]  
admin.site.register(Student,StuAdmin)

class FacAdmin(admin.ModelAdmin):
    list_display = ["role"]
admin.site.register(Faculty,FacAdmin)



class AttendanceAdmin(admin.ModelAdmin):
    list_display = ["id","student","date","academic_year","hour","status","subject","branch","semester"]
admin.site.register(Attendance,AttendanceAdmin)


