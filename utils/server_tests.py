import requests, pytest

"""
USAGE:

    $ RUST_LOG=actix_web=debug cargo run
    ---
    $ pytest server_tests.py            

"""

ORIGIN = "http://127.0.0.1:8088"


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
            # no version
            200,
            {"value": 3.1415, "params": {}, "timestamp": "1996-12-19T16:39:57-08:00",},
        ),
        (
            # no value - but it's mandatory
            400,
            {
                "version": [1, 2, 20],
                "params": {},
                "timestamp": "1996-12-19T16:39:57-08:00",
            },
        ),
        (400, {"ciastko": "karmel"}),
        (
            400,
            {
                "value": 3.1415,
                "version": [1, 2, 3],
                "params": {"team": "bakers", "section": "pies"},
                "timestamp": "fzf",
            },
        ),
    ],
)
def test_post(expected_status, payload):
    response = requests.post(f"{ORIGIN}/points/mock-metric", json=payload)
    assert (
        response.status_code == expected_status
    ), f"This is supposed to return {expected_status}; response text:\n '''{response.text}'''"


@pytest.mark.parametrize(
    "expected_status, slug",
    [(404, "/svfvsfv"), (404, "/shrek"), (404, "/shrek/donkey")],
)
def test_get_various(expected_status, slug):
    response = requests.get(f"{ORIGIN}{slug}")
    assert (
        response.status_code == expected_status
    ), f"This is supposed to return {expected_status}; response text:\n '''{response.text}'''"


@pytest.mark.parametrize(
    "expected_status, slug",
    [(200, "/points/mock-metric"), (200, "/points/ANOTHER-mock-metric"),],
)
def test_get_points(expected_status, slug):
    response = requests.get(f"{ORIGIN}{slug}")
    assert (
        response.status_code == expected_status
    ), f"This is supposed to return {expected_status}; response text:\n '''{response.text}'''"


# TODO: set config test
