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

  // Step 1: Call the RPC to find an existing conversation between the two users for this product
  console.log('Step 1: Calling RPC to find existing conversation...');
  // Fixed type argument: now passes both the return type and the argument type as Solved <string, string | null>
  const { data: existingConversationId, error: rpcError } = await supabase
    .rpc<string, string | null>('find_conversation_for_product', {
      product_uuid: product.id,
      user_one: currentUserId,
      user_two: product.seller.id,
    });

  if (rpcError) {
    console.error('Error searching for conversation using RPC:', rpcError);
    throw new Error(`Failed to search conversations: ${rpcError.message}`);
  }

  if (existingConversationId && typeof existingConversationId === 'string') {
    console.log('Found existing conversation:', existingConversationId);
    return existingConversationId;
  }

  // Step 2: Create new conversation
  console.log('Step 2: Creating new conversation...');
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

  // Step 3: Add participants
  console.log('Step 3: Adding participants...');
  const participantsToAdd = [
    { conversation_id: newConversation.id, user_id: currentUserId },
    { conversation_id: newConversation.id, user_id: product.seller.id }
  ];

  const { error: participantsError } = await supabase
    .from('conversation_participants')
    .insert(participantsToAdd);

  if (participantsError) {
    console.error('Error adding participants:', participantsError);
    throw new Error(`Failed to add participants: ${participantsError.message}`);
  }

  console.log('Conversation created with ID:', newConversation.id);
  return newConversation.id;
};
