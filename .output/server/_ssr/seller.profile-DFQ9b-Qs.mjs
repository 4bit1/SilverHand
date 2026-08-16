import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { t as Button } from "./button-CBm9KU00.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { I as Camera, f as RefreshCcw, j as ExternalLink, o as Sparkles } from "../_libs/lucide-react.mjs";
import { r as SectionHeading } from "./Cards-lPQFG7Rq.mjs";
import { n as Label, t as Input } from "./label-DbSbIPfw.mjs";
import { t as fetchProfileByUserId } from "./elderskill-DLNkYxHL.mjs";
import { t as Textarea } from "./textarea-BVgMM7AU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/seller.profile-DFQ9b-Qs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SellerProfile() {
	const [name, setName] = (0, import_react.useState)("");
	const [languages, setLanguages] = (0, import_react.useState)("");
	const [location, setLocation] = (0, import_react.useState)("");
	const [experience, setExperience] = (0, import_react.useState)("");
	const [skills, setSkills] = (0, import_react.useState)("");
	const [about, setAbout] = (0, import_react.useState)("");
	const [syncing, setSyncing] = (0, import_react.useState)(false);
	const [elderSkillLinked, setElderSkillLinked] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			const raw = window.localStorage.getItem("silverhands.profile");
			if (raw) {
				const p = JSON.parse(raw);
				setAbout(p.about || "");
				setSkills(p.skills || "");
				setLocation(p.location || "");
				setLanguages(p.languages || "");
			}
			const sessRaw = window.localStorage.getItem("silverhands.session");
			if (sessRaw) {
				const s = JSON.parse(sessRaw);
				if (s?.name) setName(s.name);
			}
			if (window.localStorage.getItem("silverhands.elderskill_user_id")) setElderSkillLinked(true);
		} catch {}
	}, []);
	async function resyncFromElderSkill() {
		const userId = window.localStorage.getItem("silverhands.elderskill_user_id");
		if (!userId) {
			toast.error("No ElderSkill account linked. Complete a voice interview first.");
			return;
		}
		setSyncing(true);
		try {
			const profile = await fetchProfileByUserId(userId);
			if (profile) {
				if (profile.full_name) setName(profile.full_name);
				if (profile.profile?.summary) setAbout(profile.profile.summary);
				if (profile.profile?.primary_skill) setSkills(profile.profile.primary_skill);
				if (profile.profile?.location_city) setLocation(profile.profile.location_city);
				if (profile.profile?.years_of_experience) setExperience(`${profile.profile.years_of_experience} years`);
				const p = {
					about: profile.profile?.summary || about,
					skills: profile.profile?.primary_skill || skills,
					location: profile.profile?.location_city || location,
					languages
				};
				window.localStorage.setItem("silverhands.profile", JSON.stringify(p));
				toast.success("Profile synced from ElderSkill!");
			} else toast.error("Could not fetch profile from ElderSkill.");
		} catch (e) {
			console.error(e);
			toast.error("Sync failed — ElderSkill may not be running.");
		} finally {
			setSyncing(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "Your story",
				title: "Seller profile"
			}),
			elderSkillLinked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface mb-6 flex flex-wrap items-center justify-between gap-4 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-flex size-8 items-center justify-center rounded-full bg-green-100 text-green-600",
						children: "✓"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: "ElderSkill account linked"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Profile data synced from your voice interview"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "outline",
					size: "sm",
					onClick: resyncFromElderSkill,
					disabled: syncing,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCcw, { className: syncing ? "animate-spin" : "" }), syncing ? "Syncing…" : "Re-sync"]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface mb-6 flex flex-wrap items-center justify-between gap-4 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold",
					children: "Want AI to write your profile?"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Complete a voice interview on ElderSkill to auto-fill your profile."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "outline",
					size: "sm",
					onClick: () => {
						const base = "http://localhost:8000";
						const callbackUrl = `${window.location.origin}/elder/callback`;
						window.location.href = `${base}/auth?return_to=${encodeURIComponent(callbackUrl)}`;
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, {}), " Start voice interview"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					try {
						const profile = {
							about,
							skills,
							location,
							languages
						};
						window.localStorage.setItem("silverhands.profile", JSON.stringify(profile));
					} catch {}
					toast.success("Profile updated");
				},
				className: "surface space-y-7 p-8 lg:p-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-24 place-items-center rounded-full bg-primary-soft text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, {
								className: "size-8",
								"aria-hidden": true
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							children: "Upload profile photo"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-5 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "sname",
									children: "Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "sname",
									value: name,
									onChange: (e) => setName(e.target.value),
									className: "h-12 rounded-xl"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "slang",
									children: "Languages"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "slang",
									value: languages,
									onChange: (e) => setLanguages(e.target.value),
									className: "h-12 rounded-xl"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "sloc",
									children: "Location"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "sloc",
									value: location,
									onChange: (e) => setLocation(e.target.value),
									className: "h-12 rounded-xl"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "sexp",
									children: "Experience"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "sexp",
									value: experience,
									onChange: (e) => setExperience(e.target.value),
									className: "h-12 rounded-xl"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "sskills",
							children: "Skills"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "sskills",
							value: skills,
							onChange: (e) => setSkills(e.target.value),
							className: "h-12 rounded-xl"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "sabout",
								children: "About me"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "sabout",
								rows: 5,
								className: "rounded-xl",
								value: about,
								onChange: (e) => setAbout(e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "secondary",
								size: "sm",
								onClick: () => toast("Hansa AI suggested a warmer opening line"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {}), " Improve bio with AI"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "lg",
						children: "Save profile"
					})
				]
			})
		]
	});
}
//#endregion
export { SellerProfile as component };
