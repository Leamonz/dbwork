import flask
from flask_mail import Mail
from flask_cors import CORS
from .views.login import login_blueprint
from .views.index import index_blueprint
from .views.profile import profile_blueprint
from .views.goods import goods_blueprint
from .models import db


def create_app():
    app = flask.Flask(__name__)
    CORS(app, supports_credentials=True)
    app.register_blueprint(login_blueprint)
    app.register_blueprint(index_blueprint)
    app.register_blueprint(profile_blueprint)
    app.register_blueprint(goods_blueprint)
    # 导入配置文件
    app.config.from_pyfile("config.py")
    mail = Mail(app)
    db.init_app(app)
    return app
