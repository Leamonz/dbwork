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
