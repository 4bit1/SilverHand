import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { i as signIn, n as completeOnboarding } from "./store-DiiHrnzs.mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as fetchProfileByUserId } from "./elderskill-DLNkYxHL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/elder.callback-BIwQDXfG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* ElderSkill callback handler.
*
* This route is hit when ElderSkill redirects back to Silver Hands after
* the user completes auth + voice interview. The flow:
*
*   ElderSkill (interview complete)
*     → /elder/callback?elderskill_user_id=<uuid>
*     → fetch profile from ElderSkill API
*     → map to Silver Hands seller profile (localStorage)
*     → signIn + completeOnboarding
*     → redirect to /seller
*/
function ElderCallback() {
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		async function handle() {
			const userId = new URLSearchParams(window.location.search).get("elderskill_user_id");
			const pendingName = window.localStorage.getItem("silverhands.pending_name") || "Seller";
			if (!userId) {
				navigate({
					to: "/login",
					search: { role: "seller" }
				});
				return;
			}
			try {
				window.localStorage.setItem("silverhands.elderskill_user_id", userId);
			} catch {}
			let profileName = pendingName;
			try {
				const profile = await fetchProfileByUserId(userId);
				if (profile) {
					if (profile.full_name) profileName = profile.full_name;
					const shProfile = {
						about: profile.profile?.summary || "",
						skills: profile.profile?.primary_skill || "",
						location: profile.profile?.location_city || "",
						languages: ""
					};
					try {
						const existingRaw = window.localStorage.getItem("silverhands.profile");
						if (existingRaw) {
							const existing = JSON.parse(existingRaw);
							for (const [key, value] of Object.entries(shProfile)) if (value) existing[key] = value;
							window.localStorage.setItem("silverhands.profile", JSON.stringify(existing));
						} else window.localStorage.setItem("silverhands.profile", JSON.stringify(shProfile));
					} catch {
						window.localStorage.setItem("silverhands.profile", JSON.stringify(shProfile));
					}
					if (profile.email) try {
						window.localStorage.setItem("silverhands.elderskill_email", profile.email);
					} catch {}
				}
			} catch (e) {
				console.warn("Failed to fetch ElderSkill profile — proceeding with local data:", e);
			}
			signIn(profileName, "seller");
			completeOnboarding();
			try {
				window.localStorage.removeItem("silverhands.pending_name");
			} catch {}
			navigate({ to: "/seller" });
		}
		handle();
	}, [navigate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto size-10 animate-spin rounded-full border-4 border-primary border-t-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "Syncing your profile from ElderSkill…"
			})]
		})
	});
}
//#endregion
export { ElderCallback as component };
