from models import Expense
from database import db

class ExpenseRepository:
    @staticmethod
    def create_expense(data):
        expense = Expense(**data)
        db.session.add(expense)
        db.session.commit()

    @staticmethod
    def get_expenses(page, per_page):
        pagination = Expense.query.order_by(Expense.date.desc()).paginate(page=page, per_page=per_page, error_out=False)
        return pagination.items, pagination.total

    @staticmethod
    def get_expense_by_id(expense_id):
        return Expense.query.get(expense_id)

    @staticmethod
    def update_expense(expense_id, data):
        expense = Expense.query.get(expense_id)
        if not expense:
            raise ValueError("Expense not found.")
        for key, value in data.items():
            setattr(expense, key, value)
        db.session.commit()

    @staticmethod
    def delete_expense(expense_id):
        expense = Expense.query.get(expense_id)
        if not expense:
            raise ValueError("Expense not found.")
        db.session.delete(expense)
        db.session.commit()

    @staticmethod
    def get_expenses_by_user_id(user_id):
        return Expense.query.filter_by(user_id=user_id).all()
