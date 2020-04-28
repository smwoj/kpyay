use actix_cors::Cors;
use actix_web::{middleware::Logger, web, App, HttpServer};

mod db;
mod handlers;
mod primitives;


#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    env_logger::init();
    db::assert_client_works();

    HttpServer::new(|| {
        App::new()
            .route("/points/{metricId}", web::get().to(handlers::get_points))
            .route("/points/{metricId}", web::post().to(handlers::add_point))
            .route("/configs/{configName}", web::get().to(handlers::get_config))
            .route("/configs/{configName}", web::post().to(handlers::set_config))
            // TODO: /rename metric
            // https://docs.rs/actix-cors/0.2.0/actix_cors/index.html
            .wrap(Cors::new().allowed_methods(vec!["GET", "POST"]).finish())
            .wrap(Logger::default())
    })
    .bind("127.0.0.1:8088")?
    .run()
    .await
}
