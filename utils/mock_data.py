import random, doctest, itertools, math
from itertools import starmap, chain, product, repeat
from more_itertools import take
from datetime import datetime, timedelta
from typing import Dict, Iterable, List, Optional, TypeVar
from api import Point, ChartConfig


def versions() -> Iterable[str]:
    """
    Monotonically increasing sequence of version strings.

    >>> take(2, versions())
    ['0.0.0', '1.0.0']

    >>> take(10, versions())
    ['0.0.0', '1.0.0', '1.1.0', '2.0.0', '2.1.0', '2.2.0', '3.0.0', '3.1.0', '3.2.0', '3.3.0']
    """
    return (
        f"{major}.{minor}.{bugfix}"
        for major in itertools.count()
        for minor in range((major % 7) + 1)
        for bugfix in [0]
    )


def rand_ints(prev: int) -> Iterable[int]:
    """
    # https://www.ams.org/journals/mcom/1999-68-225/S0025-5718-99-00996-5/S0025-5718-99-00996-5.pdf
    """
    assert prev != 0
    modulus = 4194301
    multiplier = 360889
    while True:
        prev = multiplier * prev % modulus
        yield prev


def datetimes(
    zero_time=datetime(year=2020, month=1, day=12), time_step=timedelta(days=1)
) -> Iterable[datetime]:
    return (zero_time + n * time_step for n in itertools.count())


def asympt_approaching_1(
    approach_speed: float = 5.0, jitter_factor: float = 0.03, shift: float = 0.6
) -> Iterable[float]:
    assert 1 <= approach_speed
    assert 0 < jitter_factor < 1

    def y(x):
        base_val = 1 - (1 / (5 * x + shift))
        jitter = random.random() * 2 - 1

        return base_val + jitter * jitter_factor

    def within_range(x):
        return 0 < x < 1

    return filter(within_range, map(y, itertools.count()))


def sins(a: float = 1, b: float = 0.1) -> Iterable[float]:
    for x in itertools.count():
        yield a * math.sin(x * b)


def squares(a: float = 1.0, b: float = 0.0, c: float = 0.0) -> Iterable[float]:
    for x in itertools.count():
        yield a * x ** 2 + b * x + c


nones = lambda: repeat(None)


T = TypeVar("T")


def flatten(*iterables: Iterable[T]) -> Iterable[T]:
    return chain.from_iterable(iterables)


def flat_collect(*iterables: Iterable[T]) -> List[T]:
    return list(flatten(*iterables))


def mk_points(
    n: int,
    values: Iterable[float],
    params: Iterable[Dict[str, str]],
    timestamps: Iterable[datetime],
    versions: Optional[Iterable[str]] = None,
) -> List[Point]:
    """
    `timestamps` are normally optional, but me here must provide them for mock data
    or else server will assign all the points almost exactly the same timestamp.
    """

    timestamps = timestamps or nones()
    versions = versions or nones()
    return take(n, starmap(Point.create, zip(values, params, timestamps, versions)))


POINTS = {
    "f-score": mk_points(
        70,
        asympt_approaching_1(),
        repeat({}),
        timestamps=datetimes(datetime(2018, 12, 24), timedelta(7)),
    ),
    "crunch-factor-rating": flat_collect(
        *(
            mk_points(
                10,
                sins(0.2 * scale, sin_b),
                repeat({"candy-bar": bar, "country": country}),
                timestamps=datetimes(datetime(2018, 12, 24), timedelta(7)),
            )
            for (bar, country), scale, sin_b in zip(
                product(
                    ["mars", "twix", "kit-kat"],
                    ["Poland", "Germany", "Czech", "Austria"],
                ),
                itertools.count(),
                (n **2 % 10 / 20 for n in itertools.count()),
            )
        )
    ),
    "lispiness": flat_collect(
        *(
            mk_points(
                10,
                sins(sa, sb),
                repeat(params),
                timestamps=datetimes(datetime(2019, 6, 1), timedelta(14)),
                versions=versions(),
            )
            for sa, sb, params in [
                (0.2, 0.5, {"lisp": "clojure"}),
                (0.4, 0.6, {"lisp": "scheme"}),
                (0.3, 0.4, {"lisp": "racket"}),
            ]
        )
    ),
    "fluffiness": flat_collect(
        *(
            mk_points(
                n,
                sins(sa, sb),
                repeat({"language": language}),
                timestamps=datetimes(time_zero, timedelta(2)),
                versions=versions(),
            )
            for n, sa, sb, language, time_zero in [
                (10, 0.2, 0.5, "javascript", datetime(2020, 4, 20)),
                (8, 0.4, 0.6, "c++", datetime(2020, 5, 2)),
                (20, 0.3, 0.4, "scala", datetime(2020, 4, 12)),
            ]
        )
    ),
    "debugging-frustration": flat_collect(
        *(
            mk_points(
                n,
                squares(sa, sb),
                repeat({"language": language}),
                timestamps=datetimes(time_zero, timedelta(2)),
                versions=versions(),
            )
            for n, sa, sb, language, time_zero in [
                (10, 0.2, 0.5, "fortran", datetime(2020, 4, 20)),
                (8, 0.4, 0.6, "ada", datetime(2020, 5, 2)),
                (20, 0.3, 0.4, "cobol", datetime(2020, 4, 12)),
            ]
        )
    ),
}
SHOW_ALL = [
    # restrictions = {} mean all the points will be visible on the chart
    # so the viewer will need to apply filters and splits before the view becomes usable
    *(
        ChartConfig(metric_id, x_accessor="timestamp", restrictions={})
        for metric_id in POINTS.keys()
    ),
    *(
        ChartConfig(metric_id, x_accessor="version", restrictions={})
        for metric_id in ["lispiness", "fluffiness", "debugging-frustration"]
    ),
]


if __name__ == "__main__":
    doctest.testmod()
