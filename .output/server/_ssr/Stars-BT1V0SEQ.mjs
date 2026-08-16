import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { i as Star } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Stars-BT1V0SEQ.js
var import_jsx_runtime = require_jsx_runtime();
function Stars({ rating, reviews, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `inline-flex items-center gap-1.5 text-sm ${className}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
				className: "size-4 fill-accent text-accent",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-semibold",
				children: rating.toFixed(1)
			}),
			reviews !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-muted-foreground",
				children: [
					"(",
					reviews,
					")"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "sr-only",
				children: [
					"rated ",
					rating,
					" out of 5",
					reviews !== void 0 ? ` from ${reviews} reviews` : ""
				]
			})
		]
	});
}
//#endregion
export { Stars as t };
