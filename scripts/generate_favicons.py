import os
import base64
from PIL import Image

logo_path = os.path.join(os.path.dirname(__file__), '../apps/client/public/images/brennholzkaufen_logo_transparent.png')
dest_dir = os.path.join(os.path.dirname(__file__), '../apps/client/public')

im = Image.open(logo_path)
emblem = im.crop((16, 4, 273, 327))

# 1. Base 512x512 transparent
base_transparent = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
target_size = 440
scale = target_size / max(emblem.width, emblem.height)
new_w = int(emblem.width * scale)
new_h = int(emblem.height * scale)
resized_emblem = emblem.resize((new_w, new_h), Image.Resampling.LANCZOS)
offset_x = (512 - new_w) // 2
offset_y = (512 - new_h) // 2
base_transparent.paste(resized_emblem, (offset_x, offset_y), resized_emblem)

# 2. Base 512x512 on white background for Apple touch & PWA
base_white = Image.new('RGBA', (512, 512), (255, 255, 255, 255))
base_white.paste(resized_emblem, (offset_x, offset_y), resized_emblem)

# Save standard PNGs
base_transparent.resize((16, 16), Image.Resampling.LANCZOS).save(os.path.join(dest_dir, 'favicon-16x16.png'))
base_transparent.resize((32, 32), Image.Resampling.LANCZOS).save(os.path.join(dest_dir, 'favicon-32x32.png'))
base_transparent.resize((48, 48), Image.Resampling.LANCZOS).save(os.path.join(dest_dir, 'favicon-48x48.png'))
base_transparent.resize((96, 96), Image.Resampling.LANCZOS).save(os.path.join(dest_dir, 'favicon-96x96.png'))

# Save multi-size favicon.ico
ico_sizes = [(16, 16), (24, 24), (32, 32), (48, 48), (64, 64)]
base_transparent.save(os.path.join(dest_dir, 'favicon.ico'), format='ICO', sizes=ico_sizes)

# Save Apple Touch Icon & PWA icons
base_white.resize((180, 180), Image.Resampling.LANCZOS).save(os.path.join(dest_dir, 'apple-touch-icon.png'))
base_white.resize((192, 192), Image.Resampling.LANCZOS).save(os.path.join(dest_dir, 'logo192.png'))
base_white.resize((512, 512), Image.Resampling.LANCZOS).save(os.path.join(dest_dir, 'logo512.png'))

# Save SVG favicon
with open(os.path.join(dest_dir, 'logo512.png'), 'rb') as f:
    b64 = base64.b64encode(f.read()).decode('utf-8')

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <image width="512" height="512" href="data:image/png;base64,{b64}"/>
</svg>
'''
with open(os.path.join(dest_dir, 'favicon.svg'), 'w', encoding='utf-8') as f:
    f.write(svg_content)

print("[OK] All favicons and icons generated successfully in", dest_dir)
