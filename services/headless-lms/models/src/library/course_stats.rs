use crate::library::TimeGranularity;
use crate::{prelude::*, roles::UserRole};
use std::collections::HashMap;

/// A generic result representing a count metric over a time period.
/// When the time period is not applicable (for overall totals), `period` will be `None`.
#[derive(Debug, Serialize, Deserialize, PartialEq, Clone)]
#[cfg_attr(feature = "ts_rs", derive(TS))]
pub struct CountResult {
    /// The start of the time period (e.g., day, week, month) associated with this count.
    /// For overall totals, this will be `None`.
    pub period: Option<DateTime<Utc>>,
    /// The count (for example, the number of users).
    pub count: i64,
}

/// A generic result representing an average metric over a time period.
/// The average value (e.g. average time in seconds) may be absent if no data is available.
#[derive(Debug, Serialize, Deserialize, PartialEq, Clone)]
#[cfg_attr(feature = "ts_rs", derive(TS))]
pub struct AverageMetric {
    /// The start of the time period (e.g., day, week, month) associated with this metric.
    pub period: Option<DateTime<Utc>>,
    /// The average value. For example, the average time (in seconds) from course start to first submission.
    pub average: Option<f64>,
}

/// Represents cohort activity metrics for both weekly and daily cohorts.
/// For daily cohorts, `offset` will be populated (and `activity_period` may be computed from it);
/// for weekly cohorts, `offset` will be `None` and `activity_period` indicates the week start.
#[derive(Debug, Serialize, Deserialize, PartialEq, Clone)]
#[cfg_attr(feature = "ts_rs", derive(TS))]
pub struct CohortActivity {
    /// The start date of the cohort (either day or week).
    pub cohort_start: Option<DateTime<Utc>>,
    /// The activity period (for example, the start of the week or the computed activity day).
    pub activity_period: Option<DateTime<Utc>>,
    /// The day offset from the cohort start (only applicable for daily cohorts).
    pub offset: Option<i32>,
    /// The number of active users in this cohort for the given period.
    pub active_users: i64,
}

/// Gets user IDs to exclude from course statistics for a single course.
/// Excludes users with any role other than MaterialViewer in the course, its organization, or globally.
async fn get_user_ids_to_exclude_from_course_stats(
    conn: &mut PgConnection,
    course_id: Uuid,
) -> ModelResult<Vec<Uuid>> {
    let roles = crate::roles::get_course_related_roles(conn, course_id).await?;
    let user_ids: Vec<_> = roles
        .iter()
        .filter(|role| role.role != UserRole::MaterialViewer)
        .map(|role| role.user_id)
        .collect::<std::collections::HashSet<_>>()
        .into_iter()
        .collect();
    Ok(user_ids)
}

/// Gets user IDs to exclude from course language group statistics.
/// Uses a single query to get all roles and filters out MaterialViewer roles.
async fn get_user_ids_to_exclude_from_course_language_group_stats(
    conn: &mut PgConnection,
    course_language_group_id: Uuid,
) -> ModelResult<Vec<Uuid>> {
    let roles =
        crate::roles::get_course_language_group_related_roles(conn, course_language_group_id)
            .await?;
    let user_ids: Vec<_> = roles
        .iter()
        .filter(|role| role.role != UserRole::MaterialViewer)
        .map(|role| role.user_id)
        .collect::<std::collections::HashSet<_>>()
        .into_iter()
        .collect();
    Ok(user_ids)
}

/// Total unique users in the course settings table.
pub async fn get_total_users_started_course(
    conn: &mut PgConnection,
    course_id: Uuid,
) -> ModelResult<CountResult> {
    let exclude_user_ids = get_user_ids_to_exclude_from_course_stats(conn, course_id).await?;
    let res = sqlx::query_as!(
        CountResult,
        r#"
SELECT NULL::timestamptz AS "period",
       COUNT(DISTINCT user_id) AS "count!"
FROM user_course_settings
WHERE current_course_id = $1
  AND deleted_at IS NULL
  AND user_id != ALL($2);
        "#,
        course_id,
        &exclude_user_ids
    )
    .fetch_one(conn)
    .await?;
    Ok(res)
}

/// Total unique users who have completed the course.
pub async fn get_total_users_completed_course(
    conn: &mut PgConnection,
    course_id: Uuid,
) -> ModelResult<CountResult> {
    let exclude_user_ids = get_user_ids_to_exclude_from_course_stats(conn, course_id).await?;
    let res = sqlx::query_as!(
        CountResult,
        r#"
SELECT NULL::timestamptz AS "period",
       COUNT(DISTINCT user_id) AS "count!"
FROM course_module_completions
WHERE course_id = $1
  AND deleted_at IS NULL
  AND user_id != ALL($2);
        "#,
        course_id,
        &exclude_user_ids
    )
    .fetch_one(conn)
    .await?;
    Ok(res)
}

/// Total unique users who have returned at least one exercise.
pub async fn get_total_users_returned_at_least_one_exercise(
    conn: &mut PgConnection,
    course_id: Uuid,
) -> ModelResult<CountResult> {
    let exclude_user_ids = get_user_ids_to_exclude_from_course_stats(conn, course_id).await?;
    let res = sqlx::query_as!(
        CountResult,
        r#"
SELECT NULL::timestamptz AS "period",
  COUNT(DISTINCT user_id) AS "count!"
FROM exercise_slide_submissions
WHERE course_id = $1
  AND deleted_at IS NULL
  AND user_id != ALL($2);
      "#,
        course_id,
        &exclude_user_ids
    )
    .fetch_one(conn)
    .await?;
    Ok(res)
}

/// Total unique users who have completed the course in all language versions
pub async fn get_total_users_completed_all_language_versions_of_a_course(
    conn: &mut PgConnection,
    course_language_group_id: Uuid,
) -> ModelResult<CountResult> {
    let exclude_user_ids =
        get_user_ids_to_exclude_from_course_language_group_stats(conn, course_language_group_id)
            .await?;

    let res = sqlx::query_as!(
        CountResult,
        r#"
SELECT NULL::timestamptz AS "period",
  COUNT(DISTINCT user_id) AS "count!"
FROM course_module_completions
WHERE course_id IN (
    SELECT id
    FROM courses
    WHERE course_language_group_id = $1
      AND deleted_at IS NULL
  )
  AND deleted_at IS NULL
  AND user_id != ALL($2);
    "#,
        course_language_group_id,
        &exclude_user_ids
    )
    .fetch_one(conn)
    .await?;
    Ok(res)
}

/// Total unique users who have started the course in all language versions
pub async fn get_total_users_started_all_language_versions_of_a_course(
    conn: &mut PgConnection,
    course_language_group_id: Uuid,
) -> ModelResult<CountResult> {
    let exclude_user_ids =
        get_user_ids_to_exclude_from_course_language_group_stats(conn, course_language_group_id)
            .await?;

    let res = sqlx::query_as!(
        CountResult,
        r#"
SELECT NULL::timestamptz AS "period",
  COUNT(DISTINCT user_id) AS "count!"
FROM user_course_settings
WHERE current_course_id IN (
    SELECT id
    FROM courses
    WHERE course_language_group_id = $1
      AND deleted_at IS NULL
  )
  AND deleted_at IS NULL
  AND user_id != ALL($2);
    "#,
        course_language_group_id,
        &exclude_user_ids
    )
    .fetch_one(conn)
    .await?;
    Ok(res)
}

/// Get unique users starting counts with specified time granularity.
///
/// The time_window parameter controls how far back to look:
/// - For Year granularity: number of years
/// - For Month granularity: number of months
/// - For Day granularity: number of days
pub async fn unique_users_starting_history(
    conn: &mut PgConnection,
    course_id: Uuid,
    granularity: TimeGranularity,
    time_window: u16,
) -> ModelResult<Vec<CountResult>> {
    let exclude_user_ids = get_user_ids_to_exclude_from_course_stats(conn, course_id).await?;
    let (interval_unit, time_unit) = granularity.get_sql_units();

    let res = sqlx::query_as!(
        CountResult,
        r#"
SELECT DATE_TRUNC($5, created_at) AS "period",
  COUNT(DISTINCT user_id) AS "count!"
FROM user_course_settings
WHERE current_course_id = $1
  AND deleted_at IS NULL
  AND NOT user_id = ANY($2)
  AND created_at >= NOW() - ($3 || ' ' || $4)::INTERVAL
GROUP BY "period"
ORDER BY "period"
        "#,
        course_id,
        &exclude_user_ids,
        &time_window.to_string(),
        interval_unit,
        time_unit,
    )
    .fetch_all(conn)
    .await?;

    Ok(res)
}

/// Get first exercise submission counts with specified time granularity.
///
/// The time_window parameter controls how far back to look:
/// - For Year granularity: number of years
/// - For Month granularity: number of months
/// - For Day granularity: number of days
pub async fn first_exercise_submissions_history(
    conn: &mut PgConnection,
    course_id: Uuid,
    granularity: TimeGranularity,
    time_window: u16,
) -> ModelResult<Vec<CountResult>> {
    let exclude_user_ids = get_user_ids_to_exclude_from_course_stats(conn, course_id).await?;
    let (interval_unit, time_unit) = granularity.get_sql_units();

    let res = sqlx::query_as!(
        CountResult,
        r#"
SELECT DATE_TRUNC($5, first_submission) AS "period",
  COUNT(user_id) AS "count!"
FROM (
    SELECT user_id,
      MIN(created_at) AS first_submission
    FROM exercise_slide_submissions
    WHERE course_id = $1
      AND deleted_at IS NULL
      AND NOT user_id = ANY($2)
      AND created_at >= NOW() - ($3 || ' ' || $4)::INTERVAL
    GROUP BY user_id
  ) AS first_submissions
GROUP BY "period"
ORDER BY "period"
        "#,
        course_id,
        &exclude_user_ids,
        &time_window.to_string(),
        interval_unit,
        time_unit,
    )
    .fetch_all(conn)
    .await?;

    Ok(res)
}

/// Get users returning exercises counts with specified time granularity.
///
/// The time_window parameter controls how far back to look:
/// - For Year granularity: number of years
/// - For Month granularity: number of months
/// - For Day granularity: number of days
pub async fn users_returning_exercises_history(
    conn: &mut PgConnection,
    course_id: Uuid,
    granularity: TimeGranularity,
    time_window: u16,
) -> ModelResult<Vec<CountResult>> {
    let exclude_user_ids = get_user_ids_to_exclude_from_course_stats(conn, course_id).await?;
    let (interval_unit, time_unit) = granularity.get_sql_units();

    let res = sqlx::query_as!(
        CountResult,
        r#"
SELECT DATE_TRUNC($5, created_at) AS "period",
  COUNT(DISTINCT user_id) AS "count!"
FROM exercise_slide_submissions
WHERE course_id = $1
  AND deleted_at IS NULL
  AND NOT user_id = ANY($2)
  AND created_at >= NOW() - ($3 || ' ' || $4)::INTERVAL
GROUP BY "period"
ORDER BY "period"
        "#,
        course_id,
        &exclude_user_ids,
        &time_window.to_string(),
        interval_unit,
        time_unit,
    )
    .fetch_all(conn)
    .await?;

    Ok(res)
}

/// Get average time from course start to first exercise submission with specified time granularity.
///
/// The time_window parameter controls how far back to look:
/// - For Year granularity: number of years
/// - For Month granularity: number of months
/// - For Day granularity: number of days
///
/// Returns the average time in seconds.
pub async fn avg_time_to_first_submission_history(
    conn: &mut PgConnection,
    course_id: Uuid,
    granularity: TimeGranularity,
    time_window: u16,
) -> ModelResult<Vec<AverageMetric>> {
    let exclude_user_ids = get_user_ids_to_exclude_from_course_stats(conn, course_id).await?;
    let (interval_unit, time_unit) = granularity.get_sql_units();

    let res = sqlx::query_as!(
        AverageMetric,
        r#"
SELECT DATE_TRUNC($5, user_start) AS "period",
  AVG(
    EXTRACT(
      EPOCH
      FROM (first_submission - user_start)
    )
  )::float8 AS "average"
FROM (
    SELECT u.user_id,
      MIN(u.created_at) AS user_start,
      MIN(e.created_at) AS first_submission
    FROM user_course_settings u
      JOIN exercise_slide_submissions e ON u.user_id = e.user_id
      AND e.course_id = $1
      AND e.deleted_at IS NULL
    WHERE u.current_course_id = $1
      AND u.deleted_at IS NULL
      AND NOT u.user_id = ANY($2)
      AND u.created_at >= NOW() - ($3 || ' ' || $4)::INTERVAL
    GROUP BY u.user_id
  ) AS timings
GROUP BY "period"
ORDER BY "period"
        "#,
        course_id,
        &exclude_user_ids,
        &time_window.to_string(),
        interval_unit,
        time_unit,
    )
    .fetch_all(conn)
    .await?;

    Ok(res)
}

/// Get cohort activity statistics with specified time granularity.
///
/// Parameters:
/// - history_window: How far back to look for cohorts
/// - tracking_window: How long to track activity after each cohort's start
///
/// For each granularity:
/// - Year: windows in years, tracking monthly activity
/// - Month: windows in months, tracking weekly activity
/// - Day: windows in days, tracking daily activity
///
/// Cohorts are defined by when users first submitted an exercise.
pub async fn get_cohort_activity_history(
    conn: &mut PgConnection,
    course_id: Uuid,
    granularity: TimeGranularity,
    history_window: u16,
    tracking_window: u16,
) -> ModelResult<Vec<CohortActivity>> {
    let exclude_user_ids = get_user_ids_to_exclude_from_course_stats(conn, course_id).await?;
    let (interval_unit, time_unit) = granularity.get_sql_units();

    Ok(sqlx::query_as!(
        CohortActivity,
        r#"
WITH first_activity AS (
  SELECT user_id,
    MIN(DATE_TRUNC($6, created_at)) AS first_active_at
  FROM exercise_slide_submissions
  WHERE course_id = $1
    AND created_at >= NOW() - ($3 || ' ' || $4)::INTERVAL
    AND deleted_at IS NULL
    AND NOT user_id = ANY($2)
  GROUP BY user_id
),
cohort AS (
  SELECT user_id,
    first_active_at AS cohort_start
  FROM first_activity
)
SELECT c.cohort_start AS "cohort_start",
  DATE_TRUNC($6, s.created_at) AS "activity_period",
  CASE
    WHEN $6 = 'day' THEN EXTRACT(
      DAY
      FROM (DATE_TRUNC('day', s.created_at) - c.cohort_start)
    )::integer
    WHEN $6 = 'week' THEN EXTRACT(
      WEEK
      FROM (
          DATE_TRUNC('week', s.created_at) - c.cohort_start
        )
    )::integer
    WHEN $6 = 'month' THEN (
      EXTRACT(
        YEAR
        FROM s.created_at
      ) - EXTRACT(
        YEAR
        FROM c.cohort_start
      )
    )::integer * 12 + (
      EXTRACT(
        MONTH
        FROM s.created_at
      ) - EXTRACT(
        MONTH
        FROM c.cohort_start
      )
    )::integer
    ELSE NULL::integer
  END AS "offset",
  COUNT(DISTINCT s.user_id) AS "active_users!"
FROM cohort c
  JOIN exercise_slide_submissions s ON (
    c.user_id = s.user_id
    AND s.course_id = $1
  )
  AND s.created_at >= c.cohort_start
  AND s.created_at < c.cohort_start + ($5 || ' ' || $4)::INTERVAL
  AND s.deleted_at IS NULL
GROUP BY c.cohort_start,
  "activity_period",
  "offset"
ORDER BY c.cohort_start,
  "offset"
        "#,
        course_id,
        &exclude_user_ids,
        &history_window.to_string(),
        interval_unit,
        &tracking_window.to_string(),
        time_unit,
    )
    .fetch_all(conn)
    .await?)
}

/// Get course completion counts with specified time granularity.
///
/// The time_window parameter controls how far back to look:
/// - For Year granularity: number of years
/// - For Month granularity: number of months
/// - For Day granularity: number of days
pub async fn course_completions_history(
    conn: &mut PgConnection,
    course_id: Uuid,
    granularity: TimeGranularity,
    time_window: u16,
) -> ModelResult<Vec<CountResult>> {
    let exclude_user_ids = get_user_ids_to_exclude_from_course_stats(conn, course_id).await?;
    let (interval_unit, time_unit) = granularity.get_sql_units();

    let res = sqlx::query_as!(
        CountResult,
        r#"
SELECT DATE_TRUNC($5, created_at) AS "period",
  COUNT(DISTINCT user_id) AS "count!"
FROM course_module_completions
WHERE course_id = $1
  AND prerequisite_modules_completed = TRUE
  AND needs_to_be_reviewed = FALSE
  AND passed = TRUE
  AND deleted_at IS NULL
  AND NOT user_id = ANY($2)
  AND created_at >= NOW() - ($3 || ' ' || $4)::INTERVAL
GROUP BY "period"
ORDER BY "period"
          "#,
        course_id,
        &exclude_user_ids,
        &time_window.to_string(),
        interval_unit,
        time_unit,
    )
    .fetch_all(conn)
    .await?;

    Ok(res)
}

/// Get completion counts for all language versions of a course with specified time granularity.
///
/// The time_window parameter controls how far back to look:
/// - For Year granularity: number of years
/// - For Month granularity: number of months
/// - For Day granularity: number of days
pub async fn course_completions_history_all_language_versions(
    conn: &mut PgConnection,
    course_language_group_id: Uuid,
    granularity: TimeGranularity,
    time_window: u16,
) -> ModelResult<Vec<CountResult>> {
    let exclude_user_ids =
        get_user_ids_to_exclude_from_course_language_group_stats(conn, course_language_group_id)
            .await?;
    let (interval_unit, time_unit) = granularity.get_sql_units();

    let res = sqlx::query_as!(
        CountResult,
        r#"
SELECT DATE_TRUNC($5, created_at) AS "period",
COUNT(DISTINCT user_id) AS "count!"
FROM course_module_completions
WHERE course_id IN (
    SELECT id
    FROM courses
    WHERE course_language_group_id = $1
      AND deleted_at IS NULL
  )
  AND prerequisite_modules_completed = TRUE
  AND needs_to_be_reviewed = FALSE
  AND passed = TRUE
  AND deleted_at IS NULL
  AND NOT user_id = ANY($2)
  AND created_at >= NOW() - ($3 || ' ' || $4)::INTERVAL
GROUP BY "period"
ORDER BY "period"
        "#,
        course_language_group_id,
        &exclude_user_ids,
        &time_window.to_string(),
        interval_unit,
        time_unit,
    )
    .fetch_all(conn)
    .await?;

    Ok(res)
}

/// Get unique users starting counts for all language versions with specified time granularity.
///
/// The time_window parameter controls how far back to look:
/// - For Year granularity: number of years
/// - For Month granularity: number of months
/// - For Day granularity: number of days
pub async fn unique_users_starting_history_all_language_versions(
    conn: &mut PgConnection,
    course_language_group_id: Uuid,
    granularity: TimeGranularity,
    time_window: u16,
) -> ModelResult<Vec<CountResult>> {
    let exclude_user_ids =
        get_user_ids_to_exclude_from_course_language_group_stats(conn, course_language_group_id)
            .await?;
    let (interval_unit, time_unit) = granularity.get_sql_units();

    let res = sqlx::query_as!(
        CountResult,
        r#"
SELECT DATE_TRUNC($5, created_at) AS "period",
  COUNT(DISTINCT user_id) AS "count!"
FROM user_course_settings
WHERE current_course_id IN (
    SELECT id
    FROM courses
    WHERE course_language_group_id = $1
      AND deleted_at IS NULL
  )
  AND deleted_at IS NULL
  AND NOT user_id = ANY($2)
  AND created_at >= NOW() - ($3 || ' ' || $4)::INTERVAL
GROUP BY "period"
ORDER BY "period"
        "#,
        course_language_group_id,
        &exclude_user_ids,
        &time_window.to_string(),
        interval_unit,
        time_unit,
    )
    .fetch_all(conn)
    .await?;

    Ok(res)
}

/// Total unique users in the course settings table, grouped by course instance.
///
/// Returns a HashMap where keys are course instance IDs and values are the total user counts
/// for that instance.
pub async fn get_total_users_started_course_by_instance(
    conn: &mut PgConnection,
    course_id: Uuid,
) -> ModelResult<HashMap<Uuid, CountResult>> {
    let exclude_user_ids = get_user_ids_to_exclude_from_course_stats(conn, course_id).await?;
    let results = sqlx::query!(
        r#"
SELECT current_course_instance_id AS "instance_id!",
  NULL::timestamptz AS "period",
  COUNT(DISTINCT user_id) AS "count!"
FROM user_course_settings
WHERE current_course_id = $1
  AND deleted_at IS NULL
  AND user_id != ALL($2)
GROUP BY current_course_instance_id
        "#,
        course_id,
        &exclude_user_ids
    )
    .fetch_all(conn)
    .await?;

    let mut grouped_results = HashMap::new();
    for row in results {
        let count_result = CountResult {
            period: row.period,
            count: row.count,
        };
        grouped_results.insert(row.instance_id, count_result);
    }

    Ok(grouped_results)
}

/// Total unique users who have completed the course, grouped by course instance.
///
/// Returns a HashMap where keys are course instance IDs and values are the completion counts
/// for that instance.
pub async fn get_total_users_completed_course_by_instance(
    conn: &mut PgConnection,
    course_id: Uuid,
) -> ModelResult<HashMap<Uuid, CountResult>> {
    let exclude_user_ids = get_user_ids_to_exclude_from_course_stats(conn, course_id).await?;
    let results = sqlx::query!(
        r#"
SELECT ucs.current_course_instance_id AS "instance_id!",
  NULL::timestamptz AS "period",
  COUNT(DISTINCT c.user_id) AS "count!"
FROM course_module_completions c
JOIN user_course_settings ucs ON c.user_id = ucs.user_id
  AND ucs.current_course_id = c.course_id
WHERE c.course_id = $1
  AND c.deleted_at IS NULL
  AND c.user_id != ALL($2)
GROUP BY ucs.current_course_instance_id
        "#,
        course_id,
        &exclude_user_ids
    )
    .fetch_all(conn)
    .await?;

    let mut grouped_results = HashMap::new();
    for row in results {
        let count_result = CountResult {
            period: row.period,
            count: row.count,
        };
        grouped_results.insert(row.instance_id, count_result);
    }

    Ok(grouped_results)
}

/// Total unique users who have returned at least one exercise, grouped by course instance.
///
/// Returns a HashMap where keys are course instance IDs and values are the submission counts
/// for that instance.
pub async fn get_total_users_returned_at_least_one_exercise_by_instance(
    conn: &mut PgConnection,
    course_id: Uuid,
) -> ModelResult<HashMap<Uuid, CountResult>> {
    let exclude_user_ids = get_user_ids_to_exclude_from_course_stats(conn, course_id).await?;
    let results = sqlx::query!(
        r#"
SELECT ucs.current_course_instance_id AS "instance_id!",
  NULL::timestamptz AS "period",
  COUNT(DISTINCT ess.user_id) AS "count!"
FROM exercise_slide_submissions ess
JOIN user_course_settings ucs ON ess.user_id = ucs.user_id
  AND ucs.current_course_id = ess.course_id
WHERE ess.course_id = $1
  AND ess.deleted_at IS NULL
  AND ess.user_id != ALL($2)
GROUP BY ucs.current_course_instance_id
        "#,
        course_id,
        &exclude_user_ids
    )
    .fetch_all(conn)
    .await?;

    let mut grouped_results = HashMap::new();
    for row in results {
        let count_result = CountResult {
            period: row.period,
            count: row.count,
        };
        grouped_results.insert(row.instance_id, count_result);
    }

    Ok(grouped_results)
}

/// Get course completion counts with specified time granularity, grouped by course instance.
///
/// Returns a HashMap where keys are course instance IDs and values are vectors of completion counts
/// over time for that instance.
///
/// The time_window parameter controls how far back to look:
/// - For Year granularity: number of years
/// - For Month granularity: number of months
/// - For Day granularity: number of days
pub async fn course_completions_history_by_instance(
    conn: &mut PgConnection,
    course_id: Uuid,
    granularity: TimeGranularity,
    time_window: u16,
) -> ModelResult<HashMap<Uuid, Vec<CountResult>>> {
    let exclude_user_ids = get_user_ids_to_exclude_from_course_stats(conn, course_id).await?;
    let (interval_unit, time_unit) = granularity.get_sql_units();

    // Get completions joined with user_course_settings to get instance information
    let results = sqlx::query!(
        r#"
WITH completions AS (
SELECT c.user_id,
  c.created_at,
  ucs.current_course_instance_id
FROM course_module_completions c
  JOIN user_course_settings ucs ON c.user_id = ucs.user_id
  AND ucs.current_course_id = c.course_id
WHERE c.course_id = $1
  AND c.prerequisite_modules_completed = TRUE
  AND c.needs_to_be_reviewed = FALSE
  AND c.passed = TRUE
  AND c.deleted_at IS NULL
  AND NOT c.user_id = ANY($2)
  AND c.created_at >= NOW() - ($3 || ' ' || $4)::INTERVAL
)
SELECT current_course_instance_id AS "instance_id!",
DATE_TRUNC($5, created_at) AS "period",
COUNT(DISTINCT user_id) AS "count!"
FROM completions
GROUP BY current_course_instance_id,
period
ORDER BY current_course_instance_id,
period "#,
        course_id,
        &exclude_user_ids,
        &time_window.to_string(),
        interval_unit,
        time_unit,
    )
    .fetch_all(conn)
    .await?;

    // Convert the flat results into a HashMap grouped by instance_id
    let mut grouped_results: HashMap<Uuid, Vec<CountResult>> = HashMap::new();

    for row in results {
        let count_result = CountResult {
            period: row.period,
            count: row.count,
        };

        grouped_results
            .entry(row.instance_id)
            .or_default()
            .push(count_result);
    }

    Ok(grouped_results)
}

/// Get unique users starting counts with specified time granularity, grouped by course instance.
///
/// Returns a HashMap where keys are course instance IDs and values are vectors of user counts
/// over time for that instance.
///
/// The time_window parameter controls how far back to look:
/// - For Year granularity: number of years
/// - For Month granularity: number of months
/// - For Day granularity: number of days
pub async fn unique_users_starting_history_by_instance(
    conn: &mut PgConnection,
    course_id: Uuid,
    granularity: TimeGranularity,
    time_window: u16,
) -> ModelResult<HashMap<Uuid, Vec<CountResult>>> {
    let exclude_user_ids = get_user_ids_to_exclude_from_course_stats(conn, course_id).await?;
    let (interval_unit, time_unit) = granularity.get_sql_units();

    let results = sqlx::query!(
        r#"
SELECT current_course_instance_id AS "instance_id!",
DATE_TRUNC($5, created_at) AS "period",
COUNT(DISTINCT user_id) AS "count!"
FROM user_course_settings
WHERE current_course_id = $1
AND deleted_at IS NULL
AND NOT user_id = ANY($2)
AND created_at >= NOW() - ($3 || ' ' || $4)::INTERVAL
GROUP BY current_course_instance_id,
period
ORDER BY current_course_instance_id,
period
    "#,
        course_id,
        &exclude_user_ids,
        &time_window.to_string(),
        interval_unit,
        time_unit,
    )
    .fetch_all(conn)
    .await?;

    // Convert the flat results into a HashMap grouped by instance_id
    let mut grouped_results: HashMap<Uuid, Vec<CountResult>> = HashMap::new();

    for row in results {
        let count_result = CountResult {
            period: row.period,
            count: row.count,
        };

        grouped_results
            .entry(row.instance_id)
            .or_default()
            .push(count_result);
    }

    Ok(grouped_results)
}

/// Get first exercise submission counts with specified time granularity, grouped by course instance.
///
/// Returns a HashMap where keys are course instance IDs and values are vectors of submission counts
/// over time for that instance.
///
/// The time_window parameter controls how far back to look:
/// - For Year granularity: number of years
/// - For Month granularity: number of months
/// - For Day granularity: number of days
pub async fn first_exercise_submissions_history_by_instance(
    conn: &mut PgConnection,
    course_id: Uuid,
    granularity: TimeGranularity,
    time_window: u16,
) -> ModelResult<HashMap<Uuid, Vec<CountResult>>> {
    let exclude_user_ids = get_user_ids_to_exclude_from_course_stats(conn, course_id).await?;
    let (interval_unit, time_unit) = granularity.get_sql_units();

    let results = sqlx::query!(
        r#"
WITH first_submissions AS (
SELECT user_id,
  MIN(created_at) AS first_submission
FROM exercise_slide_submissions
WHERE course_id = $1
  AND deleted_at IS NULL
  AND NOT user_id = ANY($2)
  AND created_at >= NOW() - ($3 || ' ' || $4)::INTERVAL
GROUP BY user_id
)
SELECT ucs.current_course_instance_id AS "instance_id!",
DATE_TRUNC($5, fs.first_submission) AS "period",
COUNT(fs.user_id) AS "count!"
FROM first_submissions fs
JOIN user_course_settings ucs ON fs.user_id = ucs.user_id
AND ucs.current_course_id = $1
GROUP BY ucs.current_course_instance_id,
period
ORDER BY ucs.current_course_instance_id,
period
    "#,
        course_id,
        &exclude_user_ids,
        &time_window.to_string(),
        interval_unit,
        time_unit,
    )
    .fetch_all(conn)
    .await?;

    // Convert the flat results into a HashMap grouped by instance_id
    let mut grouped_results: HashMap<Uuid, Vec<CountResult>> = HashMap::new();

    for row in results {
        let count_result = CountResult {
            period: row.period,
            count: row.count,
        };

        grouped_results
            .entry(row.instance_id)
            .or_default()
            .push(count_result);
    }

    Ok(grouped_results)
}

/// Get users returning exercises counts with specified time granularity, grouped by course instance.
///
/// Returns a HashMap where keys are course instance IDs and values are vectors of user counts
/// over time for that instance.
///
/// The time_window parameter controls how far back to look:
/// - For Year granularity: number of years
/// - For Month granularity: number of months
/// - For Day granularity: number of days
pub async fn users_returning_exercises_history_by_instance(
    conn: &mut PgConnection,
    course_id: Uuid,
    granularity: TimeGranularity,
    time_window: u16,
) -> ModelResult<HashMap<Uuid, Vec<CountResult>>> {
    let exclude_user_ids = get_user_ids_to_exclude_from_course_stats(conn, course_id).await?;
    let (interval_unit, time_unit) = granularity.get_sql_units();

    let results = sqlx::query!(
        r#"
SELECT ucs.current_course_instance_id AS "instance_id!",
DATE_TRUNC($5, ess.created_at) AS "period",
COUNT(DISTINCT ess.user_id) AS "count!"
FROM exercise_slide_submissions ess
JOIN user_course_settings ucs ON ess.user_id = ucs.user_id
AND ucs.current_course_id = ess.course_id
WHERE ess.course_id = $1
AND ess.deleted_at IS NULL
AND NOT ess.user_id = ANY($2)
AND ess.created_at >= NOW() - ($3 || ' ' || $4)::INTERVAL
GROUP BY ucs.current_course_instance_id,
period
ORDER BY ucs.current_course_instance_id,
period
    "#,
        course_id,
        &exclude_user_ids,
        &time_window.to_string(),
        interval_unit,
        time_unit,
    )
    .fetch_all(conn)
    .await?;

    // Convert the flat results into a HashMap grouped by instance_id
    let mut grouped_results: HashMap<Uuid, Vec<CountResult>> = HashMap::new();

    for row in results {
        let count_result = CountResult {
            period: row.period,
            count: row.count,
        };

        grouped_results
            .entry(row.instance_id)
            .or_default()
            .push(count_result);
    }

    Ok(grouped_results)
}
