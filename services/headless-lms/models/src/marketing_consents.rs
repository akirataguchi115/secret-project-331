use itertools::multiunzip;
use serde_json::json;

use crate::prelude::*;

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone)]
#[cfg_attr(feature = "ts_rs", derive(TS))]
pub struct UserMarketingConsent {
    pub id: Uuid,
    pub course_id: Uuid,
    pub course_language_group_id: Uuid,
    pub user_id: Uuid,
    pub user_mailchimp_id: Option<String>,
    pub consent: bool,
    pub email_subscription_in_mailchimp: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub deleted_at: Option<DateTime<Utc>>,
    pub synced_to_mailchimp_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone)]
#[cfg_attr(feature = "ts_rs", derive(TS))]
pub struct UserMarketingConsentWithDetails {
    pub id: Uuid,
    pub course_id: Uuid,
    pub course_language_group_id: Uuid,
    pub user_id: Uuid,
    pub user_mailchimp_id: Option<String>,
    pub consent: bool,
    pub email_subscription_in_mailchimp: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub deleted_at: Option<DateTime<Utc>>,
    pub synced_to_mailchimp_at: Option<DateTime<Utc>>,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub email: String,
    pub course_name: String,
    pub locale: Option<String>,
    pub completed_course_at: Option<DateTime<Utc>>,
    pub research_consent: Option<bool>,
    pub country: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone)]
#[cfg_attr(feature = "ts_rs", derive(TS))]
pub struct UserEmailSubscription {
    pub user_id: Uuid,
    pub email: String,
    pub email_subscription_in_mailchimp: Option<String>,
    pub user_mailchimp_id: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone)]
#[cfg_attr(feature = "ts_rs", derive(TS))]
pub struct MarketingMailingListAccessToken {
    pub id: Uuid,
    pub course_id: Uuid,
    pub mailchimp_mailing_list_id: String,
    pub course_language_group_id: Uuid,
    pub server_prefix: String,
    pub access_token: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub deleted_at: Option<DateTime<Utc>>,
}

#[derive(Debug, FromRow)]
pub struct MailchimpCourseTag {
    pub id: Uuid,
    pub marketing_mailing_list_access_token_id: Uuid,
    pub course_language_group_id: Uuid,
    pub tag_name: String,
    pub tag_id: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub deleted_at: Option<DateTime<Utc>>,
}

pub async fn upsert_marketing_consent(
    conn: &mut PgConnection,
    course_id: Uuid,
    course_language_group_id: Uuid,
    user_id: &Uuid,
    email_subscription: &str,
    marketing_consent: bool,
) -> sqlx::Result<Uuid> {
    let result = sqlx::query!(
        r#"
      INSERT INTO user_marketing_consents (user_id, course_id, course_language_group_id, consent, email_subscription_in_mailchimp)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id, course_language_group_id)
      DO UPDATE
      SET
        consent = $4,
        email_subscription_in_mailchimp = $5
      RETURNING id
      "#,
        user_id,
        course_id,
        course_language_group_id,
        marketing_consent,
        email_subscription
    )
    .fetch_one(conn)
    .await?;

    Ok(result.id)
}

pub async fn fetch_user_marketing_consent(
    conn: &mut PgConnection,
    course_id: Uuid,
    user_id: &Uuid,
) -> sqlx::Result<UserMarketingConsent> {
    let result = sqlx::query_as!(
        UserMarketingConsent,
        "
    SELECT *
    FROM user_marketing_consents
    WHERE user_id = $1 AND course_id = $2
    ",
        user_id,
        course_id,
    )
    .fetch_one(conn)
    .await?;

    Ok(result)
}

/// Fetches all user marketing consents with detailed user information for a specific course language group, if they haven't been synced to Mailchimp or if there have been updates since the last sync.
pub async fn fetch_all_unsynced_user_marketing_consents_by_course_language_group_id(
    conn: &mut PgConnection,
    course_language_group_id: Uuid,
) -> sqlx::Result<Vec<UserMarketingConsentWithDetails>> {
    let result = sqlx::query_as!(
        UserMarketingConsentWithDetails,
        "
    SELECT
        umc.id,
        umc.course_id,
        umc.course_language_group_id,
        umc.user_id,
        umc.user_mailchimp_id,
        umc.consent,
        umc.email_subscription_in_mailchimp,
        umc.created_at,
        umc.updated_at,
        umc.deleted_at,
        umc.synced_to_mailchimp_at,
        u.first_name AS first_name,
        u.last_name AS last_name,
        u.country AS country,
        u.email AS email,
        c.name AS course_name,
        c.language_code AS locale,
        CASE WHEN cmc.passed IS NOT NULL THEN cmc.completion_date ELSE NULL END AS completed_course_at,
        COALESCE(csfa.research_consent, urc.research_consent) AS research_consent
    FROM user_marketing_consents AS umc
    JOIN user_details AS u ON u.user_id = umc.user_id
    JOIN courses AS c ON c.id = umc.course_id
    LEFT JOIN course_module_completions AS cmc
        ON cmc.user_id = umc.user_id AND cmc.course_id = umc.course_id
     LEFT JOIN course_specific_consent_form_answers AS csfa
        ON csfa.course_id = umc.course_id AND csfa.user_id = umc.user_id
    LEFT JOIN user_research_consents AS urc
        ON urc.user_id = umc.user_id
    LEFT JOIN mailchimp_course_tags AS tags
        ON tags.course_language_group_id = umc.course_language_group_id
    WHERE umc.course_language_group_id = $1
    AND (
        umc.synced_to_mailchimp_at IS NULL
        OR umc.synced_to_mailchimp_at < umc.updated_at
        OR csfa.updated_at > umc.synced_to_mailchimp_at
        OR urc.updated_at > umc.synced_to_mailchimp_at
        OR cmc.updated_at > umc.synced_to_mailchimp_at
        OR u.updated_at > umc.synced_to_mailchimp_at
        OR EXISTS (
            SELECT 1
            FROM mailchimp_course_tags
            WHERE mailchimp_course_tags.course_language_group_id = umc.course_language_group_id
            AND mailchimp_course_tags.updated_at > umc.synced_to_mailchimp_at
            AND deleted_at IS NULL
        )
    )
    ",
        course_language_group_id
    )
    .fetch_all(conn)
    .await?;

    Ok(result)
}

/// Fetches email, email subscription status and user ID for users whose details have been updated after their marketing consent was last synced to Mailchimp
pub async fn fetch_all_unsynced_updated_emails(
    conn: &mut PgConnection,
    course_language_group_id: Uuid,
) -> sqlx::Result<Vec<UserEmailSubscription>> {
    let result = sqlx::query_as!(
        UserEmailSubscription,
        "
    SELECT
        umc.user_id,
        u.email AS email,
        umc.email_subscription_in_mailchimp,
        umc.user_mailchimp_id
    FROM user_marketing_consents AS umc
    JOIN user_details AS u ON u.user_id = umc.user_id
    WHERE umc.course_language_group_id = $1
    AND umc.synced_to_mailchimp_at < u.updated_at
    ",
        course_language_group_id
    )
    .fetch_all(conn)
    .await?;

    Ok(result)
}

/// Used to update the synced_to_mailchimp_at to a list of users when they are successfully synced to mailchimp
pub async fn update_synced_to_mailchimp_at_to_all_synced_users(
    conn: &mut PgConnection,
    ids: &[Uuid],
) -> ModelResult<()> {
    sqlx::query!(
        "
UPDATE user_marketing_consents
SET synced_to_mailchimp_at = now()
WHERE user_id IN (
    SELECT UNNEST($1::uuid [])
  )
",
        &ids
    )
    .execute(conn)
    .await?;
    Ok(())
}

/// Used to add the user_mailchimp_ids to a list of new users when they are successfully synced to mailchimp
pub async fn update_user_mailchimp_id_at_to_all_synced_users(
    pool: &mut PgConnection,
    user_contact_pairs: Vec<(String, String)>,
) -> ModelResult<()> {
    let (user_ids_raw, user_mailchimp_ids): (Vec<_>, Vec<_>) =
        user_contact_pairs.into_iter().unzip();

    // Parse user_ids into Uuid
    let user_ids: Vec<Uuid> = user_ids_raw
        .into_iter()
        .filter_map(|user_id| Uuid::parse_str(&user_id).ok())
        .collect();

    sqlx::query!(
        "
UPDATE user_marketing_consents
SET user_mailchimp_id = updated_data.user_mailchimp_id
FROM (
    SELECT UNNEST($1::uuid[]) AS user_id, UNNEST($2::text[]) AS user_mailchimp_id
) AS updated_data
WHERE user_marketing_consents.user_id = updated_data.user_id
",
        &user_ids,
        &user_mailchimp_ids
    )
    .execute(pool)
    .await?;
    Ok(())
}

/// Updates user consents to false in bulk using Mailchimp data.
pub async fn update_unsubscribed_users_from_mailchimp_in_bulk(
    conn: &mut PgConnection,
    mailchimp_data: Vec<(String, String, String, String)>,
) -> anyhow::Result<()> {
    let (
        user_ids_raw,
        timestamps_raw,
        course_language_group_ids_raw,
        email_subscriptions_in_mailchimp,
    ): (Vec<_>, Vec<_>, Vec<_>, Vec<_>) = multiunzip(mailchimp_data);

    let user_ids: Vec<Uuid> = user_ids_raw
        .into_iter()
        .filter_map(|user_id| Uuid::parse_str(&user_id).ok())
        .collect();

    let timestamps: Vec<DateTime<Utc>> = timestamps_raw
        .into_iter()
        .filter_map(|ts| {
            DateTime::parse_from_rfc3339(&ts)
                .ok()
                .map(|dt| dt.with_timezone(&Utc))
        })
        .collect();

    let course_language_group_ids: Vec<Uuid> = course_language_group_ids_raw
        .into_iter()
        .filter_map(|lang_id| Uuid::parse_str(&lang_id).ok())
        .collect();

    sqlx::query!(
        "
    UPDATE user_marketing_consents
    SET consent = false,
        email_subscription_in_mailchimp = updated_data.email_subscription_in_mailchimp,
        synced_to_mailchimp_at = updated_data.last_updated
    FROM (
        SELECT UNNEST($1::Uuid[]) AS user_id,
               UNNEST($2::timestamptz[]) AS last_updated,
               UNNEST($3::Uuid[]) AS course_language_group_id,
               UNNEST($4::text[]) AS email_subscription_in_mailchimp

    ) AS updated_data
    WHERE user_marketing_consents.user_id = updated_data.user_id
      AND user_marketing_consents.consent = true
      AND user_marketing_consents.synced_to_mailchimp_at < updated_data.last_updated
      AND user_marketing_consents.course_language_group_id = updated_data.course_language_group_id
    ",
        &user_ids,
        &timestamps,
        &course_language_group_ids,
        &email_subscriptions_in_mailchimp
    )
    .execute(conn)
    .await?;
    Ok(())
}

pub async fn fetch_all_marketing_mailing_list_access_tokens(
    conn: &mut PgConnection,
) -> sqlx::Result<Vec<MarketingMailingListAccessToken>> {
    let results = sqlx::query_as!(
        MarketingMailingListAccessToken,
        "
    SELECT
      id,
      course_id,
      course_language_group_id,
      server_prefix,
      access_token,
      mailchimp_mailing_list_id,
      created_at,
      updated_at,
      deleted_at
    FROM marketing_mailing_list_access_tokens
    "
    )
    .fetch_all(conn)
    .await?;

    Ok(results)
}

pub async fn fetch_tags_with_course_language_group_id_and_marketing_mailing_list_access_token_id(
    conn: &mut PgConnection,
    course_language_group_id: Uuid,
    marketing_mailing_access_token_id: Uuid,
) -> sqlx::Result<Vec<serde_json::Value>> {
    let results = sqlx::query!(
        "
        SELECT
          tag_name,
          tag_id
        FROM mailchimp_course_tags
        WHERE course_language_group_id = $1
        AND marketing_mailing_list_access_token_id = $2
        AND deleted_at IS NULL
        ",
        course_language_group_id,
        marketing_mailing_access_token_id
    )
    .fetch_all(conn)
    .await?;

    let tag_objects: Vec<serde_json::Value> = results
        .into_iter()
        .filter_map(|row| {
            let tag_name = row.tag_name.trim();
            let tag_id = row.tag_id.trim();

            if tag_name.is_empty() {
                return None;
            }

            Some(json!({
                "name": tag_name,
                "id": tag_id,
                "status": "active"
            }))
        })
        .collect();

    Ok(tag_objects)
}

pub async fn upsert_tag(
    conn: &mut PgConnection,
    course_language_group_id: Uuid,
    marketing_mailing_access_token_id: Uuid,
    tag_id: String,
    tag_name: String,
) -> sqlx::Result<()> {
    sqlx::query!(
        "
        INSERT INTO mailchimp_course_tags (
          tag_name,
          tag_id,
          course_language_group_id,
          marketing_mailing_list_access_token_id
        )
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (course_language_group_id, tag_name)
        DO UPDATE
        SET
          tag_name = EXCLUDED.tag_name
        ",
        tag_name,
        tag_id,
        course_language_group_id,
        marketing_mailing_access_token_id,
    )
    .execute(&mut *conn)
    .await?;
    Ok(())
}

pub async fn delete_tag(
    conn: &mut PgConnection,
    deleted_tag_id: String,
    course_language_group_id: Uuid,
) -> sqlx::Result<()> {
    sqlx::query!(
        "
        UPDATE mailchimp_course_tags
        SET deleted_at = now()
        WHERE tag_id = $1
        AND course_language_group_id = $2
        AND deleted_at IS NULL
        ",
        deleted_tag_id,
        course_language_group_id
    )
    .execute(&mut *conn)
    .await?;

    Ok(())
}
