import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const outputDir = path.join(process.cwd(), 'public', 'images');

async function generateTestimonialImages() {
  console.log('Generating testimonial images...');

  const testimonials = [
    {
      prompt: 'Professional Indonesian female business owner portrait, batik clothing, confident smile, modern office background, professional lighting, high quality photography',
      size: '768x1344',
      filename: 'testimonial-1.png'
    },
    {
      prompt: 'Professional Indonesian male business owner portrait, business casual attire, friendly expression, office environment, professional lighting, high quality photography',
      size: '768x1344',
      filename: 'testimonial-2.png'
    },
    {
      prompt: 'Professional Indonesian female entrepreneur portrait, traditional yet modern clothing, warm smile, business casual, soft lighting, high quality photograph',
      size: '768x1344',
      filename: 'testimonial-3.png'
    }
  ];

  const zai = await ZAI.create();

  for (const testimonial of testimonials) {
    const outputPath = path.join(outputDir, testimonial.filename);

    if (fs.existsSync(outputPath)) {
      console.log(`✓ ${testimonial.filename} already exists`);
      continue;
    }

    try {
      console.log(`Generating ${testimonial.filename}...`);
      const response = await zai.images.generations.create({
        prompt: testimonial.prompt,
        size: testimonial.size
      });

      const imageBase64 = response.data[0].base64;
      const buffer = Buffer.from(imageBase64, 'base64');
      fs.writeFileSync(outputPath, buffer);

      console.log(`✓ Generated ${testimonial.filename}`);
    } catch (error) {
      console.error(`✗ Failed to generate ${testimonial.filename}:`, error.message);
    }
  }

  console.log('\n✅ Testimonial images generation completed!');
}

generateTestimonialImages().catch(console.error);
