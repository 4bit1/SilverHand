import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime, r as Slot } from "../_libs/@radix-ui/react-label+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-CBm9KU00.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-[1.15em] [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow-soft hover:bg-primary/90",
			gold: "bg-accent text-accent-foreground shadow-soft hover:bg-accent/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-border bg-card text-foreground shadow-soft hover:border-primary hover:text-primary",
			secondary: "bg-primary-soft text-primary hover:bg-primary-soft/70",
			ghost: "hover:bg-primary-soft hover:text-primary",
			link: "text-primary underline-offset-4 hover:underline rounded-md"
		},
		size: {
			default: "h-11 px-6 text-[0.95rem]",
			sm: "h-9 px-4 text-sm",
			lg: "h-13 px-8 text-base",
			xl: "h-15 px-10 text-lg",
			icon: "h-11 w-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
//#endregion
export { cn as n, Button as t };
