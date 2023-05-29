from django.urls import path, re_path
from .views import convert_image, index, compress_image, Image_to_pdf, resize_image, download_media, convert_pdf_to_images
from django.views.generic import TemplateView

urlpatterns = [
    path('', index, name='index'),
    path('compress_image/',compress_image, name='compress_image'),
    path('convert_image/', convert_image),
    path('Image_to_pdf/', Image_to_pdf),
    path('resize/', resize_image, name='resize_image'),
    path('YouTubeDownload/', download_media, name='download_media'),
    path('Convert_Pdf_To_Images/', convert_pdf_to_images, name='convert_pdf_to_images'),
    
    re_path(r'^.*', index)
]
