from flask import Blueprint, request, jsonify
from services.expense_service import ExpenseService

expense_bp = Blueprint("expenses", __name__, url_prefix="/api/v1/expenses")

@expense_bp.route("/", methods=["POST"])
def create_expense():
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
    try:
        expenses = ExpenseService.get_expenses()
        return jsonify([expense.to_dict() for expense in expenses]), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch expenses"}), 500


@expense_bp.route("/<int:expense_id>", methods=["GET"])
def get_expense_by_id(expense_id):
    try:
        expense = ExpenseService.get_expense_by_id(expense_id)
        if not expense:
            return jsonify({"error": "Expense not found"}), 404
        return jsonify(expense.to_dict()), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch expense"}), 500


@expense_bp.route("/<int:expense_id>", methods=["PUT"])
def update_expense(expense_id):
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
    try:
        ExpenseService.delete_expense(expense_id)
        return jsonify({"message": "Expense deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": "Failed to delete expense"}), 500
