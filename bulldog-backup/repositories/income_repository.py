from models import Income
from models import BankAccount
from database import db

class IncomeRepository:
    @staticmethod
    def create_income(data):
        income = Income(**data)
        db.session.add(income)
        db.session.commit()
        return income

    @staticmethod
    def get_incomes_by_bank_account_id(bank_account_id):
        return Income.query.filter_by(bank_account_id=bank_account_id).all()

    @staticmethod
    def get_income_by_id(income_id):
        return Income.query.get(income_id)

    @staticmethod
    def update_income(income_id, data):
        income = Income.query.get(income_id)
        if not income:
            raise ValueError("Income not found.")
        for key, value in data.items():
            setattr(income, key, value)
        db.session.commit()
        return income

    @staticmethod
    def delete_income(income_id):
        income = Income.query.get(income_id)
        if not income:
            raise ValueError("Income not found.")
        db.session.delete(income)
        db.session.commit()

    @staticmethod
    def get_incomes_by_user_id(user_id):
        return Income.query.join(BankAccount).filter(BankAccount.user_id == user_id).all()