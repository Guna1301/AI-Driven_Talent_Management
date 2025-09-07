from flask import Flask
from pymongo import MongoClient
from .config import MONGO_URI, DB_NAME
from flask_cors import CORS  

db = None

def create_app():
    app = Flask(__name__)
    
    CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

    global db
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]

    from .routes.project_routes import project_bp
    from .routes.resource_routes import resource_bp
    from .routes.chatRoutes import chat_bp
    from .routes.allocation_routes import allocation_bp

    app.register_blueprint(project_bp, url_prefix="/projects")
    app.register_blueprint(resource_bp, url_prefix="/resources")
    app.register_blueprint(chat_bp) 
    app.register_blueprint(allocation_bp)

    return app
