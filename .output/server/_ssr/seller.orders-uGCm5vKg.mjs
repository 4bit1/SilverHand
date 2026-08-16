import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { r as SectionHeading } from "./Cards-lPQFG7Rq.mjs";
import { c as inr } from "./router-C3BqJhOM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/seller.orders-uGCm5vKg.js
var import_jsx_runtime = require_jsx_runtime();
var orders = [
	{
		id: "SH-1042",
		buyer: "Priya Menon",
		item: "Handwoven cotton throw",
		amount: 2400,
		status: "To dispatch"
	},
	{
		id: "SH-1041",
		buyer: "Arjun Thomas",
		item: "Mango & jaggery preserve × 2",
		amount: 840,
		status: "Shipped"
	},
	{
		id: "SH-1039",
		buyer: "Nisha Rao",
		item: "Bengali thali, weekly plan",
		amount: 1260,
		status: "Completed"
	},
	{
		id: "SH-1036",
		buyer: "Kabir Shah",
		item: "Kantha cushion cover",
		amount: 1150,
		status: "Completed"
	}
];
function Orders() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
		eyebrow: "Fulfilment",
		title: "Orders"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "surface overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full min-w-[42rem] text-left",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "border-b border-border text-sm text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						scope: "col",
						className: "px-6 py-4 font-medium",
						children: "Order"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						scope: "col",
						className: "px-6 py-4 font-medium",
						children: "Buyer"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						scope: "col",
						className: "px-6 py-4 font-medium",
						children: "Item"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						scope: "col",
						className: "px-6 py-4 font-medium",
						children: "Amount"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						scope: "col",
						className: "px-6 py-4 font-medium",
						children: "Status"
					})
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
				className: "divide-y divide-border",
				children: orders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-6 py-5 font-semibold",
						children: o.id
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-6 py-5",
						children: o.buyer
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-6 py-5 text-muted-foreground",
						children: o.item
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-6 py-5 font-semibold",
						children: inr(o.amount)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-6 py-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-primary-soft px-3 py-1 text-sm font-semibold text-primary",
							children: o.status
						})
					})
				] }, o.id))
			})]
		})
	})] });
}
//#endregion
export { Orders as component };
