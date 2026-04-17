
from rembg import remove
from PIL import Image
input_path = 'c:/Users/soura/.gemini/antigravity/brain/80c7cffc-8b70-48d0-8d91-f88175ee7537/media__1772834162609.jpg'
output_path = 'c:/Users/soura/.gemini/antigravity/scratch/startlane-ai/public/person_cutout.png'
input_img = Image.open(input_path)
output_img = remove(input_img)
output_img.save(output_path)

