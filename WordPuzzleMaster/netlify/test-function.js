// This script tests the Netlify function locally
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

async function testFunction() {
  try {
    // Dynamically import the handler
    const { handler } = await import('./functions/api.js');
    
    // Test the health endpoint
    const healthEvent = {
      path: '/health',
      httpMethod: 'GET',
      headers: {
        'content-type': 'application/json'
      },
      body: null,
      isBase64Encoded: false
    };
    
    // Test the users endpoint
    const usersEvent = {
      path: '/users/1',
      httpMethod: 'GET',
      headers: {
        'content-type': 'application/json'
      },
      body: null,
      isBase64Encoded: false
    };
    
    const context = {
      callbackWaitsForEmptyEventLoop: true
    };
    
    console.log('Testing health endpoint...');
    const healthResponse = await handler(healthEvent, context);
    console.log('Health endpoint status code:', healthResponse.statusCode);
    console.log('Health endpoint body:', healthResponse.body);
    
    console.log('\nTesting users endpoint...');
    const usersResponse = await handler(usersEvent, context);
    console.log('Users endpoint status code:', usersResponse.statusCode);
    console.log('Users endpoint body:', usersResponse.body);
    
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Error testing function:', error);
  }
}

testFunction();