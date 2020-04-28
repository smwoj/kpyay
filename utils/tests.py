import os, subprocess, pytest, requests
from subprocess import PIPE, Popen
from testing.redis import RedisServer

"""
This is an integration test suite. 
Fixtures provide:
 - compiled server,
 - and run it with a fresh Redis instance for each test.

USAGE: 
  
    pytest server_tests.py 
    
"""
SERVER_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../server"))


@pytest.fixture
def redis():
    """ Provides fresh, empty Redis instance. """
    with RedisServer() as redis:
        port = redis.dsn()["port"]
        yield f"redis://127.0.0.1:{port}"


@pytest.fixture(scope="session")
def compiled_server():
    """ Asserts the server compiles. """
    finished_build = subprocess.run(
        f"cd {SERVER_ROOT} && cargo build", stdout=PIPE, stderr=PIPE, shell=True
    )
    if finished_build.returncode != 0:
        screamer = "THE SERVER WON'T COMPILE, PLEASE FIX IT"
        msg = "\n".join([screamer, finished_build.stderr.decode(), screamer])
        # screamer used twice to have nice "short test summary info" in pytest report
        raise AssertionError(msg)


@pytest.fixture
def running_server(compiled_server, redis):
    """ Provides a fresh server + Redis pair. """
    with Popen(
        f"{SERVER_ROOT}/target/debug/server {redis}", stdout=PIPE, stderr=PIPE,
    ) as server_process:
        # TODO? wait till responds
        # TODO: allow port customization
        yield "http://127.0.0.1:8088"
        server_process.terminate()


@pytest.fixture
def server_with_existing_content(running_server):



@pytest.mark.parametrize(
    "expected_status, payload",
    [
        (
            200,
            {
                "value": 3.1415,
                "version": [1, 2, 3],
                "params": {"team": "bakers", "section": "pies"},
                "timestamp": "1996-12-19T16:39:57-08:00",
            },
        ),
        (
            200,
            {
                # it's OK to skip version
                "value": 3.1415,
                "params": {},
                "timestamp": "1996-12-19T16:39:57-08:00",
            },
        ),
        (
            400,
            {
                # but value is required
                "version": [1, 2, 20],
                "params": {},
                "timestamp": "1996-12-19T16:39:57-08:00",
            },
        ),
        (
            400,
            {
                # wtf this body
                "ciastko": "karmel"
            },
        ),
        (
            400,
            {
                # invalid timestamp
                "value": 3.1415,
                "version": [1, 2, 3],
                "params": {"team": "bakers", "section": "pies"},
                "timestamp": "fzf",
            },
        ),
    ],
)
def test_posting_points(running_server, expected_status, payload):
    response = requests.post(f"{running_server}/points/mock-metric", json=payload)
    assert (
        response.status_code == expected_status
    ), f"This is supposed to return {expected_status}; response text:\n '''{response.text}'''"


@pytest.mark.parametrize(
    "uri", ["/svfvsfv", "/shrek", "/shrek/donkey"],
)
def test_404s(running_server, uri):
    response = requests.get(f"{running_server}{uri}")
    assert response.status_code == 404, f"Response text:\n '''{response.text}'''"


# @pytest.mark.parametrize(
#     "uri",
#     ["/points/mock-metric", "/points/ANOTHER-mock-metric",],
# )
# def test_get_points(runexpected_status, uri):
#     response = requests.get(f"{ORIGIN}{slug}")
#     assert (
#         response.status_code == expected_status
#     ), f"This is supposed to return {expected_status}; response text:\n '''{response.text}'''"
