ALTER TABLE peer_review_configs
ADD COLUMN manual_review_cutoff_in_days INTEGER NOT NULL DEFAULT 21;
COMMENT ON COLUMN peer_review_configs.manual_review_cutoff_in_days IS 'Number of days that needs to pass for the exercise submission to move to manual review';
-- Set value to all existing tables
UPDATE peer_review_configs
SET manual_review_cutoff_in_days = 21
WHERE manual_review_cutoff_in_days IS NULL;
