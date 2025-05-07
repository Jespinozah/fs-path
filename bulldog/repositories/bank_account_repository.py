from models import BankAccount
from database import db

class BankAccountRepository:
    @staticmethod
    def create_bank_account(data):
        bank_account = BankAccount(**data)
        db.session.add(bank_account)
        db.session.commit()
        return bank_account

    @staticmethod
    def get_bank_accounts_by_user_id(user_id):
        return BankAccount.query.filter_by(user_id=user_id).all()

    @staticmethod
    def get_bank_account_by_id(account_id):
        return BankAccount.query.get(account_id)

    @staticmethod
    def update_bank_account(account_id, data):
        bank_account = BankAccount.query.get(account_id)
        if not bank_account:
            raise ValueError("Bank account not found.")
        for key, value in data.items():
            setattr(bank_account, key, value)
        db.session.commit()
        return bank_account

    @staticmethod
    def delete_bank_account(account_id):
        bank_account = BankAccount.query.get(account_id)
        if not bank_account:
            raise ValueError("Bank account not found.")
        db.session.delete(bank_account)
        db.session.commit()
