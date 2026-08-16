import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { n as cn, t as Button } from "./button-CBm9KU00.mjs";
import { c as useSession, n as completeOnboarding } from "./store-DiiHrnzs.mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { I as Camera, U as ArrowRight } from "../_libs/lucide-react.mjs";
import { n as Label, t as Input } from "./label-DbSbIPfw.mjs";
import { t as Textarea } from "./textarea-BVgMM7AU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/seller.onboarding-B7cpedUN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var steps = [
	"Tell us about yourself",
	"Your details",
	"Review"
];
function SellerOnboarding() {
	const session = useSession();
	const navigate = useNavigate();
	const [step, setStep] = (0, import_react.useState)(0);
	const [about, setAbout] = (0, import_react.useState)("");
	const [skills, setSkills] = (0, import_react.useState)("");
	const [location, setLocation] = (0, import_react.useState)("");
	const [languages, setLanguages] = (0, import_react.useState)("");
	(0, import_react.useState)(() => {
		try {
			const raw = window.localStorage.getItem("silverhands.profile");
			if (raw) {
				const p = JSON.parse(raw);
				if (p.about) setAbout(p.about);
				if (p.skills) setSkills(p.skills);
				if (p.location) setLocation(p.location);
				if (p.languages) setLanguages(p.languages);
			}
		} catch {}
	});
	function finish() {
		try {
			const profile = {
				about,
				skills,
				location,
				languages
			};
			window.localStorage.setItem("silverhands.profile", JSON.stringify(profile));
		} catch {}
		completeOnboarding();
		toast.success("Profile created — welcome to SilverHands!");
		navigate({ to: "/seller" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-10 flex items-center justify-center gap-2",
				children: steps.map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("grid size-9 place-items-center rounded-full text-sm font-semibold", i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"),
						children: i + 1
					}), i < steps.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-0.5 w-10", i < step ? "bg-primary" : "bg-border") })]
				}, label))
			}),
			step === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface space-y-6 p-8 text-center lg:p-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl",
						children: session?.name ? `Welcome, ${session.name}` : "Tell us about yourself"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-muted-foreground",
						children: [
							"Describe your skills and experience below, or use the",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: `http://localhost:8000/auth?return_to=${encodeURIComponent(window.location.origin + "/elder/callback")}`,
								className: "font-semibold text-primary underline underline-offset-4",
								children: "ElderSkill voice interview"
							}),
							" ",
							"to have AI write your profile for you."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: about,
						onChange: (e) => setAbout(e.target.value),
						rows: 5,
						placeholder: "e.g. I've been making Bengali pickles and snacks for my family for 30 years, and I'd love to sell them...",
						className: "rounded-xl text-left"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "lg",
						className: "w-full",
						disabled: !about.trim(),
						onClick: () => setStep(1),
						children: ["Continue ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
					})
				]
			}),
			step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface space-y-6 p-8 lg:p-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-20 place-items-center rounded-full bg-primary-soft text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, {
								className: "size-7",
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
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "ob-location",
								children: "Location"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "ob-location",
								value: location,
								onChange: (e) => setLocation(e.target.value),
								placeholder: "e.g. Salt Lake, Kolkata",
								className: "h-12 rounded-xl"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "ob-languages",
								children: "Languages"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "ob-languages",
								value: languages,
								onChange: (e) => setLanguages(e.target.value),
								placeholder: "e.g. Bengali, Hindi, English",
								className: "h-12 rounded-xl"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "ob-skills",
							children: "Skills"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "ob-skills",
							value: skills,
							onChange: (e) => setSkills(e.target.value),
							placeholder: "e.g. Bengali cuisine, pickling, tiffin planning",
							className: "h-12 rounded-xl"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setStep(0),
							className: "flex-1",
							children: "Back"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => setStep(2),
							className: "flex-1",
							children: ["Continue ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
						})]
					})
				]
			}),
			step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface space-y-6 p-8 lg:p-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl",
						children: "Here's your profile"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 rounded-xl border border-border p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: session?.name ?? "Your name"
							}),
							location && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: location
							}),
							languages && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: ["Speaks: ", languages]
							}),
							skills && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: ["Skills: ", skills]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm leading-relaxed",
								children: about
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setStep(1),
							className: "flex-1",
							children: "Back"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: finish,
							className: "flex-1",
							children: "Publish my profile"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: finish,
				className: "mx-auto mt-6 block text-sm text-muted-foreground underline-offset-4 hover:underline",
				children: "Skip for now"
			})
		]
	});
}
//#endregion
export { SellerOnboarding as component };
