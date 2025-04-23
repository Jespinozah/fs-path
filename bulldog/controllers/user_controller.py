from flask import Blueprint, request, jsonify
from services.user_service import UserService

user_bp = Blueprint("users", __name__, url_prefix="/api/v1/users")

@user_bp.route("", methods=["POST"])
def create_user():
    """
    Create a new user
    ---
    tags:
      - Users
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            name:
              type: string
            email:
              type: string
            age:
              type: integer
            password:
              type: string
    responses:
      201:
        description: User created successfully
    """
    data = request.json
    UserService.create_user(data)
    return jsonify({"message": "User created successfully"}), 201

@user_bp.route("", methods=["GET"])
def get_users():
    """
    Get all users
    ---
    tags:
      - Users
    responses:
      200:
        description: List of users
    """
    users = UserService.get_users()
    return jsonify([user if isinstance(user, dict) else user.__dict__ for user in users])

@user_bp.route("/<int:user_id>", methods=["GET"])
def get_user_by_id(user_id):
    """
    Get a user by ID
    ---
    tags:
      - Users
    parameters:
      - in: path
        name: user_id
        required: true
        type: integer
    responses:
      200:
        description: User details
    """
    user = UserService.get_user_by_id(user_id)
    return jsonify(user.to_dict())

@user_bp.route("/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    """
    Update a user
    ---
    tags:
      - Users
    parameters:
      - in: path
        name: user_id
        required: true
        type: integer
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            name:
              type: string
            email:
              type: string
            age:
              type: integer
            password:
              type: string
    responses:
      200:
        description: User updated successfully
    """
    data = request.json
    UserService.update_user(user_id, data)
    return jsonify({"message": "User updated successfully"})

@user_bp.route("/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    """
    Delete a user
    ---
    tags:
      - Users
    parameters:
      - in: path
        name: user_id
        required: true
        type: integer
    responses:
      200:
        description: User deleted successfully
    """
    UserService.delete_user(user_id)
    return jsonify({"message": "User deleted successfully"})
