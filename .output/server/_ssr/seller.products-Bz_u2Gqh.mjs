import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { t as Button } from "./button-CBm9KU00.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { E as ImagePlus, o as Sparkles } from "../_libs/lucide-react.mjs";
import { r as SectionHeading } from "./Cards-lPQFG7Rq.mjs";
import { c as inr, l as products, o as categories } from "./router-C3BqJhOM.mjs";
import { n as Label, t as Input } from "./label-DbSbIPfw.mjs";
import { t as Textarea } from "./textarea-BVgMM7AU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/seller.products-Bz_u2Gqh.js
var import_jsx_runtime = require_jsx_runtime();
function SellerProducts() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "Catalogue",
				title: "My products"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
				children: products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface hover-lift overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: p.image,
						alt: p.name,
						loading: "lazy",
						className: "aspect-square w-full object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1 p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold leading-snug",
							children: p.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted-foreground",
							children: [
								inr(p.price),
								" · ",
								p.stock,
								" in stock"
							]
						})]
					})]
				}, p.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "surface p-8 lg:p-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-3xl",
						children: "Add a product"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-muted-foreground",
						children: "Fill what you can — Hansa AI will help with the rest."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: (e) => {
							e.preventDefault();
							toast.success("Product saved as draft");
						},
						className: "mt-8 space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid place-items-center gap-3 rounded-2xl border-2 border-dashed border-border px-6 py-12 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, {
										className: "size-8 text-primary",
										"aria-hidden": true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: "Upload up to 8 photos"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: "Daylight, plain background works best"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "outline",
										children: "Choose images"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-5 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "ptitle",
											children: "Product title"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "ptitle",
											placeholder: "Handwoven cotton throw",
											className: "h-12 rounded-xl"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "pcat",
											children: "Category"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											id: "pcat",
											className: "h-12 w-full rounded-xl border border-input bg-card px-4",
											defaultValue: categories[0]?.name,
											children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c.name }, c.name))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "pprice",
											children: "Price (₹)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "pprice",
											type: "number",
											placeholder: "2400",
											className: "h-12 rounded-xl"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "pstock",
											children: "Stock"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "pstock",
											type: "number",
											placeholder: "6",
											className: "h-12 rounded-xl"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "pdesc",
										children: "Description"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										id: "pdesc",
										rows: 5,
										placeholder: "Tell buyers how it's made…",
										className: "rounded-xl"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										variant: "secondary",
										size: "sm",
										onClick: () => toast("Hansa AI drafted a description for you"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {}), " Generate with AI"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "pdelivery",
									children: "Delivery options"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "pdelivery",
									placeholder: "Ships in 3 days · Free above ₹1,500",
									className: "h-12 rounded-xl"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								size: "lg",
								variant: "gold",
								children: "Publish product"
							})
						]
					})
				]
			})
		]
	});
}
//#endregion
export { SellerProducts as component };
