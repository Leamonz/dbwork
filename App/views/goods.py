import datetime
import numpy as np
import cv2
import base64
import os
import re
from PIL import Image
from io import BytesIO

import flask
from flask import Blueprint, current_app
from werkzeug.utils import secure_filename

from ..models import *

goods_blueprint = Blueprint("goods",
                            __name__,
                            url_prefix="/goods")


@goods_blueprint.route("/<string:username>/getAll/", methods=["GET", "POST"])
def getAll(username):
    result_msg = "ok"
    result_code = 0
    goodsList = []
    try:
        goodsObject = Goods.query.filter_by(sellerusername=username).all()
        columns = Goods.__table__.columns
        for goods in goodsObject:
            anObject = {}
            for col in columns:
                anObject[col.name] = getattr(goods, col.name)
            goodsList.append(anObject)
    except Exception as e:
        print(str(e))
        result_msg = "database internal error"
        result_code = 6
    # print(goodsList)
    response = flask.make_response(flask.jsonify({
        "result_msg": result_msg,
        "result_code": result_code,
        "goods": goodsList,
    }), 200)
    response.content_type = "application/json"
    response.access_control_allow_origin = "*"
    return response


@goods_blueprint.route("/mart/getAll/", methods=["GET", "POST"])
def martGetAll():
    result_msg = "ok"
    result_code = 0
    goodsList = []
    try:
        goodsObject = Goods.query.all()
        columns = Goods.__table__.columns
        for goods in goodsObject:
            anObject = {}
            for col in columns:
                anObject[col.name] = getattr(goods, col.name)
            if anObject["goodnum"]:
                goodsList.append(anObject)
    except Exception as e:
        print(str(e))
        result_msg = "database internal error"
        result_code = 6
    # print(goodsList)
    response = flask.make_response(flask.jsonify({
        "result_msg": result_msg,
        "result_code": result_code,
        "goods": goodsList,
    }), 200)
    response.content_type = "application/json"
    response.access_control_allow_origin = "*"
    return response


@goods_blueprint.route("/<string:username>/getOne/", methods=["GET", "POST"])
def getOne(username):
    result_msg = "ok"
    result_code = 0
    goodid = flask.request.form.get("goodid")
    goods = Goods.query.filter_by(goodid=goodid).first()
    responseGoods = {}
    columns = Goods.__table__.columns
    for col in columns:
        responseGoods[col.name] = getattr(goods, col.name)
    response = flask.make_response(flask.jsonify({
        "result_msg": result_msg,
        "result_code": result_code,
        "goods": responseGoods
    }), 200)
    return response


@goods_blueprint.route("/<string:username>/add/", methods=["GET", "POST"])
def addOne(username):
    result_msg = "ok"
    result_code = 0
    student = Student.query.filter_by(username=username).first()
    datePrefix = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    goodID = "G" + datePrefix + student.sid[-8:]
    try:
        goodName = flask.request.form.get("goodname")
        goodNumber = flask.request.form.get("goodnum")
        goodPrice = flask.request.form.get("goodprice")
        description = flask.request.form.get("description")
        objImageFile = flask.request.files.get("upload_image")
    except Exception as e:
        print(str(e))
        result_msg = "parse post parameters failed"
        result_code = 5
    suffix = os.path.splitext(objImageFile.filename)[-1]
    imageLocalPath = os.path.join(r"D:\Program_work\dbwork\web_images", goodID + suffix)
    objImageFile.save(imageLocalPath)
    newGoods = Goods(goodID, goodName, goodNumber, goodPrice, username)
    newGoods.imageurl = imageLocalPath
    newGoods.description = description
    try:
        db.session.add(newGoods)
        db.session.commit()
    except Exception as e:
        print(str(e))
        result_msg = "database internal error"
        result_code = 6
    response = flask.make_response(flask.jsonify({
        "result_msg": result_msg,
        "result_code": result_code
    }))
    response.content_type = "application/json"
    response.access_control_allow_origin = "*"
    return response


@goods_blueprint.route("/<string:username>/delete/", methods=["GET", "POST"])
def deleteOne(username):
    result_msg = "ok"
    result_code = 0
    goodid = flask.request.form.get("goodid")
    print(goodid)
    goods = Goods.query.filter_by(goodid=goodid).first()
    os.remove(goods.imageurl)
    db.session.delete(goods)
    db.session.commit()
    response = flask.make_response(flask.jsonify({
        "result_msg": result_msg,
        "result_code": result_code
    }), 200)
    response.content_type = "application/json"
    response.access_control_allow_origin = "*"
    return response


@goods_blueprint.route("/<string:username>/modify/", methods=["GET", "POST"])
def modify(username):
    result_msg = "ok"
    result_code = 0
    goodid = flask.request.form.get("goodid")
    goodname = flask.request.form.get("modify_goodname")
    goodprice = flask.request.form.get("modify_goodprice")
    goodnum = flask.request.form.get("modify_goodnum")
    description = flask.request.form.get("modify_description")
    print(goodid)
    objImageFile = flask.request.files.get("modify_upload_image")
    goods = Goods.query.filter_by(goodid=goodid).first()
    if objImageFile.filename:
        objImageFile.save(goods.imageurl)
    Goods.query.filter_by(goodid=goodid).update({
        "goodname": goodname,
        "goodprice": goodprice,
        "goodnum": goodnum,
        "description": description
    })
    try:
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
    return response
