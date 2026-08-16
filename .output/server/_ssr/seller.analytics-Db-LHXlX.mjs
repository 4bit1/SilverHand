import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { r as SectionHeading } from "./Cards-lPQFG7Rq.mjs";
import { a as Area, c as ResponsiveContainer, i as XAxis, l as Tooltip, n as BarChart, o as CartesianGrid, r as YAxis, s as Bar, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/seller.analytics-Db-LHXlX.js
var import_jsx_runtime = require_jsx_runtime();
var earnings = [
	{
		month: "Mar",
		value: 18400
	},
	{
		month: "Apr",
		value: 21600
	},
	{
		month: "May",
		value: 19800
	},
	{
		month: "Jun",
		value: 26400
	},
	{
		month: "Jul",
		value: 31200
	},
	{
		month: "Aug",
		value: 35800
	}
];
var views = [
	{
		month: "Mar",
		value: 410
	},
	{
		month: "Apr",
		value: 520
	},
	{
		month: "May",
		value: 470
	},
	{
		month: "Jun",
		value: 690
	},
	{
		month: "Jul",
		value: 780
	},
	{
		month: "Aug",
		value: 912
	}
];
function Analytics() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
			eyebrow: "Insights",
			title: "Analytics"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface p-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl",
						children: "Earnings"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground",
						children: "Last six months"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 h-72",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
								data: earnings,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										stroke: "var(--color-border)",
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "month",
										stroke: "var(--color-muted-foreground)",
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										stroke: "var(--color-muted-foreground)",
										tickLine: false,
										axisLine: false,
										width: 56
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
										background: "var(--color-card)",
										border: "1px solid var(--color-border)",
										borderRadius: "1rem"
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "value",
										stroke: "var(--color-primary)",
										fill: "var(--color-primary-soft)",
										strokeWidth: 2.5
									})
								]
							})
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface p-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl",
						children: "Profile views"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground",
						children: "Last six months"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 h-72",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: views,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										stroke: "var(--color-border)",
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "month",
										stroke: "var(--color-muted-foreground)",
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										stroke: "var(--color-muted-foreground)",
										tickLine: false,
										axisLine: false,
										width: 48
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										cursor: { fill: "var(--color-muted)" },
										contentStyle: {
											background: "var(--color-card)",
											border: "1px solid var(--color-border)",
											borderRadius: "1rem"
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "value",
										fill: "var(--color-accent)",
										radius: [
											10,
											10,
											0,
											0
										]
									})
								]
							})
						})
					})
				]
			})]
		})]
	});
}
//#endregion
export { Analytics as component };
