import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { n as cn, t as Button } from "./button-CBm9KU00.mjs";
import { i as signIn } from "./store-DiiHrnzs.mjs";
import { _ as useSearch, g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { R as Briefcase, s as ShoppingBag } from "../_libs/lucide-react.mjs";
import { n as Label, t as Input } from "./label-DbSbIPfw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-D43ElTAI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { role: initialRole, redirect } = useSearch({ from: "/login" });
	const navigate = useNavigate();
	const [role, setRole] = (0, import_react.useState)(initialRole ?? "buyer");
	const [name, setName] = (0, import_react.useState)("");
	function handleSubmit(e) {
		e.preventDefault();
		if (!name.trim()) {
			toast.error("Please enter your name to continue");
			return;
		}
		if (role === "seller") {
			try {
				window.localStorage.setItem("silverhands.pending_name", name.trim());
			} catch {}
			const base = "http://localhost:8000";
			const callbackUrl = `${window.location.origin}/elder/callback`;
			window.location.href = `${base}/auth?return_to=${encodeURIComponent(callbackUrl)}`;
			return;
		}
		signIn(name, role);
		toast.success(`Welcome, ${name.trim()}!`);
		if (redirect) navigate({ to: redirect });
		else navigate({ to: "/buyer" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-5 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface w-full max-w-md p-8 lg:p-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-2xl font-semibold tracking-tight",
						children: "SilverHands"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 text-3xl",
						children: "Welcome back"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-muted-foreground",
						children: redirect ? "Sign in to continue — no password needed for this demo." : "Enter your name to continue — no password needed for this demo."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "mt-8 space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-3",
						role: "radiogroup",
						"aria-label": "Continue as",
						children: [{
							value: "buyer",
							label: "Buyer",
							icon: ShoppingBag
						}, {
							value: "seller",
							label: "Seller",
							icon: Briefcase
						}].map(({ value, label, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							role: "radio",
							"aria-checked": role === value,
							onClick: () => setRole(value),
							className: cn("flex flex-col items-center gap-2 rounded-2xl border-2 px-4 py-5 text-sm font-semibold transition-colors", role === value ? "border-primary bg-primary-soft text-primary" : "border-border text-muted-foreground hover:border-primary/40"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: "size-6",
								"aria-hidden": true
							}), label]
						}, value))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "login-name",
							children: "Your name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "login-name",
							autoFocus: true,
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: "e.g. Anjali Sen",
							className: "h-12 rounded-xl text-base"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						size: "lg",
						className: "w-full",
						children: ["Continue as ", role === "buyer" ? "Buyer" : "Seller"]
					})
				]
			})]
		})
	});
}
//#endregion
export { Login as component };
