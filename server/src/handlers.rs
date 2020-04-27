use super::primitives::*;
use actix_web::{web, HttpResponse};

use super::db::CLIENT;
use redis::AsyncCommands;

pub async fn get_points(metric: web::Path<String>) -> HttpResponse {
    // 404 if not in redis
    let mut conn: redis::aio::Connection  = CLIENT.get_async_connection().await.unwrap();
    let key = format!("metrics/{}", metric);
    let res : Vec<String> = conn.get(&key).await.unwrap();
    // 404 if not in redis
    HttpResponse::Ok().body(res.join("||"))
}

pub async fn add_point(metric: web::Path<String>, payload_bytes: web::Bytes) -> HttpResponse {
    let point: Point = match serde_json::from_slice(payload_bytes.as_ref()) {
        Ok(p) => p,
        Err(e) => {
            return HttpResponse::BadRequest()
                .body(format!("Content in invalid format: {}", e.to_string()))
            // todo improve err messages
        }
    };
    let mut conn : redis::aio::Connection= CLIENT.get_async_connection().await.unwrap();
    let key = format!("points/{}", metric);
    let value = serde_json::to_string(&point).unwrap();
    let _ : Result<(), _> = conn.lpush(&key, value).await;

    // check if params have legal values
    // validate with schema
    // check if redis/schemas match

    HttpResponse::Ok().body(format!("OK, added {:?}", point))
}

pub async fn set_config(config_name: web::Path<String>, payload_bytes: web::Bytes) -> HttpResponse {
    let value: serde_json::Value = match serde_json::from_slice(payload_bytes.as_ref()){
        Ok(v) => v,
        Err(e) => {
            return HttpResponse::BadRequest()
                .body(format!("Content is not valid utf-8 json, detail: {}", e.to_string()));
        }
    };
    let mut conn : redis::aio::Connection= CLIENT.get_async_connection().await.unwrap();
    let key = format!("configs/{}", config_name);
    let json_value = serde_json::to_string(&value).unwrap();
    let _ : Result<(), _> = conn.lpush(&key, &json_value).await;

    HttpResponse::Ok().body(format!("OK, set_config {:?}={}", config_name, json_value))
}

pub async fn get_config(config_name: web::Path<String>) -> HttpResponse{
    let mut conn : redis::aio::Connection = CLIENT.get_async_connection().await.unwrap();
    let key = format!("configs/{}", config_name);
    let res : String = conn.lindex(&key, -1).await.unwrap();
    dbg!(&res);
    // 404 if not in redis
    HttpResponse::Ok().body(res)
}
