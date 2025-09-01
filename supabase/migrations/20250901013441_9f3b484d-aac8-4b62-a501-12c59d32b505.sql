-- Create storage buckets for chat media
INSERT INTO storage.buckets (id, name, public) VALUES ('chat-media', 'chat-media', false);

-- Create policies for chat media access
CREATE POLICY "Users can upload their own chat media" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'chat-media' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view chat media they have access to" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'chat-media' AND (
    auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM conversation_participants cp
      WHERE cp.conversation_id::text = (storage.foldername(name))[2]
      AND cp.user_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can delete their own chat media" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'chat-media' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Add media fields to messages table
ALTER TABLE messages 
ADD COLUMN media_url TEXT,
ADD COLUMN media_type TEXT,
ADD COLUMN media_size INTEGER;