from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4

db= SQLAlchemy()

def get_uuid():
    return uuid4().hex

class Users(db.Model):
    __tablename__ = 'Users'
    userID = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    userName = db.Column(db.String(100), unique=True)
    userPassword = db.Column(db.Text)
    su = db.Column(db.Boolean)
    authors = db.relationship('Authors', backref='user_ref', lazy=True) 


    def to_dict(self):
        return {"userID":self.userID, "userName":self.userName, "su": self.su}

class Blogs(db.Model):
    __tablename__= "Blogs"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(300))
    summary = db.Column(db.String(1000))
    content = db.Column(db.Text)
    date = db.Column(db.DateTime)
    authorID = db.Column(db.Integer, db.ForeignKey('Authors.authorID'), nullable=False)

    def to_dict(self):
        return {"id": self.id, "title":self.title, "summary": self.summary, "content": self.content, "date": self.date, "author": self.author.to_dict()}

class Articles(db.Model):
    __tablename__= "Articles"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(300))
    summary = db.Column(db.String(1000))
    content = db.Column(db.Text)
    date = db.Column(db.DateTime)
    imageURL = db.Column(db.String(300))
    authorID = db.Column(db.Integer, db.ForeignKey('Authors.authorID'), nullable=False)
    


    def to_dict(self):
        return {"id": self.id, "title":self.title, "summary": self.summary, "content": self.content, "date": self.date, "author": self.author.to_dict(), "imageURL": self.imageURL}

class Authors(db.Model):
    __tablename__ = "Authors"
    authorID = db.Column(db.Integer, primary_key=True)
    userID = db.Column(db.String(32), db.ForeignKey('Users.userID'))
    blogs = db.relationship('Blogs', backref='author', lazy=True)
    articles = db.relationship('Articles', backref='author', lazy=True)
    user = db.relationship("Users")

    def to_dict(self):
        return {"userName": self.user.userName}
