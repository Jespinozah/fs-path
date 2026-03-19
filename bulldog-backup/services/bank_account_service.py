from repositories.bank_account_repository import BankAccountRepository
from repositories.income_repository import IncomeRepository

class BankAccountService:
    @staticmethod
    def create_bank_account(data):
        return BankAccountRepository.create_bank_account(data)

    @staticmethod
    def get_bank_accounts_by_user_id(user_id):
        return BankAccountRepository.get_bank_accounts_by_user_id(user_id)

    @staticmethod
    def get_bank_account_by_id(account_id):
        return BankAccountRepository.get_bank_account_by_id(account_id)

    @staticmethod
    def update_bank_account(account_id, data):
        return BankAccountRepository.update_bank_account(account_id, data)

    @staticmethod
    def delete_bank_account(account_id):
        BankAccountRepository.delete_bank_account(account_id)

    @staticmethod
    def get_incomes_by_user_id(user_id):
        return IncomeRepository.get_incomes_by_user_id(user_id)
