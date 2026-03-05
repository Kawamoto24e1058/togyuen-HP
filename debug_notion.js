
import { Client } from '@notionhq/client';
import fs from 'fs';

// Read .env file manually
const envFile = fs.readFileSync('.env', 'utf-8');
const apiKeyMatch = envFile.match(/NOTION_API_KEY\s*=\s*(.+)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : '';

const notion = new Client({ auth: apiKey });

console.log('--- Notion Client Inspection ---');
console.log('notion.databases type:', typeof notion.databases);
if (notion.databases) {
    console.log('notion.databases keys:', Object.keys(notion.databases));
    console.log('notion.databases.query type:', typeof notion.databases.query);
}
console.log('Notion Client keys:', Object.keys(notion));
