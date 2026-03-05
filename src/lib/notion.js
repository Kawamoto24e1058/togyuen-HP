import { Client } from '@notionhq/client';
import { env } from '$env/dynamic/private';

const notion = new Client({
    auth: env.NOTION_API_KEY,
    notionVersion: '2022-06-28'
});

export async function getMenuItems() {
    if (!env.NOTION_DATABASE_ID) {
        console.warn('NOTION_DATABASE_ID is not set.');
        return [];
    }

    try {
        const dbId = env.NOTION_DATABASE_ID.trim().replace(/['"]/g, '').replace(/-/g, '');
        const response = await notion.request({
            path: `databases/${dbId}/query`,
            method: 'post',
            body: {}
        });

        // @ts-ignore
        return response.results.map((/** @type {any} */ page) => {
            // Image URL extraction
            let imageUrl = null;
            for (const key in page.properties) {
                const prop = page.properties[key];
                if (prop?.type === 'files' && prop?.files?.[0]) {
                    const fileObj = prop.files[0];
                    imageUrl = fileObj?.type === 'external'
                        ? fileObj?.external?.url
                        : fileObj?.file?.url;
                    if (imageUrl) break;
                }
            }

            return {
                id: page.id,
                name: page.properties['名前']?.title?.[0]?.plain_text || '名称未設定',
                category: page.properties['カテゴリ']?.select?.name || '未分類',
                price: page.properties['価格']?.number ?? null,
                recommend: page.properties['おすすめ']?.checkbox || false,
                description: page.properties['説明']?.rich_text?.[0]?.plain_text || '',
                imageUrl: imageUrl,
            };
        });
    } catch (error) {
        console.error('Error fetching from Notion (getMenuItems):', error);
        return [];
    }
}

export async function getSiteAssets() {
    if (!env.NOTION_ASSET_DATABASE_ID) {
        console.warn('NOTION_ASSET_DATABASE_ID is not set.');
        return [];
    }

    try {
        const assetDbId = env.NOTION_ASSET_DATABASE_ID.trim().replace(/['"]/g, '').replace(/-/g, '');
        const response = await notion.request({
            path: `databases/${assetDbId}/query`,
            method: 'post',
            body: {}
        });

        // @ts-ignore
        return response.results.map((/** @type {any} */ page) => {
            const properties = page.properties;

            let imageUrl = null;
            for (const key in properties) {
                const prop = properties[key];
                if (prop?.type === 'files' && prop?.files?.[0]) {
                    const fileObj = prop.files[0];
                    imageUrl = fileObj?.type === 'external'
                        ? fileObj?.external?.url
                        : fileObj?.file?.url;
                    if (imageUrl) break;
                }
            }

            /** 
             * @param {any} prop
             * @param {any} defaultVal 
             */
            const extractText = (prop, defaultVal = '') => {
                if (!prop) return defaultVal;
                if (prop.type === 'title') return prop.title?.[0]?.plain_text ?? defaultVal;
                if (prop.type === 'rich_text') return prop.rich_text?.[0]?.plain_text ?? defaultVal;
                return defaultVal;
            };

            return {
                id: page.id,
                key: extractText(properties['Key']) || extractText(properties['キー']) || 'unknown',
                text: extractText(properties['Text']) || extractText(properties['テキスト']) || '',
                imageUrl: imageUrl,
            };
        });
    } catch (error) {
        console.error('Error fetching assets from Notion (getSiteAssets):', error);
        return [];
    }
}

export async function getNewsItems() {
    if (!env.NOTION_NEWS_DATABASE_ID) {
        console.warn('NOTION_NEWS_DATABASE_ID is not set.');
        return [];
    }

    try {
        const dbId = env.NOTION_NEWS_DATABASE_ID.trim().replace(/['"]/g, '').replace(/-/g, '');
        const response = await notion.request({
            path: `databases/${dbId}/query`,
            method: 'post',
            body: {
                sorts: [
                    {
                        property: '掲載開始',
                        direction: 'descending'
                    }
                ]
            }
        });

        // @ts-ignore
        return response.results.map(page => ({
            id: page.id,
            title: page.properties['名前']?.title?.[0]?.plain_text || 'タイトルなし',
            date: page.properties['掲載開始']?.date?.start || '日付なし'
        }));
    } catch (error) {
        console.error('Error fetching news from Notion (getNewsItems):', error);
        return [];
    }
}
