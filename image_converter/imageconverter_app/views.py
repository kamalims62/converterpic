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

        # Compress image and encode as base64 string
        try:
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
            converted_images.append(converted_image_str)

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
    merger = PdfMerger()
    for file in files:
        pdf_bytes = convert_image_to_pdf(file)
        pdf_reader = PdfReader(BytesIO(pdf_bytes))
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


@api_view(['POST'])
def resize_image(request):
    # Check if image file is present in the request
    if 'image' not in request.FILES:
        return Response({'error': 'No image file provided'})

    # Get image file from the request
    image_file = request.FILES['image']

    # Check if width and height are present in the request
    width = request.data.get('width')
    height = request.data.get('height')

    if not width or not height:
        return Response({'error': 'Width and height must be provided'})

    try:
        # Open the image
        image = PilImage.open(image_file)

        # Convert RGBA to RGB if necessary
        if image.mode == 'RGBA':
            image = image.convert('RGB')

        # Get the resize techniques
        resize_techniques_str = request.data.get('resize_techniques')
        resize_techniques = resize_techniques_str.split(',') if resize_techniques_str else []

        if not resize_techniques:
            return Response({'error': 'No resize techniques provided'})

        if 'All' in resize_techniques:
            # Include all available techniques
            resize_techniques = ['rescale', 'squeeze', 'crop', 'letterbox']

        # Resize the image using the specified techniques
        resized_images = {}

        for technique in resize_techniques:
            if technique == 'rescale':
                # Rescale the image while preserving aspect ratio
                resized_image = image.resize((int(width), int(height)))

            elif technique == 'squeeze':
                # Resize without preserving aspect ratio (squeeze/stretch)
                resized_image = image.resize((int(width), int(height)), PilImage.NEAREST)

            elif technique == 'crop':
                # Crop the image to the specified dimensions
                left = (image.width - int(width)) // 2
                top = (image.height - int(height)) // 2
                right = left + int(width)
                bottom = top + int(height)
                resized_image = image.crop((left, top, right, bottom))

            elif technique == 'letterbox':
                # Resize and add letterboxing/pillarboxing
                target_ratio = int(width) / int(height)
                original_ratio = image.width / image.height

                if target_ratio > original_ratio:
                    new_width = int(height) * original_ratio
                    resized_image = image.resize((int(new_width), int(height)))
                    padding = int((int(width) - new_width) / 2)
                    background = (0, 0, 0)  # Change the color if desired
                    resized_image = PilImage.new('RGB', (int(width), int(height)), background)
                    resized_image.paste(image, (padding, 0))
                else:
                    new_height = int(width) / original_ratio
                    resized_image = image.resize((int(width), int(new_height)))
                    padding = int((int(height) - new_height) / 2)
                    background = (0, 0, 0)  # Change the color if desired
                    resized_image = PilImage.new('RGB', (int(width), int(height)), background)
                    resized_image.paste(image, (0, padding))

            else:
                return Response({'error': f'Invalid resize technique: {technique}'})

            # Get the image format from the original image
            original_format = image.format.lower()

                        # Check if the image format is supported
            supported_formats = ['jpeg', 'png', 'gif', 'webp', 'tiff', 'jpg', 'bmp']

            if original_format not in supported_formats:
                return Response({'error': f'Unsupported image format: {original_format}'})

            # Save the resized image to a BytesIO buffer
            buffer = BytesIO()
            format = original_format if original_format != 'jpg' else 'jpeg'
            resized_image.save(buffer, format=format)
            buffer.seek(0)

            # Encode the byte string as base64
            encoded_image = base64.b64encode(buffer.getvalue()).decode('utf-8')

            # Get the resized image dimensions
            resized_width, resized_height = resized_image.size

            # Store the resized image and its dimensions
            resized_images[technique] = {
                'resized_image': encoded_image,
                'resized_width': resized_width,
                'resized_height': resized_height
            }

        # Return the resized images as response
        return Response(resized_images)

    except Exception as e:
        error_message = str(e)
        return Response({'error': error_message})



from pytube import YouTube

@api_view(['GET'])
def download_media(request):
    video_url = request.GET.get('url')
    
    try:
        # Create a YouTube object
        yt = YouTube(video_url)
        
        available_streams = []
        if yt.streams:
            # Get all available video and audio streams
            video_streams = list(yt.streams.filter(progressive=True, file_extension='mp4'))
            audio_streams = list(yt.streams.filter(only_audio=True))
            
            available_streams = video_streams + audio_streams

        if not available_streams:
            return Response("No video or audio streams available", status=400)

        # Create a list to store stream information
        stream_data = []
        
        for stream in available_streams:
            if stream.includes_audio_track and stream.includes_video_track:
                stream_type = 'video'
            elif stream.includes_audio_track:
                stream_type = 'audio'
            else:
                stream_type = 'unknown'
            
            stream_data.append({
                'type': stream_type,
                'mime_type': stream.mime_type,
                'extension': stream.subtype,
                'quality': stream.abr if stream.includes_audio_track else stream.resolution,
                'url': stream.url,
                'default_filename': stream.default_filename
            })
        
        return Response(stream_data, status=200)
        
    except Exception as e:
        return Response(str(e), status=500)



import base64
from pdf2image import convert_from_bytes
from io import BytesIO

@api_view(['POST'])
def convert_pdf_to_images(request):
    pdf_file = request.FILES.get('pdf_file')

    if pdf_file is None:
        return Response({'error': 'No PDF file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

    if not pdf_file.name.endswith('.pdf'):
        return Response({'error': 'Invalid file format. Only PDF files are allowed.'}, status=status.HTTP_400_BAD_REQUEST)

    max_pages = request.data.get('max_pages', None)
    if max_pages is not None:
        try:
            max_pages = int(max_pages)
        except ValueError:
            return Response({'error': 'Invalid max_pages parameter. It should be an integer.'}, status=status.HTTP_400_BAD_REQUEST)
        if max_pages < 0:
            return Response({'error': 'Invalid max_pages parameter. It should be a positive integer.'}, status=status.HTTP_400_BAD_REQUEST)

    max_file_size = request.data.get('max_file_size', None)
    if max_file_size is not None:
        try:
            max_file_size = int(max_file_size)
        except ValueError:
            return Response({'error': 'Invalid max_file_size parameter. It should be an integer.'}, status=status.HTTP_400_BAD_REQUEST)
        if max_file_size < 0:
            return Response({'error': 'Invalid max_file_size parameter. It should be a positive integer.'}, status=status.HTTP_400_BAD_REQUEST)

    quality = request.data.get('quality', 85)
    try:
        quality = int(quality)
        if quality < 1 or quality > 100:
            raise ValueError
    except ValueError:
        return Response({'error': 'Invalid quality parameter. It should be an integer between 1 and 100.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        pdf_bytes = pdf_file.read()
        if max_file_size and len(pdf_bytes) > max_file_size:
            return Response({'error': 'The uploaded PDF file exceeds the maximum file size limit.'}, status=status.HTTP_400_BAD_REQUEST)

        pages = convert_from_bytes(pdf_bytes, first_page=0, last_page=max_pages or None)
    except Exception as e:
        return Response({'error': f'Error converting PDF: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    images = []

    for i, page in enumerate(pages):
        if max_pages and i >= max_pages:
            break

        image_buffer = BytesIO()
        page.save(image_buffer, format='JPEG', quality=quality)
        image_buffer.seek(0)
        image_data = base64.b64encode(image_buffer.getvalue()).decode('utf-8')
        images.append({
            'image': image_data,
            'page_number': i + 1,
        })

    return Response(images, status=status.HTTP_200_OK)




