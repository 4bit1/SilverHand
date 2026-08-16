import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { t as AppShell } from "./AppShell-D-gs9b2s.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/seller-C4yf58Tq.js
var import_jsx_runtime = require_jsx_runtime();
var nav = [
	{
		label: "Dashboard",
		to: "/seller"
	},
	{
		label: "My Products",
		to: "/seller/products"
	},
	{
		label: "My Services",
		to: "/seller/services"
	},
	{
		label: "Orders",
		to: "/seller/orders"
	},
	{
		label: "Analytics",
		to: "/seller/analytics"
	},
	{
		label: "AI Advisor",
		to: "/seller/ai-advisor"
	},
	{
		label: "Profile",
		to: "/seller/profile"
	}
];
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
	nav,
	mode: "Seller"
});
//#endregion
export { SplitComponent as component };
