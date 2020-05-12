use super::db::CLIENT;
use super::primitives::*;
use actix_web::{http, web, HttpResponse};
use redis::AsyncCommands;

// TODO: get rid of ALL THESE UNWRAPS

pub async fn get_points(metric: web::Path<String>) -> HttpResponse {
    // TODO: assert metric matches correct regex
    let mut conn: redis::aio::Connection = CLIENT.get_async_connection().await.unwrap();
    let key = format!("points/{}", metric);
    let metric_exists: bool = conn.exists(&key).await.unwrap();
    if !metric_exists {
        let existing_metrics: Vec<String> = conn.keys("points/*").await.unwrap();

        // todo: provide suggestions with levenshtein
        return HttpResponse::NotFound()
            .set_header(http::header::CONTENT_TYPE, "text/json")
            .body(serde_json::json!({
                "detail":
                    format!(
                        "Points for metric '{}' not found. Existing metrics: {:?}",
                        metric, existing_metrics
                    )
            }));
    }
    let points = conn
        .lrange::<&str, Vec<String>>(&key, 0, -1)
        .await
        .unwrap()
        .into_iter()
        .map(|s| serde_json::from_str(&s).unwrap())
        .collect::<Vec<Point>>();

    HttpResponse::Ok()
        .set_header(http::header::CONTENT_TYPE, "text/json")
        .body(serde_json::json!(points).to_string())
}

pub async fn add_point(metric: web::Path<String>, payload_bytes: web::Bytes) -> HttpResponse {
    let mut point: Point = match serde_json::from_slice(payload_bytes.as_ref()) {
        Ok(p) => p,
        Err(e) => {
            let bytes = payload_bytes.as_ref();
            let content_ref = std::str::from_utf8(bytes)
                .map(|s| s.to_string())
                .unwrap_or_else(|_e| format!("not valid utf-8: '{:?}'", bytes));
            return HttpResponse::BadRequest().body(format!(
                "Payload is not a valid point: {}. Posted payload: '{:?}'",
                e.to_string(),
                content_ref
            ));
        }
    };
    let point_schema = point.to_schema();
    let mut conn: redis::aio::Connection = CLIENT.get_async_connection().await.unwrap();

    // handle schema mismatch or insert new if necessary
    let schema_key = format!("schemas/{}", &metric);
    if conn.exists(&schema_key).await.unwrap() {
        let schema_json: String = conn.get(&schema_key).await.unwrap();
        let existing_schema: PointSchema = serde_json::from_str(&schema_json).unwrap();
        if existing_schema != point_schema {
            return HttpResponse::BadRequest().body(format!(
                "Point(s) for this metric were already posted with different schema: {:?}.\
                Schema of posted point: {:?}",
                &existing_schema, &point_schema,
            ));
        }
    } else {
        conn.set(&schema_key, serde_json::to_string(&point_schema).unwrap())
            .await
            .unwrap()
    }

    point.fill_missing();
    let key = format!("points/{}", metric);
    let value = serde_json::to_string(&point).unwrap();
    let _: Result<(), _> = conn.lpush(&key, value).await;

    // todo: check if params have legal values

    HttpResponse::Created().body("")
}

pub async fn set_view(view_name: web::Path<String>, payload_bytes: web::Bytes) -> HttpResponse {
    let view: View = match serde_json::from_slice(payload_bytes.as_ref()) {
        Ok(v) => v,
        Err(e) => {
            let bytes = payload_bytes.as_ref();
            let content_ref = std::str::from_utf8(bytes)
                .map(|s| s.to_string())
                .unwrap_or_else(|_e| format!("not valid utf-8: '{:?}'", bytes));
            return HttpResponse::BadRequest().body(format!(
                "Payload is not a valid view: {}. Posted payload: '{:?}'",
                e.to_string(),
                content_ref
            ));
        }
    };
    let mut conn: redis::aio::Connection = CLIENT.get_async_connection().await.unwrap();
    let key = format!("views/{}", view_name);
    let json_value = serde_json::to_string(&view).unwrap();
    let _: () = conn.lpush(&key, &json_value).await.unwrap();

    HttpResponse::Created().body("")
}

pub async fn get_view(view_name: web::Path<String>) -> HttpResponse {
    let mut conn: redis::aio::Connection = CLIENT.get_async_connection().await.unwrap();
    let key = format!("views/{}", view_name);
    let view_exists: bool = conn.exists(&key).await.unwrap();
    if !view_exists {
        let existing_views: Vec<String> = conn.keys("views/*").await.unwrap();
        // todo: provide suggestions with levenshtein
        return HttpResponse::NotFound()
            .set_header(http::header::CONTENT_TYPE, "text/json")
            .body(serde_json::json!({
                "detail":
                    format!(
                        "Config '{}' not found. Existing views: {:?}",
                        view_name, existing_views
                    )
            }));
    }
    let res: String = conn.lindex(&key, 0).await.unwrap();

    HttpResponse::Ok()
        .set_header(http::header::CONTENT_TYPE, "text/json")
        .body(res)
}

pub async fn root() -> HttpResponse {
    HttpResponse::Ok().body("Hello!")
}
