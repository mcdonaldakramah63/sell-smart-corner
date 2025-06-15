
-- Step 1: Create a security definer function to check participant matches
CREATE OR REPLACE FUNCTION public.is_current_user_participant(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT p_user_id = auth.uid();
$$;

-- Step 2: Drop current policies
DROP POLICY IF EXISTS "Users can read their own participation" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can add themselves as participants" ON public.conversation_participants;

-- Step 3: Add new policies using the function
CREATE POLICY "Users can read their own participation"
  ON public.conversation_participants
  FOR SELECT
  USING (public.is_current_user_participant(user_id));

CREATE POLICY "Users can add themselves as participants"
  ON public.conversation_participants
  FOR INSERT
  WITH CHECK (public.is_current_user_participant(user_id));
