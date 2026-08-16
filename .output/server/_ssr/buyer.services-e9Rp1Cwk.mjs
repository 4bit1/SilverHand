import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { n as cn } from "./button-CBm9KU00.mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as Search } from "../_libs/lucide-react.mjs";
import { a as StitchDivider, i as ServiceCard, r as SectionHeading, t as EmptyState } from "./Cards-lPQFG7Rq.mjs";
import { d as services, i as Route$13, o as categories } from "./router-C3BqJhOM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/buyer.services-e9Rp1Cwk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ExploreServices() {
	const { category, q } = Route$13.useSearch();
	const navigate = useNavigate();
	const active = category ?? "All";
	const [query, setQuery] = (0, import_react.useState)(q ?? "");
	const list = services.filter((s) => {
		const matchesCategory = active === "All" || s.category === active;
		const needle = (q ?? "").trim().toLowerCase();
		const matchesQuery = !needle || s.title.toLowerCase().includes(needle) || s.category.toLowerCase().includes(needle) || s.seller.toLowerCase().includes(needle);
		return matchesCategory && matchesQuery;
	});
	function setActive(next) {
		navigate({
			to: "/buyer/services",
			search: {
				...next !== "All" ? { category: next } : {},
				...q ? { q } : {}
			}
		});
	}
	function submitSearch(e) {
		e.preventDefault();
		navigate({
			to: "/buyer/services",
			search: {
				...active !== "All" ? { category: active } : {},
				...query.trim() ? { q: query.trim() } : {}
			}
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
			eyebrow: "Explore",
			title: "Services"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submitSearch,
			className: "relative mb-6 max-w-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					htmlFor: "services-q",
					className: "sr-only",
					children: "Search services"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
					className: "pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground",
					"aria-hidden": true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "services-q",
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: "Search services — e.g. tailoring, tutoring, sitar",
					className: "h-13 w-full rounded-full border border-border bg-card pl-13 pr-5 text-base shadow-soft outline-none placeholder:text-muted-foreground"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-8 flex flex-wrap gap-2",
			role: "group",
			"aria-label": "Filter by category",
			children: ["All", ...categories.map((c) => c.name)].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setActive(c),
				"aria-pressed": active === c,
				className: cn("rounded-full border px-5 py-2.5 text-sm font-medium transition-colors", active === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary hover:text-primary"),
				children: c
			}, c))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StitchDivider, { className: "mb-8" }),
		list.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3",
			children: list.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceCard, { service: s }, s.id))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			icon: Search,
			title: "No matches yet",
			description: `Nothing found${q ? ` for "${q}"` : ""} in ${active === "All" ? "any category" : active}. Try a different search or browse all categories.`
		})
	] });
}
//#endregion
export { ExploreServices as component };
