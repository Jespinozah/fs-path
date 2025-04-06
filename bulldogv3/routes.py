from controllers.user_controller import user_bp
from controllers.login_controller import login_bp
from controllers.expense_controller import expense_bp

def register_routes(app):
    app.register_blueprint(user_bp)
    app.register_blueprint(login_bp)
    app.register_blueprint(expense_bp)  # Register expense routes
