from app import *


def add_article():
    title = "This is the first blog"
    summary = "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Animi veniam illo, consectetur nostrum soluta deserunt et obcaecati similique quaerat ullam."
    content = "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Animi veniam illo, consectetur nostrum soluta deserunt et obcaecati similique quaerat ullam."
    date = datetime.today()
    authorID=1
    image = "test_file.png"
    blog = Articles(title=title, summary= summary, content=content, date=date, authorID = authorID, image=image)
    db.session.add(blog)
    db.session.commit()


def add_blog():
    title = "This is the first blog"
    summary = "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Animi veniam illo, consectetur nostrum soluta deserunt et obcaecati similique quaerat ullam."
    content = "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Animi veniam illo, consectetur nostrum soluta deserunt et obcaecati similique quaerat ullam."
    date = datetime.today()
    authorID=1
    blog = Blogs(title=title, summary= summary, content=content, date=date, authorID = authorID)
    db.session.add(blog)
    db.session.commit()

def add_user():
    userName = "root"
    userPassword = "toor"
    user = Users(userName= userName, userPassword=userPassword)
    db.session.add(user)
    db.session.commit()

def add_author():
    author = Authors(userID=1)
    db.session.add(author)
    db.session.commit()


def run_db():
    add_article()
    add_author()
    add_user()
    add_blog()
