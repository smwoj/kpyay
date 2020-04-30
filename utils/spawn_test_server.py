import io, logging, contextlib, time
from subprocess import Popen
from tests import compile_server, running_redis, SERVER_ROOT, wait_until_responds
from api import ServerClient
from mock_data import POINTS, SHOW_ALL

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s %(name)-8s %(levelname)-8s %(message)s"
)

"""
This script:
- compiles & runs (server + redis)
- inserts a lot of stuff into it
- halts so you can `npm start` and see how the whole thing works
"""


@contextlib.contextmanager
def running_server(redis: str):
    with Popen(
        [f"{SERVER_ROOT}/target/debug/server", redis],
        env={"RUST_LOG": "actix_web=debug"},
    ) as server_process:
        url = "http://127.0.0.1:8088"
        wait_until_responds(f"{url}/")
        yield url
        server_process.terminate()


if __name__ == "__main__":
    logging.info("Compiling the server...")
    compile_server()
    logging.info("Running server + redis...")
    intercepted_stderr = io.StringIO()

    with running_redis() as redis, running_server(redis) as url:
        logging.info("Inserting stuff into the server and forwarding it's stderr...")
        time.sleep(1)
        client = ServerClient(url)

        for metric, points in POINTS.items():
            for p in points:
                client.post_point(metric, p)
        client._post_view("show-stuff", SHOW_ALL)

        logging.info("Server ready. Press enter to stop.")
        input()

    logging.info("(づ◔ ͜ʖ◔)づ DONE (づ◔ ͜ʖ◔)づ")
