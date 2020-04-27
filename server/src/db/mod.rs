mod client;

pub use client::CLIENT;

// let client: &Client = &*CLIENT;
// client
//     .get_connection()?
//     .set::<&str, &str, String>("dupa", "ass")
//     .unwrap();
// println!(
//     "translation for 'dupa': {}",
//     client
//         .get_connection()
//         .unwrap()
//         .get::<&str, String>("dupa")
//         .unwrap()
// );
