use redis::Client;

fn parse_conn_str() -> String {
    // TODO: civilized CLI
    std::env::args().nth(1).unwrap_or_else(|| {
        eprintln!("ERROR: Usage:\n\n\t kpyay-server redis://127.0.0.1:5379/\n");
        std::process::exit(2);
    })
}

lazy_static::lazy_static! {
    pub static ref CONN_STR: String =  parse_conn_str();
}

fn init_client() -> Client {
    Client::open(CONN_STR.as_str()).unwrap_or_else(|err| {
        eprintln!("Failed to connect to {}. Error: {}", CONN_STR.as_str(), err);
        std::process::exit(1);
    })
}

lazy_static::lazy_static! {
    pub static ref CLIENT: Client =  init_client() ;
}

pub fn assert_client_works() {
    let c: &Client = &*CLIENT;
    match c.get_connection() {
        Ok(_) => eprintln!("Connected to {}", CONN_STR.as_str()),
        Err(e) => {
            eprintln!(
                "Cannot connect to {}. Error: {}",
                CONN_STR.as_str(),
                e.to_string()
            );
            std::process::exit(2);
        }
    };
}
