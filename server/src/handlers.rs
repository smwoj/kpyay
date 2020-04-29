use super::db::CLIENT;
use super::primitives::*;
use actix_web::{web, HttpResponse};
use redis::AsyncCommands;

// enum UnhappyResponse{
//    InvalidMetric
// }

pub async fn get_points(metric: web::Path<String>) -> HttpResponse {
    // TODO: assert metric matches correct regex
    let mut conn: redis::aio::Connection = CLIENT.get_async_connection().await.unwrap();
    let key = format!("points/{}", metric);
    let metric_exists: bool = conn.exists(&key).await.unwrap();
    let existing_metrics: Result<Vec<String>, _> = conn.keys("*").await;
    if !metric_exists {
        // todo: plug in suggestions with levenshtein
        return HttpResponse::NotFound().body(format!(
            "Points for metric '{}' not found. Existing metrics: {:?}",
            metric, existing_metrics
        ));
    }
    let points = conn
        .lrange::<&str, Vec<String>>(&key, 0, -1)
        .await
        .unwrap()
        .into_iter()
        .map(|s| serde_json::from_str(&s).unwrap())
        .collect::<Vec<Point>>();

    HttpResponse::Ok().body(serde_json::json!(points).to_string())
}

pub async fn add_point(metric: web::Path<String>, payload_bytes: web::Bytes) -> HttpResponse {
    let mut point: Point = match serde_json::from_slice(payload_bytes.as_ref()) {
        Ok(p) => p,
        Err(e) => {
            let bytes = payload_bytes.as_ref();
            let content_ref = std::str::from_utf8(bytes).map(|s| s.to_string())
                .unwrap_or_else(|e| format!("not valid utf-8: '{:?}'", bytes));
            return HttpResponse::BadRequest()
                .body(format!(
                    "Content in invalid format: {}. Posted content: '{:?}'",
                    e.to_string(), content_ref));
        }
    };
    point.fill_timestamp_if_missing();
    let mut conn: redis::aio::Connection = CLIENT.get_async_connection().await.unwrap();
    let key = format!("points/{}", metric);
    let value = serde_json::to_string(&point).unwrap();
    let _: Result<(), _> = conn.lpush(&key, value).await;

    // check if params have legal values
    // validate with schema
    // check if redis/schemas match

    HttpResponse::Ok().body(format!("OK, added {:?}", point))
}

pub async fn set_config(config_name: web::Path<String>, payload_bytes: web::Bytes) -> HttpResponse {
    let value: serde_json::Value = match serde_json::from_slice(payload_bytes.as_ref()) {
        Ok(v) => v,
        Err(e) => {
            return HttpResponse::BadRequest().body(format!(
                "Content is not valid utf-8 json, detail: {}",
                e.to_string()
            ));
        }
    };
    let mut conn: redis::aio::Connection = CLIENT.get_async_connection().await.unwrap();
    let key = format!("configs/{}", config_name);
    let json_value = serde_json::to_string(&value).unwrap();
    let _: Result<(), _> = conn.lpush(&key, &json_value).await;

    HttpResponse::Ok().body(format!("OK, set_config {:?}={}", config_name, json_value))
}

pub async fn get_config(config_name: web::Path<String>) -> HttpResponse {
    let mut conn: redis::aio::Connection = CLIENT.get_async_connection().await.unwrap();
    let key = format!("configs/{}", config_name);
    let res: String = conn.lindex(&key, -1).await.unwrap();
    dbg!(&res);
    // 404 if not in redis
    HttpResponse::Ok().body(res)
}
