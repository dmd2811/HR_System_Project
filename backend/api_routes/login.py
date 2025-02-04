from flask import Blueprint, jsonify, request
from backend import crypt, database
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy import text

my_sql = database.connecting()

api_login = Blueprint("api_login", __name__, url_prefix= "/api")

@api_login.route("/login", methods = ["POST"])
def login():
    try:
        data = request.get_json()
        username = data["username"]
        password = data["password"]
        with my_sql.connect() as connection:
            query = text(f"""
                SELECT * FROM tb_users
                WHERE username = '{username}'
            """)
            check_valid = connection.execute(query)
            result = connection.execute(query).mappings().fetchone()
            if check_valid.rowcount:
                if crypt.check_crypt(password, result["password"]):
                    access_token = create_access_token(identity=username)
                    return jsonify({"message": access_token,
                                   "accessToken": access_token}
                                   ), 200
                else:
                    return jsonify({"error":"Wrong info"})
            else:
                return jsonify({"error":"Invalid account"})
    except Exception as e:
        return jsonify({"error": str(e)})