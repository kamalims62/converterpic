from rest_framework.decorators import api_view
from rest_framework.response import Response
from .conversion_functions import *
from PIL import Image as PilImage
from io import BytesIO
import json
import os
from django.shortcuts import render


@api_view(['GET'])
def index(request):
    return render(request, 'imageconverter_app/index.html', {})


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

    allowed_target_format = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'tiff', 'psd', 'raw', 'bmp', 'heif', 'indd']

    for target_format in toFormat:
        if target_format not in allowed_target_format:
            return Response({'error': 'Invalid target format'}, status=400)


    if target_format == 'jpg':
        target_format = 'jpeg'

    for index in range(len(image_file)):
        source_format = fromFormat[index]
        target_format = toFormat[index]

        function_name = conversion_function_mapping[source_format][target_format]
        # Call the function from conversion_functions.py module based on source_format, target_format & help of
        # conversion_function_mapping
        with PilImage.open(image_file[index]) as pil_image:
            converted_image_str = eval(f"{function_name}(pil_image, source_format, target_format)")
            converted_images.append(converted_image_str)

    print(converted_images)
    print(len(converted_images))
    response_data = {'converted_image': converted_images}
    return Response(response_data, status=200)






    # with PilImage.open(file_obj) as pil_image:
    #     # if pil_image.mode not in ('RGB', 'RGBA'):
    #     #     pil_image = pil_image.convert('RGB')
    #     print('here1............................................')
    #     print(pil_image.format)
    #     if source_format == 'png' and target_format == 'jpeg':
    #         converted_image = pil_image.convert('CMYK')
    #     if source_format == 'jpeg' and target_format == 'png':
    #         if pil_image.mode != "RGBA":
    #             converted_image = pil_image.convert("RGBA")
    #     converted_image = pil_image.convert(target_format.upper())
    #     print('here2..............................................')
    #     buffer = BytesIO()
    #     converted_image.save(buffer, format=target_format.upper())
    #     converted_image_str = base64.b64encode(buffer.getvalue()).decode('utf-8')
    #
    # response_data = {'converted_image': converted_image_str}
    # return Response(response_data, status=200)
