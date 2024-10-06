from flask import Flask, url_for, render_template, redirect, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI']= 'sqlite:///blog.db'
app.config['UPLOAD_FOLDER'] = 'uploads'
db = SQLAlchemy(app)


class Users(db.Model):
    __tablename__ = 'Users'
    userID = db.Column(db.Integer, primary_key=True)
    userName = db.Column(db.String(100))
    userPassword = db.Column(db.String(250))
    authors = db.relationship('Authors', backref='user', lazy=True) 

class Blogs(db.Model):
    __tablename__= "Blogs"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(300))
    summary = db.Column(db.String(1000))
    content = db.Column(db.Text)
    date = db.Column(db.DateTime)
    authorID = db.Column(db.Integer, db.ForeignKey('Authors.authorID'), nullable=False)

class Articles(db.Model):
    __tablename__= "Articles"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(300))
    summary = db.Column(db.String(1000))
    content = db.Column(db.Text)
    date = db.Column(db.DateTime)
    image = db.Column(db.String(300))
    authorID = db.Column(db.Integer, db.ForeignKey('Authors.authorID'), nullable=False)

class Authors(db.Model):
    __tablename__ = "Authors"
    authorID = db.Column(db.Integer, primary_key=True)
    userID = db.Column(db.Integer, db.ForeignKey('Users.userID'))
    blogs = db.relationship('Blogs', backref='author', lazy=True)
    articles = db.relationship('Articles', backref='author', lazy=True)



@app.route("/")
def index():
    blogs = Blogs.query.order_by(Blogs.date.desc()).all()
    articles = Articles.query.order_by(Articles.date.desc()).all()
    return render_template('index.html', blogs = blogs, articles = articles)


@app.route("/blog/<int:blog_id>")
def blogPost(blog_id):
    blog = Blogs.query.get(blog_id)
    return render_template("post.html", post = blog)

@app.route("/allblogs")
def allBlogs():
    blogs = Blogs.query.order_by(Blogs.date.desc()).all()
    return render_template('blogs.html', blogs=blogs)

@app.route("/article/<int:article_id>")
def articlePost(article_id):
    article = Articles.query.get(article_id)
    return render_template("post.html", post = article)

@app.route("/allarticles")
def allArticles():
    articles = Articles.query.order_by(Articles.date.desc()).all()
    return render_template('articles.html', articles=articles)




@app.route("/uploads/<filename>")
def uploads(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


def add_blog():
    title = "This is the first blog"
    summary = "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Animi veniam illo, consectetur nostrum soluta deserunt et obcaecati similique quaerat ullam."
    content = "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Animi veniam illo, consectetur nostrum soluta deserunt et obcaecati similique quaerat ullam."
    date = datetime.today()
    authorID=1
    image = "test_file.png"
    blog = Articles(title=title, summary= summary, content=content, date=date, authorID = authorID, image=image)
    db.session.add(blog)
    db.session.commit()


if __name__ == "__main__":
    app.run(debug=True)

