from rest_framework import serializers
from .models import user_profile, userPost, comment
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = user_profile
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'gender', 'age', 'address', 'profile_img']

class CommentSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)

    class Meta:
        model = comment
        fields = ['id', 'user', 'post', 'content', 'created_at']

class UserPostSerializer(serializers.ModelSerializer):
    author = UserProfileSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = userPost
        fields = ['id', 'author', 'subject', 'content', 'image', 'created_at', 'updated_at', 'likes', 'comments']

# handels registrations and loging throuht api

class RegisterUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = user_profile
        fields = [
            'username', 'email', 'password', 'password2',
            'first_name', 'last_name', 'gender', 'age',
            'address', 'profile_img'
        ]

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user = user_profile(**validated_data)
        user.set_password(password)
        user.save()
        return user
    
class LoginUserSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if not user or not user.is_active:
            raise serializers.ValidationError("Invalid username or password.")
        data['user'] = user  # Attach user object for use in view
        return data
    
class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = comment
        fields = ['id', 'user', 'content', 'created_at']

class PostSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)
    image = serializers.ImageField(required=False)
    total_likes = serializers.IntegerField()
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = userPost
        fields = [
            'id', 'author', 'subject', 'content', 'image',
            'created_at', 'updated_at', 'total_likes', 'comments'
        ]
