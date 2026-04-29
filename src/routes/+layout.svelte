<script lang="ts">
	import "../app.css";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";

	let { children } = $props();
	let isMobileMenuOpen = $state(false);
	let showSplash = $state(false);

	const toggleMobileMenu = () => {
		isMobileMenuOpen = !isMobileMenuOpen;
	};

	const scrollToTop = (e: Event) => {
		e.preventDefault();
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	onMount(() => {
		// Service Worker 登録 (PWA)
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.register('/sw.js').catch(() => {});
		}

		// Splash screen: show once per session
		const hasVisited = sessionStorage.getItem("visited_togyuen");
		if (hasVisited) {
			showSplash = false;
		} else {
			sessionStorage.setItem("visited_togyuen", "true");
			showSplash = true;
			setTimeout(() => {
				showSplash = false;
			}, 2000);
		}

		// Intersection observer for fade-up animations
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("visible");
					}
				});
			},
			{ threshold: 0.1 },
		);

		document
			.querySelectorAll(".fade-up")
			.forEach((el) => observer.observe(el));

		// Utility to re-observe dynamically added elements in Svelte
		const mutationObserver = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				mutation.addedNodes.forEach((node) => {
					if (
						node.nodeType === 1 &&
						(node as Element).classList.contains("fade-up")
					) {
						observer.observe(node as Element);
					}
				});
			});
		});

		mutationObserver.observe(document.body, {
			childList: true,
			subtree: true,
		});

		return () => {
			observer.disconnect();
			mutationObserver.disconnect();
		};
	});
</script>

<svelte:head>
	<title>ホルモン焼肉 桃牛苑 | 和泉市（和泉中央）の黒毛和牛・ホルモン焼肉</title>
	<meta name="description" content="大阪府和泉市（和泉中央）のホルモン焼肉「桃牛苑」。厳選された黒毛和牛・新鮮ホルモンを堀りごたつ個室でご堪能。平日限定 団体様特別セット4,980円〜。ご予約はお電話0725-53-0083まで。">
	<meta name="keywords" content="桃牛苑,ホルモン焼肉,和泉市,和泉中央,黒毛和牛,焼肉,ホルモン,大阪,唐国町,団体,宴会,個室,堀りごたつ">

	<!-- OGP -->
	<meta property="og:title" content="ホルモン焼肉 桃牛苑 | 和泉市（和泉中央）の黒毛和牛・ホルモン焼肉">
	<meta property="og:description" content="厳選された黒毛和牛と新鮮ホルモンを、堀りごたつの個室でご堪能。平日限定 団体様特別セット4,980円〜。大阪府和泉市（和泉中央）。ご予約 0725-53-0083。">
	<meta property="og:type" content="restaurant">
	<meta property="og:url" content="https://togyuen-hp.vercel.app/">
	<meta property="og:image" content="https://togyuen-hp.vercel.app/special-set.jpg">
	<meta property="og:site_name" content="ホルモン焼肉 桃牛苑">
	<meta property="og:locale" content="ja_JP">

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image">
	<meta name="twitter:title" content="ホルモン焼肉 桃牛苑 | 和泉市（和泉中央）">
	<meta name="twitter:description" content="厳選された黒毛和牛と新鮮ホルモン。平日限定 団体様特別セット4,980円〜。大阪府和泉市。">
	<meta name="twitter:image" content="https://togyuen-hp.vercel.app/special-set.jpg">

	<!-- 構造化データ (JSON-LD) -->
	{@html `<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "Restaurant",
		"name": "ホルモン焼肉 桃牛苑",
		"alternateName": "桃牛苑",
		"description": "厳選された黒毛和牛と新鮮ホルモンを堀りごたつの個室でご堪能いただける、大阪府和泉市のホルモン焼肉店。",
		"url": "https://togyuen-hp.vercel.app/",
		"image": "https://togyuen-hp.vercel.app/special-set.jpg",
		"telephone": "0725-53-0083",
		"servesCuisine": ["焼肉", "ホルモン", "黒毛和牛"],
		"priceRange": "¥¥",
		"address": {
			"@type": "PostalAddress",
			"streetAddress": "唐国町2丁目5-11",
			"addressLocality": "和泉市",
			"addressRegion": "大阪府",
			"postalCode": "594-1151",
			"addressCountry": "JP"
		},
		"geo": {
			"@type": "GeoCoordinates",
			"latitude": 34.4869,
			"longitude": 135.4169
		},
		"openingHoursSpecification": [
			{
				"@type": "OpeningHoursSpecification",
				"dayOfWeek": ["Monday", "Tuesday", "Thursday", "Friday"],
				"opens": "17:00",
				"closes": "22:30"
			},
			{
				"@type": "OpeningHoursSpecification",
				"dayOfWeek": ["Saturday", "Sunday"],
				"opens": "15:00",
				"closes": "22:30"
			}
		],
		"hasMap": "https://maps.google.co.jp/maps?q=ホルモン焼肉桃牛苑+和泉市唐国町2丁目5-11",
		"sameAs": ["https://www.instagram.com/togyuengram/"]
	}
	<\/script>`}
</svelte:head>

{#if showSplash}
	<div
		out:fade={{ duration: 1000 }}
		class="fixed inset-0 z-[100] bg-[#2C2A29] flex flex-col items-center justify-center gap-8"
	>
		<h1
			class="text-white font-serif text-4xl md:text-5xl tracking-[0.5em]"
			style="writing-mode: vertical-rl;"
		>
			桃牛苑
		</h1>
		<p
			class="text-[#C5A059]/60 text-[10px] font-sans tracking-[0.5em] uppercase"
		>
			Hormonyakiniku Togyuen
		</p>
	</div>
{/if}

<!-- Header -->
<header
	class="fixed top-0 left-0 w-full z-50 bg-base/90 backdrop-blur-md border-b border-main/5 transition-colors duration-300"
>
	<div
		class="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between"
	>
		<!-- Logo -->
		<a
			href="/"
			class="text-2xl md:text-3xl font-serif text-main tracking-[0.2em] font-medium hover:opacity-80 transition-opacity"
		>
			桃牛苑
		</a>

		<!-- PC Nav & Button -->
		<div class="hidden md:flex items-center gap-8">
			<nav
				class="flex items-center gap-8 text-sm md:text-base font-serif tracking-[0.1em] text-main/80"
			>
				<a
					href="/"
					class="hover:text-gold transition-colors duration-300 pb-1 border-b border-transparent hover:border-gold"
					>ホーム</a
				>
				<a
					href="/#01 %E7%84%BC%E8%82%89"
					class="hover:text-gold transition-colors duration-300 pb-1 border-b border-transparent hover:border-gold"
					>お品書き</a
				>
				<a
					href="/#access"
					class="hover:text-gold transition-colors duration-300 pb-1 border-b border-transparent hover:border-gold"
					>アクセス</a
				>
			</nav>
			<a
				href="tel:0725-53-0083"
				class="bg-gold text-base px-6 py-3 text-sm font-serif tracking-[0.1em] hover:bg-gold/80 transition-colors duration-300 shadow-sm border border-gold/50 flex items-center gap-2"
			>
				<svg
					class="w-4 h-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
					/></svg
				>
				<span class="tracking-[0.2em]">お電話のご予約</span>
			</a>
			<!-- MAP Link Button (Icon + Text) -->
			<a
				href="https://www.google.com/maps/search/?api=1&query=桃牛苑+大阪府和泉市唐国町2-5-11"
				target="_blank"
				rel="noopener noreferrer"
				class="flex flex-col items-center justify-center gap-1 text-main/70 hover:text-gold transition-colors duration-300"
				title="MAPアプリで開く"
			>
				<svg
					class="w-5 h-5 pointer-events-none"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
					/><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
					/></svg
				>
				<span
					class="text-[8px] font-sans tracking-widest uppercase pointer-events-none"
					>Map</span
				>
			</a>
			<!-- Instagram Link -->
			<a
				href="https://www.instagram.com/togyuengram/"
				target="_blank"
				rel="noopener noreferrer"
				class="flex flex-col items-center justify-center gap-1 text-main/70 hover:text-gold transition-colors duration-300"
				title="Instagram @togyuengram"
			>
				<svg
					class="w-5 h-5"
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
				<span
					class="text-[8px] font-sans tracking-widest uppercase pointer-events-none"
					>Instagram</span
				>
			</a>
		</div>

		<!-- Mobile Menu Button -->
		<div class="md:hidden flex items-center gap-4">
			<a
				href="tel:0725-53-0083"
				class="bg-gold text-base px-4 py-2 text-xs font-serif tracking-[0.2em] shadow-sm flex items-center gap-1"
			>
				<svg
					class="w-3 h-3"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
					/></svg
				>
				予約
			</a>
			<button
				class="text-main focus:outline-none p-1"
				onclick={toggleMobileMenu}
				aria-label="Toggle Menu"
			>
				<svg
					class="w-7 h-7"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					{#if isMobileMenuOpen}
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M6 18L18 6M6 6l12 12"
						/>
					{:else}
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					{/if}
				</svg>
			</button>
		</div>
	</div>

	<!-- Mobile Nav Dropdown -->
	{#if isMobileMenuOpen}
		<div
			class="md:hidden absolute top-20 left-0 w-full bg-base/95 backdrop-blur-lg border-b border-main/10 shadow-xl py-6 px-6 flex flex-col gap-6 fade-up visible"
		>
			<a
				href="/"
				class="text-lg font-serif text-main tracking-widest border-b border-main/10 pb-4 pl-2"
				onclick={toggleMobileMenu}>ホーム</a
			>
			<a
				href="/#01 %E7%84%BC%E8%82%89"
				class="text-lg font-serif text-main tracking-widest border-b border-main/10 pb-4 pl-2"
				onclick={toggleMobileMenu}>お品書き</a
			>
			<a
				href="/#access"
				class="text-lg font-serif text-main tracking-widest border-b border-main/10 pb-4 pl-2"
				onclick={toggleMobileMenu}>アクセス</a
			>
			<div class="flex gap-4 mt-2">
				<a
					href="tel:0725-53-0083"
					class="bg-gold text-base flex justify-center items-center gap-2 py-4 font-serif tracking-widest flex-1 shadow-md border border-gold/50"
					onclick={toggleMobileMenu}
				>
					<svg
						class="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
						/></svg
					>
					お電話のご予約
				</a>
				<a
					href="https://www.google.com/maps/search/?api=1&query=桃牛苑+大阪府和泉市唐国町2-5-11"
					target="_blank"
					rel="noopener noreferrer"
					class="bg-main text-white flex justify-center items-center py-4 w-20 shadow-md border border-main/80"
					onclick={toggleMobileMenu}
				>
					<svg
						class="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
						/><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
						/></svg
					>
				</a>
			</div>
		</div>
	{/if}
</header>

<div class="flex flex-col min-h-screen">
	<!-- Main Content -->
	<main class="w-full flex-grow pt-20 flex flex-col">
		{@render children()}
	</main>

	<!-- Footer -->
	<footer class="bg-[#2C2A29] w-full py-16 relative mt-auto">
		<!-- Page Top Button -->
		<button
			class="absolute -top-7 right-6 md:right-12 w-14 h-14 bg-[#C5A059] flex items-center justify-center text-white hover:bg-white hover:text-[#2C2A29] transition-colors duration-300 shadow-xl"
			onclick={scrollToTop}
			aria-label="Scroll to top"
		>
			<svg
				class="w-6 h-6"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="1.5"
					d="M5 15l7-7 7 7"
				/></svg
			>
		</button>

		<div class="flex flex-col items-center gap-6 px-8">
			<!-- Logo -->
			<!-- Instagram -->
			<a
				href="https://www.instagram.com/togyuengram/"
				target="_blank"
				rel="noopener noreferrer"
				class="flex items-center gap-3 hover:opacity-70 transition-opacity duration-300"
			>
				<svg
					class="w-6 h-6 text-[#C5A059]"
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
				<p
					class="text-3xl md:text-4xl font-serif text-[#C5A059] tracking-[0.35em] font-medium"
				>
					桃牛苑
				</p>
			</a>
			<p
				class="text-[9px] md:text-[10px] font-sans text-white/30 tracking-[0.5em] uppercase"
			>
				Hormonyakiniku Togyuen
			</p>

			<!-- Divider -->
			<div class="w-8 h-px bg-[#C5A059]/40 mt-2"></div>

			<!-- Copyright -->
			<p
				class="text-[10px] font-sans tracking-[0.3em] text-white/25 uppercase mt-2"
			>
				&copy; 2026 Togyuen. All rights reserved.
			</p>
		</div>
	</footer>

	<!-- Mobile Phone FAB (スマホのみ表示) -->
	<a
		href="tel:0725-53-0083"
		class="fixed bottom-6 right-6 z-50 flex md:hidden items-center justify-center w-14 h-14 bg-[#B49257] text-white rounded-full shadow-lg opacity-90 hover:opacity-100 transition-opacity"
		aria-label="お電話でのご予約"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
			/>
		</svg>
	</a>
</div>
