import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { t as Button } from "./button-CBm9KU00.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { L as CalendarCheck, N as Clock, S as MapPin, k as Globe } from "../_libs/lucide-react.mjs";
import { t as Stars } from "./Stars-BT1V0SEQ.mjs";
import { c as inr, n as Route, u as reviews } from "./router-C3BqJhOM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/buyer.service._id-B-2NGoXG.js
var import_jsx_runtime = require_jsx_runtime();
function ServiceDetail() {
	const { service } = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "space-y-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/buyer/services",
			className: "text-sm font-medium text-primary hover:underline",
			children: "← Back to services"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-10 lg:grid-cols-[1.6fr_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-hidden rounded-3xl shadow-soft",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: service.image,
							alt: service.title,
							className: "aspect-[16/10] w-full object-cover"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-[0.18em] text-accent",
							children: service.category
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-3 text-4xl leading-tight lg:text-5xl",
							children: service.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, {
									rating: service.rating,
									reviews: service.reviews
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
											className: "size-4",
											"aria-hidden": true
										}),
										" ",
										service.location
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
											className: "size-4",
											"aria-hidden": true
										}),
										" ",
										service.delivery
									]
								})
							]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "surface p-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-2xl",
								children: ["About ", service.seller]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-lg text-muted-foreground",
								children: service.about
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "mt-6 grid gap-5 sm:grid-cols-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-sm text-muted-foreground",
										children: "Experience"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "font-semibold",
										children: service.experience
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-sm text-muted-foreground",
										children: "Languages"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
										className: "inline-flex items-center gap-2 font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, {
											className: "size-4 text-primary",
											"aria-hidden": true
										}), service.languages.join(", ")]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-sm text-muted-foreground",
										children: "Availability"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "font-semibold",
										children: service.delivery
									})] })
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl",
						children: "Portfolio"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid grid-cols-3 gap-4",
						children: [
							0,
							1,
							2
						].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: service.image,
							alt: `Work sample ${i + 1} by ${service.seller}`,
							loading: "lazy",
							className: "aspect-square rounded-2xl object-cover shadow-soft"
						}, i))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl",
						children: "Reviews"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 space-y-4",
						children: reviews.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "surface p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-2",
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
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "lg:sticky lg:top-28 lg:self-start",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface space-y-5 p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-3xl font-semibold",
							children: [
								inr(service.price),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-base font-normal text-muted-foreground",
									children: service.unit
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "space-y-2 text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Free consultation before booking" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Cancel up to 24 hours in advance" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Payment released after completion" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "xl",
							variant: "gold",
							className: "w-full",
							onClick: () => toast.success("Booking request sent", { description: service.seller + " will confirm shortly." }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, {}), " Book this service"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							variant: "outline",
							className: "w-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/buyer/messages",
								children: ["Message ", service.seller.split(" ")[0]]
							})
						})
					]
				})
			})]
		})]
	});
}
//#endregion
export { ServiceDetail as component };
