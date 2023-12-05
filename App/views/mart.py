import datetime

import flask
from flask import Blueprint

from App.models import *

mart_blueprint = Blueprint("mart",
                           __name__,
                           url_prefix="/mart",
                           static_url_path="/goods_images",
                           static_folder=r"D:\Program_work\dbwork\web_images")


@mart_blueprint.route("/")
def mart_index():
    return flask.render_template("mart.html")


@mart_blueprint.route("/test/")
def test():
    return flask.render_template("goods_detail.html")


@mart_blueprint.route("/<string:goodid>/page/")
def detailPage(goodid):
    result_msg = "ok"
    result_code = 0
    try:
        goods = Goods.query.filter_by(goodid=goodid).first()
    except Exception as e:
        print(str(e))
        result_msg = "goods not found"
        result_code = 24
    return flask.render_template("goods_detail.html", goods=goods)


@mart_blueprint.route("/getSeller/<string:sellerUsername>/", methods=["GET", "POST"])
def getSellerById(sellerUsername):
    result_msg = "ok"
    result_code = 0
    responseSeller = {}
    try:
        seller = Student.query.filter_by(username=sellerUsername).first()
        columns = Student.__table__.columns
        for col in columns:
            responseSeller[col.name] = getattr(seller, col.name)
    except Exception as e:
        print(str(e))
        result_msg = "user not found"
        result_code = 23
    response = flask.make_response(flask.jsonify({
        "result_msg": result_msg,
        "result_code": result_code,
        "seller": responseSeller
    }), 200)
    response.content_type = "application/json"
    response.access_control_allow_origin = "*"
    return response


@mart_blueprint.route("/reservation/", methods=["POST"])
def makeAReservation():
    result_msg = "ok"
    result_code = 0
    buyerUsername = flask.request.form.get("buyer")
    sellerUsername = flask.request.form.get("seller")
    goodid = flask.request.form.get("goodid")
    number = flask.request.form.get("num")
    total = flask.request.form.get("total")
    goods = Goods.query.filter_by(goodid=goodid).first()
    try:
        buyer = Student.query.filter_by(username=buyerUsername).first()
        if not buyer:
            raise ValueError
        seller = Student.query.filter_by(username=sellerUsername).first()
        if not seller:
            raise ValueError
        datePrefix = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        rid = "R" + datePrefix + seller.sid[-4:] + buyer.sid[-4:]
        newReservation = Reservation(rid, buyerUsername, sellerUsername, goodid, number, total)
        goods.num -= 1
        db.session.add(newReservation)
        db.session.add(goods)
        db.session.commit()
    except ValueError as e:
        result_msg = "user not found"
        result_code = 23
        print(str(e))
    except Exception as e:
        result_msg = "database internal error"
        result_code = 6
        print(str(e))
    response = flask.make_response(flask.jsonify({
        "result_msg": result_msg,
        "result_code": result_code
    }), 200)
    response.content_type = "application/json"
    response.access_control_allow_origin = "*"
    return response
