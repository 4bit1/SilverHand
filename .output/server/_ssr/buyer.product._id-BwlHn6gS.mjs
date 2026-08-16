import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { t as Button } from "./button-CBm9KU00.mjs";
import { r as requireSession, t as addToCart } from "./store-DiiHrnzs.mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Truck, s as ShoppingBag } from "../_libs/lucide-react.mjs";
import { t as Stars } from "./Stars-BT1V0SEQ.mjs";
import { c as inr, r as Route$1, u as reviews } from "./router-C3BqJhOM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/buyer.product._id-BwlHn6gS.js
var import_jsx_runtime = require_jsx_runtime();
function ProductDetail() {
	const { product } = Route$1.useLoaderData();
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "space-y-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/buyer/products",
				className: "text-sm font-medium text-primary hover:underline",
				children: "← Back to products"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-10 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: product.image,
						alt: product.name,
						className: "aspect-square w-full rounded-3xl object-cover shadow-soft"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-4",
						children: [
							0,
							1,
							2
						].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: product.image,
							alt: `${product.name} view ${i + 2}`,
							loading: "lazy",
							className: "aspect-square rounded-2xl object-cover shadow-soft"
						}, i))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase tracking-[0.18em] text-accent",
								children: product.category
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-3 text-4xl leading-tight lg:text-5xl",
								children: product.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-muted-foreground",
								children: ["by ", product.seller]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, {
								rating: product.rating,
								reviews: product.reviews,
								className: "mt-3"
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-3xl font-semibold",
							children: inr(product.price)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg text-muted-foreground",
							children: product.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "inline-flex items-center gap-2 rounded-full bg-primary-soft px-4 py-2 text-sm font-medium text-primary",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, {
									className: "size-4",
									"aria-hidden": true
								}),
								" ",
								product.delivery
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [product.stock, " in stock"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3 sm:flex-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "xl",
								variant: "gold",
								className: "flex-1",
								onClick: () => {
									if (!requireSession(navigate, `/buyer/product/${product.id}`)) return;
									addToCart(product.id);
									toast.success("Added to cart", { description: product.name });
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, {}), " Add to Cart"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "xl",
								variant: "outline",
								className: "flex-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/buyer/messages",
									children: "Contact seller"
								})
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl",
				children: "Reviews"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid gap-4 md:grid-cols-3",
				children: reviews.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: r.author
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-muted-foreground",
								children: r.date
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, {
							rating: r.rating,
							className: "mt-1"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-muted-foreground",
							children: r.text
						})
					]
				}, r.id))
			})] })
		]
	});
}
//#endregion
export { ProductDetail as component };
