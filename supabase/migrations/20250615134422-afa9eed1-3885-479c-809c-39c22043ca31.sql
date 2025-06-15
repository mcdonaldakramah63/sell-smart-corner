
-- Step 1: Create a security-definer function (if not already defined)
CREATE OR REPLACE FUNCTION public.is_current_user_participant(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT p_user_id = auth.uid();
$$;

-- Step 2: Drop any existing policies that may cause recursion problems/are outdated
DROP POLICY IF EXISTS "Users can read their own participation" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can add themselves as participants" ON public.conversation_participants;

-- Step 3: Add SELECT policy using the security-definer function (no subquery on table itself)
CREATE POLICY "Users can read their own participation"
  ON public.conversation_participants
  FOR SELECT
  USING (public.is_current_user_participant(user_id));

-- Step 4: Add INSERT policy using the security-definer function
CREATE POLICY "Users can add themselves as participants"
  ON public.conversation_participants
  FOR INSERT
  WITH CHECK (public.is_current_user_participant(user_id));
