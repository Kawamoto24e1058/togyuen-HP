import { Client } from '@notionhq/client';
import fs from 'fs';

// Read .env file manually
const envFile = fs.readFileSync('.env', 'utf-8');
const apiKeyMatch = envFile.match(/NOTION_API_KEY\s*=\s*(.+)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : '';

if (!apiKey) {
    console.error("NOTION_API_KEY could not be found in .env");
    process.exit(1);
}

const notion = new Client({ auth: apiKey });

async function searchDatabases() {
    try {
        const response = await notion.search({});
        let output = "--- Found Objects ---\n";
        for (const obj of response.results) {
            const title = obj.title && obj.title.length > 0 ? obj.title[0].plain_text : 'Untitled';
            const url = obj.url || 'No URL';
            output += `Name:   ${title}\nID:     ${obj.id}\nObject: ${obj.object}\nURL:    ${url}\n-----------------------\n`;
        }
        fs.writeFileSync('dbs.txt', output);
        console.log("Wrote dbs to dbs.txt");
    } catch (error) {
        console.error("Error searching databases:", error.message);
    }
}

searchDatabases();
