# run all the tests, linters and stuff
# must be run from the repo root

set euxo -pipefail

# ~make it pretty ~
_RED="$(tput setaf 1)"
_GREEN="$(tput setaf 2)"
_NO_COLOR='\e[0m'
BAR="-----------------------------------------------------"

function red() {
  printf "${_RED}%s${_NO_COLOR}\n" "$@"
}
function green() {
  printf "${_GREEN}%s${_NO_COLOR}\n" "$@"
}

CWD="$(pwd)"
[[ -e "${CWD}/run_tests.sh" ]] || {
  red "${BAR}"
  red "This script must be run from repo root. (pwd=${CWD})"
  red "${BAR}"
  exit
}

# ~~~~~~~~~~~~~~~~~

function check-server-compiles() {
  cd server || exit
  echo -n "Ensuring server compiles... "
  if cargo build &>/dev/null; then
    green "OK, server compiles."
  else
    red "FAIL"
    red "ERROR: server won't compile - rerun with 'cd server && cargo build' and fix."
    return 1
  fi
  cd ..
}

function run-server-tests() {
  cd server || exit
  echo -n "Running server tests... "
  if cargo test &>/dev/null; then
    green "OK, server tests pass."
  else
    red "FAIL"
    red "ERROR: server unit tests failed - rerun with 'cd server && cargo test' and fix."
    return 1
  fi
  cd ..
}
function run-front-tests() {
  cd front || exit
  echo -n "Running front-end tests... "
  if npm test &>/dev/null; then
    green "OK, front-end tests pass."
  else
    red "FAIL"
    red "ERROR: front-end tests failed - rerun with 'cd front && npm test' and fix."
    return 1
  fi
  cd ..
}

if (
  check-server-compiles &&
    run-server-tests &&
    run-front-tests
  # todo: include pytest integration tests, check typescript compiles, linters don't complain, formatting is OK
); then
  green "SUCCESS: All tests & checks passed."
else
  red "ERROR: Part of quality check failed, don't merge this."
fi
