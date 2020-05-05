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
    green "COMPILES INDEED."
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
    green "PASSED."
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
    green "PASSED."
  else
    red "FAIL"
    red "ERROR: front-end tests failed - rerun with 'cd front && npm test' and fix."
    return 1
  fi
  cd ..
}
function run-front-linter() {
  cd front || exit
  echo -n "Linting front-end... "
  if npm run lint &>/dev/null; then
    green "LINTER HAPPY."
  else
    red "FAIL"
    red "ERROR: tslint is not happy - rerun with 'cd front && npm run lint' and fix."
    return 1
  fi
  cd ..
}

function run-server-linter() {
  cd server || exit
  echo -n "Linting server... "
  if [ "$(cargo-clippy |& grep -c warning)" -eq "0" ]; then
    green "LINTER HAPPY."
  else
    red "FAIL"
    red "ERROR: clippy is not happy - rerun with 'cd server && cargo-clippy' and fix."
    return 1
  fi
  cd ..
}

function run-server-linter() {
  cd server || exit
  echo -n "Linting server... "
  if [ "$(cargo-clippy |& grep -c warning)" -eq "0" ]; then
    green "PASSED."
  else
    red "FAIL"
    red "ERROR: clippy is not happy - rerun with 'cd server && cargo-clippy' and fix."
    return 1
  fi
  cd ..
}
function run-server-integration-tests() {
  cd utils || exit
  echo -n "Running server integration tests... "
  if pytest tests.py &>/dev/null; then
    green "PASSED."
  else
    red "FAIL"
    red "ERROR: server integration tests failed - rerun with 'cd utils && pytest tests.py -vv' and fix."
    return 1
  fi
  cd ..
}
function check-front-builds() {
  cd front || exit
  echo -n "Checking front app compiles... "
  if npm run build &>/dev/null; then
    green "OH YEA IT DOES."
  else
    red "FAIL"
    red "ERROR: front app failed to compile - rerun with 'cd front && npm run build' and fix."
    return 1
  fi
  cd ..
}

# the order is not optimized atm
if (
  check-server-compiles &&
    run-server-tests &&
    run-front-tests &&
    run-front-linter &&
    run-server-linter &&
    run-server-integration-tests && check-front-builds
  # todo: check all components are correctly formatted (prettier, rustfmt, black)
); then
  green "SUCCESS: All tests & checks passed."
else
  red "ERROR: Part of quality check failed, don't merge this."
fi
