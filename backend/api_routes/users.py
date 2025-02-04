from flask import Blueprint, jsonify, request
from backend import crypt, database
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import text

my_sql = database.connecting()

api_users = Blueprint("api_users", __name__, url_prefix= "/api")

@api_users.route("/users", methods = ["GET"]) # lấy thông tin user
@jwt_required()
def get_users():
    try:
        jwt_username = get_jwt_identity()
        with my_sql.connect() as connection:
            query = text(f"""
                SELECT * FROM tb_users
                WHERE username = '{jwt_username}' 
            """)
            result = connection.execute(query).mappings().fetchone()
            if result["role"] == "admin":
                query = text("""
                    SELECT * FROM tb_users
                """)
                result = connection.execute(query).mappings()
                users = [dict(row) for row in result]
                return jsonify(users), 200
            else:
                query = text(f"""
                    SELECT * FROM tb_users WHERE username = {result["username"]}
                """)
                result = connection.execute(query).mappings()
                users = [dict(row) for row in result]
            return jsonify(users),200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_users.route("/users", methods = ["POST"]) # thêm thông tin user
@jwt_required()
def post_users():
    try:
        jwt_username = get_jwt_identity()
        with my_sql.connect() as connection:
            query = text(f"""
                SELECT * FROM tb_users
                WHERE username = '{jwt_username}' 
            """)
            result = connection.execute(query).mappings().fetchone()
            if result["role"] == "admin":
                data = request.get_json()
                username = data.get("username")
                password = data.get("password")
                role = data.get("role")
                employee_id = data.get("employee_id")
                hashed_password = crypt.encode(password)
                print(hashed_password)
                query = text(f"""
                    INSERT INTO tb_users (username, password, role, employee_id)
                    VALUES ('{username}', '{hashed_password.decode()}', '{role}', {employee_id})
                """)
                connection.execute(query)
                connection.commit()
                return jsonify({"message": "User added successfully!"}), 200
            else:
                return jsonify({"error": "You aren't permission !"})
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_users.route("/users/<string:username>", methods = ["PUT"]) # cập nhật thông tin user
@jwt_required()
def put_users(username):
    try:
        jwt_username = get_jwt_identity()
        with my_sql.connect() as connection:
            query = text(f"""
                SELECT * FROM tb_users
                WHERE username = '{jwt_username}' 
            """)
            result = connection.execute(query).mappings().fetchone()
            if result["role"] == "admin":
                data = request.get_json()
                password = data.get("password")
                role = data.get("role")
                employee_id = data.get("employee_id")
                hashed_password = crypt.encode(password)
                print(hashed_password)
                query = text(f"""
                    UPDATE tb_users
                    SET password = '{hashed_password.decode()}', role = '{role}', employee_id = {employee_id}
                    WHERE username = '{username}'
                """)
                value = connection.execute(query)
                if value.rowcount:
                    connection.commit()
                    return jsonify({"message": "User updated successfully!"}), 200
                else:
                    return jsonify({"error": "username invalid !"}), 200
            else:
                return jsonify({"error": "You aren't permission !"})
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_users.route("/users/<string:username>", methods = ["DELETE"]) # xóa thông tin user
@jwt_required()
def delete_users(username):
    try:
        jwt_username = get_jwt_identity()
        with my_sql.connect() as connection:
            query = text(f"""
                SELECT * FROM tb_users
                WHERE username = '{jwt_username}' 
            """)
            result = connection.execute(query).mappings().fetchone()
            if result["role"] == "admin":
                query = text(f"""
                    DELETE FROM tb_users
                    WHERE username = '{username}'
                """)
                result = connection.execute(query)
                if result.rowcount:
                    connection.commit()
                    return jsonify({"message": "User deleted successfully!"}), 200
                else:
                    return jsonify({"error": "username invalid !"}), 200
            else:
                return jsonify({"error": "You aren't permission !"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
