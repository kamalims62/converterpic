import base64
from io import BytesIO
from PIL import Image


def image_compression(image_file, quality):
    # Open image using Pillow library
    image = Image.open(image_file)

    # Validate image format
    allowed_formats = ['jpeg', 'png', 'gif', 'webp', 'tiff', 'jpg', 'bmp']
    if image.format.lower() not in allowed_formats:
        raise ValueError('Invalid image format')

    # Compress image using Pillow
    output_buffer = BytesIO()
    image.save(output_buffer, format=image.format, optimize=True, quality=quality)
    compressed_image_data = output_buffer.getvalue()

    # Encode compressed image data as base64 string
    compressed_image_base64 = base64.b64encode(compressed_image_data).decode('utf-8')

    return {'compressed_image_data': compressed_image_base64, 'compression_quality': quality}
