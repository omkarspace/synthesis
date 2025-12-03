const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;
console.log('API Key present:', !!apiKey);
console.log('API Key (masked):', apiKey ? apiKey.substring(0, 10) + '...' : 'MISSING');

if (!apiKey) {
    console.error('ERROR: GEMINI_API_KEY is not set!');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testAPI() {
    try {
        console.log('\nTesting Gemini API...');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        const result = await model.generateContent('Say hello in 5 words');
        const response = result.response;
        const text = response.text();
        
        console.log('✓ API works!');
        console.log('Response:', text);
    } catch (error) {
        console.error('✗ API Error:', error.message);
        process.exit(1);
    }
}

testAPI();
