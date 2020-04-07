import random, doctest, itertools
from more_itertools import take
from datetime import datetime, timedelta
from typing import NamedTuple, Optional, Dict, Iterable


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


def datetimes(day_zero: datetime) -> Iterable[datetime]:
    return (day_zero + timedelta(n) for n in itertools.count())


def datestamps(day_zero: datetime = datetime(year=2020, month=1, day=12)) -> Iterable[str]:
    """
    >>> take(2, datestamps())
    ['2020-01-12', '2020-01-13']

    >>> take(3, datestamps(day_zero=datetime(2030, 12, 31)))
    ['2030-12-31', '2031-01-01', '2031-01-02']
    """

    def fmt(date: datetime):
        return date.strftime("%Y-%m-%d")

    return map(fmt, datetimes(day_zero))


def asympt_approaching_1(
        approach_speed: float = 5., jitter_factor: float = 0.03, shift: float = 0.6
) -> Iterable[float]:
    assert 1 < approach_speed
    assert 0 < jitter_factor < 1

    def y(x):
        base_val = 1 - (1 / (5 * x + shift))
        jitter = random.random() * 2 - 1

        return base_val + jitter * jitter_factor

    def within_range(x):
        return 0 < x < 1

    return filter(within_range, map(y, itertools.count()))


class Point(NamedTuple):
    value: float
    datestamps: datetime
    version: Optional[str]
    params: Dict[str, str]
    #  posted_ts: datetime


def datestamped_points(
        values: Iterable[float], datestamps: Iterable[datetime], *, params: Dict[str, str]
) -> Iterable[Point]:
    return (
        Point(value, datestamp, version=None, params=params)
        for value, datestamp, version in zip(values, datestamps, versions)
    )


def versioned_points(
        values: Iterable[float], datestamps: Iterable[datetime], *, versions: Iterable[str], params: Dict[str, str]
) -> Iterable[Point]:
    return (
        Point(value, datestamp, version, params)
        for value, datestamp, version in zip(values, datestamps, versions)
    )

# values in these dicts will differentiate plots
teams_factors = ['echo', 'foxtrot', 'lima']
classifiers = ['random-forest', 'cnn-gamma', 'cnn-eta']

if __name__ == "__main__":
    doctest.testmod()

    sloths_vs_pastry__classifier_scores = set(
        [factor * val for val in take(10, asympt_1())]
        for factor in [0.6, 0.8, 0.9]
    )
    dogs_vs_muffins = set(

    )

    # print(mock_f_scores)
    # print(mock_precision)
    # mock_recall = take(20, asympt_1())
