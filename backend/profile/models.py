from django.db import models
# profile/models.py
from django.contrib.auth.models import AbstractUser

class user_profile(AbstractUser):
    GENDER_CHOICES = (
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    )
    first_name=models.CharField(max_length=50)
    last_name=models.CharField(max_length=50)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    age = models.PositiveIntegerField(null=True, blank=True)
    email=models.EmailField()
    address =models.CharField(null=True, blank=True)
    profile_img=models.ImageField(upload_to='profile_img/%Y/%m/%d/', blank=True, null=True)
    def __str__(self):
        return self.username
    
class userPost(models.Model):
    author = models.ForeignKey(user_profile, on_delete=models.CASCADE, related_name='posts')
    subject = models.CharField(max_length=300)
    content = models.TextField(blank=True)
    image = models.ImageField(upload_to='post_images/%Y/%m/%d/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    likes = models.ManyToManyField(user_profile, related_name='liked_posts', blank=True)

    def __str__(self):
        return f"{self.subject} by {self.author.username}"

    def total_likes(self):
        return self.likes.count()

class comment(models.Model):
    user = models.ForeignKey(user_profile, on_delete=models.CASCADE, related_name='comments')
    post = models.ForeignKey(userPost, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.post.subject}"
    
class Follow(models.Model):
    follower = models.ForeignKey(user_profile, related_name='following', on_delete=models.CASCADE)
    following = models.ForeignKey(user_profile, related_name='followers', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('follower', 'following')
