kpyay server implementation in Rust.  
([required toolchain](https://www.rust-lang.org/tools/install))

The server requires a Redis instance. 
If you don't have redis-server installed, there's always an option 
to go with docker `docker run --name debug-redis -d --network host redis`).

Commands:
- running: `cargo run -- redis://127.0.0.1:5379/`
- building: `cargo build`. Once done, you can run the binary via `target/debug/server redis://127.0.0.1:5379/`
    If you want it to go brrr much faster - `cargo build --release`.
- linting: `cargo-clippy`
- formatting `cargo-fmt` (though it's better to have rustfmt enabled in the editor/IDE).

Linting and formatting require additional toolchain elements - 
trying to run the commands mentioned above will tell you how to install them.
