// Interface translations — English, Hindi, Tamil.
//
// Scope, deliberately: this translates the interface (navigation, buttons,
// headings, instructions) — not seller listing content (product/service
// names, descriptions, reviews). That's user-authored text; translating it
// out from under a seller isn't something a real product would do
// silently either. If a seller writes their listing in Hindi, it stays in
// Hindi regardless of the interface language, same as any real
// marketplace.
//
// Persisted the same way session/cart state is (useSyncExternalStore +
// localStorage) — see lib/store.ts for the identical pattern.

import { useSyncExternalStore } from "react";

export type LangCode = "en" | "hi" | "ta";

export const LANGUAGES: { code: LangCode; label: string; nativeLabel: string }[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
  { code: "ta", label: "Tamil", nativeLabel: "தமிழ்" },
];

type Dict = Record<string, string>;

const en: Dict = {
  "nav.home": "Home",
  "nav.exploreServices": "Services",
  "nav.exploreProducts": "Products",
  "nav.favorites": "Favorites",
  "nav.cart": "Cart",
  "nav.profile": "Profile",
  "nav.dashboard": "Dashboard",
  "nav.myProducts": "Products",
  "nav.myServices": "Services",
  "nav.advertising": "Ads",
  "nav.orders": "Orders",
  "nav.analytics": "Analytics",
  "nav.aiAdvisor": "AI Advisor",
  "nav.theirExpertise": "Their Expertise",
  "nav.teachAndShare": "Teach & Share",
  "nav.signIn": "Sign in",
  "nav.startSelling": "Start selling",
  "nav.switchToSelling": "Switch to selling",
  "nav.switchToBuying": "Switch to buying",
  "nav.signOut": "Sign out",

  "common.search": "Search",
  "common.continue": "Continue",
  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.loading": "Loading…",
  "common.viewAll": "View all",
  "common.getStarted": "Get started",

  "landing.eyebrow": "A livelihood marketplace, built on skill",
  "landing.headline1": "Turn a lifetime",
  "landing.headline2": "of skill into",
  "landing.headline3": "income.",
  "landing.subhead":
    "Cooking. Gardening. Tutoring. Craft passed down for generations. SilverHands helps senior citizens and homemakers across India get discovered, trusted, and paid — for what they already know how to do.",
  "landing.startEarning": "Start earning",
  "landing.exploreSkills": "Explore skills",
  "landing.categoriesHeadline": "Every skill has a home here.",
  "landing.entryQuestion": "Which brings you here today?",
  "landing.buyerCardTitle": "A trusted local expert",
  "landing.sellerCardTitle": "My own customers",
  "landing.continueAsBuyer": "Continue as a buyer",
  "landing.continueAsSeller": "Continue as a seller",
  "landing.closeHeadline1": "Your skill has been waiting",
  "landing.closeHeadline2": "for its",
  "landing.closeHeadline3": "customer.",

  "login.welcomeBack": "Welcome back",
  "login.subhead": "Enter your name to continue — no password needed for this demo.",
  "login.yourName": "Your name",
  "login.namePlaceholder": "e.g. Anjali Sen",
  "login.buyer": "Buyer",
  "login.seller": "Seller",
  "login.continueAs": "Continue as",

  "buyerHome.searchEyebrow": "Curated by people with decades of practice",
  "buyerHome.searchHeadline": "What would you like to find today?",
  "buyerHome.searchPlaceholder": "Try \u201chome-cooked meals near me\u201d",
  "buyerHome.aiSearch": "AI Search",
  "buyerHome.aiSearchHint": "AI understands plain language — describe the outcome you want, not the keyword.",
  "buyerHome.trending": "Trending",
  "buyerHome.browseByCategory": "Browse by category",
  "buyerHome.featured": "Featured",
  "buyerHome.servicesWorthBooking": "Services worth booking",
  "buyerHome.handmade": "Handmade, not mass-produced",
  "buyerHome.madeSlowly": "Made slowly, by hand",
  "buyerHome.recommended": "Recommended for you",
  "buyerHome.sellersYouMayLove": "Sellers you may love",
  "buyerHome.nearbyOpportunities": "Nearby opportunities",
  "buyerHome.sponsored": "Sponsored",
  "buyerHome.featuredThisWeek": "Featured this week",

  "explore.services": "Services",
  "explore.products": "Handmade products",
  "explore.fairDiscovery": "Fair Discovery",
  "explore.topRated": "Top Rated",
  "explore.fairDiscoveryHint":
    "Gives newer and less-reviewed sellers a fair chance to be seen, not just whoever has the most reviews.",

  "currency.label": "Currency",
  "language.label": "Language",
};

const hi: Dict = {
  "nav.home": "होम",
  "nav.exploreServices": "सेवाएं",
  "nav.exploreProducts": "उत्पाद",
  "nav.favorites": "पसंदीदा",
  "nav.cart": "कार्ट",
  "nav.profile": "प्रोफ़ाइल",
  "nav.dashboard": "डैशबोर्ड",
  "nav.myProducts": "उत्पाद",
  "nav.myServices": "सेवाएं",
  "nav.advertising": "विज्ञापन",
  "nav.orders": "ऑर्डर",
  "nav.analytics": "विश्लेषण",
  "nav.aiAdvisor": "एआई सलाहकार",
  "nav.theirExpertise": "उनकी विशेषज्ञता",
  "nav.teachAndShare": "सिखाएं और साझा करें",
  "nav.signIn": "साइन इन करें",
  "nav.startSelling": "बेचना शुरू करें",
  "nav.switchToSelling": "बिक्री पर जाएं",
  "nav.switchToBuying": "खरीद पर जाएं",
  "nav.signOut": "साइन आउट",

  "common.search": "खोजें",
  "common.continue": "जारी रखें",
  "common.save": "सहेजें",
  "common.cancel": "रद्द करें",
  "common.loading": "लोड हो रहा है…",
  "common.viewAll": "सभी देखें",
  "common.getStarted": "शुरू करें",

  "landing.eyebrow": "कौशल पर आधारित एक आजीविका मार्केटप्लेस",
  "landing.headline1": "एक जीवन भर के",
  "landing.headline2": "कौशल को बनाएं",
  "landing.headline3": "आय।",
  "landing.subhead":
    "खाना बनाना। बागवानी। ट्यूशन। पीढ़ियों से चली आ रही कला। SilverHands पूरे भारत में वरिष्ठ नागरिकों और गृहणियों को पहचान, भरोसा और भुगतान पाने में मदद करता है — जो वे पहले से ही जानते हैं उसके लिए।",
  "landing.startEarning": "कमाना शुरू करें",
  "landing.exploreSkills": "कौशल देखें",
  "landing.categoriesHeadline": "हर हुनर का यहाँ एक घर है।",
  "landing.entryQuestion": "आज आप यहाँ किस लिए आए हैं?",
  "landing.buyerCardTitle": "एक भरोसेमंद स्थानीय विशेषज्ञ",
  "landing.sellerCardTitle": "मेरे अपने ग्राहक",
  "landing.continueAsBuyer": "खरीदार के रूप में जारी रखें",
  "landing.continueAsSeller": "विक्रेता के रूप में जारी रखें",
  "landing.closeHeadline1": "आपका हुनर इंतज़ार कर रहा है",
  "landing.closeHeadline2": "अपने",
  "landing.closeHeadline3": "ग्राहक का।",

  "login.welcomeBack": "वापसी पर स्वागत है",
  "login.subhead": "जारी रखने के लिए अपना नाम दर्ज करें — इस डेमो के लिए किसी पासवर्ड की आवश्यकता नहीं है।",
  "login.yourName": "आपका नाम",
  "login.namePlaceholder": "जैसे अंजलि सेन",
  "login.buyer": "खरीदार",
  "login.seller": "विक्रेता",
  "login.continueAs": "इस रूप में जारी रखें",

  "buyerHome.searchEyebrow": "दशकों के अनुभव वाले लोगों द्वारा चुना गया",
  "buyerHome.searchHeadline": "आज आप क्या खोजना चाहेंगे?",
  "buyerHome.searchPlaceholder": "जैसे \u201cपास में घर का बना खाना\u201d",
  "buyerHome.aiSearch": "एआई खोज",
  "buyerHome.aiSearchHint": "एआई सामान्य भाषा समझता है — जो परिणाम चाहिए उसे बताएं, कीवर्ड नहीं।",
  "buyerHome.trending": "ट्रेंडिंग",
  "buyerHome.browseByCategory": "श्रेणी के अनुसार ब्राउज़ करें",
  "buyerHome.featured": "विशेष रुप से प्रदर्शित",
  "buyerHome.servicesWorthBooking": "बुक करने लायक सेवाएं",
  "buyerHome.handmade": "हस्तनिर्मित, मशीन से नहीं",
  "buyerHome.madeSlowly": "हाथ से, धीरे-धीरे बनाया गया",
  "buyerHome.recommended": "आपके लिए अनुशंसित",
  "buyerHome.sellersYouMayLove": "विक्रेता जिन्हें आप पसंद कर सकते हैं",
  "buyerHome.nearbyOpportunities": "आस-पास के अवसर",
  "buyerHome.sponsored": "प्रायोजित",
  "buyerHome.featuredThisWeek": "इस सप्ताह के विशेष",

  "explore.services": "सेवाएं",
  "explore.products": "हस्तनिर्मित उत्पाद",
  "explore.fairDiscovery": "निष्पक्ष खोज",
  "explore.topRated": "सर्वोच्च रेटेड",
  "explore.fairDiscoveryHint":
    "नए और कम समीक्षा वाले विक्रेताओं को दिखने का एक निष्पक्ष मौका देता है, न कि केवल सबसे अधिक समीक्षा वाले को।",

  "currency.label": "मुद्रा",
  "language.label": "भाषा",
};

const ta: Dict = {
  "nav.home": "முகப்பு",
  "nav.exploreServices": "சேவைகள்",
  "nav.exploreProducts": "பொருட்கள்",
  "nav.favorites": "பிடித்தவை",
  "nav.cart": "கார்ட்",
  "nav.profile": "சுயவிவரம்",
  "nav.dashboard": "டாஷ்போர்டு",
  "nav.myProducts": "பொருட்கள்",
  "nav.myServices": "சேவைகள்",
  "nav.advertising": "விளம்பரம்",
  "nav.orders": "ஆர்டர்கள்",
  "nav.analytics": "பகுப்பாய்வு",
  "nav.aiAdvisor": "AI ஆலோசகர்",
  "nav.theirExpertise": "அவர்களின் நிபுணத்துவம்",
  "nav.teachAndShare": "கற்பியுங்கள் & பகிருங்கள்",
  "nav.signIn": "உள்நுழைக",
  "nav.startSelling": "விற்பனையைத் தொடங்குங்கள்",
  "nav.switchToSelling": "விற்பனைக்கு மாறவும்",
  "nav.switchToBuying": "வாங்குதலுக்கு மாறவும்",
  "nav.signOut": "வெளியேறு",

  "common.search": "தேடு",
  "common.continue": "தொடரவும்",
  "common.save": "சேமி",
  "common.cancel": "ரத்துசெய்",
  "common.loading": "ஏற்றுகிறது…",
  "common.viewAll": "அனைத்தையும் காண்க",
  "common.getStarted": "தொடங்குங்கள்",

  "landing.eyebrow": "திறமையின் அடிப்படையிலான வாழ்வாதார சந்தை",
  "landing.headline1": "ஒரு வாழ்நாள்",
  "landing.headline2": "திறமையை",
  "landing.headline3": "வருமானமாக்குங்கள்.",
  "landing.subhead":
    "சமையல். தோட்டக்கலை. டியூஷன். தலைமுறைகளாக கடத்தப்பட்ட கைவினை. SilverHands இந்தியா முழுவதும் உள்ள மூத்த குடிமக்கள் மற்றும் இல்லத்தரசிகள் ஏற்கனவே அறிந்ததற்காக அங்கீகாரம், நம்பிக்கை மற்றும் ஊதியம் பெற உதவுகிறது.",
  "landing.startEarning": "சம்பாதிக்கத் தொடங்குங்கள்",
  "landing.exploreSkills": "திறமைகளை ஆராயுங்கள்",
  "landing.categoriesHeadline": "ஒவ்வொரு திறமைக்கும் இங்கே ஒரு இடம் உண்டு.",
  "landing.entryQuestion": "இன்று நீங்கள் இங்கு வந்த காரணம் என்ன?",
  "landing.buyerCardTitle": "நம்பகமான உள்ளூர் நிபுணர்",
  "landing.sellerCardTitle": "எனது சொந்த வாடிக்கையாளர்கள்",
  "landing.continueAsBuyer": "வாங்குபவராகத் தொடரவும்",
  "landing.continueAsSeller": "விற்பனையாளராகத் தொடரவும்",
  "landing.closeHeadline1": "உங்கள் திறமை காத்திருக்கிறது",
  "landing.closeHeadline2": "அதன்",
  "landing.closeHeadline3": "வாடிக்கையாளருக்காக.",

  "login.welcomeBack": "மீண்டும் வருக",
  "login.subhead": "தொடர உங்கள் பெயரை உள்ளிடவும் — இந்த டெமோவிற்கு கடவுச்சொல் தேவையில்லை.",
  "login.yourName": "உங்கள் பெயர்",
  "login.namePlaceholder": "எ.கா. அஞ்சலி சென்",
  "login.buyer": "வாங்குபவர்",
  "login.seller": "விற்பனையாளர்",
  "login.continueAs": "இதுவாகத் தொடரவும்",

  "buyerHome.searchEyebrow": "பல தசாப்த அனுபவம் உள்ளவர்களால் தேர்ந்தெடுக்கப்பட்டது",
  "buyerHome.searchHeadline": "இன்று நீங்கள் என்ன தேட விரும்புகிறீர்கள்?",
  "buyerHome.searchPlaceholder": "எ.கா. \u201cஅருகில் வீட்டு உணவு\u201d",
  "buyerHome.aiSearch": "AI தேடல்",
  "buyerHome.aiSearchHint": "AI எளிய மொழியைப் புரிந்துகொள்கிறது — நீங்கள் விரும்பும் விளைவை விவரிக்கவும், முக்கிய வார்த்தையை அல்ல.",
  "buyerHome.trending": "பிரபலமானவை",
  "buyerHome.browseByCategory": "வகை வாரியாக உலாவவும்",
  "buyerHome.featured": "சிறப்பம்சம்",
  "buyerHome.servicesWorthBooking": "பதிவு செய்யத்தக்க சேவைகள்",
  "buyerHome.handmade": "கைவினை, இயந்திரத்தால் அல்ல",
  "buyerHome.madeSlowly": "கையால், மெதுவாகச் செய்யப்பட்டது",
  "buyerHome.recommended": "உங்களுக்கான பரிந்துரைகள்",
  "buyerHome.sellersYouMayLove": "நீங்கள் விரும்பக்கூடிய விற்பனையாளர்கள்",
  "buyerHome.nearbyOpportunities": "அருகிலுள்ள வாய்ப்புகள்",
  "buyerHome.sponsored": "விளம்பரம்",
  "buyerHome.featuredThisWeek": "இந்த வார சிறப்பம்சம்",

  "explore.services": "சேவைகள்",
  "explore.products": "கைவினைப் பொருட்கள்",
  "explore.fairDiscovery": "நியாயமான கண்டறிதல்",
  "explore.topRated": "அதிக மதிப்பீடு",
  "explore.fairDiscoveryHint":
    "அதிக மதிப்புரை உள்ளவர்களை மட்டும் அல்லாமல், புதிய மற்றும் குறைவான மதிப்புரை உள்ள விற்பனையாளர்களுக்கும் ஒரு நியாயமான வாய்ப்பு அளிக்கிறது.",

  "currency.label": "நாணயம்",
  "language.label": "மொழி",
};

const dictionaries: Record<LangCode, Dict> = { en, hi, ta };

const LANG_KEY = "silverhands.lang";

function loadLang(): LangCode {
  if (typeof window === "undefined") return "en";
  try {
    const raw = window.localStorage.getItem(LANG_KEY);
    return raw === "hi" || raw === "ta" ? raw : "en";
  } catch {
    return "en";
  }
}

let lang: LangCode = loadLang();
const listeners = new Set<() => void>();

export function setLang(next: LangCode) {
  lang = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(LANG_KEY, next);
    } catch {
      // ignore
    }
  }
  listeners.forEach((l) => l());
}

export function useLang(): LangCode {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => lang,
    () => "en",
  );
}

/** Translate a key in the current language, falling back to English, then
 * to the key itself if it's genuinely missing — never a blank string. */
export function useT() {
  const current = useLang();
  return (key: string): string => dictionaries[current][key] ?? en[key] ?? key;
}
