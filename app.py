from flask import Flask, request, send_from_directory, jsonify, url_for
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS #type:ignore
from werkzeug.utils import secure_filename
import os
import json
import bleach #type:ignore

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
    imageURL = db.Column(db.String(300))
    authorID = db.Column(db.Integer, db.ForeignKey('Authors.authorID'), nullable=False)
    


    def to_dict(self):
        return {"id": self.id, "title":self.title, "summary": self.summary, "content": self.content, "date": self.date, "author": self.author.to_dict(), "imageURL": self.imageURL}

class Authors(db.Model):
    __tablename__ = "Authors"
    authorID = db.Column(db.Integer, primary_key=True)
    userID = db.Column(db.Integer, db.ForeignKey('Users.userID'))
    blogs = db.relationship('Blogs', backref='author', lazy=True)
    articles = db.relationship('Articles', backref='author', lazy=True)
    user = db.relationship("Users")

    def to_dict(self):
        return {"authorID":self.authorID, "userID":self.userID, "userName": self.user.userName}


@app.route("/uploads/<filename>")
def uploads(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)



def cleanContent(content):
    sanitized_content = bleach.clean(content, tags=['p', 'ol', 'a', 'li', 'span', 'br', 'strong', 'em', 'u', ], attributes={'a': ['href', 'rel'], 'li':['data-list', 'class']})
    return sanitized_content

@app.route("/")
def index():
    blogs = Blogs.query.order_by(Blogs.date.desc()).limit(2).all()
    articles = Articles.query.order_by(Articles.date.desc()).limit(2).all()
    response_data = {
        "blogs":[blog.to_dict() for blog in blogs],
        "articles":[article.to_dict() for article in articles]
    }
    return jsonify(response_data)



@app.route("/blog/<int:blog_id>")
def blogPost(blog_id):
    try:
        blog = Blogs.query.get(blog_id)
        return jsonify(blog.to_dict()),200
    except:
        return jsonify(0),404
@app.route("/allblogs")
def allBlogs():
    blogs = Blogs.query.order_by(Blogs.date.desc()).all()
    return jsonify([blog.to_dict() for blog in blogs]), 200

@app.route("/article/<int:article_id>")
def articlePost(article_id):
    try:
        article = Articles.query.get(article_id)
        return jsonify(article.to_dict()), 200
    except:
        return jsonify(0), 400
@app.route("/allarticles")
def allArticles():
    articles = Articles.query.order_by(Articles.date.desc()).all()
    return jsonify([article.to_dict() for article in articles])


@app.route("/addblog", methods=["POST"])
def addBlog():
    data = json.loads(request.form.get('json'))
    blog = Blogs(title=bleach.clean(data["title"]), summary=bleach.clean(data["summary"]), content=cleanContent(data["content"]), authorID = data["author"], date=datetime.today())
    db.session.add(blog)
    db.session.commit()

    return jsonify(1), 200


ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS



@app.route("/addarticle", methods=["POST"])
def addArticle():
    data = json.loads(request.form.get('json'))
    image = request.files.get("image")
    filename = None
    if image and allowed_file(image.filename):
        filename = secure_filename(image.filename)
        image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        article = Articles(title=bleach.clean(data["title"]), summary=bleach.clean(data["summary"]), content=cleanContent(data["content"]), authorID = data["author"], date=datetime.today(), imageURL=f"http://127.0.0.1:5000{url_for('uploads', filename=filename)}")
        db.session.add(article)
        db.session.commit()
        return jsonify(1), 200
    else:
        return jsonify(3), 200
    

@app.route("/editblog", methods=["POST"])
def editBlog():
    data = json.loads(request.form.get('json'))
    blog = Blogs.query.get(request.args.get("postid"))
    blog.title=bleach.clean(data["title"])
    blog.summary= bleach.clean(data["summary"])
    blog.content=cleanContent(data["content"])
    blog.date=datetime.today()
    db.session.commit()
    return jsonify(1),200

@app.route("/editarticle", methods=["POST"])
def editArticle():
    data = json.loads(request.form.get('json'))
    image = request.files.get("image")
    filename = None
    if image and allowed_file(image.filename):
        filename = secure_filename(image.filename)
        image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        article = Articles.query.get(request.args.get("postid"))
        article.title=bleach.clean(data["title"])
        article.summary= bleach.clean(data["summary"])
        article.content=cleanContent(data["content"])
        article.imageURL="http://127.0.0.1:5000"+url_for('uploads', filename=filename)
        article.date=datetime.today()
    
        db.session.commit()
    return jsonify(1),200

if __name__ == "__main__":
    app.run(debug=True)

