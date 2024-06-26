-- Add copied_from to course subtables.
ALTER TABLE chapters
ADD COLUMN copied_from UUID REFERENCES chapters(id);
COMMENT ON COLUMN chapters.copied_from IS 'The original chapter record of a copy.';
ALTER TABLE pages
ADD COLUMN copied_from UUID REFERENCES pages(id);
COMMENT ON COLUMN pages.copied_from IS 'The original page record of a copy.';
ALTER TABLE exercises
ADD COLUMN copied_from UUID REFERENCES exercises(id);
COMMENT ON COLUMN exercises.copied_from IS 'The original exercises record of a copy.';
COMMENT ON COLUMN exercises.chapter_id IS '(Redundant) Chapter in which the exercise belongs to.';
ALTER TABLE exercise_tasks
ADD COLUMN copied_from UUID REFERENCES exercise_tasks(id);
COMMENT ON COLUMN exercise_tasks.copied_from IS 'The original exercise_tasks record of a copy.';
-- Add new columns to course table
ALTER TABLE courses
ADD COLUMN language_code VARCHAR(15) CHECK (
    language_code ~ '^[a-z]{2,3}(-[A-Z][a-z]{3})?-[A-Z]{2}$'
  ),
  ADD COLUMN copied_from UUID REFERENCES courses(id),
  ADD COLUMN language_version_of_course_id UUID REFERENCES courses(id);
UPDATE courses
SET language_code = 'en-US'
WHERE language_code IS NULL;
ALTER TABLE courses
ALTER COLUMN language_code
SET NOT NULL;
COMMENT ON COLUMN courses.language_code IS 'IETF language code identifier for the course';
COMMENT ON COLUMN courses.copied_from IS 'The original course that this course is a copy of. If null, this is the original course.';
COMMENT ON COLUMN courses.language_version_of_course_id IS 'The original course, if this course is based on a translation.';
