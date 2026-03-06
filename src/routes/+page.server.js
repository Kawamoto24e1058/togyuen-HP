import { getMenuItems, getSiteAssets, getNewsItems } from '$lib/notion';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    // 全てのNotion APIのレスポンスが返ってくるまで確実に待機する
    const [menuItems, newsItems, siteAssets] = await Promise.all([
        getMenuItems(),
        getNewsItems(),
        getSiteAssets()
    ]);

    // おすすめアイテムの抽出（サーバー側で行い、フロントに渡す）
    const recommendedItems = Array.isArray(menuItems)
        ? menuItems.filter(item => item?.recommend).slice(0, 3)
        : [];

    const isError = menuItems.length === 0 && siteAssets.length === 0 && newsItems.length === 0;

    return {
        menuItems,
        newsItems,
        siteAssets,
        recommendedItems,
        isError: !!isError
    };
}
