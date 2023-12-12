import datetime

import flask
from flask import Blueprint

from App.models import *

reservation_blueprint = flask.Blueprint("reservation",
                                        __name__,
                                        url_prefix="/reservation")


@reservation_blueprint.route("/")
def reservation_page():
    return flask.render_template("my_reservation.html")
