from django.urls import path, re_path
from .views import convert_image, index, compress_image, Image_to_pdf, resize_image
from django.views.generic import TemplateView

urlpatterns = [
    path('', index, name='index'),
    path('compress_image/',compress_image, name='compress_image'),
    path('convert_image/', convert_image),
    path('Image_to_pdf/', Image_to_pdf),
    path('resize/', resize_image, name='resize_image'),
    re_path(r'^.*', index)
]
