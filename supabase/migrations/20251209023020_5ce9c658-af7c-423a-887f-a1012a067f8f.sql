-- Create table for call signaling
CREATE TABLE public.call_signals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  caller_id UUID NOT NULL,
  callee_id UUID NOT NULL,
  call_type TEXT NOT NULL CHECK (call_type IN ('voice', 'video')),
  signal_type TEXT NOT NULL CHECK (signal_type IN ('offer', 'answer', 'ice-candidate', 'end')),
  signal_data JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'ended')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.call_signals ENABLE ROW LEVEL SECURITY;

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE call_signals;

-- RLS policies - participants can view signals for their calls
CREATE POLICY "Users can view their call signals"
ON public.call_signals
FOR SELECT
USING (auth.uid() = caller_id OR auth.uid() = callee_id);

-- Users can create signals for their calls
CREATE POLICY "Users can create call signals"
ON public.call_signals
FOR INSERT
WITH CHECK (auth.uid() = caller_id);

-- Users can update their call signals
CREATE POLICY "Users can update their call signals"
ON public.call_signals
FOR UPDATE
USING (auth.uid() = caller_id OR auth.uid() = callee_id);

-- Users can delete their call signals
CREATE POLICY "Users can delete their call signals"
ON public.call_signals
FOR DELETE
USING (auth.uid() = caller_id OR auth.uid() = callee_id);