import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { t as Button } from "./button-CBm9KU00.mjs";
import { r as SectionHeading } from "./Cards-lPQFG7Rq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/seller.messages-2Yo1--rj.js
var import_jsx_runtime = require_jsx_runtime();
var buyers = [
	"Priya Menon",
	"Arjun Thomas",
	"Nisha Rao"
];
var thread = [{
	from: "them",
	text: "Hello! Do you deliver to Indiranagar on Sundays?"
}, {
	from: "me",
	text: "Yes, Sunday deliveries reach by 12:30."
}];
function SellerMessages() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
		eyebrow: "Inbox",
		title: "Messages"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[20rem_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "surface divide-y divide-border overflow-hidden",
			children: buyers.map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: `w-full px-5 py-4 text-left transition-colors hover:bg-muted ${i === 0 ? "bg-primary-soft" : ""}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block font-semibold",
					children: b
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block truncate text-sm text-muted-foreground",
					children: i === 0 ? "Do you deliver on Sundays?" : "Thank you, it arrived safely!"
				})]
			}) }, b))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface flex min-h-[26rem] flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "border-b border-border px-6 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: buyers[0]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Buyer since 2024"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-1 flex-col gap-3 p-6",
					children: thread.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `max-w-[75%] rounded-2xl px-4 py-3 ${m.from === "me" ? "self-end bg-primary text-primary-foreground" : "bg-muted text-foreground"}`,
						children: m.text
					}, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => e.preventDefault(),
					className: "flex items-center gap-3 border-t border-border p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "smsg",
							className: "sr-only",
							children: "Write a reply"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "smsg",
							placeholder: "Write a reply…",
							className: "h-12 flex-1 rounded-full bg-muted px-5 outline-none placeholder:text-muted-foreground"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							children: "Send"
						})
					]
				})
			]
		})]
	})] });
}
//#endregion
export { SellerMessages as component };
