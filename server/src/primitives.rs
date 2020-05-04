use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};

#[derive(Debug, Copy, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Version(u16, u16, u16);

pub type Params = std::collections::BTreeMap<String, String>;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Point {
    value: f64,
    version: Option<Version>,
    timestamp: Option<NaiveDateTime>,
    params: Option<Params>,
}

impl Point {
    // todo: introduce separate structs for API Point and db Point model - code below will be the conversion
    pub fn fill_missing(&mut self) {
        if self.timestamp.is_none() {
            self.timestamp = Some(chrono::Utc::now().naive_utc());
        }
        if self.params.is_none() {
            self.params = Some(Params::new());
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Config {
    metric_id: String,
    x_accessor: String,
    restrictions: std::collections::BTreeMap<String, String>,
}

pub type View = Vec<Config>;

#[cfg(test)]
mod tests {
    use super::*;
    use chrono::{NaiveDate, NaiveTime};
    use std::collections::BTreeMap;

    #[test]
    fn deserializes_from_json() {
        let parsed: Result<Point, _> = serde_json::from_str(
            r#"{"value": 3.45, "version": [1, 2, 3], "timestamp": "1996-12-19T16:39:57", "params": {}}"#,
        );
        if !&parsed.is_ok() {
            println!("{}", parsed.as_ref().err().unwrap())
        };
        let p = parsed.unwrap();
        assert_eq!(p.params, Some(BTreeMap::new()));
        assert_eq!(p.version, Some(Version(1, 2, 3)));
        assert_eq!(
            p.timestamp,
            Some(NaiveDateTime::new(
                NaiveDate::from_ymd(1996, 12, 19),
                NaiveTime::from_hms(16, 39, 57),
            ))
        );
    }

    #[test]
    fn deserializes_from_json_2() {
        let parsed: Result<Point, _> = serde_json::from_str(
            r#"{"value": 3.45, "timestamp": "1996-12-19T16:39:57", "params": {"team": "wege"}}"#,
        );
        if !&parsed.is_ok() {
            println!("{}", parsed.as_ref().err().unwrap())
        };
        let p = parsed.unwrap();
        assert_eq!(
            p.params,
            Some(maplit::btreemap! {"team".to_string() => "wege".to_string()})
        );
        assert_eq!(p.version, None);
        assert_eq!(
            p.timestamp,
            Some(NaiveDateTime::new(
                NaiveDate::from_ymd(1996, 12, 19),
                NaiveTime::from_hms(16, 39, 57),
            ))
        );
    }

    #[test]
    fn rejects_malformed_timestamps() {
        let parsed: Result<Point, _> = serde_json::from_str(
            r#"{"value": 3.45, "timestamp": "shakira shakira", "params": {"team": "wege"}}"#,
        );
        if !&parsed.is_ok() {
            println!("{}", parsed.as_ref().err().unwrap())
        };
    }
}

#[cfg(test)]
mod timestamp_tests {
    use super::*;
    use chrono::{NaiveDate, NaiveTime};

    #[test]
    fn timestamp_deserialization_ok() {
        let parsed: NaiveDateTime = serde_json::from_str("\"2020-04-30T13:01:50\"").unwrap();
        let expected = NaiveDateTime::new(
            NaiveDate::from_ymd(2020, 4, 30),
            NaiveTime::from_hms(13, 1, 50),
        );
        assert_eq!(parsed, expected);
    }

    #[test]
    fn timestamp_deserialization_err() {
        // the 'T' is missing - default NaiveDateTime serialization format (RFC 3339) requires it
        let parsed: Result<NaiveDateTime, _> = serde_json::from_str("\"2020-04-30 13:01:50\"");
        assert!(parsed.is_err());
    }
}
