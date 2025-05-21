from repositories.income_repository import IncomeRepository

class IncomeService:
    @staticmethod
    def create_income(data):
        return IncomeRepository.create_income(data)

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