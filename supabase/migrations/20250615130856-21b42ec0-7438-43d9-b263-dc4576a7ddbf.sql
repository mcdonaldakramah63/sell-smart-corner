
-- Enable SELECT for own participation records (conversations they're a part of)
CREATE POLICY "Users can read their own participation" 
  ON public.conversation_participants
  FOR SELECT 
  USING (user_id = auth.uid());

-- Enable INSERT: Only allow inserting rows for themselves, for conversations they are part of or will be part of
CREATE POLICY "Users can add themselves as participants" 
  ON public.conversation_participants
  FOR INSERT
  WITH CHECK (user_id = auth.uid());
