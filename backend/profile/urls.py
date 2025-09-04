from django.urls import path
from .views import RegisterView, LoginView , UserInfoView , PostListCreateView , PostDetailView , CommentCreateView,LikeToggleView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('user-info/', UserInfoView.as_view(), name='user-info'),
     path('posts/', PostListCreateView.as_view(), name='post-list'),
    path('posts/<int:pk>/', PostDetailView.as_view(), name='post-detail'),
    path('posts/<int:post_id>/comment/', CommentCreateView.as_view(), name='post-comment'),
    path('posts/<int:post_id>/like/', LikeToggleView.as_view(), name='post-like'),

]