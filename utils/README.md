This directory contains utilities for integration testing, mock/demo data etc.
- api.py - a minimal client "library" that wraps the server HTTP API,
- tests.py - a few unit tests and a few more integration tests. 
    Fixtures compile the server and provide each one with a fresh Redis instance.
    Good examples of API usage can be found there. Tests are collected in one big suite, 
    but it hasn't bothered me enough to split them yet.
    
    Run with `pytest tests.py -vv`.
    
- spawn_test_server.py - spawns fresh Redis + server pair and inserts predefined demo content.
    Once you run `python spawn_test_server.py` and the execution suspends, you play with the front end.

Scripts that compile & run the server (`pytest tests.py`, `python spawn_test_server.py`) 
obviously assume there's Rust toolchain installed.
