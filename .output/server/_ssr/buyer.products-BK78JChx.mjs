import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { n as cn } from "./button-CBm9KU00.mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as Search } from "../_libs/lucide-react.mjs";
import { a as StitchDivider, n as ProductCard, r as SectionHeading, t as EmptyState } from "./Cards-lPQFG7Rq.mjs";
import { a as Route$15, l as products, o as categories } from "./router-C3BqJhOM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/buyer.products-BK78JChx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ExploreProducts() {
	const { q, category, sort } = Route$15.useSearch();
	const navigate = useNavigate();
	const [query, setQuery] = (0, import_react.useState)(q ?? "");
	const active = category ?? "All";
	const activeSort = sort ?? "popular";
	const needle = (q ?? "").trim().toLowerCase();
	let list = products.filter((p) => {
		const matchesCategory = active === "All" || p.category === active;
		const matchesQuery = !needle || p.name.toLowerCase().includes(needle) || p.category.toLowerCase().includes(needle) || p.seller.toLowerCase().includes(needle);
		return matchesCategory && matchesQuery;
	});
	if (activeSort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
	if (activeSort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
	if (activeSort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
	function pushSearch(next) {
		const merged = {
			q,
			category,
			sort,
			...next
		};
		navigate({
			to: "/buyer/products",
			search: {
				...merged.q?.trim() ? { q: merged.q.trim() } : {},
				...merged.category && merged.category !== "All" ? { category: merged.category } : {},
				...merged.sort && merged.sort !== "popular" ? { sort: merged.sort } : {}
			}
		});
	}
	function submitSearch(e) {
		e.preventDefault();
		pushSearch({ q: query });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-wrap items-end justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "Explore",
				title: "Handmade products"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 text-sm text-muted-foreground",
				children: ["Sort", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: activeSort,
					onChange: (e) => pushSearch({ sort: e.target.value }),
					className: "rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground outline-none",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "popular",
							children: "Most popular"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "rating",
							children: "Highest rated"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "price-asc",
							children: "Price: low to high"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "price-desc",
							children: "Price: high to low"
						})
					]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submitSearch,
			className: "relative mb-6 max-w-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					htmlFor: "products-q",
					className: "sr-only",
					children: "Search products"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
					className: "pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground",
					"aria-hidden": true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "products-q",
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: "Search products — e.g. pickle, cushion, saree",
					className: "h-13 w-full rounded-full border border-border bg-card pl-13 pr-5 text-base shadow-soft outline-none placeholder:text-muted-foreground"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-6 flex flex-wrap gap-2",
			role: "group",
			"aria-label": "Filter by category",
			children: ["All", ...categories.map((c) => c.name)].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => pushSearch({ category: c }),
				"aria-pressed": active === c,
				className: cn("rounded-full border px-4 py-2 text-sm font-medium transition-colors", active === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary hover:text-primary"),
				children: c
			}, c))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StitchDivider, { className: "mb-6" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-6 text-sm text-muted-foreground",
			children: [
				list.length,
				" ",
				list.length === 1 ? "product" : "products"
			]
		}),
		list.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
			children: list.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			icon: Search,
			title: "No matches yet",
			description: `Nothing found${q ? ` for "${q}"` : ""}${active !== "All" ? ` in ${active}` : ""}. Try a different search or category.`
		})
	] });
}
//#endregion
export { ExploreProducts as component };
