from datetime import timedelta

# 数据库配置
SQLALCHEMY_DATABASE_URI = "database link"
SQLALCHEMY_ECHO = True  # sqlalchemy debug mode
# 邮箱设置
MAIL_SERVER = "smtp server which your sending mail address use"
MAIL_PORT = 465
MAIL_USE_SSL = True
MAIL_USERNAME = "your sending mail address"
MAIL_PASSWORD = "enable smtp service and generate authorization code. fill the code here"
MAIL_DEFAULT_SENDER = "your sending mail address"

# Session
# Flask Session使用必须配置密钥，可以随机生成
SECRET_KEY = "ntJwJIeOGQyOku3c"
SESSION_TYPE = "filesystem"  # session类型为filesystem，可避免配置数据库
# SESSION_USE_SIGNER = True  # 是否对发送到浏览器上session的cookie值进行加密
# SESSION_KEY_PREFIX = "session: "  # 保存到session中的值的前缀
# PERMANENT_SESSION_LIFETIME = timedelta(days=1)  # session有效期1天
