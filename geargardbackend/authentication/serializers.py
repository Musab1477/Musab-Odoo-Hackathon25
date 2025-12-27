from rest_framework import serializers
from .models import User


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            "first_name",
            "last_name",
            "email",
            "password",
            "age",
            "gender",
            "address",
            "designation",
            "department",
        )

    def create(self, validated_data):
        password = validated_data.pop("password")
        email = validated_data.get("email")

        user = User(
            username=email,   # 🔥 email → username
            **validated_data
        )
        user.set_password(password)
        user.save()
        return user
