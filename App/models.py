from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Users(db.Model):
    __table_name__ = "users"
    username = db.Column(db.String(20), primary_key=True)
    passwd = db.Column(db.String(20), nullable=False)
    student = db.relationship("Student", backref="account", uselist=False, cascade="all, delete-orphan")
    goods = db.relationship("Goods", backref="seller", uselist=True)
    like = db.relationship("Favourite", backref="user", uselist=True)

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
    create_time = db.Column(db.Date())
    views = db.Column(db.Integer(), default=0)
    likes = db.Column(db.Integer(), default=0)
    reservation = db.relationship("Reservation", backref="goods", uselist=True, cascade="all, delete-orphan")
    userLikeList = db.relationship("Favourite", backref="goods", uselist=True, cascade="all, delete-orphan")

    def __init__(self, goodID, goodName, goodNumber, goodPrice, sellerUsername):
        self.goodid = goodID
        self.goodname = goodName
        self.goodnum = goodNumber
        self.goodprice = goodPrice
        self.sellerusername = sellerUsername


class Reservation(db.Model):
    __table_name__ = "reservation"
    rid = db.Column(db.String(255), primary_key=True)
    buyerusername = db.Column(db.String(20), db.ForeignKey("users.username"))
    goodid = db.Column(db.String(255), db.ForeignKey("goods.goodid"))
    num = db.Column(db.Integer(), default=0)
    total = db.Column(db.Numeric(precision=15, scale=2), nullable=False)
    create_time = db.Column(db.Date())
    status = db.Column(db.Integer(), default=0)

    def __init__(self, rid, buyer, goodid, num, total):
        self.rid = rid
        self.buyerusername = buyer
        self.goodid = goodid
        self.num = num
        self.total = total


class Favourite(db.Model):
    __table_name__ = "favourite"
    goodid = db.Column(db.String(255), db.ForeignKey("goods.goodid"),
                       primary_key=True)
    username = db.Column(db.String(255), db.ForeignKey("users.username"),
                         primary_key=True)
    create_time = db.Column(db.Date())

    def __init__(self, goodid, username, create_time):
        self.goodid = goodid
        self.username = username
        self.create_time = create_time
