-- Add exam check to course module completions
ALTER TABLE course_modules
ADD automatic_completion_requires_exam BOOLEAN NOT NULL DEFAULT FALSE;
COMMENT ON COLUMN course_modules.automatic_completion_requires_exam IS 'If automatic completion is enabled, whether an exam is also required or not.';
-- Add exam minimum points treshold
ALTER TABLE exams
ADD COLUMN minimum_points_treshold INTEGER NOT NULL DEFAULT 0;
ALTER TABLE exams
ALTER COLUMN minimum_points_treshold DROP DEFAULT;
COMMENT ON COLUMN exams.minimum_points_treshold IS 'The minimum amount of points from the exam for student to pass it.';
-- Update course_exams table
ALTER TABLE course_exams
ADD created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ADD updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ADD deleted_at TIMESTAMP WITH TIME ZONE;
CREATE TRIGGER set_timestamp BEFORE
UPDATE ON course_exams FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
COMMENT ON COLUMN course_exams.created_at IS 'Timestamp when the record was created.';
COMMENT ON COLUMN course_exams.updated_at IS 'Timestamp when the record was last updated. The field is updated automatically by the set_timestamp trigger.';
COMMENT ON COLUMN course_exams.deleted_at IS 'Timestamp when the record was deleted. If null, the record is not deleted.';
