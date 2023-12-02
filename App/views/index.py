import flask
from flask import Blueprint

index_blueprint = Blueprint("index", __name__, url_prefix="/index")


@index_blueprint.route("/")
def index():
    return flask.render_template("index.html")
