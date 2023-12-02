import flask
import random
import string

from flask import Blueprint, current_app
from flask_mail import Message
from ..models import *

# from ...globalVar import *

login_blueprint = Blueprint("login", __name__, url_prefix='/login')


@login_blueprint.route("/page/")
def login_page():
    return flask.render_template("login.html")


@login_blueprint.route("/", methods=["GET", "POST"])
def login():
    username = flask.request.form.get("username")
    input_passwd = flask.request.form.get("password")
    user = Users.query.filter_by(username=username).first()
    if input_passwd == user.passwd:
        response = flask.make_response(flask.jsonify({
            'result_msg': 'ok',
            'result_code': 0,
        }))
    else:
        response = flask.make_response(flask.jsonify({
            'result_msg': 'password not match',
            'result_code': 10,
        }))
    response.status_code = 200
    response.content_type = "application/json"
    # 解决跨域问题
    response.access_control_allow_origin = "*"
    return response


@login_blueprint.route("/register/", methods=["POST"])
def register():
    result_msg = "ok"
    result_code = 0
    username = flask.request.form.get("username")
    passwd = flask.request.form.get("password")
    sid = flask.request.form.get("sid")
    email = flask.request.form.get("email")
    newUser = Users(username=username, passwd=passwd)
    newStudent = Student(sid=sid, username=username, mailaddress=email)
    db.session.add(newUser)
    db.session.add(newStudent)
    db.session.commit()
    response = flask.make_response(flask.jsonify({
        "result_msg": result_msg,
        "result_code": result_code
    }), 200)
    response.content_type = "application/json"
    response.access_control_allow_origin = "*"
    return response


@login_blueprint.route("/register/page/")
def register_page():
    return flask.render_template("register.html")


@login_blueprint.route("/register/verify-email/", methods=["GET", "POST"])
def send_verify_code():
    result_msg = "ok"
    code = ""
    mail = current_app.extensions['mail']
    result_code = 0
    if flask.request.method == "POST":
        mailAddr = flask.request.form.get("email")
        if not mailAddr:
            result_msg = "email address is empty"
            result_code = 11
        else:
            code = str(random.randint(100000, 999999))
            message = Message(subject='验证码', recipients=[mailAddr], body=f"您收到的验证码是：{code}")
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


@login_blueprint.route("/register/checkUsername/<string:username>/")
def checkUsername(username):
    result_msg = "ok"
    result_code = 0
    res = Users.query.filter_by(username=username).all()
    print(res)
    if res:
        result_msg = "username already exist"
        result_code = 21
    response = flask.make_response(flask.jsonify({
        "result_msg": result_msg,
        "result_code": result_code
    }), 200)
    response.content_type = "application/json"
    response.access_control_allow_origin = "*"
    return response


@login_blueprint.route("/register/checkSID/<string:sid>/")
def checkSID(sid):
    result_msg = "ok"
    result_code = 0
    res = Student.query.filter_by(sid=sid).all()
    print(res)
    if res:
        result_msg = "already have an account"
        result_code = 22
    response = flask.make_response(flask.jsonify({
        "result_msg": result_msg,
        "result_code": result_code
    }), 200)
    response.content_type = "application/json"
    response.access_control_allow_origin = "*"
    return response


def generate_new_password():
    # 定义包含数字和字母的字符集合
    characters = string.ascii_letters + string.digits
    # 生成随机密码，长度为16
    password = ''.join(random.choice(characters) for i in range(16))
    return password


@login_blueprint.route("/forgot_passwd/", methods=["GET", "POST"])
def forgot_passwd_page():
    if flask.request.method == "POST":
        result_msg = "ok"
        result_code = 0
        mail = current_app.extensions["mail"]
        username = flask.request.form.get("username")
        mailAddr = flask.request.form.get("email")
        if not mailAddr:
            result_msg = "email address is empty"
            result_code = 11
        else:
            try:
                newPasswd = generate_new_password()
                Users.query.filter_by(username=username).update({
                    "passwd": newPasswd
                })
                message = Message(subject="新密码", recipients=[mailAddr],
                                  body=f"您的新密码为：{newPasswd}。请及时在个人页面进行修改！")
                db.session.commit()
            except Exception as e:
                result_msg = "user not found"
                result_code = 23
            try:
                mail.send(message)
            except Exception as e:
                result_msg = "sending email failed"
                result_code = 12
        response = flask.make_response(flask.jsonify({
            "result_msg": result_msg,
            "result_code": result_code
        }), 200)
        response.content_type = "application/json"
        return response
    return flask.render_template("forgot-password.html")
