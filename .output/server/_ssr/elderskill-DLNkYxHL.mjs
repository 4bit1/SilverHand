//#region node_modules/.nitro/vite/services/ssr/assets/elderskill-DLNkYxHL.js
function baseUrl() {
	return "http://localhost:8000";
}
/**
* Fetch a user's complete profile from ElderSkill by their user ID.
* Used by the callback handler after the user returns from ElderSkill.
*/
async function fetchProfileByUserId(userId) {
	try {
		const res = await fetch(`${baseUrl()}/api/auth/users/${userId}`);
		if (!res.ok) return null;
		return (await res.json())?.data ?? null;
	} catch (e) {
		console.error("ElderSkill profile fetch failed:", e);
		return null;
	}
}
//#endregion
export { fetchProfileByUserId as t };
