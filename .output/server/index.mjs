globalThis.__nitro_main__ = import.meta.url;
import { n as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-08-16T14:21:17.469Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-08-16T14:21:17.469Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/assets/AppShell-xygxTfir.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a68-plfeEkixrzFSeb3uRqzpkUJvPpU\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 10856,
		"path": "../public/assets/AppShell-xygxTfir.js"
	},
	"/assets/Cards-DuI_Z8vK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1407-Wcvj6LJIs8K3Lk+ST4gbbuTzPsQ\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 5127,
		"path": "../public/assets/Cards-DuI_Z8vK.js"
	},
	"/assets/Stars-BD8c9Eeu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"24e-2y434URVeJc6HtruZ8/Fdoerpzw\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 590,
		"path": "../public/assets/Stars-BD8c9Eeu.js"
	},
	"/assets/arrow-right-D9dIjaq0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a5-yM1NPdm2VNUeU6YVaLlK1G74khg\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 165,
		"path": "../public/assets/arrow-right-D9dIjaq0.js"
	},
	"/assets/briefcase-B5_tcoGk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dc-Y2Y3mAwE97W+YXP0fadJY7Xe4Xw\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 220,
		"path": "../public/assets/briefcase-B5_tcoGk.js"
	},
	"/assets/button-Drqhm8sv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7d8e-t969Q1/ECanNIRyn4J73aV8z1T4\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 32142,
		"path": "../public/assets/button-Drqhm8sv.js"
	},
	"/assets/buyer-BQJ57z0I.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"142-Qy1btOXoaPLcs3CBFxPaenEN2wo\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 322,
		"path": "../public/assets/buyer-BQJ57z0I.js"
	},
	"/assets/buyer.favorites-C_MQQQiT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"465-yiH5f91mmlf9+h1Cmhv4VpmvTas\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 1125,
		"path": "../public/assets/buyer.favorites-C_MQQQiT.js"
	},
	"/assets/buyer.index-DxvhOVPs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1360-hbrX6TgmHBq2VszF7kqmm3xgRqo\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 4960,
		"path": "../public/assets/buyer.index-DxvhOVPs.js"
	},
	"/assets/buyer.messages-jZQyLq_C.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8fa-opba42FBkUWV8C1vcl/rBlc3elQ\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 2298,
		"path": "../public/assets/buyer.messages-jZQyLq_C.js"
	},
	"/assets/buyer.product._id-DbKMMTEe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d03-08QMij8shkEODVrr+R+8tUJgUX0\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 3331,
		"path": "../public/assets/buyer.product._id-DbKMMTEe.js"
	},
	"/assets/buyer.products-CMpGXb-x.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cdd-5UxnZGtsMkarRfpkik0lk65nKJE\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 3293,
		"path": "../public/assets/buyer.products-CMpGXb-x.js"
	},
	"/assets/buyer.profile-HELGZ4nd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"489-wwp+4ireAp65di9OriGmZ16maBs\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 1161,
		"path": "../public/assets/buyer.profile-HELGZ4nd.js"
	},
	"/assets/buyer.service._id-C7i2VdO4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12fa-coIyBpEjSbWttNuaTHoJeq+tJk8\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 4858,
		"path": "../public/assets/buyer.service._id-C7i2VdO4.js"
	},
	"/assets/buyer.services-CHHtGNRr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8e6-9G2hED74jc8+ZZcd8LPGKeHg5rM\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 2278,
		"path": "../public/assets/buyer.services-CHHtGNRr.js"
	},
	"/assets/camera-BFX8ak5t.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"150-jnnGn7L6WZzU4RMYEAaksbl0/dQ\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 336,
		"path": "../public/assets/camera-BFX8ak5t.js"
	},
	"/assets/cat-food-DuaI1O36.jpg": {
		"type": "image/jpeg",
		"etag": "\"10ddb-0b0CU+GqzH4vnYI/Bu7tZMUo1lw\"",
		"mtime": "2026-08-16T14:21:16.707Z",
		"size": 69083,
		"path": "../public/assets/cat-food-DuaI1O36.jpg"
	},
	"/assets/cat-craft-gjxzFmLO.jpg": {
		"type": "image/jpeg",
		"etag": "\"178ab-Amh0zd2N3ZBcjw2KIzwQW40x328\"",
		"mtime": "2026-08-16T14:21:16.707Z",
		"size": 96427,
		"path": "../public/assets/cat-craft-gjxzFmLO.jpg"
	},
	"/assets/cat-tailoring-Clk9OvhF.jpg": {
		"type": "image/jpeg",
		"etag": "\"95cf-LTGJ3lHc1jiv5hfErLxAsC/J+Xc\"",
		"mtime": "2026-08-16T14:21:16.708Z",
		"size": 38351,
		"path": "../public/assets/cat-tailoring-Clk9OvhF.jpg"
	},
	"/assets/cat-garden-CVkno_9-.jpg": {
		"type": "image/jpeg",
		"etag": "\"cf55-zEjOXXfbcyXZaxDFKuCvJMpfzNQ\"",
		"mtime": "2026-08-16T14:21:16.708Z",
		"size": 53077,
		"path": "../public/assets/cat-garden-CVkno_9-.jpg"
	},
	"/assets/cat-music-CDaO13lR.jpg": {
		"type": "image/jpeg",
		"etag": "\"be91-SLx2nnw/0WBNkWVZ8UB04VoT06k\"",
		"mtime": "2026-08-16T14:21:16.708Z",
		"size": 48785,
		"path": "../public/assets/cat-music-CDaO13lR.jpg"
	},
	"/assets/check-36OnHiEM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7c-hapva/WwzvTwZU6QqEoeORO0Jac\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 124,
		"path": "../public/assets/check-36OnHiEM.js"
	},
	"/assets/cat-tutoring-Dbr_nEAn.jpg": {
		"type": "image/jpeg",
		"etag": "\"99b8-fAfnfF+rK4rcz5At/oQYQBc5VNM\"",
		"mtime": "2026-08-16T14:21:16.708Z",
		"size": 39352,
		"path": "../public/assets/cat-tutoring-Dbr_nEAn.jpg"
	},
	"/assets/createLucideIcon-CLdWFMku.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4ab-rMBxsqcPKrcnF/JzamLtMRV6aPw\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 1195,
		"path": "../public/assets/createLucideIcon-CLdWFMku.js"
	},
	"/assets/elderskill-G5PWG8WG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f5-EcJJ5zm1b+OJ07WzsQsE5qj0M3Y\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 245,
		"path": "../public/assets/elderskill-G5PWG8WG.js"
	},
	"/assets/heart-BFO9Yoo3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"102-FMVFjvcsNjSTe7VsOnr40L1NbQY\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 258,
		"path": "../public/assets/heart-BFO9Yoo3.js"
	},
	"/assets/elder.callback-CCDh-s4H.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"704-UWRAdTkZf5NMhBi44P+ay//pQ24\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 1796,
		"path": "../public/assets/elder.callback-CCDh-s4H.js"
	},
	"/assets/image-plus-DR9qwBjL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"16b-HDGdsIbnAY/8XI5ylpXSArJ1yrM\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 363,
		"path": "../public/assets/image-plus-DR9qwBjL.js"
	},
	"/assets/jsx-runtime-B-hcVAMW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"216d-pcqlp1Bv4Kt7yFmWJlJC8xMXx/k\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 8557,
		"path": "../public/assets/jsx-runtime-B-hcVAMW.js"
	},
	"/assets/hero-BnJgWzhm.jpg": {
		"type": "image/jpeg",
		"etag": "\"2a8ee-1Ne4z14CzHz2Tp2lhBDz52DUeJk\"",
		"mtime": "2026-08-16T14:21:16.708Z",
		"size": 174318,
		"path": "../public/assets/hero-BnJgWzhm.jpg"
	},
	"/assets/label-BkTH4zci.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6b7-2HryMCn9HcDFzR0ioyoey1JKhvM\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 1719,
		"path": "../public/assets/label-BkTH4zci.js"
	},
	"/assets/link-D6-BY3Jx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4620-gZOwFeHrhPl77/AsScR4eMGfOfw\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 17952,
		"path": "../public/assets/link-D6-BY3Jx.js"
	},
	"/assets/map-pin-BupMBcH4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"103-Na+3MLwyM6Ov5Ec+7cD9c9DTz6o\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 259,
		"path": "../public/assets/map-pin-BupMBcH4.js"
	},
	"/assets/login-DWScRuuA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a0d-lRvfIJEdidfCwqNb5PGnqVz2T3g\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 2573,
		"path": "../public/assets/login-DWScRuuA.js"
	},
	"/assets/matchContext-DyXrH4xk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8e-YhWGcXqMNvQOQvgCVZpGcwhQ5/4\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 142,
		"path": "../public/assets/matchContext-DyXrH4xk.js"
	},
	"/assets/not-found-i5RsCZif.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"76-Trmr7GZIBZuvfg4uM18tBiRtOXg\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 118,
		"path": "../public/assets/not-found-i5RsCZif.js"
	},
	"/assets/react-dom-sF8Euvcq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dde-aqKHuf81fP3cShclx8Jw44pWPro\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 3550,
		"path": "../public/assets/react-dom-sF8Euvcq.js"
	},
	"/assets/index-CUCpyf8U.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5aeca-Agwbz18di3kkh7qssRgviplVoD0\"",
		"mtime": "2026-08-16T14:21:16.705Z",
		"size": 372426,
		"path": "../public/assets/index-CUCpyf8U.js"
	},
	"/assets/redirect-1Dss4sOM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"216-AhfiXwQqYdLrM+uQAOtPHfIddmI\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 534,
		"path": "../public/assets/redirect-1Dss4sOM.js"
	},
	"/assets/refresh-ccw-pr9apZcm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"141-yxGfe0+UmvEULOqwxotylOxMB+M\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 321,
		"path": "../public/assets/refresh-ccw-pr9apZcm.js"
	},
	"/assets/routes-6D9b3Q70.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4da3-Y4wrVCmyBlj059wZgwkcJr5jTdE\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 19875,
		"path": "../public/assets/routes-6D9b3Q70.js"
	},
	"/assets/search-BtJsgOj6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ae-XB1j66io3rmBfdcdDs6Q8edRKds\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 174,
		"path": "../public/assets/search-BtJsgOj6.js"
	},
	"/assets/seller-Be4GrL_2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1bf-G7CE0QAP6Rx05RsEiZw2UEygAzo\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 447,
		"path": "../public/assets/seller-Be4GrL_2.js"
	},
	"/assets/seller.ai-advisor-BWDvlufv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"29bc-brqga9jeO6AWQMqcq+SU7TzgO5Y\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 10684,
		"path": "../public/assets/seller.ai-advisor-BWDvlufv.js"
	},
	"/assets/seller.index-bonWKXwk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1cf1-S1iJVO2+O16H1Ur0CPgKga9wrUI\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 7409,
		"path": "../public/assets/seller.index-bonWKXwk.js"
	},
	"/assets/seller.interview-DxCppoyy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1dc-TzSCCEZdr/gsaNkSafRbpnqW0cw\"",
		"mtime": "2026-08-16T14:21:16.707Z",
		"size": 476,
		"path": "../public/assets/seller.interview-DxCppoyy.js"
	},
	"/assets/seller.analytics-BhkKisWq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5ce40-BimaWaM28OkUE/FrVDpQsIFAZ8A\"",
		"mtime": "2026-08-16T14:21:16.706Z",
		"size": 380480,
		"path": "../public/assets/seller.analytics-BhkKisWq.js"
	},
	"/assets/seller.messages-Cs3ToMGH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7b6-PidsdFangmfmW455KM/fMp9pcQQ\"",
		"mtime": "2026-08-16T14:21:16.707Z",
		"size": 1974,
		"path": "../public/assets/seller.messages-Cs3ToMGH.js"
	},
	"/assets/seller.onboarding-CVII_EvK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1383-nb2WbgssCI6Fa7f7yEfhoqRiwoc\"",
		"mtime": "2026-08-16T14:21:16.707Z",
		"size": 4995,
		"path": "../public/assets/seller.onboarding-CVII_EvK.js"
	},
	"/assets/seller.orders-BYZJbSWH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"75e-EowSz5DkupPhFigmZ+k1vwDs8e8\"",
		"mtime": "2026-08-16T14:21:16.707Z",
		"size": 1886,
		"path": "../public/assets/seller.orders-BYZJbSWH.js"
	},
	"/assets/seller.products-DoIzy50N.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dad-PqYOErX8z3EvB51n1BlAermiRS8\"",
		"mtime": "2026-08-16T14:21:16.707Z",
		"size": 3501,
		"path": "../public/assets/seller.products-DoIzy50N.js"
	},
	"/assets/seller.profile-CAWmD1c1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1627-aYXuQ2VzlYE+vWgTkDUqR4D8O1k\"",
		"mtime": "2026-08-16T14:21:16.707Z",
		"size": 5671,
		"path": "../public/assets/seller.profile-CAWmD1c1.js"
	},
	"/assets/seller.services-DIkb5GL5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b85-1lHZ3IcnfgunsBkj/j1g7bc4358\"",
		"mtime": "2026-08-16T14:21:16.707Z",
		"size": 2949,
		"path": "../public/assets/seller.services-DIkb5GL5.js"
	},
	"/assets/shopping-bag-DalPP2Dd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"154-34jDhx4G6+zv5kDPr2txHLlEWVk\"",
		"mtime": "2026-08-16T14:21:16.707Z",
		"size": 340,
		"path": "../public/assets/shopping-bag-DalPP2Dd.js"
	},
	"/assets/sparkles-DZ5Pl1vD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ee-iq5/zvIByGNJzwVVOKaFoa+gD8s\"",
		"mtime": "2026-08-16T14:21:16.707Z",
		"size": 494,
		"path": "../public/assets/sparkles-DZ5Pl1vD.js"
	},
	"/assets/store-D2OzTm3p.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5e7-6BreZWv42hzsqCdKOsfIweyi2lU\"",
		"mtime": "2026-08-16T14:21:16.707Z",
		"size": 1511,
		"path": "../public/assets/store-D2OzTm3p.js"
	},
	"/assets/textarea-B6bw0R5f.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"208-PHZkOKYzWXsUrSiChT67SFSkMsY\"",
		"mtime": "2026-08-16T14:21:16.707Z",
		"size": 520,
		"path": "../public/assets/textarea-B6bw0R5f.js"
	},
	"/assets/star-uDEKZL9z.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d8-mPWg1wRYGouAhcCmrvdFQA6hVk4\"",
		"mtime": "2026-08-16T14:21:16.707Z",
		"size": 472,
		"path": "../public/assets/star-uDEKZL9z.js"
	},
	"/assets/trending-up-BmQymeAx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"25e-xANLi3qsVmVO3ZiApmF8kUpD0po\"",
		"mtime": "2026-08-16T14:21:16.707Z",
		"size": 606,
		"path": "../public/assets/trending-up-BmQymeAx.js"
	},
	"/assets/useRouter-BGpAXxmD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"97-+ISDMDd0jCDVZNcQqLKhSYvsP+8\"",
		"mtime": "2026-08-16T14:21:16.707Z",
		"size": 151,
		"path": "../public/assets/useRouter-BGpAXxmD.js"
	},
	"/assets/styles-CL2eWznk.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"16854-+2Y8SZgnVAhn0Nq2oCj0X0ab6Go\"",
		"mtime": "2026-08-16T14:21:16.708Z",
		"size": 92244,
		"path": "../public/assets/styles-CL2eWznk.css"
	},
	"/assets/useStore-UNz3pZR2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1560-rcjNGqNuaGg7J+tihFDqPZh5QIY\"",
		"mtime": "2026-08-16T14:21:16.707Z",
		"size": 5472,
		"path": "../public/assets/useStore-UNz3pZR2.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_8_4q6l = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_8_4q6l
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
