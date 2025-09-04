from profile.models import user_profile, userPost, comment
from django.core.files.uploadedfile import SimpleUploadedFile
import random

# this for Creating demo users
users = []
for i in range(5):
    user = user_profile.objects.create_user(
        username=f"user{i}",
        password="testpass123",
        email=f"user{i}@example.com",
        first_name=f"First{i}",
        last_name=f"Last{i}",
        gender=random.choice(['Male', 'Female', 'Other']),
        age=random.randint(18, 40),
    )
    users.append(user)

# Create demo posts
subjects = [
    "Exploring Django Signals",
    "My First React + Django App",
    "Tailwind v4 Tips & Tricks",
    "Why I Love Python",
    "Building Local AI Agents"
]

for i in range(5):
    post = userPost.objects.create(
        author=random.choice(users),
        subject=subjects[i],
        content=f"This is a demo post about {subjects[i].lower()} with some insights and code snippets.",
    )
    # Random likes
    liked_by = random.sample(users, k=random.randint(0, len(users)))
    post.likes.set(liked_by)

    # Add comments
    for j in range(random.randint(1, 3)):
        comment.objects.create(
            user=random.choice(users),
            post=post,
            content=f"Great post! I learned a lot about {subjects[i].split()[0].lower()}."
        )