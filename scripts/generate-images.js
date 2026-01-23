#!/usr/bin/env node

import http from 'http';

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/generate-image',
  method: 'GET'
};

console.log('🎨 Generating images for UMKM website...');

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('\n✅ Image generation completed!');
      console.log(`📊 Total: ${response.total} images`);
      console.log(`🆕 Generated: ${response.generated} new images`);
      console.log(`✓ Existing: ${response.total - response.generated} images\n`);

      console.log('Generated images:');
      response.results.forEach((result, index) => {
        const icon = result.status === 'generated' ? '✓' : result.status === 'exists' ? '○' : '✗';
        console.log(`  ${icon} ${index + 1}. ${result.filename}`);
        if (result.error) {
          console.log(`     Error: ${result.error}`);
        }
      });

      console.log('\n🎉 All images are ready at /public/images/');
    } catch (error) {
      console.error('Failed to parse response:', error);
      console.error('Response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error generating images:', error.message);
  console.log('Make sure the dev server is running on port 3000');
});

req.end();
