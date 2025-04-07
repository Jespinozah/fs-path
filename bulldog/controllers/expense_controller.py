from flask import Blueprint, request, jsonify
from services.expense_service import ExpenseService

expense_bp = Blueprint("expenses", __name__, url_prefix="/api/v1/expenses")

@expense_bp.route("/", methods=["POST"])
def create_expense():
    """
    Create a new expense
    ---
    tags:
      - Expenses
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            user_id:
              type: integer
            amount:
              type: number
            category:
              type: string
            date:
              type: string
              format: date
            description:
              type: string
    responses:
      201:
        description: Expense created successfully
    """
    data = request.json
    if not data:
        return jsonify({"error": "Invalid request payload"}), 400

    try:
        ExpenseService.create_expense(data)
        return jsonify({"message": "Expense created successfully"}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Failed to create expense"}), 500


@expense_bp.route("/", methods=["GET"])
def get_expenses():
    """
    Get all expenses
    ---
    tags:
      - Expenses
    responses:
      200:
        description: List of expenses
    """
    try:
        expenses = ExpenseService.get_expenses()
        return jsonify([expense.to_dict() for expense in expenses]), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch expenses"}), 500


@expense_bp.route("/<int:expense_id>", methods=["GET"])
def get_expense_by_id(expense_id):
    """
    Get an expense by ID
    ---
    tags:
      - Expenses
    parameters:
      - in: path
        name: expense_id
        required: true
        type: integer
    responses:
      200:
        description: Expense details
    """
    try:
        expense = ExpenseService.get_expense_by_id(expense_id)
        if not expense:
            return jsonify({"error": "Expense not found"}), 404
        return jsonify(expense.to_dict()), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch expense"}), 500


@expense_bp.route("/<int:expense_id>", methods=["PUT"])
def update_expense(expense_id):
    """
    Update an expense
    ---
    tags:
      - Expenses
    parameters:
      - in: path
        name: expense_id
        required: true
        type: integer
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            user_id:
              type: integer
            amount:
              type: number
            category:
              type: string
            date:
              type: string
              format: date
            description:
              type: string
    responses:
      200:
        description: Expense updated successfully
    """
    data = request.json
    if not data:
        return jsonify({"error": "Invalid request payload"}), 400

    try:
        ExpenseService.update_expense(expense_id, data)
        return jsonify({"message": "Expense updated successfully"}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Failed to update expense"}), 500


@expense_bp.route("/<int:expense_id>", methods=["DELETE"])
def delete_expense(expense_id):
    """
    Delete an expense
    ---
    tags:
      - Expenses
    parameters:
      - in: path
        name: expense_id
        required: true
        type: integer
    responses:
      200:
        description: Expense deleted successfully
    """
    try:
        ExpenseService.delete_expense(expense_id)
        return jsonify({"message": "Expense deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": "Failed to delete expense"}), 500


@expense_bp.route("/user/<int:user_id>", methods=["GET"])
def get_expenses_by_user_id(user_id):
    """
    Get expenses by user ID
    ---
    tags:
      - Expenses
    parameters:
      - in: path
        name: user_id
        required: true
        type: integer
    responses:
      200:
        description: List of expenses for the user
    """
    try:
        expenses = ExpenseService.get_expenses_by_user_id(user_id)
        return jsonify([expense.to_dict() for expense in expenses]), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch expenses for the user"}), 500
