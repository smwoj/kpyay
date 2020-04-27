use super::primitives::*;
use actix_http::ResponseBuilder;
use actix_web::http::{header, StatusCode};
use actix_web::{web, App, HttpMessage, HttpRequest, HttpResponse, HttpServer, Responder};
use chrono::{DateTime, Utc};
use serde::export::fmt::Error;
use serde::export::Formatter;
use serde::{Deserialize, Serialize};

pub async fn get_points(metric: web::Path<String>) -> actix_web::Result<String> {
    dbg!(&metric);
    Ok("OK, get_points".to_string())
}

pub async fn add_point(metric: web::Path<String>, payload_bytes: web::Bytes) -> HttpResponse {
    let point: Point = match serde_json::from_slice(payload_bytes.as_ref()) {
        Ok(p) => p,
        Err(e) => {
            return HttpResponse::BadRequest()
                .body(&format!("Content in invalid format: {}", e.to_string()))
            // todo improve err messages
        }
    };
    dbg!(&point);

    HttpResponse::Ok().body(format!("OK, added {:?}", point))
}

// async fn set_config(config_name: web::Path<String>, req: HttpRequest) -> actix_web::Result<String> {
//     dbg!(&config_name, &req, req.payload());
//     Ok("OK, set_config".to_string())
// }
//
// async fn get_config(config_name: web::Path<String>) -> actix_web::Result<String> {
//     dbg!(config_name);
//     Ok("OK, get_config".to_string())
// }
//
pub async fn fallback() -> actix_web::Result<String> {
    Ok("FALLBACK".to_string())
}
