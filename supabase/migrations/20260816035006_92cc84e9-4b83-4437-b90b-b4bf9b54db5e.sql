CREATE TABLE public.meeting_sessions (
  id text PRIMARY KEY,
  purpose text NOT NULL DEFAULT '',
  host_name text NOT NULL DEFAULT 'Host',
  guest_name text NOT NULL DEFAULT 'Guest',
  started_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz NOT NULL DEFAULT now() + interval '30 minutes',
  status text NOT NULL DEFAULT 'ACTIVE',
  ended_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.meeting_sessions TO anon;
GRANT SELECT, INSERT, UPDATE ON public.meeting_sessions TO authenticated;
GRANT ALL ON public.meeting_sessions TO service_role;

ALTER TABLE public.meeting_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone with the link can read a session"
  ON public.meeting_sessions FOR SELECT USING (true);

CREATE POLICY "Anyone with the link can start a session"
  ON public.meeting_sessions FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone with the link can end a session"
  ON public.meeting_sessions FOR UPDATE USING (true) WITH CHECK (true);