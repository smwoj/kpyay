import os, subprocess, pytest, requests, json
from datetime import datetime, timezone, timedelta
from subprocess import PIPE, Popen
from testing.redis import RedisServer

from api import ServerClient, Point, ChartConfig

"""
This is an integration test suite. 
Each test runs with a fresh pair, server + redis.

USAGE: 
  
    pytest tests.py 
    
"""
SERVER_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../server"))


@pytest.fixture
def redis():
    """ Provides a new Redis instance. """
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


def _wait_until_responds(url: str, max_seconds: int = 10):
    assert max_seconds >= 1
    one_sleep = 200  # ms
    n_sleeps = int(max_seconds * 1000 / one_sleep)
    for r in range(n_sleeps):
        try:
            resp = requests.get(url)
        except requests.exceptions.ConnectionError:
            pass
        else:
            if resp.status_code == 200:
                return
    raise RuntimeError(
        f"{max_seconds}s after spawning the server still doesn't respond."
    )


@pytest.fixture
def running_server(compiled_server, redis):
    """ Provides a fresh server + Redis pair. """
    with Popen(
        [f"{SERVER_ROOT}/target/debug/server", redis], stdout=PIPE, stderr=PIPE
    ) as server_process:
        # TODO: allow port customization
        url = "http://127.0.0.1:8088"
        _wait_until_responds(f"{url}/")
        yield url
        server_process.terminate()
        print(server_process.stderr.read().decode())


FIXED_TIMESTAMP_STR = "2020-04-29T12:06:23"
FIXED_TIMESTAMP = datetime.fromisoformat(FIXED_TIMESTAMP_STR)


@pytest.fixture
def client_to_existing_content(running_server):
    client = ServerClient(running_server)

    client.post_point(
        "f-score", Point.create(0.72, timestamp=FIXED_TIMESTAMP),
    )
    client.post_point(
        "f-score", Point.create(0.75, timestamp=FIXED_TIMESTAMP),
    )

    client.post_point(
        "cost", Point.create(19.0, params={"team": "vege"}),
    )
    client.post_point(
        "cost", Point.create(20.0, params={"team": "burgery"}),
    )
    client.post_point(
        "cost", Point.create(20, params={"team": "vege"}),
    )

    first_view = [
        ChartConfig(
            metric_id="cost", x_accessor="timestamp", restrictions={"team": "vege"}
        ),
        ChartConfig(
            metric_id="cost", x_accessor="timestamp", restrictions={"team": "burgery"}
        ),
    ]

    client._post_view("sample-view", first_view)
    client._post_view(
        "sample-view",
        [
            *first_view,
            ChartConfig(
                metric_id="cost", x_accessor="timestamp", restrictions={"team": "olimp"}
            ),
        ],
    )

    return client


@pytest.mark.parametrize(
    "p, json_str",
    [
        (Point.create(0.5), """{"value": 0.5, "params": {}}"""),
        (
            Point.create(1, params={"team": "vege"}),
            """{"value": 1.0, "params": {"team": "vege"}}""",
        ),
        (
            Point.create(1, version="1.2.0"),
            """{"value": 1.0, "params": {}, "version": [1, 2, 0]}""",
        ),
        (
            Point.create(1, version="2012.5.12"),
            """{"value": 1.0, "params": {}, "version": [2012, 5, 12]}""",
        ),
        (
            Point.create(1, timestamp=FIXED_TIMESTAMP),
            """{"value": 1.0, "params": {}, "timestamp": "%s"}""" % FIXED_TIMESTAMP_STR,
        ),
    ],
)
def test_point_serialization(p: Point, json_str):
    assert p.to_json() == json_str


@pytest.mark.parametrize(
    "variant, formatted",
    [
        (
            datetime(2020, 12, 5, 20, 25, 45, tzinfo=timezone.utc),
            "2020-12-05T20:25:45",
        ),
        (
            datetime(
                2020, 12, 5, 20, 25, 45, tzinfo=timezone(timedelta(seconds=14400))
            ),
            "2020-12-05T20:25:45",
        ),
        (datetime(2020, 12, 5, 20, 25, 45), "2020-12-05T20:25:45"),
        (datetime(2020, 12, 5, 20, 25), "2020-12-05T20:25:00"),
        (datetime(2020, 12, 5, 20), "2020-12-05T20:00:00"),
        (datetime(2020, 12, 5), "2020-12-05T00:00:00"),
        (datetime(2020, 12, 5), "2020-12-05T00:00:00"),
    ],
)
def test_datestamp_serialization(variant: datetime, formatted):
    assert Point._fmt_ts(variant) == formatted


@pytest.mark.parametrize("timestamp", ["NaN", "2020-04-29 12:06:23", "2020-04-29", ""])
def test_posting_with_invalid_timestamp_format_fails(running_server, timestamp):
    resp = requests.post(
        f"{running_server}/points/stuff",
        data=json.dumps({"value": 1.2, "timestamp": "NaN"}),
    )
    assert resp.status_code == 400


def test_existing_points(client_to_existing_content: ServerClient):
    client = client_to_existing_content

    actual = client.get_points("f-score")
    assert actual == [
        Point(
            value=0.75,
            params={},
            timestamp=datetime.fromisoformat("2020-04-29T12:06:23"),
            version=None,
        ),
        Point(
            value=0.72,
            params={},
            timestamp=datetime.fromisoformat("2020-04-29T12:06:23"),
            version=None,
        ),
    ]


def test_existing_view(client_to_existing_content: ServerClient):
    client = client_to_existing_content

    view = client.get_view("sample-view")
    assert view == [
        ChartConfig(
            metric_id="cost", x_accessor="timestamp", restrictions={"team": "vege"}
        ),
        ChartConfig(
            metric_id="cost", x_accessor="timestamp", restrictions={"team": "burgery"}
        ),
        ChartConfig(
            metric_id="cost", x_accessor="timestamp", restrictions={"team": "olimp"}
        ),
    ]


@pytest.mark.parametrize(
    "expected_status, payload",
    [
        (
            201,
            {
                "value": 3.1415,
                "version": [1, 2, 3],
                "params": {"team": "bakers", "section": "pies"},
                "timestamp": "1996-12-19T16:39:57",
            },
        ),
        (
            201,
            {
                # it's OK to skip version
                "value": 3.1415,
                "params": {},
                "timestamp": "1996-12-19T16:39:57",
            },
        ),
        (
            400,
            {
                # but value is required
                "version": [1, 2, 20],
                "params": {},
                "timestamp": "1996-12-19T16:39:57",
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
                "timestamp": "2020-12-30",
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


def test_getting_not_existing_point(running_server):
    response = requests.get(f"{running_server}/points/i-dont-exist")
    assert response.status_code == 404, f"Response text:\n '''{response.text}'''"


def test_getting_not_existing_config(running_server):
    response = requests.get(f"{running_server}/views/i-dont-exist")
    assert response.status_code == 404, f"Response text:\n '''{response.text}'''"


def test_posting_corruputed_view(running_server):
    """ View should be a list of configs, not a single config. """
    response = requests.post(
        f"{running_server}/views/a-corrupted-view",
        json=ChartConfig(
            metric_id="cost", x_accessor="timestamp", restrictions={"team": "vege"}
        )._asdict(),
    )
    assert response.status_code == 400, f"Response text:\n '''{response.text}'''"
