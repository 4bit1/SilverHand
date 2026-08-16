import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { t as Button } from "./button-CBm9KU00.mjs";
import { r as SectionHeading } from "./Cards-lPQFG7Rq.mjs";
import { n as Label, t as Input } from "./label-DbSbIPfw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/buyer.profile-DvOrncEQ.js
var import_jsx_runtime = require_jsx_runtime();
var fields = [
	{
		id: "name",
		label: "Full name",
		value: "Priya Menon"
	},
	{
		id: "email",
		label: "Email",
		value: "priya@example.com"
	},
	{
		id: "phone",
		label: "Phone",
		value: "+91 98765 43210"
	},
	{
		id: "city",
		label: "City",
		value: "Bengaluru"
	}
];
function BuyerProfile() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-3xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
			eyebrow: "Account",
			title: "Your profile"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: (e) => e.preventDefault(),
			className: "surface space-y-6 p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-5 sm:grid-cols-2",
					children: fields.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: f.id,
							children: f.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: f.id,
							defaultValue: f.value,
							className: "h-12 rounded-xl"
						})]
					}, f.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "address",
						children: "Delivery address"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "address",
						defaultValue: "14, Lakeview Residency, Indiranagar",
						className: "h-12 rounded-xl"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "lg",
					type: "submit",
					children: "Save changes"
				})
			]
		})]
	});
}
//#endregion
export { BuyerProfile as component };
