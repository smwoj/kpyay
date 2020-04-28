import requests, json, re
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


class Point:
    def __init__(
        self,
        value: Union[float, int],
        params: Optional[Dict[str, str]] = None,
        timestamp: Optional[Union[str, datetime]] = None,
        version: Optional[Union[str, Tuple[int, int, int]]] = None,
    ):
        self.value: float = float(value)
        self.params: Dict[str, str] = params or {}
        self.timestamp: Optional[datetime] = datetime.fromisoformat(
            timestamp
        ) if isinstance(timestamp, str) else timestamp
        self.version: Optional[Version] = tuple(
            map(int, version.split("."))
        ) if isinstance(version, str) else version

    def to_json(self) -> str:
        def fmt_if_datetime(value):
            return value.isoformat() if isinstance(value, datetime) else value

        return json.dumps(
            {
                field: fmt_if_datetime(value)
                for field, value in vars(self).items()
                if value is not None
            }
        )

    def __repr__(self):
        return json.dumps(vars(self))


class _ChartConfig(NamedTuple):
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

    def get_points(self, metric: str) -> Set[Point]:
        resp = requests.get(f"{self._server_url}/points/{metric}")
        if resp.status_code != 200:
            raise KPYayError(f"Fetching points failed - {_response_details(resp)}'")

        return {Point(**d) for d in json.loads(resp.text)}

    def _post_view(self, config_name: str, configs: List[_ChartConfig]) -> None:
        resp = requests.post(
            f"{self._server_url}/configs/{config_name}",
            json=[c._asdict() for c in configs],
        )
        if resp.status_code != 200:
            raise KPYayError(f"Posting config failed - {_response_details(resp)}'")

    def _get_view(self, config_name: str) -> List[_ChartConfig]:
        resp = requests.get(f"{self._server_url}/configs/{config_name}")
        if resp.status_code != 200:
            raise KPYayError(
                f"Couldn't get config '{config_name}'. {_response_details(resp)}"
            )
        return [_ChartConfig(**cfg) for cfg in json.loads(resp.text)]
