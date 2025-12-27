from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import login, logout
from .models import User
from rest_framework.permissions import IsAuthenticated
import traceback
from .serializers import UserCreateSerializer

def get_tokens_for_user(user):
    """
    Helper function to generate JWT tokens for user
    """
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """
    Login API
    Accepts email OR username
    """

    email = request.data.get('email')
    username = request.data.get('username')
    password = request.data.get('password')

    # 🔹 Prefer email if provided
    login_identifier = email or username

    if not login_identifier or not password:
        return Response(
            {'error': 'Please provide email/username and password.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(
        request,
        username=login_identifier,  # email stored as username
        password=password
    )

    if user is not None:
        tokens = get_tokens_for_user(user)

        login(request, user)

        return Response(
            {
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                },
                'tokens': tokens
            },
            status=status.HTTP_200_OK
        )

    return Response(
        {'error': 'Invalid email/username or password'},
        status=status.HTTP_401_UNAUTHORIZED
    )


@api_view(['POST'])
def logout_user(request):
    """
    Function-based logout API - destroys session
    """
    logout(request)
    return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
    })
    



@api_view(["POST"])
@permission_classes([AllowAny])
def create_user(request):
    """
    User Signup API
    """

    serializer = UserCreateSerializer(data=request.data)

    if not serializer.is_valid():
        # ❌ validation error (safe)
        return Response(
            {
                "error": "Validation failed",
                "details": serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = serializer.save()

        return Response(
            {
                "message": "User created successfully",
                "user": {
                    "id": user.id,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email,
                    "username": user.username,
                }
            },
            status=status.HTTP_201_CREATED
        )

    except Exception as e:
        # 🔥 FULL ERROR IN TERMINAL
        print("🔥 SIGNUP ERROR 🔥")
        traceback.print_exc()

        return Response(
            {
                "error": "Internal server error during signup",
                "details": str(e)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

