from flask import Blueprint, request, jsonify, make_response
import bcrypt
from services.user_service import UserService
import jwt
import datetime

login_bp = Blueprint("auth", __name__, url_prefix="/api/v1/auth")

SECRET_KEY = "my_secret_key"  # Replace with a secure key in production

@login_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password are required"}), 400

    user = UserService.get_user_by_email(data["email"])
    if not user or not bcrypt.checkpw(data["password"].encode("utf-8"), user.password.encode("utf-8")):
        return jsonify({"error": "Invalid email or password"}), 401

    # Generate access and refresh tokens
    access_token = jwt.encode(
        {
            "email": user.email,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=15),
        },
        SECRET_KEY,
        algorithm="HS256",
    )
    refresh_token = jwt.encode(
        {
            "email": user.email,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1),
        },
        SECRET_KEY,
        algorithm="HS256",
    )

    response = make_response(
        jsonify({"access_token": access_token, "user_id": user.id})
    )
    response.set_cookie("refresh_token", refresh_token, httponly=True)
    return response, 200


@login_bp.route("/refresh", methods=["POST"])
def refresh():
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        return jsonify({"error": "Missing refresh token"}), 401

    try:
        decoded = jwt.decode(refresh_token, SECRET_KEY, algorithms=["HS256"])
        new_access_token = jwt.encode(
            {
                "email": decoded["email"],
                "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=15),
            },
            SECRET_KEY,
            algorithm="HS256",
        )
        return jsonify({"access_token": new_access_token}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Refresh token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid refresh token"}), 401


@login_bp.route("/logout", methods=["POST"])
def logout():
    response = make_response(jsonify({"message": "Logged out successfully"}))
    response.set_cookie("refresh_token", "", expires=0)
    return response, 200
