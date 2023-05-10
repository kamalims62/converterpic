from rest_framework.decorators import api_view
from rest_framework.response import Response
from .conversion_functions import *
from .utility_functions import image_compression
from PIL import Image as PilImage
from io import BytesIO
import json
import os
from django.shortcuts import render, redirect
from rest_framework import status
from PyPDF2 import PdfReader, PdfMerger
from rest_framework.exceptions import ParseError, APIException
from django.http import HttpResponse


@api_view(['GET'])
def index(request):
    return render(request, 'imageconverter_app/index.html', {})


@api_view(['GET', 'POST'])
def compress_image(request):
    if request.method == 'GET':
        return redirect('index')

    elif request.method == 'POST':
        # Get image and metadata from request
        try:
            print('hello 1')
            image = request.FILES.get('image')
            metadata_str = request.POST.get('metadata')
        except Exception as e:
            return Response({"error": "Failed to retrieve image or metadata."}, status=status.HTTP_400_BAD_REQUEST)

        # Parse metadata string to dictionary
        metadata = {}
        if metadata_str:
            try:
                metadata = json.loads(metadata_str)
            except json.JSONDecodeError:
                return Response({'error': 'Invalid metadata format'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate image format and size
        if not image:
            return Response({'error': 'No image file was provided'}, status=status.HTTP_400_BAD_REQUEST)

        allowed_formats = ['jpeg', 'png', 'gif', 'webp', 'tiff', 'jpg', 'bmp']
        if image.content_type.lower().split('/')[1] not in allowed_formats:
            return Response({'error': 'Invalid image format'}, status=status.HTTP_400_BAD_REQUEST)

        if image.size > 10 * 1024 * 1024:  # 10 MB limit
            return Response({'error': 'Image size too large'}, status=status.HTTP_400_BAD_REQUEST)

        # Get compression quality from metadata or default to 70
        compression_quality = metadata.get('compression_quality', 70)
        print('hello 1')

        # Compress image and encode as base64 string
        try:
            print(image, compression_quality)
            compressed_image_data = image_compression(image, compression_quality)
            compressed_image_base64 = compressed_image_data['compressed_image_data']
            compression_quality = compressed_image_data['compression_quality']
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': 'Failed to compress image'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Return compressed image data and compression quality in response
        return Response({'compressed_image_data': compressed_image_base64, 'compression_quality': compression_quality})


# Open the JSON file
conversion_function_mapping={}
with open(os.path.join(os.path.dirname(__file__), 'conversion_function_mapping.json'), 'r')as f:
    # Load the JSON data
    conversion_function_mapping = json.load(f)


@api_view(['POST'])
def convert_image(request):

    request_files = request.FILES
    request_meta_data = request.POST.items()
    request_files_length = len(request_files)

    image_file = []
    toFormat = []
    fromFormat = []
    converted_images = []
    if request_files_length>0:
        for i in range(request_files_length):
            # extract the image file and its metadata from the request
            image_file.append(request.FILES[f'file{i}'])

        for key, value in request_meta_data:
            if 'toFormat' in key:
                toFormat.append(value)

            if 'format' in key:
                fromFormat.append(value)

    allowed_target_format = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'tiff', 'bmp']

    for target_format in toFormat:
        if target_format not in allowed_target_format:
            return Response({'error': 'Invalid target format'}, status=400)

    for index in range(len(image_file)):
        source_format = fromFormat[index]
        target_format = toFormat[index]
        if target_format == 'jpg':
            target_format = 'jpeg'

        function_name = conversion_function_mapping[source_format][target_format]
        # Call the function from conversion_functions.py module based on source_format, target_format & help of
        # conversion_function_mapping
        with PilImage.open(image_file[index]) as pil_image:
            converted_image_str = eval(f"{function_name}(pil_image, source_format, target_format)")
            print(type(converted_image_str))
            converted_images.append(converted_image_str)

    print(len(converted_images))
    response_data = {'converted_image': converted_images}
    return Response(response_data, status=200)


@api_view(['GET', 'POST'])
def Image_to_pdf(request):
    if request.method == 'GET':
        return redirect('index')

    elif request.method == 'POST':
            # Get the image files from the request
        return images_to_pdf(request)

def images_to_pdf(request):
    files = request.FILES.getlist('file')
    print(len(files))
    merger = PdfMerger()
    for file in files:
        pdf_bytes = convert_image_to_pdf(file)
        pdf_reader = PdfReader(BytesIO(pdf_bytes))
        print(len(pdf_reader.pages))
        if len(pdf_reader.pages) == 0:
            return Response({'error': 'Failed to convert one or more image files to PDF.'}, status=400)

        merger.append(pdf_reader)
    output_buffer = BytesIO()
    merger.write(output_buffer)
    output_buffer.seek(0)
    response = HttpResponse(output_buffer, content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="converted.pdf"'
    return response

def convert_image_to_pdf(image_file):
    from PIL import Image
    import tempfile

    with BytesIO() as f:
        image = Image.open(image_file)
        pdf_width, pdf_height = (8.5 * 72, 11 * 72)  # 1 inch = 72 points
        margin = 72  # 1 inch margin
        image_width, image_height = image.size
        if image_width > pdf_width - 2 * margin or image_height > pdf_height - 2 * margin:
            # Resize the image to fit within the page margins
            image.thumbnail((pdf_width - 2 * margin, pdf_height - 2 * margin))
        pdf_image = Image.new('RGB', (int(pdf_width), int(pdf_height)), (255, 255, 255))  # Create a white background for the PDF page
        pdf_image.paste(image, ((int(pdf_width) - int(image.width)) // 2, (int(pdf_height) - int(image.height)) // 2))  # Center the image on the page
        pdf_image.save(f, 'PDF', resolution=100, save_all=True)
        f.seek(0)
        return f.read()