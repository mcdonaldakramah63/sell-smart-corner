UPDATE products 
SET status = 'approved', rejection_reason = NULL, reviewed_at = NOW() 
WHERE status = 'rejected';