from flask import Blueprint, jsonify, request
from backend import crypt, database
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import text

my_sql = database.connecting()

api_employees = Blueprint("api_employees", __name__, url_prefix= "/api")

@api_employees.route("/employees", methods = ["GET"])
@jwt_required()
def get_employees():
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
                    SELECT * FROM tb_employees
                """)
                result = connection.execute(query).mappings()
                employee = [dict(row) for row in result]
                
            else:
                query = text(f"""
                    SELECT * FROM tb_employees WHERE employee_id = {result["employee_id"]}
                """)
                result = connection.execute(query).mappings()
                employee = [dict(row) for row in result]
            return jsonify(employee),200
    except Exception as e:
        return jsonify({"error": str(e)})

@api_employees.route("/employees", methods = ["POST"])
@jwt_required()
def add_employees():
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
                name = data.get("name")
                department = data.get("department")
                position = data.get("position")
                base_salary = data.get("base_salary")
                query = text(f"""
                    INSERT INTO tb_employees(name, department, position, base_salary)
                    VALUES('{name}', '{department}', '{position}', '{base_salary}')
                """)
                connection.execute(query)
                connection.commit()
                return jsonify({"message": "Add new employee successfully !"}),200 
            else:
                return jsonify({"error": "You aren't permission !"})

    except Exception as e:
        return jsonify({"error": str(e)})

@api_employees.route("/employees/<int:employee_id>", methods = ["DELETE"])
@jwt_required()
def delete_employees(employee_id): # xoá thông tin employee
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
                    DELETE FROM tb_employees where employee_id = {employee_id}
                """)
                result = connection.execute(query)
                if result.rowcount:
                    connection.commit()
                    return jsonify({"message": "Delete employee successfully !"}), 200
                else:
                    return jsonify({"error": "employee_id invalid !"}), 200
            else:
                return jsonify({"error": "You aren't permission !"})
            
    except Exception as e:
        return jsonify({"error GET": str(e)}), 500

@api_employees.route("/employees/<int:employee_id>", methods = ["PUT"])
@jwt_required()
def put_employees(employee_id): # cập nhật thông tin employee
    try:
        jwt_username = get_jwt_identity()
        with my_sql.connect() as connection:
            query = text(f"""
                SELECT * FROM tb_users
                WHERE username = '{jwt_username}' 
            """)
            result = connection.execute(query).mappings().fetchone()
            data = request.get_json()
            name = data.get("name")
            department = data.get("department")
            position = data.get("position")
            base_salary = data.get("base_salary")
            if result["role"] == "admin":
                query = text(f"""
                    UPDATE tb_employees
                    set name = '{name}', department = '{department}', position = '{position}', base_salary = {base_salary}
                    where employee_id = {employee_id};
                """)
                result = connection.execute(query)
                if result.rowcount:
                    connection.commit()
                    return jsonify({"message": "Update employee successfully !"}), 200
                else:
                    return jsonify({"error": "employee_id invalid !"}), 200
            else:
                return jsonify({"error": "You aren't permission !"})
    except Exception as e:
        return jsonify({"error PUT": str(e)}), 500


