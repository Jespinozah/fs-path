from repositories.income_repository import IncomeRepository
from repositories.bank_account_repository import BankAccountRepository

class IncomeService:
    @staticmethod
    def create_income(data):
        income = IncomeRepository.create_income(data)
        from decimal import Decimal
        updatedBalance = income.bankAccount.balance + Decimal(str(data['amount']))
        BankAccountRepository.update_bank_account(income.bank_account_id, {'balance': updatedBalance})
        return  income

    @staticmethod
    def get_incomes_by_bank_account_id(bank_account_id):
        return IncomeRepository.get_incomes_by_bank_account_id(bank_account_id)

    @staticmethod
    def get_income_by_id(income_id):
        return IncomeRepository.get_income_by_id(income_id)

    @staticmethod
    def update_income(income_id, data):
        return IncomeRepository.update_income(income_id, data)

    @staticmethod
    def delete_income(income_id):
        return IncomeRepository.delete_income(income_id)