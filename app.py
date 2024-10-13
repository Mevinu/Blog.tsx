from flask import Flask, request, send_from_directory, jsonify, url_for, session, url_for, make_response
from flask_session import Session #type:ignore
from flask_bcrypt import Bcrypt #type:ignore
from datetime import datetime
from config import ApplicationConfig
from flask_cors import CORS, cross_origin #type:ignore
from werkzeug.utils import secure_filename
import os
import json
import bleach #type:ignore
from model import *


app = Flask(__name__)
app.config.from_object(ApplicationConfig)

bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:5173"}}, methods=["POST", "GET"])

server_session = Session(app)
db.init_app(app)



with app.app_context():
    db.create_all()


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




@app.route("/fake")
def fake():
    session["user_id"] = "ec49cab990d34f628d64c3d0d6e45a78"
    return jsonify(0), 200


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data["username"]
    password = data["password"]

    user = Users.query.filter_by(userName=username).first()

    if user is None:
        return jsonify({"error": "Invalied username"}), 401

    if not bcrypt.check_password_hash(user.userPassword, password):
        return jsonify({"error": "Password incorrect"}), 401
    
    session["user_id"] = user.userID
    
    return jsonify(0), 200

@app.route("/createuser", methods=["POST"])
def createUser():
    data = request.get_json()
    
    username = data["username"]
    password = data["password"]

    user_exists = Users.query.filter_by(userName=username).first() is not None

    if user_exists:
        return jsonify({"error": "User already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = Users(userName=username, userPassword=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    session["user_id"] = new_user.userID

    author = Authors(userID=new_user.userID)
    db.session.add(author)
    db.session.commit()
    return jsonify("User created"), 200


@app.route('/admin')
def admin():
    userID = session.get("user_id")
    print(f"user id is {userID}")
    if not userID:
        return jsonify({"error": "Unauthorized"}), 401
    
    return jsonify({"status": "logged in"}), 200

    '''
    
    authorID = Authors.query.filter_by(userID=userID).first().authorID
    blogs = Blogs.query.filter_by(authorID=authorID).all()
    articles = Articles.query.filter_by(authorID=authorID).all()
    response_data = {
        "blogs":[blog.to_dict() for blog in blogs],
        "articles":[article.to_dict() for article in articles]
    }
    return jsonify(response_data)

'''


@app.route("/addblog", methods=["POST"])
def addBlog():
    userID = session.get("user_id")
    if not userID:
        return jsonify({"error": "Unauthorized"}), 401
    
    data = json.loads(request.form.get('json'))
    author = Authors.query.filter_by(userID=userID).first();
    blog = Blogs(title=bleach.clean(data["title"]), summary=bleach.clean(data["summary"]), content=cleanContent(data["content"]), authorID = author.authorID, date=datetime.today())
    db.session.add(blog)
    db.session.commit()

    return jsonify(1), 200


ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS



@app.route("/addarticle", methods=["POST"])
def addArticle():
    userID = session.get("user_id")
    if not userID:
        return jsonify({"error": "Unauthorized"}), 401


    data = json.loads(request.form.get('json'))
    image = request.files.get("image")
    author = Authors.query.filter_by(userID=userID).first();
    filename = None
    if image and allowed_file(image.filename):
        filename = secure_filename(image.filename)
        image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        article = Articles(title=bleach.clean(data["title"]), summary=bleach.clean(data["summary"]), content=cleanContent(data["content"]), authorID = author.authorID, date=datetime.today(), imageURL=f"http://127.0.0.1:5000{url_for('uploads', filename=filename)}")
        db.session.add(article)
        db.session.commit()
        return jsonify(1), 200
    else:
        return jsonify(3), 200
    

@app.route("/editblog", methods=["POST"])
def editBlog():
    userID = session.get("user_id")
    if not userID:
        return jsonify({"error": "Unauthorized"}), 401

    blog = Blogs.query.get(request.args.get("postid"))
    authorID = Authors.query.filter_by(userID=userID)
    if blog.authorID != authorID:
        return jsonify({"error": "Unauthorized"}), 401
    
    data = json.loads(request.form.get('json'))

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

