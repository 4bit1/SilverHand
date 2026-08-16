import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { n as cn, t as Button } from "./button-CBm9KU00.mjs";
import { o as toggleFavorite, r as requireSession, s as useMarketState, t as addToCart } from "./store-DiiHrnzs.mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as Heart, S as MapPin, s as ShoppingBag } from "../_libs/lucide-react.mjs";
import { t as Stars } from "./Stars-BT1V0SEQ.mjs";
import { c as inr } from "./router-C3BqJhOM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Cards-lPQFG7Rq.js
var import_jsx_runtime = require_jsx_runtime();
function StitchDivider({ className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "presentation",
		"aria-hidden": "true",
		className: cn("h-[2px] w-full opacity-60", className),
		style: { backgroundImage: "repeating-linear-gradient(90deg, var(--accent) 0 10px, transparent 10px 18px)" }
	});
}
function ServiceCard({ service }) {
	const { favorites } = useMarketState();
	const navigate = useNavigate();
	const fav = favorites.includes(service.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "surface hover-lift group flex flex-col overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/buyer/service/$id",
				params: { id: service.id },
				className: "block aspect-[4/3] overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: service.image,
					alt: service.title,
					loading: "lazy",
					className: "size-full object-cover transition-transform duration-700 group-hover:scale-105"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => {
					if (!requireSession(navigate, `/buyer/service/${service.id}`)) return;
					toggleFavorite(service.id);
				},
				"aria-pressed": fav,
				"aria-label": fav ? "Remove from favorites" : "Save to favorites",
				className: "absolute right-3 top-3 grid size-11 place-items-center rounded-full bg-card/90 shadow-soft backdrop-blur transition-colors hover:bg-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("size-5", fav ? "fill-accent text-accent" : "text-foreground") })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col gap-3 p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-semibold uppercase tracking-[0.14em] text-accent",
					children: service.category
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/buyer/service/$id",
					params: { id: service.id },
					className: "font-display text-lg leading-snug font-semibold hover:text-primary",
					children: service.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						service.seller,
						" · ",
						service.sellerAge
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-x-4 gap-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, {
						rating: service.rating,
						reviews: service.reviews
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1 text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
							className: "size-4",
							"aria-hidden": true
						}), service.location]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-auto flex items-center justify-between gap-3 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-lg font-semibold",
						children: [
							inr(service.price),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-normal text-muted-foreground",
								children: service.unit
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "gold",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/buyer/service/$id",
							params: { id: service.id },
							children: "Book"
						})
					})]
				})
			]
		})]
	});
}
function ProductCard({ product }) {
	const { favorites } = useMarketState();
	const navigate = useNavigate();
	const fav = favorites.includes(product.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "surface hover-lift group flex flex-col overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/buyer/product/$id",
				params: { id: product.id },
				className: "block aspect-[4/5] overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: product.image,
					alt: product.name,
					loading: "lazy",
					className: "size-full object-cover transition-transform duration-700 group-hover:scale-105"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => {
					if (!requireSession(navigate, `/buyer/product/${product.id}`)) return;
					toggleFavorite(product.id);
				},
				"aria-pressed": fav,
				"aria-label": fav ? "Remove from favorites" : "Save to favorites",
				className: "absolute right-3 top-3 grid size-11 place-items-center rounded-full bg-card/90 shadow-soft backdrop-blur transition-colors hover:bg-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("size-5", fav ? "fill-accent text-accent" : "text-foreground") })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col gap-2 p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/buyer/product/$id",
					params: { id: product.id },
					className: "font-display text-lg leading-snug font-semibold hover:text-primary",
					children: product.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: ["by ", product.seller]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, {
					rating: product.rating,
					reviews: product.reviews
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-auto flex items-center justify-between gap-3 pt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-lg font-semibold",
						children: inr(product.price)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => {
							if (!requireSession(navigate, `/buyer/product/${product.id}`)) return;
							addToCart(product.id);
							toast.success("Added to cart", { description: product.name });
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, {}), " Add"]
					})]
				})
			]
		})]
	});
}
function SectionHeading({ eyebrow, title, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-7 flex flex-wrap items-end justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [eyebrow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-semibold uppercase tracking-[0.18em] text-accent",
			children: eyebrow
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-1 text-3xl md:text-4xl",
			children: title
		})] }), action]
	});
}
function EmptyState({ icon: Icon, title, description, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface flex flex-col items-center gap-4 px-6 py-20 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-16 place-items-center rounded-full bg-primary-soft text-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					className: "size-7",
					"aria-hidden": true
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-2xl",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-muted-foreground",
				children: description
			}),
			action
		]
	});
}
//#endregion
export { StitchDivider as a, ServiceCard as i, ProductCard as n, SectionHeading as r, EmptyState as t };
