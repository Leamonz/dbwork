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

IMAGE_DIR = "D:\Program_work\dbwork\App"


@goods_blueprint.route("/<string:username>/getAll/", methods=["GET", "POST"])
def getAll(username):
    result_msg = "ok"
    result_code = 0
    goodsList = []
    try:
        queryRes = db.session.query(Goods).filter(
            Goods.sellerusername == username).all()
        for goods in queryRes:
            anObject = {}
            for col in Goods.__table__.columns:
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
        order_by = flask.request.form.get("order_by")
        if order_by == "time":
            queryRes = db.session.query(Goods).order_by(
                Goods.create_time.desc()).all()
        elif order_by == "views":
            queryRes = db.session.query(Goods).order_by(
                Goods.views.desc()).all()
        else:
            queryRes = db.session.query(Goods).all()
        for goods in queryRes:
            anObject = {}
            for col in Goods.__table__.columns:
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
    goodName = flask.request.form.get("goodname")
    goodNumber = flask.request.form.get("goodnum")
    goodPrice = flask.request.form.get("goodprice")
    description = flask.request.form.get("description")
    objImageFile = flask.request.files.get("upload_image")
    suffix = os.path.splitext(objImageFile.filename)[-1]
    imageLocalPath = os.path.join(r"D:\Program_work\dbwork\App\static\web_images", goodID + suffix)
    objImageFile.save(imageLocalPath)
    createTime = datetime.datetime.now().strftime("%Y-%m-%d")
    newGoods = Goods(goodID, goodName, goodNumber, goodPrice, username)
    newGoods.create_time = createTime
    newGoods.imageurl = "/static/web_images/" + goodID + suffix
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
    goods = Goods.query.filter_by(goodid=goodid).first()
    db.session.delete(goods)
    db.session.commit()
    imageLocalPath = IMAGE_DIR + goods.imageurl
    print(imageLocalPath)
    os.remove(imageLocalPath)
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
    try:
        goodid = flask.request.form.get("goodid")
        goodname = flask.request.form.get("modify_goodname")
        goodprice = flask.request.form.get("modify_goodprice")
        goodnum = flask.request.form.get("modify_goodnum")
        description = flask.request.form.get("modify_description")
        print(goodid)
        objImageFile = flask.request.files.get("modify_upload_image")
    except Exception as e:
        result_msg = "parse post parameters failed"
        result_code = 5
        print(str(e))
    goods = Goods.query.filter_by(goodid=goodid).first()
    reservations = Reservation.query.filter_by(goodid=goodid).all()
    goods.goodname = goodname
    goods.goodprice = float(goodprice)
    goods.goodnum = int(goodnum)
    goods.description = description
    for reservation in reservations:
        reservation.total = goods.goodprice * reservation.num
    if objImageFile.filename:
        imageLocalPath = os.path.join(r"D:\Program_work\dbwork\App\static\web_images", goods.imageurl.split("/")[-1])
        print(imageLocalPath)
        objImageFile.save(imageLocalPath)
    try:
        db.session.add(goods)
        db.session.add_all(reservations)
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


def query(search_input, column):
    goodsList = []
    # goodsObject = Goods.query.filter(getattr(Goods, column).like(f"%{search_input}%")).all()
    queryRes = db.session.query(
        Goods).filter(
        getattr(Goods, column).like(f"%{search_input}%")).all()
    for goods in queryRes:
        anObject = {}
        for col in Goods.__table__.columns:
            anObject[col.name] = getattr(goods, col.name)
        if anObject["goodnum"]:
            goodsList.append(anObject)
    return goodsList


@goods_blueprint.route("/query/", methods=["GET", "POST"])
def queryGoods():
    result_msg = "ok"
    result_code = 0
    option = flask.request.form.get("option")
    goodsList = []
    if option == "name":
        goodname = flask.request.form.get("search_input")
        goodsList = query(goodname, "goodname")
    elif option == "seller":
        seller = flask.request.form.get("search_input")
        goodsList = query(seller, "sellerusername")
    else:
        return flask.redirect("/goods/mart/getAll/")
    response = flask.make_response(flask.jsonify({
        "result_msg": result_msg,
        "result_code": result_code,
        "goods": goodsList
    }), 200)
    response.content_type = "application/json"
    response.access_control_allow_origin = "*"
    return response


@goods_blueprint.route("/likes/update/", methods=["POST"])
def updateLikes():
    result_msg = "ok"
    result_code = 0
    goodid = flask.request.form.get("goodid")
    username = flask.request.form.get("username")
    likes = flask.request.form.get("likes")
    try:
        likeRecord = Favourite.query.filter_by(goodid=goodid, username=username).first()
        if likeRecord:
            db.session.delete(likeRecord)
        else:
            create_time = datetime.datetime.now().strftime("%Y-%m-%d")
            newLike = Favourite(goodid=goodid, username=username, create_time=create_time)
            db.session.add(newLike)
        Goods.query.filter_by(goodid=goodid).update({
            "likes": likes
        })
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


@goods_blueprint.route("/favourite/")
def favouritesPage():
    return flask.render_template("my_favourites.html")


@goods_blueprint.route("/favourites/query/", methods=["POST"])
def queryFavourites():
    result_msg = "ok"
    result_code = 0
    username = flask.request.form.get("username")
    favouritesList = []
    try:
        queryRes = db.session.query(Favourite, Goods).join(Goods, Favourite.goodid == Goods.goodid).filter(
            Favourite.username == username).order_by(
            Favourite.create_time.desc()).all()
        for (like, goods) in queryRes:
            anObject = {}
            for col in Goods.__table__.columns:
                anObject[col.name] = getattr(goods, col.name)
            anObject["username"] = username
            favouritesList.append(anObject)
    except Exception as e:
        print(str(e))
        result_msg = f"favourites history not found for user: {username}"
        result_code = 31
    response = flask.make_response(flask.jsonify({
        "result_msg": result_msg,
        "result_code": result_code,
        "favourites": favouritesList
    }), 200)
    response.content_type = "application/json"
    response.access_control_allow_origin = "*"
    return response
