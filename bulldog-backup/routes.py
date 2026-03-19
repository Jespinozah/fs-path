from controllers.user_controller import user_bp
from controllers.login_controller import login_bp
from controllers.expense_controller import expense_bp
from controllers.bank_account_controller import bank_account_bp
from controllers.income_controller import income_bp

def register_routes(app):
    app.register_blueprint(user_bp)
    app.register_blueprint(login_bp)
    app.register_blueprint(expense_bp)
    app.register_blueprint(bank_account_bp)
    app.register_blueprint(income_bp)