import os, sys, json

def generate_images(category, output_dir, count=4):
    try:
        import google.generativeai as genai
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            print("No GEMINI_API_KEY set. Using placeholder images.")
            return generate_placeholders(category, output_dir, count)
        genai.configure(api_key=api_key)
    except ImportError:
        print("google-generativeai not installed. Using placeholders.")
        return generate_placeholders(category, output_dir, count)

    PROMPTS = {
        "restaurant": "Professional food photography, modern Indian restaurant, warm lighting, elegant",
        "tile": "Modern tile showroom, ceramic tiles on walls, bright LED lighting, professional",
        "salon": "Luxurious beauty salon, styling mirrors, warm lighting, elegant decor",
        "hardware": "Organized hardware store, tools displayed, bright commercial lighting",
    }
    prompt = PROMPTS.get(category.lower().split()[0], "Modern Indian business, professional, welcoming")

    os.makedirs(output_dir, exist_ok=True)
    generated = []
    model = genai.GenerativeModel("gemini-2.0-flash-exp")
    for i in range(count):
        try:
            response = model.generate_content(
                f"Generate a photorealistic image: {prompt}",
                generation_config={"response_mime_type": "image/jpeg"}
            )
            filepath = os.path.join(output_dir, f"image-{i+1}.jpg")
            with open(filepath, "wb") as f:
                f.write(response.parts[0].inline_data.data)
            generated.append(filepath)
            print(f"Generated: {filepath}")
        except Exception as e:
            print(f"Failed image {i+1}: {e}")
    return generated

def generate_placeholders(category, output_dir, count):
    os.makedirs(output_dir, exist_ok=True)
    urls = []
    for i in range(count):
        url = f"https://source.unsplash.com/featured/800x600/?{category},business,india"
        urls.append(url)
    with open(os.path.join(output_dir, "image-urls.json"), "w") as f:
        json.dump(urls, f, indent=2)
    print(f"Placeholder URLs saved to {output_dir}/image-urls.json")
    return urls

if __name__ == "__main__":
    cat = sys.argv[1] if len(sys.argv) > 1 else "business"
    out = sys.argv[2] if len(sys.argv) > 2 else "./images"
    cnt = int(sys.argv[3]) if len(sys.argv) > 3 else 4
    generate_images(cat, out, cnt)
