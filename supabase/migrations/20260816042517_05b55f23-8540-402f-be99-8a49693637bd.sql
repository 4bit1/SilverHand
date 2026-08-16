DROP POLICY IF EXISTS "Anyone with the link can end a session" ON public.meeting_sessions;
DROP POLICY IF EXISTS "Anyone with the link can read a session" ON public.meeting_sessions;
DROP POLICY IF EXISTS "Anyone with the link can start a session" ON public.meeting_sessions;

REVOKE ALL ON public.meeting_sessions FROM anon;
REVOKE ALL ON public.meeting_sessions FROM authenticated;
GRANT ALL ON public.meeting_sessions TO service_role;

ALTER TABLE public.meeting_sessions ENABLE ROW LEVEL SECURITY;