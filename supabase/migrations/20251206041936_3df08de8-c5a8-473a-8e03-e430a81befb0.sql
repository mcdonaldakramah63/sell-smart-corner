-- Change default status for products to 'approved' so new products are auto-approved
ALTER TABLE products ALTER COLUMN status SET DEFAULT 'approved';