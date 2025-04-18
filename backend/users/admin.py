from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User



class UserAdmin(BaseUserAdmin):
    def get_list_display(self, request):
        return [field.name for field in self.model._meta.fields]

    fieldsets = BaseUserAdmin.fieldsets + (
        ('Avatar personalizado', {'fields': ('avatar_name',)}),
    )

    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Avatar personalizado', {
            'classes': ('wide',),
            'fields': ('avatar_name',),
        }),
    )

admin.site.register(User, UserAdmin)
