# Cloudflare AI-Powered Alt Text Generator

Generate SEO-optimized, accessibility-friendly alt text for images using Cloudflare’s AI. Upload images or provide image URLs, and receive concise, keyword-rich descriptions in multiple languages.

## Features
- Generate SEO-friendly alt text for images
- Supports multiple languages: English, German, French, Italian, Portuguese, Hindi, Spanish, and Thai
- Works with image uploads or URLs
- Powered by Cloudflare Workers

### Known Limitations

While the AI-powered alt text generator provides useful descriptions, there are some known issues:
- **Quality of Alt Tags**: The generated alt tags are generally good, but in some cases, they may not be perfectly accurate or descriptive, particularly for complex images.
- **Language Support**: Although the model supports multiple languages, the quality of alt tags in languages other than English may be lower, and some languages may produce less accurate results.

### Future Improvements

One potential enhancement to improve the quality of the generated alt tags is to integrate a **second AI model** to validate the alt text before returning it. This secondary model could cross-check the description for accuracy, clarity, and language appropriateness, ensuring better results across all supported languages.


## Getting Started

### Prerequisites
- [Cloudflare Workers](https://workers.cloudflare.com/)
- Node.js and npm installed

### Installation
#### 1. Clone the repository
   ```bash
   git clone https://github.com/Leon338/alt-text-ai
   cd alt-text-ai
   ```
#### 2. Install dependencies
 ```bash
   npm install
   ```
### API Endpoints
- **POST `/agree`**: Initialize and agree to use the AI model.
- **POST `/describe`**: Generate alt text for an image in the specified language.
### Usage
#### 1. Run the `/agree` route
Before you can use the model, you need to run the `/agree` route once to activate the AI model:
```bash
curl -X POST https://your-worker-url/agree
```
#### 2. Generate Alt Text
You can either send a JSON request with an image URL or upload the image directly.

- **Request with Image URL (JSON)**:
   ```bash
   curl -X POST https://your-worker-url/describe?lang=en \
   -H "Content-Type: application/json" \
   -d '{"url": "https://www.gstatic.com/webp/gallery/4.sm.jpg"}'
   ```
- **Direct Image Upload (Binary)**:
   ```bash
   curl -X POST https://your-worker-url/describe?lang=en \
  -H "Content-Type: image/jpeg" \
  -d "@path/to/image.jpg"
   ```
   
