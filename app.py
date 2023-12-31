import flask
from App import create_app

app = create_app()


@app.route("/")
def index():
    return flask.redirect("/login/page/")


if __name__ == "__main__":
    app.run(host="localhost", port=8888, debug=True)
