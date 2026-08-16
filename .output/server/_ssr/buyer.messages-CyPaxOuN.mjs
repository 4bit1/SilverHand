import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { t as Button } from "./button-CBm9KU00.mjs";
import { r as SectionHeading } from "./Cards-lPQFG7Rq.mjs";
import { d as services } from "./router-C3BqJhOM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/buyer.messages-CyPaxOuN.js
var import_jsx_runtime = require_jsx_runtime();
var thread = [
	{
		from: "them",
		text: "Namaste! Yes, I can deliver the thali by 12:30 tomorrow."
	},
	{
		from: "me",
		text: "Perfect. Could you make it slightly less spicy?"
	},
	{
		from: "them",
		text: "Of course — I'll keep the green chilli separate on the side."
	}
];
function Messages() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
		eyebrow: "Inbox",
		title: "Messages"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[20rem_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "surface divide-y divide-border overflow-hidden",
			children: services.slice(0, 4).map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: `flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-muted ${i === 0 ? "bg-primary-soft" : ""}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: s.image,
					alt: "",
					loading: "lazy",
					className: "size-12 rounded-full object-cover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block truncate font-semibold",
						children: s.seller
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block truncate text-sm text-muted-foreground",
						children: i === 0 ? "I'll keep the chilli separate" : "Thank you for your order!"
					})]
				})]
			}) }, s.id))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface flex min-h-[26rem] flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "border-b border-border px-6 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: services[0]?.seller
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Usually replies within an hour"
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
							htmlFor: "msg",
							className: "sr-only",
							children: "Write a message"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "msg",
							placeholder: "Write a message…",
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
export { Messages as component };
