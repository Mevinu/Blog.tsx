import os
from dotenv import load_dotenv
import redis #type:ignore


load_dotenv()


class ApplicationConfig:
    SECRET_KEY = os.environ.get("SECRET_KEY", "default_secret_key")
    
    SQLALCHEMY_DATABASE_URI = 'sqlite:///blog.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = 'uploads'
    SESSION_COOKIE_SAMESITE="None"
    SESSION_COOKIE_SECURE=False

    SESSION_TYPE = "redis"
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True
    SESSION_REDIS = redis.from_url("redis://127.0.0.1:6379")