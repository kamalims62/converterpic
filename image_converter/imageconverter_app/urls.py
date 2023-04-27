from django.urls import path
from .views import convert_image, index

urlpatterns = [
    path('', index),
    path('convert_image/', convert_image),
]
