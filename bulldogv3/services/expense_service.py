from repositories.expense_repository import ExpenseRepository

class ExpenseService:
    @staticmethod
    def create_expense(data):
        if not data.get("user_id") or not data.get("amount") or not data.get("category") or not data.get("date"):
            raise ValueError("All fields (user_id, amount, category, date) are required.")
        ExpenseRepository.create_expense(data)

    @staticmethod
    def get_expenses():
        return ExpenseRepository.get_expenses()

    @staticmethod
    def get_expense_by_id(expense_id):
        return ExpenseRepository.get_expense_by_id(expense_id)

    @staticmethod
    def update_expense(expense_id, data):
        if not data.get("user_id") or not data.get("amount") or not data.get("category") or not data.get("date"):
            raise ValueError("All fields (user_id, amount, category, date) are required.")
        ExpenseRepository.update_expense(expense_id, data)

    @staticmethod
    def delete_expense(expense_id):
        ExpenseRepository.delete_expense(expense_id)
