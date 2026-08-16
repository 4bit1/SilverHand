import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { t as AppShell } from "./AppShell-D-gs9b2s.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/buyer-B5Z4m1zS.js
var import_jsx_runtime = require_jsx_runtime();
var nav = [
	{
		label: "Home",
		to: "/buyer"
	},
	{
		label: "Explore Services",
		to: "/buyer/services"
	},
	{
		label: "Explore Products",
		to: "/buyer/products"
	},
	{
		label: "Profile",
		to: "/buyer/profile"
	}
];
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
	nav,
	mode: "Buyer"
});
//#endregion
export { SplitComponent as component };
