from rest_framework.permissions import BasePermission



class IsNotAuthenticated(BasePermission):
    """
    Allow access only to unauthenticated users.
    """
    def has_permission(self, request, view):
        return not request.user or request.user.is_anonymous

