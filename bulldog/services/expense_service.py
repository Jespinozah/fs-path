from repositories.expense_repository import ExpenseRepository
from repositories.bank_account_repository import BankAccountRepository

class ExpenseService:
    @staticmethod
    def create_expense(data):
        if not data.get("bank_account_id") or not data.get("amount") or not data.get("category") or not data.get("date") or not data.get("hour"):
            raise ValueError("All fields (user_id, amount, category, date, hour) are required.")
        expense = ExpenseRepository.create_expense(data)
        from decimal import Decimal
        updated_balance = expense.bankAccount.balance - Decimal(str(data['amount']))
        BankAccountRepository.update_bank_account(expense.bank_account_id, {'balance': updated_balance})

    @staticmethod
    def get_expenses(page, per_page):
        return ExpenseRepository.get_expenses(page, per_page)

    @staticmethod
    def get_expense_by_id(expense_id):
        return ExpenseRepository.get_expense_by_id(expense_id)

    @staticmethod
    def get_expenses_by_user_id(user_id):
        return ExpenseRepository.get_expenses_by_user_id(user_id)

    @staticmethod
    def update_expense(expense_id, data):
        if not data.get("user_id") or not data.get("amount") or not data.get("category") or not data.get("date") or not data.get("hour"):
            raise ValueError("All fields (user_id, amount, category, date, hour) are required.")
        ExpenseRepository.update_expense(expense_id, data)

    @staticmethod
    def delete_expense(expense_id):
        ExpenseRepository.delete_expense(expense_id)
