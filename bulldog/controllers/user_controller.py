from flask import Blueprint, request, jsonify
from services.user_service import UserService

user_bp = Blueprint("users", __name__, url_prefix="/api/v1/users")

@user_bp.route("/", methods=["POST"])
def create_user():
    data = request.json
    UserService.create_user(data)
    return jsonify({"message": "User created successfully"}), 201

@user_bp.route("/", methods=["GET"])
def get_users():
    users = UserService.get_users()
    return jsonify([user if isinstance(user, dict) else user.__dict__ for user in users])

@user_bp.route("/<int:user_id>", methods=["GET"])
def get_user_by_id(user_id):
    user = UserService.get_user_by_id(user_id)
    return jsonify(user.to_dict())

@user_bp.route("/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    data = request.json
    UserService.update_user(user_id, data)
    return jsonify({"message": "User updated successfully"})

@user_bp.route("/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    UserService.delete_user(user_id)
    return jsonify({"message": "User deleted successfully"})
