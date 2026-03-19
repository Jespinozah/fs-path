from flask import Blueprint, request, jsonify
from services.income_service import IncomeService

income_bp = Blueprint("incomes", __name__, url_prefix="/api/v1/incomes")

@income_bp.route('', methods=['POST'])
def create_income():
    """
    Create a new income.
    ---
    tags:
      - Incomes
    requestBody:
      description: JSON object containing income data
      required: true
    responses:
      201:
        description: Income created successfully
      400:
        description: Invalid input
    """
    data = request.json
    if not data:
        return jsonify({"error": "Invalid request payload"}), 400

    try:
        income = IncomeService.create_income(data)
        return jsonify(income.to_dict()), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@income_bp.route('/bank-account/<int:bank_account_id>', methods=['GET'])
def get_incomes_by_bank_account_id(bank_account_id):
    """
    Get all incomes for a specific bank account.
    ---
    tags:
      - Incomes
    parameters:
      - name: bank_account_id
        in: path
        required: true
        description: ID of the bank account
    responses:
      200:
        description: List of incomes
    """
    incomes = IncomeService.get_incomes_by_bank_account_id(bank_account_id)
    return jsonify([income.to_dict() for income in incomes]), 200

@income_bp.route('/<int:income_id>', methods=['GET'])
def get_income_by_id(income_id):
    """
    Get a specific income by ID.
    ---
    tags:
      - Incomes
    parameters:
      - name: income_id
        in: path
        required: true
        description: ID of the income
    responses:
      200:
        description: Income details
      404:
        description: Income not found
    """
    income = IncomeService.get_income_by_id(income_id)
    if not income:
        return jsonify({"error": "Income not found"}), 404
    return jsonify(income.to_dict()), 200

@income_bp.route('/<int:income_id>', methods=['PUT'])
def update_income(income_id):
    """
    Update an existing income.
    ---
    tags:
      - Incomes
    parameters:
      - name: income_id
        in: path
        required: true
        description: ID of the income
    requestBody:
      description: JSON object containing updated income data
      required: true
    responses:
      200:
        description: Income updated successfully
      400:
        description: Invalid input
    """
    data = request.get_json()
    income = IncomeService.update_income(income_id, data)
    return jsonify(income.to_dict()), 200

@income_bp.route('/<int:income_id>', methods=['DELETE'])
def delete_income(income_id):
    """
    Delete an income by ID.
    ---
    tags:
      - Incomes
    parameters:
      - name: income_id
        in: path
        required: true
        description: ID of the income
    responses:
      204:
        description: Income deleted successfully
      404:
        description: Income not found
    """
    IncomeService.delete_income(income_id)
    return '', 204