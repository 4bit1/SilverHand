import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/seller.interview-FOs2B5bT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Legacy route — the embedded voice interview has been removed.
*
* The voice experience is now entirely owned by ElderSkill (separate app).
* If a user somehow reaches this route, redirect them to ElderSkill's
* auth page so they can go through the real voice application.
*/
function SellerInterviewRedirect() {
	(0, import_react.useEffect)(() => {
		const base = "http://localhost:8000";
		const callbackUrl = `${window.location.origin}/elder/callback`;
		window.location.href = `${base}/auth?return_to=${encodeURIComponent(callbackUrl)}`;
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-[60vh] items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground",
			children: "Redirecting to ElderSkill voice application…"
		})
	});
}
//#endregion
export { SellerInterviewRedirect as component };
