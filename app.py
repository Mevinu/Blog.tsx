from flask import Flask, url_for, render_template, redirect, send_from_directory, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS #type:ignore


app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI']= 'sqlite:///blog.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'
db = SQLAlchemy(app)


class Users(db.Model):
    __tablename__ = 'Users'
    userID = db.Column(db.Integer, primary_key=True)
    userName = db.Column(db.String(100))
    userPassword = db.Column(db.String(250))
    authors = db.relationship('Authors', backref='user_ref', lazy=True) 

    def to_dict(self):
        return {"userID":self.userId, "userName":self.userName, "userPassword":self.userPassword}

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
    image = db.Column(db.String(300))
    authorID = db.Column(db.Integer, db.ForeignKey('Authors.authorID'), nullable=False)
    


    def to_dict(self):
        return {"id": self.id, "title":self.title, "summary": self.summary, "content": self.content, "date": self.date, "author": self.author.to_dict(), "image": self.image}

class Authors(db.Model):
    __tablename__ = "Authors"
    authorID = db.Column(db.Integer, primary_key=True)
    userID = db.Column(db.Integer, db.ForeignKey('Users.userID'))
    blogs = db.relationship('Blogs', backref='author', lazy=True)
    articles = db.relationship('Articles', backref='author', lazy=True)
    user = db.relationship("Users")

    def to_dict(self):
        return {"authorID":self.authorID, "userID":self.userID, "userName": self.user.userName}



@app.route("/")
def index():
    blogs = Blogs.query.order_by(Blogs.date.desc()).all()
    articles = Articles.query.order_by(Articles.date.desc()).all()
    response_data = {
        "blogs":[blog.to_dict() for blog in blogs],
        "articles":[article.to_dict() for article in articles]
    }
    return jsonify(response_data)



@app.route("/blog/<int:blog_id>")
def blogPost(blog_id):
    try:
        blog = Blogs.query.get(blog_id)
        return jsonify(blog.to_dict())
    except:
        return jsonify(0)
@app.route("/allblogs")
def allBlogs():
    blogs = Blogs.query.order_by(Blogs.date.desc()).all()
    return jsonify([blog.to_dict() for blog in blogs])

@app.route("/article/<int:article_id>")
def articlePost(article_id):
    try:
        article = Articles.query.get(article_id)
        return jsonify(article.to_dict())
    except:
        return jsonify(0)
@app.route("/allarticles")
def allArticles():
    articles = Articles.query.order_by(Articles.date.desc()).all()
    return jsonify([article.to_dict() for article in articles])




@app.route("/uploads/<filename>")
def uploads(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == "__main__":
    app.run(debug=True)

