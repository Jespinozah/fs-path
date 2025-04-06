import bcrypt
from repositories.user_repository import UserRepository

class UserService:
    @staticmethod
    def create_user(data):
        # Hash the password using bcrypt
        hashed_password = bcrypt.hashpw(data["password"].encode("utf-8"), bcrypt.gensalt())
        data["password"] = hashed_password.decode("utf-8")
        UserRepository.create_user(data)

    @staticmethod
    def get_users():
        return UserRepository.get_users()

    @staticmethod
    def get_user_by_id(user_id):
        return UserRepository.get_user_by_id(user_id)

    @staticmethod
    def get_user_by_email(email):
        return UserRepository.get_user_by_email(email)

    @staticmethod
    def update_user(user_id, data):
        # Hash the password if it is being updated
        if "password" in data and data["password"]:
            hashed_password = bcrypt.hashpw(data["password"].encode("utf-8"), bcrypt.gensalt())
            data["password"] = hashed_password.decode("utf-8")
        UserRepository.update_user(user_id, data)

    @staticmethod
    def delete_user(user_id):
        UserRepository.delete_user(user_id)
