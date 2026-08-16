import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { t as Button } from "./button-CBm9KU00.mjs";
import { s as useMarketState } from "./store-DiiHrnzs.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as Heart } from "../_libs/lucide-react.mjs";
import { i as ServiceCard, n as ProductCard, r as SectionHeading, t as EmptyState } from "./Cards-lPQFG7Rq.mjs";
import { d as services, l as products } from "./router-C3BqJhOM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/buyer.favorites-02tdb9YS.js
var import_jsx_runtime = require_jsx_runtime();
function Favorites() {
	const { favorites } = useMarketState();
	const savedServices = services.filter((s) => favorites.includes(s.id));
	const savedProducts = products.filter((p) => favorites.includes(p.id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
			eyebrow: "Saved",
			title: "Your favorites"
		}), !savedServices.length && !savedProducts.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			icon: Heart,
			title: "Nothing saved yet",
			description: "Tap the heart on any service or product and it will wait for you here.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				size: "lg",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/buyer/services",
					children: "Start exploring"
				})
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [!!savedServices.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3",
			children: savedServices.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceCard, { service: s }, s.id))
		}), !!savedProducts.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
			children: savedProducts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
		})] })]
	});
}
//#endregion
export { Favorites as component };
