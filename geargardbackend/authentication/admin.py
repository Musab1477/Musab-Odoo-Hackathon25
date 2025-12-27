from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Custom User Admin for GearGuard
    """

    # 🔹 List View (Table columns)
    list_display = (
        "id",
        "email",
        "first_name",
        "last_name",
        "designation",
        "department",
        "is_active",
        "is_staff",
    )

    # 🔹 Clickable field
    list_display_links = ("id", "email")

    # 🔹 Filters on right sidebar
    list_filter = (
        "is_active",
        "is_staff",
        "department",
        "designation",
        "gender",
    )

    # 🔹 Search bar
    search_fields = (
        "email",
        "first_name",
        "last_name",
        "designation",
        "department",
    )

    # 🔹 Default ordering
    ordering = ("-id",)

    # 🔹 Fields shown in ADD / EDIT form
    fieldsets = (
        ("Login Credentials", {
            "fields": ("email", "username", "password")
        }),
        ("Personal Information", {
            "fields": (
                "first_name",
                "last_name",
                "age",
                "gender",
                "address",
            )
        }),
        ("Company Information", {
            "fields": (
                "designation",
                "department",
            )
        }),
        ("Permissions", {
            "fields": (
                "is_active",
                "is_staff",
                "is_superuser",
                "groups",
                "user_permissions",
            )
        }),
        ("Important Dates", {
            "fields": ("last_login", "date_joined")
        }),
    )

    # 🔹 Fields shown while creating user from admin
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "email",
                "username",
                "first_name",
                "last_name",
                "password1",
                "password2",
                "is_active",
                "is_staff",
            ),
        }),
    )

    # 🔹 Read-only fields
    readonly_fields = ("last_login", "date_joined")
