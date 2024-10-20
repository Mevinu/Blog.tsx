from flask import Flask, request, send_from_directory, jsonify, url_for, session, url_for, make_response
from flask_session import Session #type:ignore
from flask_bcrypt import Bcrypt #type:ignore
from datetime import datetime
from config import ApplicationConfig
from flask_cors import CORS#type:ignore
from werkzeug.utils import secure_filename
import os
import json
import bleach #type:ignore
from model import *
from uuid import uuid4

app = Flask(__name__)
app.config.from_object(ApplicationConfig)

bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)

server_session = Session(app)
db.init_app(app)



with app.app_context():
    db.create_all()


@app.route("/uploads/<filename>")
def uploads(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)



def cleanContent(content):
    sanitized_content = bleach.clean(content, tags=['p', 'ol', 'a', 'li', 'span', 'br', 'strong', 'em', 'u', ], attributes={'a': ['href', 'rel'], 'li':['data-list', 'class'], 'span':['class', 'contenteditable']})
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
    
    return jsonify({"status":"logged in"}), 200

@app.route("/createuser", methods=["POST"])
def createUser():
    data = request.get_json()
    userID = Users.query.filter_by(userID=session.get("user_id")).first().su
    
    if not userID:
        return jsonify({"error": "Unauthorized"}), 401
    

    username = data["username"]
    password = data["password"]
    su = data["su"]

    user_exists = Users.query.filter_by(userName=username).first() is not None

    if user_exists:
        return jsonify({"error": "User already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = Users(userName=username, userPassword=hashed_password, su=su)
    db.session.add(new_user)
    db.session.commit()
    session["user_id"] = new_user.userID

    author = Authors(userID=new_user.userID)
    db.session.add(author)
    db.session.commit()
    return jsonify("User created"), 200


@app.route("/logout")
def logout():
    session.pop("user_id")
    return jsonify(1), 200

@app.route("/checkuser")
def checkUser():
    userID = session.get("user_id")
    if not userID:
        return jsonify({"error": "unauthorized"}), 401
    
    suUser = Users.query.filter_by(userID=userID).first().su
    if suUser:
        return jsonify({"su": True}), 200

    return jsonify({"status":"authorized"}), 200

@app.route('/admin')
def admin():
    userID  = session.get("user_id")
    try:
        author = Authors.query.filter_by(userID=userID).first()
        sessionuser = Users.query.filter_by(userID=userID).first()
        if not userID:
            return jsonify({"error": "Unauthorized"}), 401
        
        blogs = Blogs.query.filter_by(authorID=author.authorID).order_by(Blogs.date.desc()).all()
        articles = Articles.query.filter_by(authorID=author.authorID).order_by(Articles.date.desc()).all()
 
        if sessionuser.su:
            response_data = {
                "blogs":[blog.to_dict() for blog in Blogs.query.order_by(Blogs.date.desc()).all()],
                "articles":[article.to_dict() for article in Articles.query.order_by(Articles.date.desc()).all()],
                "users":[user.to_dict() for user in Users.query.all()]
            }
        else:
            response_data = {
                "blogs":[blog.to_dict() for blog in blogs],
                "articles":[article.to_dict() for article in articles]
            }
        return jsonify(response_data), 200
    except:
        return jsonify(0), 200
    

@app.route("/deleteuser", methods=["DELETE"])
def deleteUser():
    userID = session.get("user_id")
    if not userID:
        return jsonify({"error":"unauthorized"}), 401
    
    requestUser = Users.query.filter_by(userID=userID).first()
    if requestUser.su == True:
        deleteUserID = request.args.get("userid")
        deleteUserAuthorID = Authors.query.filter_by(userID=deleteUserID).first().authorID
        requestUserAuthorID = Authors.query.filter_by(userID=userID).first().authorID
        deleteUserBlogs = Blogs.query.filter_by(authorID=deleteUserAuthorID).all()
        deleteUserArticles = Articles.query.filter_by(authorID=deleteUserAuthorID).all()

        for blog in deleteUserBlogs:
            blog.authorID = requestUserAuthorID
        for article in deleteUserArticles:
            article.authorID = requestUserAuthorID
        
        db.session.delete(Users.query.filter_by(userID=deleteUserID).first())
        db.session.commit()

        return jsonify({"status":"data updated"}), 200

    return jsonify({"error":"unauthorized"}), 401 

@app.route("/getblog/<int:blog_id>")
def getBlogPost(blog_id):
    userID = session.get("user_id")
    try:
        authorID = Authors.query.filter_by(userID=userID).first().authorID
        blog = Blogs.query.get(blog_id)
        userSU = Users.query.filter_by(userID=userID).first().su
        if blog.authorID == authorID or userSU:
            return jsonify(blog.to_dict()),200
        else:
            return jsonify(0),401
    except:
        return jsonify(0),404


@app.route("/getarticle/<int:article_id>")
def getArticlePost(article_id):
    userID = session.get("user_id")
    try:
        authorID = Authors.query.filter_by(userID=userID).first().authorID
        article = Articles.query.get(article_id)
        userSU = Users.query.filter_by(userID=userID).first().su
        if article.authorID == authorID or userSU:
            return jsonify(article.to_dict()),200
        else:
            return jsonify(0),401
    except:
        return jsonify(0),404



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
        file_extension = os.path.splitext(filename)[1]
        unique_filename = f"{uuid4()}{file_extension}"

        image.save(os.path.join(app.config['UPLOAD_FOLDER'], unique_filename))
        article = Articles(title=bleach.clean(data["title"]), summary=bleach.clean(data["summary"]), content=cleanContent(data["content"]), authorID = author.authorID, date=datetime.today(), imageURL=f"http://127.0.0.1:5000{url_for('uploads', filename=unique_filename)}")
        db.session.add(article)
        db.session.commit()
        return jsonify(1), 200
    else:
        return jsonify(1), 406 
    

@app.route("/editblog", methods=["POST"])
def editBlog():
    userID = session.get("user_id")
    if not userID:
        return jsonify({"error": "Unauthorized"}), 401

    blog = Blogs.query.get(request.args.get("postid"))
    authorID = Authors.query.filter_by(userID=userID).first().authorID
    userSU = Users.query.filter_by(userID=userID).first().su


    if blog.authorID != authorID and userSU == False:
        return jsonify({"error": "Unauthorized"}), 401
    
    data = json.loads(request.form.get('json'))

    blog.title=bleach.clean(data["title"])
    blog.authorID = authorID
    blog.summary= bleach.clean(data["summary"])
    blog.content=cleanContent(data["content"])
    blog.date=datetime.today()
    db.session.commit()
    return jsonify(1),200


@app.route("/editarticle", methods=["POST"])
def editArticle():
    userID = session.get("user_id")

    if not userID:
        return jsonify({"error":"unauthorized"}), 401
    
    data = json.loads(request.form.get('json'))
    image = request.files.get("image")
    filename = None
    if image and allowed_file(image.filename):
        filename = secure_filename(image.filename)
        file_extension = os.path.splitext(filename)[1]
        unique_filename = f"{uuid4()}{file_extension}"

        image.save(os.path.join(app.config['UPLOAD_FOLDER'], unique_filename))
        article = Articles.query.get(request.args.get("postid"))
        authorID = Authors.query.filter_by(userID=userID).first().authorID
        userSU = Users.query.filter_by(userID=userID).first().su 

        if article.authorID != authorID and userSU == False:
            return jsonify({"error": "Unauthorized"}), 401


        article.title=bleach.clean(data["title"])
        article.summary= bleach.clean(data["summary"])
        article.authorID = authorID
        article.content=cleanContent(data["content"])
        article.imageURL="http://127.0.0.1:5000"+url_for('uploads', filename=unique_filename)
        article.date=datetime.today()
    
        db.session.commit()
    return jsonify(1),200



@app.route("/deleteblog", methods=['DELETE'])
def deleteBlog():
    userID = session.get("user_id")
    postID = request.args.get("postid")
    if not userID:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        blog = Blogs.query.get(postID)
        authorID = Authors.query.filter_by(userID=userID).first().authorID
        if blog.authorID == authorID:
            db.session.delete(blog)
            db.session.commit()
            return jsonify({"status":"Post deleted"}), 200
        else:
            return jsonify({"error": "Unauthorized"}), 401
    except:
        return jsonify({"error":"Invalied post number"}), 404
    
@app.route("/deletearticle", methods=['DELETE'])
def deleteArticle():
    userID = session.get("user_id")
    postID = request.args.get("postid")
    if not userID:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        article = Articles.query.get(postID)
        authorID = Authors.query.filter_by(userID=userID).first().authorID
        if article.authorID == authorID:
            db.session.delete(article)
            db.session.commit()
            return jsonify({"status":"Post deleted"}), 200
        else:
            return jsonify({"error": "Unauthorized"}), 401
    except:
        return jsonify({"error":"Invalied post number"}), 404

if __name__ == "__main__":
    app.run(debug=True)

