import path from 'path';
import fs from 'fs';

async function testAllModels() {
  const envContent = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf8');
  const apiKeyMatch = envContent.match(/GEMINI_API_KEY=(.*)/);
  const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : null;

  if (!apiKey) {
    console.error('GEMINI_API_KEY not found');
    return;
  }

  const models = [
    'gemini-1.0-pro',
    'gemini-1.0-pro-latest',
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro',
    'gemini-1.5-pro-latest',
    'gemini-pro',
    'gemini-2.0-flash',
    'gemini-2.0-flash-exp',
    'gemini-2.5-flash'
  ];

  const payload = {
    contents: [{ parts: [{ text: 'Hi' }] }]
  };

  for (const model of models) {
    console.log(`\nTesting ${model} (v1beta)...`);
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        console.log(`✅ SUCCESS (${model})`);
      } else {
        console.log(`❌ FAILED (${model}):`, data.error?.message || data.error?.code || res.status);
      }
    } catch (e: any) {
      console.log(`❌ ERROR (${model}):`, e.message);
    }
  }
}

testAllModels();
