
import path from 'path';
import fs from 'fs';

async function listModels() {
  const envContent = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf8');
  const apiKeyMatch = envContent.match(/GEMINI_API_KEY=(.*)/);
  const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : null;

  if (!apiKey) {
    console.error('GEMINI_API_KEY not found');
    return;
  }

  const versions = ['v1', 'v1beta'];
  
  for (const v of versions) {
    console.log(`\n--- Checking API Version: ${v} ---`);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/${v}/models?key=${apiKey}`);
      const data = await response.json();
      
      if (data.models) {
        console.log(`Found ${data.models.length} models:`);
        data.models.forEach((m: any) => {
          console.log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`);
        });
      } else {
        console.log(`No models found or error: ${JSON.stringify(data)}`);
      }
    } catch (error: any) {
      console.error(`Error checking ${v}:`, error.message);
    }
  }
}

listModels();
