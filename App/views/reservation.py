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


@reservation_blueprint.route("/query/", methods=["GET", "POST"])
def queryReservations():
    result_msg = "ok"
    result_code = 0
    reservationList = []
    buyer = flask.request.form.get("buyer")
    # reservations = Reservation.query.filter_by(buyerusername=buyer).all()
    queryRes = db.session.query(Reservation, Goods.goodname, Goods.imageurl, Goods.sellerusername).join(
        Goods, Reservation.goodid == Goods.goodid).filter(
        Reservation.buyerusername == buyer).all()
    for (reservation, goodname, imageurl, seller) in queryRes:
        anObject = {}
        for col in Reservation.__table__.columns:
            anObject[col.name] = getattr(reservation, col.name)
        anObject["goodname"] = goodname
        anObject["imageurl"] = imageurl
        anObject["sellerusername"] = seller
        reservationList.append(anObject)
    response = flask.make_response(flask.jsonify({
        "result_msg": result_msg,
        "result_code": result_code,
        "reservations": reservationList
    }), 200)
    response.content_type = "application/json"
    response.access_control_allow_origin = "*"
    return response


@reservation_blueprint.route("/delete/", methods=["POST"])
def deleteReservation():
    result_msg = "ok"
    result_code = 0
    rid = flask.request.form.get("rid")
    print(rid)
    reservation = Reservation.query.filter_by(rid=rid).first()
    goods = Goods.query.filter_by(goodid=reservation.goodid).first()
    if reservation.status == 0:
        goods.goodnum += reservation.num
    try:
        db.session.add(goods)
        db.session.delete(reservation)
        db.session.commit()
    except Exception as e:
        print(str(e))
        result_msg = "database internal error"
        result_code = 6
    response = flask.make_response(flask.jsonify({
        "result_msg": result_msg,
        "result_code": result_code
    }), 200)
    response.content_type = "application/json"
    response.access_control_allow_origin = "*"
    return response
