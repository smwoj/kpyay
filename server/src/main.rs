use actix_cors::Cors;
use actix_web::{get, web, App, HttpServer, Responder};

#[get("/{slug}")]
async fn index(info: web::Path<String>) -> impl Responder {
    serde_json::json!({ "echoed": info.into_inner() }).to_string()
}

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .service(index)
            // https://docs.rs/actix-cors/0.2.0/actix_cors/index.html
            .wrap(Cors::new().allowed_methods(vec!["GET"]).finish())
    })
    .bind("127.0.0.1:8088")?
    .run()
    .await
}
