import io, logging
from tests import compile_server, running_redis, running_server_cm
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


if __name__ == "__main__":
    logging.info("Compiling the server...")
    compile_server()
    logging.info("Running server + redis...")
    intercepted_stderr = io.StringIO()

    with running_redis() as redis, running_server_cm(
        redis, proc_stderr=intercepted_stderr
    ) as url:
        logging.info("Inserting stuff into the server...")
        client = ServerClient(url)

        for metric, points in POINTS.items():
            for p in points:
                client.post_point(metric, p)
        client._post_view("show-stuff", SHOW_ALL)

        logging.info("Server ready. Press enter to stop.")
        input()

    logging.info("stderr intercepted from server:\n %s ", intercepted_stderr.getvalue())
    logging.info("(づ◔ ͜ʖ◔)づ DONE (づ◔ ͜ʖ◔)づ")
