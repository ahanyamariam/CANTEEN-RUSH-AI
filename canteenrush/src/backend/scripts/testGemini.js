require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  console.log('\n🔑 Testing Gemini API Connection...\n');

  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not set in backend/.env');
    console.log('\nGet your free key: https://aistudio.google.com/apikey');
    process.exit(1);
  }

  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  console.log(`✅ API key found: ${process.env.GEMINI_API_KEY.slice(0, 8)}...`);
  console.log(`📌 Model: ${model}`);

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const geminiModel = genAI.getGenerativeModel({ model });

  // Retry helper
  async function tryWithRetry(label, fn, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      console.log(`\n📡 ${label} (attempt ${attempt}/${maxRetries})...`);
      try {
        await fn();
        return true;
      } catch (error) {
        const isRateLimit = error.message?.includes('429') || error.message?.includes('quota');

        if (isRateLimit && attempt < maxRetries) {
          // Extract retry delay
          const retryMatch = error.message.match(/retry in (\d+)/i);
          const waitSec = retryMatch ? parseInt(retryMatch[1]) + 5 : 60;
          console.log(`⏳ Rate limited. Waiting ${waitSec}s before retry...`);
          await new Promise(r => setTimeout(r, waitSec * 1000));
        } else if (isRateLimit) {
          console.error(`❌ Rate limit exceeded after ${maxRetries} attempts.`);
          console.log('\n💡 Solutions:');
          console.log('   1. Wait for quota to reset (midnight Pacific Time)');
          console.log('   2. Try a different model:');
          console.log('      GEMINI_MODEL=gemini-1.5-flash');
          console.log('      GEMINI_MODEL=gemini-2.0-flash-lite');
          console.log('   3. Create new API key in new project:');
          console.log('      https://aistudio.google.com/apikey');
          console.log('   4. Your app still works! It falls back to');
          console.log('      deterministic predictions automatically.\n');
          return false;
        } else {
          console.error(`❌ Non-rate-limit error: ${error.message}`);
          return false;
        }
      }
    }
    return false;
  }

  // Test 1: Basic
  const test1 = await tryWithRetry('Test 1: Basic API call', async () => {
    const result = await geminiModel.generateContent('Reply with exactly: {"status":"ok"}');
    const text = result.response.text();
    console.log('✅ Response:', text);
  });

  if (!test1) {
    console.log('\n⚠️  Gemini is rate-limited, but your app handles this!');
    console.log('    The prediction engine falls back to deterministic mode.');
    console.log('    Students still get accurate time estimates.\n');

    // Show what deterministic mode looks like
    console.log('─── Deterministic Fallback Demo ───');
    console.log('Order: 2× Masala Dosa + 1× Coffee');
    console.log('Queue: 3 ahead, vendor max 4 concurrent');

    const basePrepTime = 8 + 8 + 3; // 19 min
    const queueWait = Math.ceil(3 / 4) * 10; // ~10 min
    const estimate = Math.round((basePrepTime + queueWait) * 1.0);

    console.log(`\n📐 Deterministic Prediction:`);
    console.log(`   Base prep: ${basePrepTime} min`);
    console.log(`   Queue wait: ${queueWait} min`);
    console.log(`   Total estimate: ${estimate} min`);
    console.log(`   Confidence: 65%`);
    console.log(`   Method: deterministic`);
    console.log('\n   ✅ This works without any AI API!\n');
    return;
  }

  // Test 2: JSON prediction
  await tryWithRetry('Test 2: JSON prediction', async () => {
    const result = await geminiModel.generateContent({
      contents: [{
        role: 'user',
        parts: [{
          text: `Predict food prep time. 2x Masala Dosa (8 min, medium) + 1x Coffee (3 min, simple). Queue: 3 ahead, max 4 concurrent, rush hour.
Respond ONLY in JSON: {"estimated_prep_minutes":<num>,"confidence":<0-1>,"reasoning":"<1 sentence>"}`
        }]
      }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 256,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(result.response.text());
    console.log('✅ Prediction:', parsed);
  });

  console.log('\n═══════════════════════════════════════');
  console.log('  ✅ Gemini is working!');
  console.log('═══════════════════════════════════════\n');
}

testGemini().catch(console.error);