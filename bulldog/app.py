from flask import Flask
from flask_cors import CORS
from database import init_db
from routes import register_routes

app = Flask(__name__)
CORS(app)

# Initialize the database
init_db(app)

# Register routes
register_routes(app)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
