import { Hono } from 'hono';

const app = new Hono<{ Bindings: CloudflareBindings }>();

// This Map contains the supported languages by the AI model.
// Note: Some languages may not generate accurate results.
const languages = new Map([
  ['en', 'English'],
  ['de', 'German'],
  ['fr', 'French'],
  ['it', 'Italian'],
  ['pt', 'Portuguese'],
  ['hi', 'Hindi'],
  ['es', 'Spanish'],
  ['th', 'Thai'],
]);

/**
 * POST /describe
 *
 * This API route generates an SEO-optimized alt text for a given image. The image can be provided
 * either via a URL in a JSON body or as binary data (JPEG, PNG). The alt text is concise and optimized
 * for accessibility and SEO. The user can specify the language of the alt text via a query parameter,
 * with English as the default.
 *
 * @queryParam {string} [lang="en"] - The target language for the alt text. Supported languages: en (English),
 * de (German), fr (French), it (Italian), pt (Portuguese), hi (Hindi), es (Spanish), th (Thai).
 *
 * @requestBody {application/json} [url]
 * @requestBody {application/octet-stream} [binary] - Binary image data (JPEG, PNG) sent directly.
 */
app.post('/describe', async (c) => {
  const contentType = c.req.header('Content-Type') || '';
  const lang = c.req.query('lang') || 'en';

  let imgBuffer: ArrayBuffer;
  if (contentType.includes('application/json')) {
    const body = await c.req.json();
    if (!body.url) {
      return c.text('Invalid request body');
    }
    const img = await fetch(body.url);
    imgBuffer = await img.arrayBuffer();
  } else if (
    contentType.includes('application/octet-stream') ||
    contentType.includes('image/jpeg') ||
    contentType.includes('image/png')
  ) {
    imgBuffer = await c.req.arrayBuffer();
  } else {
    return c.text('Invalid content type');
  }

  if (!imgBuffer) {
    return c.text('Invalid image');
  }

  const messages = [
    {
      role: 'system',
      content:
        'You are a friendly assistant who specializes in generating SEO-optimized content.',
    },
    {
      role: 'user',
      content: `
        Please generate a concise, SEO-optimized alt text for this image, and output only the alt text itself with no additional commentary. 
        The alt tag should describe the content of the image clearly for accessibility, include relevant keywords, and be under 125 characters.
        Provide the alt text in the following language: ${languages.get(
          lang.toLowerCase()
        )}.
      `,
    },
  ];

  const aiResponse = await c.env.AI.run(
    // @ts-ignore - We know that the AI binding exists / BETA
    '@cf/meta/llama-3.2-11b-vision-instruct',
    {
      messages,
      image: Array.from(new Uint8Array(imgBuffer)),
    }
  );

  // @ts-ignore - We know that the response property exists / BETA
  let response: string = aiResponse.response || '';
  response = response.trim();

  return c.json({ result: response });
});

export default app;
