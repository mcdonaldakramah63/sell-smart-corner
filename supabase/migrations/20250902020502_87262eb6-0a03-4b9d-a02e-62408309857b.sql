-- Update chat-media bucket to be public for image display
UPDATE storage.buckets 
SET public = true 
WHERE id = 'chat-media';