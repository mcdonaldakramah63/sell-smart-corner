
-- Remove any and all policies that reference conversation_participants recursively or are duplicates. 
-- We'll keep only the two correct security-definer-function-based policies for SELECT and INSERT as detailed below.

-- Drop ALL existing policies on conversation_participants to prevent conflicts or recursion
DROP POLICY IF EXISTS "Users can view participants in their conversations" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can read their own participation" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can add themselves as participants" ON public.conversation_participants;

-- (Re)Create the secure function to check user matches (already present but re-assert in case)
CREATE OR REPLACE FUNCTION public.is_current_user_participant(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT p_user_id = auth.uid();
$$;

-- Add only the two required non-recursive policies
CREATE POLICY "Users can read their own participation"
  ON public.conversation_participants
  FOR SELECT
  USING (public.is_current_user_participant(user_id));

CREATE POLICY "Users can add themselves as participants"
  ON public.conversation_participants
  FOR INSERT
  WITH CHECK (public.is_current_user_participant(user_id));

