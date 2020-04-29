import requests, json, re, warnings
from datetime import datetime
from typing import Optional, Dict, Set, Union, Tuple, NamedTuple, List

_REGEX = rf"([a-zA-Z0-9]+-)*([a-zA-Z0-9]+)"
_PARAM_RE = re.compile(_REGEX)

# validators ##############
# def _debug_repr(value) -> str:
#     value_str = str(value)[:30]
#     return f"'{value_str}' (type={type(value)})"
#
#
# ApiStr = str
#
#
# def _validate_api_str(s: str) -> str:
#     if _PARAM_RE.fullmatch(s) is None:
#         raise KPYayError(
#             f"'{s}' is not a string supported by the API. It should be a string matching: {_REGEX}"
#         )
#     return s
#
#
# XAccessor = str
#
#
# def _validate_x_accessor(x_accessor: str) -> str:
#     if not isinstance(x_accessor, str) or x_accessor not in ("timestamp", "version"):
#         raise KPYayError(
#             f"x_accessor must be either 'timestamp' or 'version', but it's {_debug_repr(x_accessor)}"
#         )
#     return x_accessor
#
#
# Version = Tuple[int, int, int]
#
#
# def _validate_version(
#     version: Union[str, Tuple[int, int, int]]
# ) -> Tuple[int, int, int]:
#     if isinstance(version, str):
#         version = tuple(int(seg) for seg in version.split("."))
#     if len(version) != 3 or any(not isinstance(i, int) for i in version):
#         raise KPYayError(
#             f"version must be a tuple of 3 ints or a string like '1.2.3', but it's {_debug_repr(version)}"
#         )
#     return version


# ########################

Version = Tuple[int, int, int]


class Point(NamedTuple):
    value: float
    params: Dict[str, str]
    timestamp: Optional[datetime]  # any timezone info will be discarded
    version: Optional[Tuple[int, int, int]]

    @classmethod
    def create(
        cls,
        value: Union[float, int],
        params: Optional[Dict[str, str]] = None,
        timestamp: Optional[Union[str, datetime]] = None,
        version: Optional[Union[str, Tuple[int, int, int]]] = None,
    ):
        """
        More flexible "constructor" variant - performs conversions if necessary.
        """
        version = (
            tuple(map(int, version.split("."))) if isinstance(version, str) else version
        )
        timestamp = (
            datetime.fromisoformat(timestamp)
            if isinstance(timestamp, str)
            else timestamp
        )
        return cls(
            value=float(value),
            params=params or {},
            timestamp=timestamp,
            version=version,
        )

    @staticmethod
    def _fmt_ts(ts: datetime):
        return ts.replace(tzinfo=None).isoformat(sep="T", timespec="seconds")

    def to_json(self) -> str:
        return json.dumps(
            {
                field: self._fmt_ts(value) if isinstance(value, datetime) else value
                for field, value in self._asdict().items()
                if value is not None
            }
        )


class ChartConfig(NamedTuple):
    metric: str
    x_accessor: str
    restrictions: Dict[str, str]


class KPYayError(Exception):
    pass


def _response_details(resp: requests.Response) -> str:
    return f"Response status={resp.status_code}, Response text='{resp.text}'"


class ServerClient:

    # functions prefixed with _ are "unsafe" api
    # - they all have typed versions that ensure invariants requested the the API

    def __init__(self, server_url: str):
        # TODO: check_server_url
        self._server_url = server_url

    def post_point(self, metric: str, p: Point) -> None:
        resp = requests.post(f"{self._server_url}/points/{metric}", data=p.to_json())
        if resp.status_code != 200:
            raise KPYayError(f"Posting points failed - {_response_details(resp)}")

    def get_points(self, metric: str) -> List[Point]:
        resp = requests.get(f"{self._server_url}/points/{metric}")
        if resp.status_code != 200:
            raise KPYayError(f"Fetching points failed - {_response_details(resp)}'")

        return [Point.create(**d) for d in json.loads(resp.text)]

    def get_view(self, config_name: str) -> List[ChartConfig]:
        resp = requests.get(f"{self._server_url}/configs/{config_name}")
        if resp.status_code != 200:
            raise KPYayError(
                f"Couldn't get config '{config_name}'. {_response_details(resp)}"
            )
        return [ChartConfig(**cfg) for cfg in json.loads(resp.text)]

    def _post_view(self, config_name: str, configs: List[ChartConfig]) -> None:
        """
        WARNING: this API is supposed to be consumed by front end!
        Front end is responsible for allowing serialization of only these views, which "render nicely".
        """
        resp = requests.post(
            f"{self._server_url}/configs/{config_name}",
            json=[c._asdict() for c in configs],
        )
        if resp.status_code != 201:
            raise KPYayError(f"Posting config failed - {_response_details(resp)}'")
