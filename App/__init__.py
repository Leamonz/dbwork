import flask
from flask_mail import Mail
from flask_cors import CORS
from flask_session import Session
from App.views.login import login_blueprint
from App.views.index import index_blueprint
from App.views.profile import profile_blueprint
from App.views.goods import goods_blueprint
from App.views.mart import mart_blueprint
from App.views.reservation import reservation_blueprint
from App.models import db


def create_app():
    app = flask.Flask(__name__,
                      static_url_path="/static",
                      static_folder=r"D:\Program_work\dbwork\App\static")
    # 导入配置文件
    app.config.from_pyfile("config.py")
    Session(app)
    CORS(app, supports_credentials=True)
    app.register_blueprint(login_blueprint)
    app.register_blueprint(index_blueprint)
    app.register_blueprint(profile_blueprint)
    app.register_blueprint(goods_blueprint)
    app.register_blueprint(mart_blueprint)
    app.register_blueprint(reservation_blueprint)
    # app绑定session
    mail = Mail(app)
    db.init_app(app)
    return app
