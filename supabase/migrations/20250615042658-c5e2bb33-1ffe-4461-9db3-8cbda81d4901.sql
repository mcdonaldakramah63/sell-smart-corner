
-- First, just enable RLS on all the tables (this is safe to run even if already enabled)
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Only create policies that don't exist yet - starting with essential ones

-- Conversations policies (if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'conversations' AND policyname = 'Users can view their conversations') THEN
        CREATE POLICY "Users can view their conversations" 
        ON public.conversations 
        FOR SELECT 
        USING (
          EXISTS (
            SELECT 1 FROM public.conversation_participants cp 
            WHERE cp.conversation_id = conversations.id 
            AND cp.user_id = auth.uid()
          )
        );
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'conversations' AND policyname = 'Authenticated users can create conversations') THEN
        CREATE POLICY "Authenticated users can create conversations" 
        ON public.conversations 
        FOR INSERT 
        TO authenticated
        WITH CHECK (true);
    END IF;
END $$;

-- Messages policies (if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'messages' AND policyname = 'Users can view messages in their conversations') THEN
        CREATE POLICY "Users can view messages in their conversations" 
        ON public.messages 
        FOR SELECT 
        USING (
          EXISTS (
            SELECT 1 FROM public.conversation_participants cp 
            WHERE cp.conversation_id = messages.conversation_id 
            AND cp.user_id = auth.uid()
          )
        );
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'messages' AND policyname = 'Users can send messages in their conversations') THEN
        CREATE POLICY "Users can send messages in their conversations" 
        ON public.messages 
        FOR INSERT 
        WITH CHECK (
          sender_id = auth.uid() AND
          EXISTS (
            SELECT 1 FROM public.conversation_participants cp 
            WHERE cp.conversation_id = messages.conversation_id 
            AND cp.user_id = auth.uid()
          )
        );
    END IF;
END $$;

-- Notifications policies (if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Users can view their own notifications') THEN
        CREATE POLICY "Users can view their own notifications" 
        ON public.notifications 
        FOR SELECT 
        USING (user_id = auth.uid());
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Users can update their own notifications') THEN
        CREATE POLICY "Users can update their own notifications" 
        ON public.notifications 
        FOR UPDATE 
        USING (user_id = auth.uid());
    END IF;
END $$;

-- Products policies (if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Anyone can view products') THEN
        CREATE POLICY "Anyone can view products" 
        ON public.products 
        FOR SELECT 
        TO public
        USING (true);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Authenticated users can create products') THEN
        CREATE POLICY "Authenticated users can create products" 
        ON public.products 
        FOR INSERT 
        TO authenticated
        WITH CHECK (user_id = auth.uid());
    END IF;
END $$;
