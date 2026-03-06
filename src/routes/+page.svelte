<script>
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    let { data } = $props();
    let recommendedItems = $derived(data.recommendedItems || []);
    let assets = $derived(data.siteAssets || []);
    let items = $derived(data.menuItems || []);

    // Extract unique categories and sort them (e.g., '01 焼肉', '02 特選'...)
    let categories = $derived(
        [...new Set(items.map((/** @type {any} */ i) => i.category))].sort(
            (a, b) => {
                if (!a) return 1;
                if (!b) return -1;
                return a.localeCompare(b, "ja", { numeric: true });
            },
        ),
    );

    let groupedItems = $derived(
        categories.map((/** @type {any} */ cat) => ({
            name: cat,
            items: items.filter((/** @type {any} */ i) => i.category === cat),
        })),
    );

    // Grouped menu by category for the menu list section
    let groupedMenu = $derived(
        items.reduce(
            (
                /** @type {Record<string, any[]>} */ acc,
                /** @type {any} */ item,
            ) => {
                if (!acc[item.category]) acc[item.category] = [];
                acc[item.category].push(item);
                return acc;
            },
            {},
        ),
    );
    let sortedCategories = $derived(
        Object.keys(groupedMenu).sort((a, b) =>
            a.localeCompare(b, "ja", { numeric: true }),
        ),
    );

    // Tab selection state
    let selectedCategory = $state("");
    $effect(() => {
        if (sortedCategories.length > 0 && !selectedCategory) {
            selectedCategory = sortedCategories[0];
        }
    });

    // Hero slideshow: collect all assets that have an imageUrl
    let heroImages = $derived(
        assets
            .filter((/** @type {any} */ a) => !!a.imageUrl)
            .map((/** @type {any} */ a) => a.imageUrl),
    );

    // Fallback hero image if no assets have images
    let fallbackHero = "/src/lib/assets/hero.png";

    let introText = $derived(
        assets.find((/** @type {any} */ a) => a.key === "intro_text")?.text ||
            "厳選された黒毛和牛の極みを、\n和泉中央で。",
    );
    let newsItems = $derived(data.newsItems || []);

    // Slideshow state
    let currentIndex = $state(0);

    onMount(() => {
        const images = assets
            .filter((/** @type {any} */ a) => !!a.imageUrl)
            .map((/** @type {any} */ a) => a.imageUrl);

        if (images.length <= 1) return;

        const timer = setInterval(() => {
            let nextIndex;
            do {
                nextIndex = Math.floor(Math.random() * images.length);
            } while (nextIndex === currentIndex);
            currentIndex = nextIndex;
        }, 5000);

        return () => clearInterval(timer);
    });

    /** @param {string | null} dateStr */
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return dateStr.replace(/-/g, ".");
    };
</script>

<svelte:head>
    <title>老舗焼肉店 桃牛苑 | トップ</title>
</svelte:head>

<!-- Hero Section: Split Layout (Left: Text / Right: Slideshow) -->
<section class="flex flex-col md:flex-row min-h-[70vh] md:min-h-screen">
    <!-- Left: Text Area -->
    <div
        class="w-full md:w-1/2 bg-[#FAF8F5] flex flex-col justify-center items-center px-6 md:px-12 lg:px-20 py-12 md:py-16 relative"
    >
        <!-- Thin gold accent line (top) -->
        <div
            class="absolute top-8 left-1/2 -translate-x-1/2 w-px h-12 bg-[#C5A059]/50 hidden md:block"
        ></div>

        <!-- Inner content -->
        <div class="flex flex-col md:flex-row items-center gap-10 mt-8">
            <!-- Vertical shop name -->
            <h1
                class="text-5xl lg:text-6xl font-serif text-[#2C2A29] tracking-[0.35em] font-medium leading-none"
                style="writing-mode: vertical-rl;"
            >
                桃牛苑
            </h1>

            <!-- Divider + Catchphrase -->
            <div
                class="flex flex-col gap-6 md:pl-10 md:border-l border-[#2C2A29]/15"
            >
                <!-- English subtitle -->
                <span
                    class="text-[10px] font-sans tracking-[0.4em] text-[#C5A059] uppercase"
                    >Hormonyakiniku Togyuen</span
                >

                <p
                    class="text-base md:text-xl font-serif !text-[#2C2A29] tracking-[0.2em] leading-loose whitespace-pre-wrap"
                >
                    {introText}
                </p>

                <div class="w-10 h-px bg-[#C5A059]/60"></div>

                <!-- Reservation button -->
                <a
                    href="tel:0725-53-0083"
                    class="inline-flex items-center gap-3 border border-[#2C2A29]/30 px-6 py-3 text-xs font-serif text-[#2C2A29] tracking-[0.2em] hover:bg-[#2C2A29] hover:text-[#FAF8F5] transition-colors duration-300 self-start"
                >
                    <svg
                        class="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.5"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                    </svg>
                    お電話でご予約
                </a>
            </div>
        </div>

        <!-- Thin gold accent line (bottom) -->
        <div
            class="absolute bottom-8 left-1/2 -translate-x-1/2 w-px h-12 bg-[#C5A059]/50 hidden md:block"
        ></div>
    </div>

    <!-- Right: Image Slideshow -->
    <div
        class="w-full md:w-1/2 relative overflow-hidden h-64 md:h-auto min-h-[300px] md:min-h-[500px] flex-grow flex-shrink-0 md:self-stretch"
        style="-webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%); mask-image: linear-gradient(to bottom, black 80%, transparent 100%);"
    >
        {#if heroImages.length > 0}
            {#each heroImages as src, index}
                <img
                    {src}
                    alt="Hero Slide"
                    class="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
                    style="opacity: {index === currentIndex ? 1 : 0};"
                />
            {/each}
        {:else}
            <img
                src={fallbackHero}
                alt="Hero Fallback"
                class="absolute inset-0 w-full h-full object-cover"
            />
        {/if}
        <!-- Subtle dark gradient on left edge for depth -->
        <div
            class="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#FAF8F5]/30 to-transparent pointer-events-none"
        ></div>
    </div>
</section>

<!-- Concept Section -->
<section class="mt-16 w-full border-b border-[#E5DFD3] overflow-hidden">
    <div class="grid grid-cols-1 md:grid-cols-2 items-stretch">
        <!-- Left: Vertical Text (Desktop) / Horizontal Text (Mobile) -->
        <div
            class="flex items-center justify-center px-6 md:px-16 py-12 md:py-24 min-h-[400px] md:min-h-[500px] order-2 md:order-1 w-full fade-up"
        >
            <div
                class="flex flex-col md:flex-row-reverse gap-8 md:gap-8 items-center md:items-start text-center md:text-left w-full"
            >
                <!-- Heading column -->
                <div class="flex flex-col items-center gap-4">
                    <span
                        class="text-[9px] font-sans tracking-[0.6em] text-[#C5A059] uppercase [writing-mode:horizontal-tb] md:[writing-mode:vertical-rl]"
                        >Concept</span
                    >
                    <div class="w-12 h-px md:w-px md:h-6 bg-[#C5A059]/60"></div>
                    <h2
                        class="text-xl md:text-2xl font-serif text-[#2C2A29] tracking-[0.3em] md:leading-[2.5] leading-loose [writing-mode:horizontal-tb] md:[writing-mode:vertical-rl]"
                    >
                        黒毛和牛の旨味と、<br class="md:hidden" />寛ぎの空間。
                    </h2>
                </div>

                <!-- Body text column -->
                <div
                    class="flex flex-col md:flex-row gap-4 md:gap-6 text-[#2C2A29]/65 fade-up delay-200 [writing-mode:horizontal-tb] md:[writing-mode:vertical-rl]"
                >
                    <p
                        class="font-serif text-sm md:text-xs leading-[2.2] md:leading-[2.5] tracking-[0.15em]"
                    >
                        当店のお肉はすべて厳選された黒毛和牛を使用し、<br
                            class="md:hidden"
                        />鮮度と旨味に徹底的にこだわってご提供しております。
                    </p>
                    <p
                        class="font-serif text-sm md:text-xs leading-[2.2] md:leading-[2.5] tracking-[0.15em]"
                    >
                        辛いもの好きにはたまらないビビン麵、さっぱりとした韓国冷麺など、<br
                            class="md:hidden"
                        />本場の味が楽しめるサイドメニューも豊富にご用意。
                    </p>
                    <p
                        class="font-serif text-sm md:text-xs leading-[2.2] md:leading-[2.5] tracking-[0.15em]"
                    >
                        掘りごたつ式の座敷で、ご家族やご友人との特別な時間を<br
                            class="md:hidden"
                        />美味しい焼肉とともにお過ごしください。
                    </p>
                </div>
            </div>
        </div>

        <!-- Right: Image -->
        <div
            class="relative overflow-hidden min-h-[300px] md:min-h-[500px] order-1 md:order-2 fade-up delay-100"
            style="-webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 100%); mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 100%);"
        >
            {#if assets.length > 0 && assets[0].imageUrl}
                <img
                    src={assets[0].imageUrl}
                    alt="桃牛苑 店内・料理イメージ"
                    class="w-full h-full min-h-[300px] md:min-h-[500px] object-cover hover:scale-[1.03] transition-transform duration-[2000ms] ease-out"
                />
            {:else}
                <div
                    class="absolute inset-0 bg-[#2C2A29]/8 flex items-center justify-center"
                >
                    <span
                        class="font-serif text-[#2C2A29]/20 tracking-[0.5em] text-sm"
                        style="writing-mode: vertical-rl;">桃牛苑</span
                    >
                </div>
            {/if}
            <div
                class="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#FCFAF8]/50 to-transparent pointer-events-none md:block hidden"
            ></div>
        </div>
    </div>
</section>

<!-- NEWS Section -->
<section
    class="w-full bg-base py-16 md:py-24 relative z-10 border-b border-main/5"
>
    <div class="max-w-5xl mx-auto px-8 lg:px-12 fade-up">
        <div class="flex flex-col md:flex-row gap-12 md:gap-24 items-start">
            <!-- Section Header -->
            <div
                class="w-full md:w-auto flex-shrink-0 flex items-center md:items-start md:flex-col gap-4 md:gap-6"
            >
                <!-- Golden Line -->
                <div class="hidden md:block w-px h-12 bg-gold/50 ml-4"></div>

                <h2
                    class="text-3xl font-serif text-main tracking-[0.2em] relative"
                >
                    お知らせ
                    <span
                        class="absolute -top-6 left-0 text-[9px] font-sans text-gold tracking-[0.4em] uppercase"
                        >News</span
                    >
                </h2>
            </div>

            <!-- List -->
            <div class="flex-grow w-full flex flex-col pt-2 md:pt-0">
                <div
                    class="border-t border-main/10 w-full hidden md:block mb-2"
                ></div>
                {#each newsItems as news}
                    <div
                        class="group flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-10 py-6 border-b border-main/10 hover:bg-main/[0.02] transition-colors duration-300 px-4 -mx-4 sm:mx-0 sm:px-2 cursor-pointer"
                    >
                        <span
                            class="text-[10px] sm:text-xs font-sans tracking-[0.2em] text-gold/80 w-24 flex-shrink-0"
                            >{formatDate(news.date)}</span
                        >
                        <p class="text-[#2C2A29] tracking-widest">
                            {news.title}
                        </p>
                    </div>
                {:else}
                    <div class="py-12 text-center">
                        <p
                            class="text-sm font-serif text-main/40 tracking-widest"
                        >
                            現在お知らせはありません。
                        </p>
                    </div>
                {/each}

                <!-- Notice Link -->
                <div class="mt-8 text-right">
                    <a
                        href="/#access"
                        class="inline-flex items-center gap-2 text-xs font-serif tracking-widest text-main/50 hover:text-gold transition-colors duration-300 group"
                    >
                        <span>過去のお知らせ一覧</span>
                        <span
                            class="w-6 h-[1px] bg-main/30 group-hover:bg-gold transition-colors block"
                        ></span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Today's Special Section -->
<section class="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-16 md:py-32">
    <div class="text-center mb-24 space-y-8 fade-up">
        <h2 class="text-4xl md:text-5xl font-serif tracking-[0.2em] text-sumi">
            本日のおすすめ
        </h2>
        <div class="flex items-center justify-center gap-4">
            <div class="h-[1px] w-12 bg-main/20"></div>
            <div class="w-2 h-2 rounded-full bg-gold/60"></div>
            <div class="h-[1px] w-12 bg-main/20"></div>
        </div>
    </div>

    {#if data.isError}
        <div class="text-center text-main/50 font-serif fade-up py-12">
            データの取得に失敗しました。<br />
            Notionの接続設定（APIキーやデータベースID）をご確認ください。
        </div>
    {:else if recommendedItems.length === 0}
        <div class="text-center text-neutral-500 font-serif fade-up py-12">
            現在、おすすめメニューの登録がありません。
        </div>
    {:else}
        <div class="flex flex-col gap-24">
            {#each recommendedItems as item, i}
                <div
                    class="flex flex-col md:flex-row items-center gap-12 lg:gap-20 fade-up group {i %
                        2 !==
                    0
                        ? 'md:flex-row-reverse'
                        : ''}"
                >
                    <!-- Large Image Container -->
                    <div class="w-full md:w-1/2 relative">
                        <!-- Burgundy accent block behind image -->
                        <div
                            class="absolute inset-0 bg-koubai/5 {i % 2 !== 0
                                ? '-translate-x-6'
                                : 'translate-x-6'} translate-y-6 transition-transform duration-700 group-hover:{i %
                                2 !==
                            0
                                ? '-translate-x-8 -translate-y-2'
                                : 'translate-x-8 -translate-y-2'}"
                        ></div>

                        <div
                            class="w-full aspect-[4/3] relative overflow-hidden shadow-xl z-10"
                        >
                            {#if item.imageUrl}
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    class="w-full h-full object-cover filter brightness-90 group-hover:brightness-110 group-hover:scale-105 transition-all duration-700"
                                />
                            {:else}
                                <div
                                    class="w-full h-full bg-neutral-900 border border-neutral-800 flex items-center justify-center"
                                >
                                    <span
                                        class="text-neutral-600 font-serif tracking-widest text-sm"
                                        >NO IMAGE</span
                                    >
                                </div>
                            {/if}
                        </div>
                    </div>

                    <!-- Details -->
                    <div
                        class="w-full md:w-1/2 flex flex-col justify-center space-y-6"
                    >
                        <span
                            class="inline-block text-xs font-medium tracking-[0.2em] text-koubai border-b border-koubai/30 pb-2 self-start"
                        >
                            {item.category}
                        </span>
                        <h3
                            class="text-3xl lg:text-4xl font-serif text-sumi leading-tight tracking-[0.1em]"
                        >
                            {item.name}
                        </h3>

                        {#if item.description}
                            <p
                                class="text-sumi/60 font-serif leading-loose tracking-widest text-sm md:text-base py-4"
                            >
                                {item.description}
                            </p>
                        {/if}

                        <div class="pt-4 border-t border-main/10">
                            <span
                                class="block text-xs text-main/40 tracking-widest mb-1"
                                >税込</span
                            >
                            <p
                                class="text-[#2C2A29] tracking-widest text-3xl font-serif"
                            >
                                ¥{item.price !== null
                                    ? item.price.toLocaleString()
                                    : "---"}
                            </p>
                        </div>
                    </div>
                </div>
            {/each}
        </div>

        <!-- Full Menu Section -->
        <div class="mt-32 w-full">
            <div class="text-center mb-16 space-y-6 fade-up">
                <h2
                    class="text-4xl md:text-5xl font-serif tracking-[0.2em] text-main"
                >
                    お品書き
                </h2>
                <div class="flex items-center justify-center gap-4">
                    <div class="h-[1px] w-12 bg-main/20"></div>
                    <div class="w-2 h-2 rounded-full bg-gold/60"></div>
                    <div class="h-[1px] w-12 bg-main/20"></div>
                </div>
            </div>
        </div>
    {/if}
</section>

<!-- Full お品書き Section (Tab Nav + Items) -->
<section
    class="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-12 pb-16 text-[#2C2A29]"
>
    <!-- Sticky Tab Nav — outside all item loops -->
    <div
        class="sticky top-20 z-40 bg-[#FCFAF8]/95 backdrop-blur-sm py-3 mb-8 md:mb-12 border-b border-sand"
    >
        <ul
            class="flex overflow-x-auto whitespace-nowrap w-full max-w-[100vw] pb-4 px-4 -mx-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
            {#each sortedCategories as category}
                <li class="snap-start shrink-0">
                    <button
                        onclick={() => (selectedCategory = category)}
                        class="whitespace-nowrap text-xs md:text-sm font-serif tracking-[0.2em] py-2 px-4 border-b-2 transition-all duration-200 {category ===
                        selectedCategory
                            ? 'text-[#2C2A29] border-[#C5A059] font-medium'
                            : 'text-main/40 border-transparent hover:text-main/70 hover:border-main/20'}"
                    >
                        {category}
                    </button>
                </li>
            {/each}
        </ul>
    </div>

    <!-- Selected category items (tab content) -->
    {#key selectedCategory}
        <div
            class="w-full max-w-[100vw] overflow-hidden px-4 md:px-0 mx-auto md:max-w-4xl box-border"
            in:fade={{ duration: 250 }}
        >
            {#if selectedCategory && groupedMenu[selectedCategory]}
                <div class="flex flex-col w-full">
                    <!-- Category Label (horizontal) -->
                    <div class="flex items-center gap-4 mb-8">
                        <div class="w-px h-8 bg-[#C5A059]/60"></div>
                        <h2
                            class="text-lg md:text-xl font-serif tracking-[0.3em]"
                            style="color: #2C2A29;"
                        >
                            {selectedCategory}
                        </h2>
                        <div class="flex-1 h-px bg-[#E5DFD3]"></div>
                    </div>

                    <!-- Menu Items -->
                    <div class="flex flex-col w-full">
                        {#each groupedMenu[selectedCategory] as item}
                            <div
                                class="flex justify-between items-start w-full gap-4 py-3 border-b border-[#E5DFD3]"
                            >
                                <div
                                    class="flex-1 min-w-0 break-words whitespace-normal text-base text-[#2C2A29] leading-snug"
                                >
                                    <h3
                                        class="font-serif tracking-[0.15em] mb-1 group-hover/item:translate-x-1 transition-transform duration-500 block !text-[#2C2A29]"
                                    >
                                        {item.name}
                                    </h3>
                                    {#if item.description}
                                        <p
                                            class="text-xs tracking-[0.1em] !text-[#2C2A29]/50"
                                        >
                                            {item.description}
                                        </p>
                                    {/if}
                                </div>
                                <p
                                    class="flex-shrink-0 whitespace-nowrap text-sm text-[#2C2A29] pt-1 tracking-widest font-serif"
                                >
                                    ¥{item.price !== null
                                        ? item.price.toLocaleString()
                                        : "---"}
                                </p>
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>
    {/key}
</section>

<!-- Access Section -->
<section
    id="access"
    class="w-full bg-base py-16 md:py-32 border-t border-main/5 relative scroll-mt-20"
>
    <div class="max-w-7xl mx-auto px-8 lg:px-12 fade-up">
        <div class="text-center mb-20 space-y-6">
            <h2
                class="text-4xl md:text-5xl font-serif tracking-[0.2em] text-main"
            >
                アクセス
            </h2>
            <div class="flex items-center justify-center gap-4">
                <div class="h-[1px] w-12 bg-main/20"></div>
                <div class="w-2 h-2 rounded-full bg-gold/60"></div>
                <div class="h-[1px] w-12 bg-main/20"></div>
            </div>
            <p
                class="text-[10px] md:text-xs font-sans tracking-[0.4em] text-main/40 uppercase mt-2"
            >
                Location & Access
            </p>
        </div>

        <div
            class="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center md:items-start justify-between"
        >
            <!-- Left: Shop Info -->
            <div
                class="w-full lg:w-1/3 flex flex-col gap-10 lg:pt-12 order-2 lg:order-1"
            >
                <div>
                    <h3
                        class="text-2xl font-serif text-main tracking-[0.2em] mb-2"
                    >
                        ホルモン焼肉 桃牛苑
                    </h3>
                    <p
                        class="text-[10px] font-sans text-main/40 tracking-[0.3em] uppercase mb-8"
                    >
                        Premium Yakiniku Togyuen
                    </p>
                    <p
                        class="font-serif text-sm md:text-base tracking-[0.15em] text-main/80 leading-loose"
                    >
                        〒594-1151<br />
                        大阪府和泉市唐国町2丁目5-11
                    </p>
                </div>

                <div class="space-y-6 border-t border-main/10 pt-8">
                    <div class="flex flex-col gap-2">
                        <span
                            class="text-[10px] font-sans text-gold tracking-[0.2em] uppercase"
                            >Phone</span
                        >
                        <p
                            class="font-serif text-lg tracking-[0.1em] text-main"
                        >
                            0725-53-0083
                        </p>
                    </div>

                    <div class="flex flex-col gap-2">
                        <span
                            class="text-[10px] font-sans text-gold tracking-[0.2em] uppercase"
                            >Hours</span
                        >
                        <p
                            class="font-serif leading-loose tracking-[0.1em] text-sm text-main/80"
                        >
                            平日 17:00～22:30<br />
                            土日祝 15:00～22:30<br />
                            定休日：水曜日
                        </p>
                    </div>

                    <div class="flex flex-col gap-2">
                        <span
                            class="text-[10px] font-sans text-gold tracking-[0.2em] uppercase"
                            >Parking</span
                        >
                        <p
                            class="font-serif leading-loose tracking-[0.1em] text-sm text-main/80"
                        >
                            駐車場あり
                        </p>
                    </div>

                    <div class="flex flex-col gap-2">
                        <span
                            class="text-[10px] font-sans text-gold tracking-[0.2em] uppercase"
                            >Instagram</span
                        >
                        <a
                            href="https://www.instagram.com/togyuengram/"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="flex items-center gap-2 font-serif text-sm tracking-[0.1em] text-main/80 hover:text-gold transition-colors duration-300"
                        >
                            <svg
                                class="w-4 h-4 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.5"
                                viewBox="0 0 24 24"
                            >
                                <rect
                                    x="2"
                                    y="2"
                                    width="20"
                                    height="20"
                                    rx="5"
                                    ry="5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="4"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <circle
                                    cx="17.5"
                                    cy="6.5"
                                    r="0.5"
                                    fill="currentColor"
                                    stroke="none"
                                />
                            </svg>
                            @togyuengram
                        </a>
                    </div>
                </div>
            </div>

            <!-- Right: Map -->
            <div class="w-full lg:w-2/3 order-1 lg:order-2">
                <div class="w-full relative bg-main/5 p-1">
                    <!-- Subtle border decoration -->
                    <div
                        class="absolute -inset-2 border border-main/10 pointer-events-none"
                    ></div>
                    <!-- Map iFrame -->
                    <iframe
                        src="https://maps.google.co.jp/maps?q=ホルモン焼肉桃牛苑+和泉市唐国町2丁目5-11&output=embed&t=m&z=16&hl=ja"
                        title="Shop Location"
                        class="w-full h-80 md:h-96 object-cover grayscale opacity-90 hover:grayscale-0 transition-all duration-500 border-0"
                        allowfullscreen={false}
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                    >
                    </iframe>
                </div>
                <div class="mt-4 text-right">
                    <a
                        href="https://maps.google.co.jp/maps?q=ホルモン焼肉桃牛苑+和泉市唐国町2丁目5-11"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center gap-2 text-xs font-serif tracking-widest text-main/60 hover:text-gold transition-colors duration-300"
                    >
                        <span>Google Mapsで大きな地図を見る</span>
                        <svg
                            class="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            ><path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="1.5"
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            /></svg
                        >
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>
