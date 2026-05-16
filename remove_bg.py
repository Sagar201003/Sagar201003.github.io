from rembg import remove
from PIL import Image

input_path = 'Sagar_ProfilePhoto.jpeg'
output_path = 'Sagar_ProfilePhoto_bg_removed.png'

print("Removing background...")
input_image = Image.open(input_path)
output_image = remove(input_image)
output_image.save(output_path)
print("Background removed successfully!")
