from repositories.user_repository import UserRepository
from werkzeug.security import generate_password_hash

class UserService:
    @staticmethod
    def create_user(data):
        hashed_password = generate_password_hash(data["password"], method="sha256")
        data["password"] = hashed_password
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
        UserRepository.update_user(user_id, data)

    @staticmethod
    def delete_user(user_id):
        UserRepository.delete_user(user_id)
