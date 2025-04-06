from models import User
from database import db

class UserRepository:
    @staticmethod
    def create_user(data):
        user = User(**data)
        db.session.add(user)
        db.session.commit()

    @staticmethod
    def get_users():
        return User.query.all()

    @staticmethod
    def get_user_by_id(user_id):
        return User.query.get(user_id)

    @staticmethod
    def get_user_by_email(email):
        return User.query.filter_by(email=email).first()

    @staticmethod
    def update_user(user_id, data):
        user = User.query.get(user_id)
        for key, value in data.items():
            setattr(user, key, value)
        db.session.commit()

    @staticmethod
    def delete_user(user_id):
        user = User.query.get(user_id)
        db.session.delete(user)
        db.session.commit()
