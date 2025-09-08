from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status , permissions , generics
from .serializers import RegisterUserSerializer , LoginUserSerializer, UserPostSerializer , UserProfileSerializer , FollowSerializer ,PostSerializer, CommentSerializer
from rest_framework_simplejwt.tokens import RefreshToken 
from django.shortcuts import get_object_or_404
from . models import userPost , comment , Follow , user_profile
from rest_framework.permissions import IsAuthenticated
# this for parsing the post so we can put images in the post safely
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser
# This method handles the POST request for registering a new user
class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'User registered successfully.',
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# This method handles the POST request for logging in a user
class LoginView(APIView):
    def post(self, request):
        serializer = LoginUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Login successful.',
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)
    

class UserInfoView(APIView):
    """
    Returns the authenticated user's profile info.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    # This method updates the authenticated user's profile info
    def put(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

 # This method handles the POST request for creating a new post
class PostListCreateView(generics.ListCreateAPIView):
    queryset = userPost.objects.all().order_by('-created_at')
    serializer_class = UserPostSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [JSONParser, FormParser, MultiPartParser]


    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
# This method retrieves and updates a specific post
class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = userPost.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]
# This method creates a new comment on a specific post
class CommentCreateView(generics.CreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        post_id = self.kwargs.get('post_id')
        post = get_object_or_404(userPost, id=post_id)
        serializer.save(user=self.request.user, post=post)
# This method toggles the like status of a specific post
class LikeToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    # handels liking posts
    def post(self, request, post_id):
        post = get_object_or_404(userPost, id=post_id)
        user = request.user
        # handles unliking posts
        if user in post.likes.all():
            post.likes.remove(user)
            return Response({'status': 'unliked'})
        # handles the liking
        else:
            post.likes.add(user)
            return Response({'status': 'liked'})
    # also handles the unliking post for some reson   
    def delete(self, request, post_id):

        post = get_object_or_404(userPost, id=post_id)
        user = request.user
        if user in post.likes.all():
            post.likes.remove(user)
            return Response({'status': 'unliked'}, status=status.HTTP_204_NO_CONTENT)
        return Response({'detail': 'Not liked'}, status=status.HTTP_400_BAD_REQUEST)
 # This method follows or unfallow a specific user
class FollowUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        users = user_profile.objects.exclude(id=request.user.id)
        serializer = UserProfileSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request, username):
        try:
            target = user_profile.objects.get(username=username)
            if target == request.user:
                return Response({'error': 'Cannot follow yourself'}, status=400)
            Follow.objects.get_or_create(follower=request.user, following=target)
            return Response({'status': 'followed'}, status=201)
        except user_profile.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

    def delete(self, request, username):
        try:
            target = user_profile.objects.get(username=username)
            Follow.objects.filter(follower=request.user, following=target).delete()
            return Response({'status': 'unfollowed'}, status=204)
        except user_profile.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)