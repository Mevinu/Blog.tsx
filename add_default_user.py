from app import *


def add_user():
    username = "root"
    password = "toor"
    su = True
    user_exists = Users.query.filter_by(userName=username).first() is not None
    if user_exists:
        print("\n\n\n\n\n\nUser Exists [-]")
        return 0
    else:
        hashed_password = bcrypt.generate_password_hash(password)
        new_user = Users(userName=username, userPassword=hashed_password, su=su)
        db.session.add(new_user)
        db.session.commit()
        author = Authors(userID=new_user.userID)
        db.session.add(author)
        db.session.commit()
        print("\n\n\n\n\n\nUser Created [+]")


with app.app_context():
    add_user()