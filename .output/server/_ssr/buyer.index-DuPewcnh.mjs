import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { t as Button } from "./button-CBm9KU00.mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as MapPin, o as Sparkles, u as Search } from "../_libs/lucide-react.mjs";
import { t as Stars } from "./Stars-BT1V0SEQ.mjs";
import { a as StitchDivider, i as ServiceCard, n as ProductCard, r as SectionHeading } from "./Cards-lPQFG7Rq.mjs";
import { d as services, l as products, o as categories } from "./router-C3BqJhOM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/buyer.index-DuPewcnh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BuyerHome() {
	const navigate = useNavigate();
	const [query, setQuery] = (0, import_react.useState)("");
	function submitSearch(e) {
		e.preventDefault();
		navigate({
			to: "/buyer/services",
			search: query.trim() ? { q: query.trim() } : {}
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "surface rise-in px-6 py-12 text-center lg:px-16 lg:py-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-[0.22em] text-accent",
						children: "Curated by people with decades of practice"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mx-auto mt-4 max-w-3xl text-4xl leading-tight sm:text-5xl lg:text-6xl",
						children: "What would you like to find today?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: submitSearch,
						className: "mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "q",
								className: "sr-only",
								children: "Search services and products"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
									className: "pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground",
									"aria-hidden": true
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "q",
									value: query,
									onChange: (e) => setQuery(e.target.value),
									placeholder: "Try “home-cooked meals near me”",
									className: "h-15 w-full rounded-full border border-border bg-card pl-13 pr-5 text-base shadow-soft outline-none placeholder:text-muted-foreground"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								size: "xl",
								variant: "gold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {}), " AI Search"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-muted-foreground",
						children: "AI understands plain language — describe the outcome you want, not the keyword."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "Trending",
				title: "Browse by category"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5",
				children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/buyer/services",
					search: { category: c.name },
					className: "surface hover-lift group overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "aspect-[4/3] overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: c.image,
							alt: c.name,
							loading: "lazy",
							className: "size-full object-cover transition-transform duration-700 group-hover:scale-105"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display font-semibold leading-snug",
							children: c.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [c.count, " listings"]
						})]
					})]
				}, c.name))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StitchDivider, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "Featured",
				title: "Services worth booking",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/buyer/services",
						children: "View all services"
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3",
				children: services.slice(0, 3).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceCard, { service: s }, s.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "Handmade, not mass-produced",
				title: "Made slowly, by hand",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/buyer/products",
						children: "View all products"
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
				children: products.slice(0, 8).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "Recommended for you",
				title: "Sellers you may love"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-6 md:grid-cols-3",
				children: services.slice(0, 3).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface flex items-center gap-4 p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: s.image,
						alt: s.seller,
						loading: "lazy",
						className: "size-16 shrink-0 rounded-full object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate font-display font-semibold",
								children: s.seller
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: s.sellerAge
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, {
								rating: s.rating,
								reviews: s.reviews,
								className: "mt-1"
							})
						]
					})]
				}, s.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "surface flex flex-col items-start gap-6 bg-primary-soft p-8 lg:flex-row lg:items-center lg:p-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-14 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
							className: "size-7",
							"aria-hidden": true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-3xl",
						children: "Nearby opportunities"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-2xl text-muted-foreground",
						children: "Eleven sellers within 3 km are open for bookings this week — including two tiffin kitchens and a retired chartered accountant offering tax consultations."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "lg",
						className: "lg:ml-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/buyer/services",
							children: "See what's close by"
						})
					})
				]
			})
		]
	});
}
//#endregion
export { BuyerHome as component };
