from flask import Flask, request
from flask_cors import CORS
from flasgger import Swagger  # Import Flasgger
from database import init_db
from routes import register_routes

app = Flask(__name__)
app.url_map.strict_slashes = False  # Disable strict slashes for all routes
CORS(app,  resources={r"/api/*": {"origins": "http://localhost:5173"}})  # Enable CORS for all API routes


# Initialize Flasgger Swagger
swagger_config = {
    "headers": [],
    "specs": [
        {
            "endpoint": "docs",
            "route": "/apidocs.json",
        }
    ],
    "static_url_path": "/apidocs",
    "swagger_ui": True,
    "swagger_ui_url": "/apidocs",
    "specs_route": "/apidocs/",
    "title": "Bulldog API",
    "description": "API documentation for Bulldog",
    "version": "1.0.0",
}
swagger = Swagger(app, config=swagger_config)

# Initialize the database
init_db(app)

# Register routes
register_routes(app)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
