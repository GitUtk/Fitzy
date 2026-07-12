from PIL import Image, ImageOps

input_path = "/home/utkarsh/Documents/Fitzy-1/frontend/public/snitch-logo.jpeg"
dark_logo_path = "/home/utkarsh/Documents/Fitzy-1/frontend/public/snitch-logo-dark.png"
light_logo_path = "/home/utkarsh/Documents/Fitzy-1/frontend/public/snitch-logo-light.png"

try:
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    print(f"Image loaded: {width}x{height}")
    
    # Let's inspect the corner pixel to see background color
    corner_pixel = img.getpixel((0, 0))
    print(f"Corner pixel: {corner_pixel}")
    
    # We will assume background is near-white if corner_pixel is light
    is_white_bg = (corner_pixel[0] + corner_pixel[1] + corner_pixel[2]) / 3 > 127
    
    # Create dark logo (black/dark on transparent)
    # If background is white, we make white transparent. Otherwise we make black transparent.
    dark_data = []
    for y in range(height):
        for x in range(width):
            r, g, b, a = img.getpixel((x, y))
            # compute brightness
            brightness = (r + g + b) / 3
            if is_white_bg:
                # white is background: make it transparent
                # the closer to white, the more transparent
                alpha = int(255 - brightness)
                # Keep it black/dark color
                dark_data.append((0, 0, 0, alpha))
            else:
                # black is background: make it transparent
                alpha = int(brightness)
                dark_data.append((0, 0, 0, alpha))
                
    dark_img = Image.new("RGBA", (width, height))
    dark_img.putdata(dark_data)
    dark_img.save(dark_logo_path, "PNG")
    print(f"Saved dark logo to {dark_logo_path}")
    
    # Create light logo (white/light on transparent)
    light_data = []
    for y in range(height):
        for x in range(width):
            r, g, b, a = img.getpixel((x, y))
            brightness = (r + g + b) / 3
            if is_white_bg:
                # white background is transparent, dark logo text becomes white text
                alpha = int(255 - brightness)
                light_data.append((255, 255, 255, alpha))
            else:
                # black background is transparent, white logo text remains white text
                alpha = int(brightness)
                light_data.append((255, 255, 255, alpha))
                
    light_img = Image.new("RGBA", (width, height))
    light_img.putdata(light_data)
    light_img.save(light_logo_path, "PNG")
    print(f"Saved light logo to {light_logo_path}")
    
except Exception as e:
    print(f"Error processing image: {e}")
