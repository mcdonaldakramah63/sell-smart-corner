
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/lib/types';

export const createOrFindConversation = async (
  product: Product,
  currentUserId: string
): Promise<string> => {
  console.log('=== CONVERSATION CREATION UTILITY ===');
  console.log('Product:', product);
  console.log('Current User ID:', currentUserId);
  console.log('Seller ID:', product.seller.id);

  // Step 1: Check if conversation already exists
  console.log('Step 1: Checking for existing conversations');
  const { data: existingConversations, error: searchError } = await supabase
    .from('conversations')
    .select('id')
    .eq('product_id', product.id);

  if (searchError) {
    console.error('Error searching conversations:', searchError);
    throw new Error(`Failed to search conversations: ${searchError.message}`);
  }

  console.log('Found conversations for product:', existingConversations);

  // Step 2: Check if user is already in any of these conversations
  if (existingConversations && existingConversations.length > 0) {
    console.log('Step 2: Checking existing participants');
    
    for (const conv of existingConversations) {
      const { data: participants, error: participantsError } = await supabase
        .from('conversation_participants')
        .select('user_id')
        .eq('conversation_id', conv.id);

      if (participantsError) {
        console.error('Error fetching participants:', participantsError);
        continue;
      }

      console.log(`Participants for conversation ${conv.id}:`, participants);
      
      const participantIds = participants?.map(p => p.user_id) || [];
      
      if (participantIds.includes(currentUserId) && participantIds.includes(product.seller.id)) {
        console.log('Found existing conversation:', conv.id);
        return conv.id;
      }
    }
  }

  // Step 3: Create new conversation
  console.log('Step 3: Creating new conversation');
  const { data: newConversation, error: conversationError } = await supabase
    .from('conversations')
    .insert({
      product_id: product.id
    })
    .select('id')
    .single();

  if (conversationError) {
    console.error('Error creating conversation:', conversationError);
    throw new Error(`Failed to create conversation: ${conversationError.message}`);
  }

  console.log('New conversation created:', newConversation);

  // Step 4: Add participants
  console.log('Step 4: Adding participants');
  const participantsToAdd = [
    { conversation_id: newConversation.id, user_id: currentUserId },
    { conversation_id: newConversation.id, user_id: product.seller.id }
  ];
  
  console.log('Adding participants:', participantsToAdd);
  
  const { error: participantsError } = await supabase
    .from('conversation_participants')
    .insert(participantsToAdd);

  if (participantsError) {
    console.error('Error adding participants:', participantsError);
    throw new Error(`Failed to add participants: ${participantsError.message}`);
  }

  console.log('Participants added successfully');
  console.log('Conversation created with ID:', newConversation.id);
  
  return newConversation.id;
};
