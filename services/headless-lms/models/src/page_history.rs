use std::collections::HashMap;

use serde_json::Value;

use crate::{
    pages::{CmsPageExercise, CmsPageExerciseSlide, CmsPageExerciseTask},
    peer_or_self_review_configs::CmsPeerOrSelfReviewConfig,
    peer_or_self_review_questions::CmsPeerOrSelfReviewQuestion,
    prelude::*,
};

#[derive(Debug, Serialize, Deserialize, PartialEq, Eq, Clone, Copy, Type)]
#[cfg_attr(feature = "ts_rs", derive(TS))]
#[sqlx(type_name = "history_change_reason", rename_all = "kebab-case")]
pub enum HistoryChangeReason {
    PageSaved,
    HistoryRestored,
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone)]
#[cfg_attr(feature = "ts_rs", derive(TS))]
pub struct PageHistory {
    pub id: Uuid,
    pub created_at: DateTime<Utc>,
    pub title: String,
    pub content: Value,
    pub history_change_reason: HistoryChangeReason,
    pub restored_from_id: Option<Uuid>,
    pub author_user_id: Uuid,
    pub page_id: Uuid,
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone)]
#[cfg_attr(feature = "ts_rs", derive(TS))]
pub struct PageHistoryContent {
    pub content: serde_json::Value,
    pub exercises: Vec<CmsPageExercise>,
    pub exercise_slides: Vec<CmsPageExerciseSlide>,
    pub exercise_tasks: Vec<CmsPageExerciseTask>,
    pub peer_or_self_review_configs: Vec<CmsPeerOrSelfReviewConfig>,
    pub peer_or_self_review_questions: Vec<CmsPeerOrSelfReviewQuestion>,
}

// Batch refactor pushed past the limit
#[allow(clippy::too_many_arguments)]
pub async fn insert(
    conn: &mut PgConnection,
    pkey_policy: PKeyPolicy<Uuid>,
    page_id: Uuid,
    title: &str,
    content: &PageHistoryContent,
    history_change_reason: HistoryChangeReason,
    author_user_id: Uuid,
    restored_from_id: Option<Uuid>,
) -> ModelResult<Uuid> {
    let res = sqlx::query!(
        "
INSERT INTO page_history (
    id,
    page_id,
    title,
    content,
    history_change_reason,
    author_user_id,
    restored_from_id
  )
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING id
        ",
        pkey_policy.into_uuid(),
        page_id,
        title,
        serde_json::to_value(content)?,
        history_change_reason as HistoryChangeReason,
        author_user_id,
        restored_from_id
    )
    .fetch_one(conn)
    .await?;
    Ok(res.id)
}

pub struct PageHistoryData {
    pub content: PageHistoryContent,
    pub title: String,
    pub exam_id: Option<Uuid>,
}

pub async fn get_history_data(conn: &mut PgConnection, id: Uuid) -> ModelResult<PageHistoryData> {
    let record = sqlx::query!(
        "
SELECT page_history.content,
  page_history.title,
  pages.exam_id
FROM page_history
  JOIN pages ON pages.id = page_history.page_id
WHERE page_history.id = $1
  AND pages.deleted_at IS NULL
  AND page_history.deleted_at IS NULL
        ",
        id,
    )
    .fetch_one(conn)
    .await?;
    Ok(PageHistoryData {
        content: serde_json::from_value(record.content)?,
        title: record.title,
        exam_id: record.exam_id,
    })
}

pub async fn history(
    conn: &mut PgConnection,
    page_id: Uuid,
    pagination: Pagination,
) -> ModelResult<Vec<PageHistory>> {
    let res = sqlx::query_as!(
        PageHistory,
        r#"
SELECT id,
  title,
  content,
  created_at,
  history_change_reason as "history_change_reason: HistoryChangeReason",
  restored_from_id,
  author_user_id,
  page_id
FROM page_history
WHERE page_id = $1
AND deleted_at IS NULL
ORDER BY created_at DESC, id
LIMIT $2
OFFSET $3
"#,
        page_id,
        pagination.limit(),
        pagination.offset()
    )
    .fetch_all(conn)
    .await?;
    Ok(res)
}

pub async fn history_count(conn: &mut PgConnection, page_id: Uuid) -> ModelResult<i64> {
    let res = sqlx::query!(
        "
SELECT COUNT(*) AS count
FROM page_history
WHERE page_id = $1
AND deleted_at IS NULL
",
        page_id
    )
    .fetch_one(conn)
    .await?;
    Ok(res.count.unwrap_or_default())
}

pub async fn get_latest_history_entries_for_pages_by_course_ids(
    conn: &mut PgConnection,
    course_ids: &[Uuid],
) -> ModelResult<HashMap<Uuid, PageHistory>> {
    let res = sqlx::query_as!(
        PageHistory,
        r#"
WITH ranked_history AS (
  SELECT ph.*,
    ROW_NUMBER() OVER (
      PARTITION BY ph.page_id
      ORDER BY ph.created_at DESC
    ) AS rn
  FROM page_history ph
    JOIN pages p ON p.id = ph.page_id
  WHERE p.course_id = ANY($1)
    AND ph.deleted_at IS NULL
    AND p.deleted_at IS NULL
)
SELECT id,
  title,
  content,
  created_at,
  history_change_reason AS "history_change_reason: HistoryChangeReason",
  restored_from_id,
  author_user_id,
  page_id
FROM ranked_history
WHERE rn = 1
"#,
        course_ids
    )
    .fetch_all(conn)
    .await?
    .into_iter()
    .fold(HashMap::new(), |mut map, history| {
        map.insert(history.page_id, history);
        map
    });

    Ok(res)
}
