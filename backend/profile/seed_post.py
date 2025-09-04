from django.core.management.base import BaseCommand
from profile.models import user_profile, userPost, comment
import random
# to have some demo data that for creating postes and comments
class Command(BaseCommand):
    help = "Seed the database with demo posts and comments"

    def handle(self, *args, **kwargs):
        users = user_profile.objects.all()
        if not users.exists():
            self.stdout.write(self.style.ERROR("No users found. Create users first."))
            return

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
            post.likes.set(random.sample(list(users), k=random.randint(0, len(users))))
            for j in range(random.randint(1, 3)):
                comment.objects.create(
                    user=random.choice(users),
                    post=post,
                    content=f"Great post! I learned a lot about {subjects[i].split()[0].lower()}."
                )

        self.stdout.write(self.style.SUCCESS("Demo posts and comments created successfully."))