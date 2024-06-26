use crate::prelude::*;

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone)]
#[cfg_attr(feature = "ts_rs", derive(TS))]
pub struct UserResearchConsent {
    pub id: Uuid,
    pub user_id: Uuid,
    pub research_consent: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub deleted_at: Option<DateTime<Utc>>,
}

pub async fn upsert(
    conn: &mut PgConnection,
    pkey_policy: PKeyPolicy<Uuid>,
    user_id: Uuid,
    research_consent: bool,
) -> ModelResult<UserResearchConsent> {
    let res = sqlx::query_as!(
        UserResearchConsent,
        "
INSERT INTO user_research_consents (
    id,
    user_id,
    research_consent
)
VALUES ($1, $2, $3) ON CONFLICT (user_id, deleted_at)
DO UPDATE SET research_consent = $3
RETURNING *;
    ",
        pkey_policy.into_uuid(),
        user_id,
        research_consent,
    )
    .fetch_one(conn)
    .await?;
    Ok(res)
}

pub async fn get_research_consent_by_user_id(
    conn: &mut PgConnection,
    user_id: Uuid,
) -> ModelResult<UserResearchConsent> {
    let res = sqlx::query_as!(
        UserResearchConsent,
        "
SELECT *
FROM user_research_consents
WHERE user_id = $1
AND deleted_at IS NULL
    ",
        user_id,
    )
    .fetch_one(conn)
    .await?;
    Ok(res)
}
