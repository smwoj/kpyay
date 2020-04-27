import requests
from typing import NamedTuple

ORIGIN = "http://127.0.0.1:8088"


class Point(NamedTuple):
    value: float
    timestamp: datetime
    posted_ts: datetime
    version: Optional[str]
    params: Dict[str, str]

    def json_dict(self) -> Dict[str, str]:
        def fmt_if_datetime(value):
            return value.isoformat() if isinstance(value, datetime) else value

        return {
            field: fmt_if_datetime(value) for field, value in self._asdict().items()
        }


def post_point(metric, point):
    resp = requests.post(f"{ORIGIN}/points/{metric}", json=point)
    assert resp.status_code == 200
    return resp


if __name__ == "__main__":
    # assumes the server database is empty
    post_point("alfa", {})
