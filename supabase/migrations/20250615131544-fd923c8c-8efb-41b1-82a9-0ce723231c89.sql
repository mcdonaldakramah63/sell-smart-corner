
-- Drop all existing policies on conversation_participants
DROP POLICY IF EXISTS "Users can read their own participation" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can add themselves as participants" ON public.conversation_participants;

-- Enable SELECT for own participation
CREATE POLICY "Users can read their own participation" 
  ON public.conversation_participants
  FOR SELECT 
  USING (user_id = auth.uid());

-- Enable INSERT: Only allow users to add themselves
CREATE POLICY "Users can add themselves as participants" 
  ON public.conversation_participants
  FOR INSERT
  WITH CHECK (user_id = auth.uid());
