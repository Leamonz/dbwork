import datetime
import random

import flask
from flask import Blueprint, current_app, g
from flask_mail import Message
from ..models import *

profile_blueprint = Blueprint("profile", __name__, url_prefix="/profile")


@profile_blueprint.route("/<string:username>/", methods=["GET", "POST"])
def profile_page(username):
    student = Student.query.filter_by(username=username).first()
    columns = Student.__table__.columns
    profile_dict = {}
    for col in columns:
        profile_dict[col.name] = getattr(student, col.name)
    now = datetime.datetime.now().strftime("%Y年%m月%d日")
    profile_dict['nowDate'] = now
    print(profile_dict)
    return flask.render_template("profile.html", **profile_dict)


@profile_blueprint.route("/user_div/", methods=["POST"])
def profile_user_div():
    result_msg = "ok"
    result_code = 0
    username = flask.request.form.get("username")
    student = Student.query.filter_by(username=username).first()
    columns = Student.__table__.columns
    profile_dict = {}
    for col in columns:
        profile_dict[col.name] = getattr(student, col.name)
    now = datetime.datetime.now().strftime("%Y年%m月%d日")
    profile_dict['nowDate'] = now
    print(profile_dict)
    response = flask.make_response(flask.jsonify({
        "result_msg": result_msg,
        "result_code": result_code,
        "student": profile_dict
    }), 200)
    response.content_type = "application/json"
    response.access_control_allow_origin = "*"
    return response


@profile_blueprint.route("/<string:username>/update/", methods=["GET", "POST"])
def update_profile(username):
    result_msg = "ok"
    result_code = 0
    student = Student.query.filter_by(username=username).first()
    data = {
        "sid": flask.request.form.get("sid"),
        "sname": flask.request.form.get("sname"),
        "mailaddress": flask.request.form.get("mailaddress"),
        "sdept": flask.request.form.get("sdept"),
        "sclass": flask.request.form.get("sclass"),
        "qqid": flask.request.form.get("qqid"),
        "wechatid": flask.request.form.get("wechatid")
    }
    for key, value in data.items():
        if value:
            setattr(student, key, value)
    db.session.commit()
    response = flask.make_response(flask.jsonify({
        "result_msg": result_msg,
        "result_code": result_code
    }), 200)
    response.content_type = "application/json"
    response.access_control_allow_origin = "*"
    return response


@profile_blueprint.route("/change-password/<string:username>/", methods=["GET", "POST"])
def change_password_page(username):
    user = Users.query.filter_by(username=username).first()
    return flask.render_template("change-password.html", username=username, password=user.passwd)


@profile_blueprint.route("/change-password/<string:username>/verify-email/", methods=["GET", "POST"])
def send_verification_code(username):
    result_msg = "ok"
    result_code = 0
    code = ""
    mail = current_app.extensions['mail']
    student = Student.query.filter_by(username=username).first()
    mailAddr = student.mailaddress
    if flask.request.method == "POST":
        if not mailAddr:
            result_msg = "email address is empty"
            result_code = 11
        else:
            code = str(random.randint(100000, 999999))
            message = Message(subject='【修改密码】 验证码', recipients=[mailAddr],
                              body=f"请确认是您本人进行操作！您收到的验证码是：{code}")
            try:
                mail.send(message)
            except Exception as e:
                result_msg = "sending email failed"
                result_code = 12
    else:
        result_msg = "method not accepted"
        result_code = 1
    response = flask.make_response(flask.jsonify({
        "result_msg": result_msg,
        "result_code": result_code,
        "code": code
    }), 200)
    response.content_type = "application/json"
    response.access_control_allow_origin = "*"
    return response


@profile_blueprint.route("/change-password/<string:username>/confirm/", methods=["GET", "POST"])
def confirm(username):
    result_msg = "ok"
    result_code = 0
    newPasswd = flask.request.form.get("new_password")
    Users.query.filter_by(username=username).update({
        "passwd": newPasswd
    })
    db.session.commit()
    response = flask.make_response(flask.jsonify({
        "result_msg": result_msg,
        "result_code": result_code
    }), 200)
    response.content_type = "application/json"
    response.access_control_allow_origin = "*"
    return response
