from flask import Blueprint, Flask # thư viện cho framework
from backend import database, crypt 
from flask_cors import CORS # bảo mật giữa các nguồn truy cập
from flask_jwt_extended import JWTManager
from backend.api_routes import api

my_sql = database.connecting()

app = Flask(__name__)
CORS(app, resources={"/api/*":{"origins":"*"}})

app.config["JWT_SECRET_KEY"] = "281100"
jwt = JWTManager(app)

app.register_blueprint(api)

if __name__ == "__main__":
    app.run(debug = True)