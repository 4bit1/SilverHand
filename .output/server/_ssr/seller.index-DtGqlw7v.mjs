import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { n as cn, t as Button } from "./button-CBm9KU00.mjs";
import { c as useSession } from "./store-DiiHrnzs.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as Eye, T as IndianRupee, g as Package, i as Star, o as Sparkles, r as TrendingUp, y as MessageSquareText } from "../_libs/lucide-react.mjs";
import { r as SectionHeading } from "./Cards-lPQFG7Rq.mjs";
import { c as inr, d as services, l as products } from "./router-C3BqJhOM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/seller.index-DtGqlw7v.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AiAdvisor({ seller, stats, className = "" }) {
	const [state, setState] = (0, import_react.useState)({ status: "idle" });
	async function getSuggestions() {
		setState({ status: "loading" });
		try {
			const res = await fetch("/api/advisor", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					seller,
					stats
				})
			});
			if (!res.ok) {
				setState({
					status: "error",
					message: "Advisor is temporarily unavailable."
				});
				return;
			}
			const data = await res.json();
			if (!Array.isArray(data?.suggestions) || data.suggestions.length === 0) {
				setState({
					status: "error",
					message: "Advisor is temporarily unavailable."
				});
				return;
			}
			setState({
				status: "success",
				suggestions: data.suggestions
			});
		} catch {
			setState({
				status: "error",
				message: "Advisor is temporarily unavailable."
			});
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("surface p-7 lg:p-9", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
						className: "size-3.5",
						"aria-hidden": true
					}), " AI-drafted"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-1.5 font-display text-2xl font-semibold",
					children: "Suggestions for you"
				})] }), state.status !== "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: getSuggestions,
					className: "rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90",
					children: state.status === "success" ? "Refresh suggestions" : "Get suggestions"
				})]
			}),
			state.status === "idle" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted-foreground",
				children: "Get a few ideas based on your craft, your city, and what's happening this season."
			}),
			state.status === "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex items-center gap-2.5 text-sm text-primary",
				role: "status",
				"aria-live": "polite",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-3.5 animate-spin rounded-full border-2 border-primary-soft border-t-primary" }), "Thinking about your shop…"]
			}),
			state.status === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-xl bg-secondary px-4 py-3 text-sm",
				role: "alert",
				children: [
					state.message,
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: getSuggestions,
						className: "font-semibold text-primary underline underline-offset-2",
						children: "Try again"
					})
				]
			}),
			state.status === "success" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-5 flex flex-col gap-3",
				children: state.suggestions.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-3 rounded-xl border border-border bg-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
						className: "mt-1 size-4 shrink-0 text-accent",
						"aria-hidden": true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display font-semibold leading-snug",
						children: s.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 text-sm text-muted-foreground",
						children: s.description
					})] })]
				}, i))
			})
		]
	});
}
var widgets = [
	{
		icon: IndianRupee,
		label: "Total earnings",
		value: inr(184500),
		sub: "+12% vs last month"
	},
	{
		icon: Package,
		label: "Orders received",
		value: "126",
		sub: "8 awaiting dispatch"
	},
	{
		icon: TrendingUp,
		label: "Active listings",
		value: "14",
		sub: "3 drafts pending"
	},
	{
		icon: Eye,
		label: "Profile views",
		value: "3,482",
		sub: "Last 30 days"
	},
	{
		icon: Star,
		label: "Customer rating",
		value: "4.9",
		sub: "From 214 reviews"
	}
];
function SellerDashboard() {
	const session = useSession();
	const firstName = session?.name?.split(" ")[0] ?? "there";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs font-semibold uppercase tracking-[0.2em] text-accent",
					children: ["Good morning, ", firstName]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-4xl lg:text-5xl",
					children: "Your shop today"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "lg",
					variant: "gold",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/seller/products",
						children: "Add a new listing"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: [widgets.map(({ icon: Icon, label, value, sub }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface hover-lift p-7",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: "size-6",
								"aria-hidden": true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 text-sm text-muted-foreground",
							children: label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-3xl font-semibold",
							children: value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-accent",
							children: sub
						})
					]
				}, label)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/seller/ai-advisor",
					className: "surface hover-lift flex flex-col justify-between gap-4 bg-primary-soft p-7",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquareText, {
								className: "size-6",
								"aria-hidden": true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 font-semibold",
							children: "Ask your AI Advisor"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground",
							children: "Get suggestions grounded in your shop's own numbers, or ask a specific question."
						})
					] })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiAdvisor, {
				seller: session?.name ? { name: session.name } : {},
				stats: {
					revenue: 184500,
					orders: 126,
					views: 3482,
					topCategory: "Handmade Food"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "Recent",
				title: "Latest orders",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/seller/orders",
						children: "All orders"
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "surface divide-y divide-border overflow-hidden",
				children: products.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-4 px-6 py-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: p.image,
							alt: "",
							loading: "lazy",
							className: "size-14 rounded-xl object-cover"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate font-semibold",
								children: p.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: [
									"Order #SH-10",
									i + 4,
									" · 2 items"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: inr(p.price)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-accent-soft px-3 py-1 text-sm font-semibold text-accent",
							children: i % 2 ? "Shipped" : "To dispatch"
						})
					]
				}, p.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "Live",
				title: "Your active services"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-5 md:grid-cols-2",
				children: services.slice(0, 2).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface flex gap-4 p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: s.image,
						alt: "",
						loading: "lazy",
						className: "size-20 rounded-2xl object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold leading-snug",
							children: s.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: [
								inr(s.price),
								" ",
								s.unit,
								" · ",
								s.reviews,
								" reviews"
							]
						})]
					})]
				}, s.id))
			})] })
		]
	});
}
//#endregion
export { SellerDashboard as component };
