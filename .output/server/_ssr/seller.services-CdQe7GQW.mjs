import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { t as Button } from "./button-CBm9KU00.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { E as ImagePlus, o as Sparkles } from "../_libs/lucide-react.mjs";
import { r as SectionHeading } from "./Cards-lPQFG7Rq.mjs";
import { c as inr, d as services } from "./router-C3BqJhOM.mjs";
import { n as Label, t as Input } from "./label-DbSbIPfw.mjs";
import { t as Textarea } from "./textarea-BVgMM7AU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/seller.services-CdQe7GQW.js
var import_jsx_runtime = require_jsx_runtime();
function SellerServices() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "Offerings",
				title: "My services"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-5 md:grid-cols-2 lg:grid-cols-3",
				children: services.slice(0, 3).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface hover-lift overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: s.image,
						alt: s.title,
						loading: "lazy",
						className: "aspect-[4/3] w-full object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1 p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold leading-snug",
							children: s.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted-foreground",
							children: [
								inr(s.price),
								" ",
								s.unit
							]
						})]
					})]
				}, s.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "surface p-8 lg:p-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-3xl",
					children: "Create a service"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						toast.success("Service published");
					},
					className: "mt-8 space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "stitle",
								children: "Service title"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "stitle",
								placeholder: "Bespoke blouse stitching",
								className: "h-12 rounded-xl"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "sdesc",
									children: "Description"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "sdesc",
									rows: 5,
									placeholder: "What's included, and how you work…",
									className: "rounded-xl"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									variant: "secondary",
									size: "sm",
									onClick: () => toast("Hansa AI polished your service description"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {}), " Improve with AI"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-5 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "sprice",
										children: "Price (₹)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "sprice",
										type: "number",
										placeholder: "450",
										className: "h-12 rounded-xl"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "savail",
										children: "Availability"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "savail",
										placeholder: "Mon–Fri, 10am–5pm",
										className: "h-12 rounded-xl"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "sdel",
										children: "Delivery time"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "sdel",
										placeholder: "4–6 days",
										className: "h-12 rounded-xl"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid place-items-center gap-3 rounded-2xl border-2 border-dashed border-border px-6 py-12 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, {
									className: "size-8 text-primary",
									"aria-hidden": true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: "Add portfolio images"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									children: "Choose images"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							size: "lg",
							variant: "gold",
							children: "Publish service"
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { SellerServices as component };
