from flask import Blueprint, request, jsonify
from services.bank_account_service import BankAccountService

bank_account_bp = Blueprint("bank_accounts", __name__, url_prefix="/api/v1/bank-accounts")

@bank_account_bp.route("", methods=["POST"])
def create_bank_account():
    """
    Create a new bank account
    ---
    tags:
      - Bank Accounts
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            user_id:
              type: integer
            bank_name:
              type: string
            account_number:
              type: string
            routing_number:
              type: string
            account_type:
              type: string
            alias:
              type: string
            balance:
              type: number
    responses:
      201:
        description: Bank account created successfully
      400:
        description: Invalid request payload
    """
    data = request.json
    if not data or not data.get("user_id") or not data.get("bank_name") or not data.get("account_number") or not data.get("routing_number") or not data.get("account_type"):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        bank_account = BankAccountService.create_bank_account(data)
        return jsonify(bank_account.to_dict()), 201
    except Exception as e:
        return jsonify({"error": "Failed to create bank account"}), 500

@bank_account_bp.route("/user/<int:user_id>", methods=["GET"])
def get_bank_accounts_by_user_id(user_id):
    """
    Get all bank accounts for a user
    ---
    tags:
      - Bank Accounts
    parameters:
      - in: path
        name: user_id
        required: true
        type: integer
    responses:
      200:
        description: List of bank accounts
    """
    bank_accounts = BankAccountService.get_bank_accounts_by_user_id(user_id)
    return jsonify([account.to_dict() for account in bank_accounts]), 200

@bank_account_bp.route("/<int:account_id>", methods=["GET"])
def get_bank_account_by_id(account_id):
    """
    Get a bank account by ID
    ---
    tags:
      - Bank Accounts
    parameters:
      - in: path
        name: account_id
        required: true
        type: integer
    responses:
      200:
        description: Bank account details
    """
    bank_account = BankAccountService.get_bank_account_by_id(account_id)
    if not bank_account:
        return jsonify({"error": "Bank account not found"}), 404
    return jsonify(bank_account.to_dict()), 200

@bank_account_bp.route("/<int:account_id>", methods=["PUT"])
def update_bank_account(account_id):
    """
    Update a bank account
    ---
    tags:
      - Bank Accounts
    parameters:
      - in: path
        name: account_id
        required: true
        type: integer
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            bank_name:
              type: string
            account_number:
              type: string
            routing_number:
              type: string
            account_type:
              type: string
            alias:
              type: string
            balance:
              type: number
    responses:
      200:
        description: Bank account updated successfully
    """
    data = request.json
    bank_account = BankAccountService.update_bank_account(account_id, data)
    return jsonify(bank_account.to_dict()), 200

@bank_account_bp.route("/<int:account_id>", methods=["DELETE"])
def delete_bank_account(account_id):
    """
    Delete a bank account
    ---
    tags:
      - Bank Accounts
    parameters:
      - in: path
        name: account_id
        required: true
        type: integer
    responses:
      200:
        description: Bank account deleted successfully
    """
    BankAccountService.delete_bank_account(account_id)
    return jsonify({"message": "Bank account deleted successfully"}), 200

@bank_account_bp.route("/users/<int:user_id>/incomes", methods=["GET"])
def get_incomes_by_user_id(user_id):
    """
    Get all incomes for a user by their user ID.
    ---
    tags:
      - Bank Accounts
    parameters:
      - in: path
        name: user_id
        required: true
        type: integer
        description: ID of the user
    responses:
      200:
        description: List of incomes for the user
    """
    incomes = BankAccountService.get_incomes_by_user_id(user_id)
    return jsonify([income.to_dict() for income in incomes]), 200
