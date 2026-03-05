import { Client } from '@notionhq/client';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
const apiKeyMatch = envFile.match(/NOTION_API_KEY\s*=\s*(.+)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : '';
const dbMatch = envFile.match(/NOTION_DATABASE_ID\s*=\s*(.+)/);
const dbId = dbMatch ? dbMatch[1].trim() : '';

const notion = new Client({ auth: apiKey });

async function testQuery() {
    try {
        console.log("Querying data_source:", dbId);
        const response = await notion.dataSources.query({
            data_source_id: dbId.replace(/-/g, '')
        });
        console.log(`Success! Found ${response.results.length} items`);
    } catch (e) {
        console.error("Without hyphens Error:", e.message);
    }

    try {
        const response2 = await notion.dataSources.query({
            data_source_id: dbId
        });
        console.log(`Success with Hyphens! Found ${response2.results.length} items`);
    } catch (e) {
        console.error("With hyphens Error:", e.message);
    }
}
testQuery();
