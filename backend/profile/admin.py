from django.contrib import admin
from .models import  user_profile ,userPost , comment , Follow
# Register your models here.
admin.site.register(user_profile),
admin.site.register(userPost),
admin.site.register(comment),
admin.site.register(Follow),

