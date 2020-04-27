use redis::Client;

fn init_client() -> Client {
    let conn_str = "redis://127.0.0.1/";
    Client::open(conn_str).unwrap_or_else(|err| {
        eprintln!("Failed to connect to {}. Error: {}", conn_str, err);
        std::process::exit(1);
    })
}

lazy_static::lazy_static! {
    pub static ref CLIENT: Client =  init_client() ;
}
