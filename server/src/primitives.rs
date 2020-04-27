use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Copy, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Version(u16, u16, u16);

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Point {
    value: f64,
    version: Option<Version>,
    timestamp: DateTime<Utc>,
    params: std::collections::BTreeMap<String, String>,
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::BTreeMap;

    #[test]
    fn deserializes_from_json() {
        let parsed: Result<Point, _> = serde_json::from_str(
            r#"{"value": 3.45, "version": [1, 2, 3], "timestamp": "1996-12-19T16:39:57-08:00", "params": {}}"#,
        );
        if !&parsed.is_ok() {
            println!("{}", parsed.as_ref().err().unwrap())
        };
        let p = parsed.unwrap();
        assert_eq!(p.params, BTreeMap::new());
        assert_eq!(p.version, Some(Version(1, 2, 3)));
        assert_eq!(
            p.timestamp,
            DateTime::parse_from_rfc3339("1996-12-19T16:39:57-08:00").unwrap()
        );
    }

    #[test]
    fn deserializes_from_json_2() {
        let parsed: Result<Point, _> = serde_json::from_str(
            r#"{"value": 3.45, "timestamp": "1996-12-19T16:39:57-08:00", "params": {"team": "wege"}}"#,
        );
        if !&parsed.is_ok() {
            println!("{}", parsed.as_ref().err().unwrap())
        };
        let p = parsed.unwrap();
        assert_eq!(
            p.params,
            btreemap! {"team".to_string() => "wege".to_string()}
        );
        assert_eq!(p.version, None);
        assert_eq!(
            p.timestamp,
            DateTime::parse_from_rfc3339("1996-12-19T16:39:57-08:00").unwrap()
        );
    }
}
