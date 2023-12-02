from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Users(db.Model):
    __table_name__ = "users"
    username = db.Column(db.String(20), primary_key=True)
    passwd = db.Column(db.String(20), nullable=False)
    student = db.relationship("Student", backref="account", uselist=False)
    goods = db.relationship("Goods", backref="seller", uselist=True)

    def __init__(self, username, passwd):
        self.username = username
        self.passwd = passwd


class Student(db.Model):
    __table_name__ = "student"
    sid = db.Column(db.String(13), primary_key=True)
    username = db.Column(db.String(20), db.ForeignKey("users.username"))
    sname = db.Column(db.String(16))
    sdept = db.Column(db.String(24))
    sclass = db.Column(db.Integer())
    mailaddress = db.Column(db.String(30))
    qqid = db.Column(db.Integer())
    wechatid = db.Column(db.String(20))

    def __init__(self, sid, username, mailaddress):
        self.sid = sid
        self.username = username
        self.mailaddress = mailaddress


class Goods(db.Model):
    __table_name__ = "goods"
    goodid = db.Column(db.String(255), primary_key=True)
    goodname = db.Column(db.String(40), nullable=False)
    goodnum = db.Column(db.Integer(), nullable=False, default=1)
    goodprice = db.Column(db.Numeric(precision=15, scale=2), nullable=False)
    sellerusername = db.Column(db.String(20), db.ForeignKey("users.username"))
    imageurl = db.Column(db.String(255))
    description = db.Column(db.String(255))

    def __init__(self, goodID, goodName, goodNumber, goodPrice, sellerUsername):
        self.goodid = goodID
        self.goodname = goodName
        self.goodnum = goodNumber
        self.goodprice = goodPrice
        self.sellerusername = sellerUsername
