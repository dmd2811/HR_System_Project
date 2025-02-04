from flask import Blueprint, jsonify, request
from backend import crypt, database
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import text
from datetime import datetime

my_sql = database.connecting()

api_timesheets = Blueprint("api_timesheets", __name__, url_prefix= "/api")

@api_timesheets.route("/timesheets", methods = ["GET"]) # lấy thông tin timesheet
@jwt_required()
def get_timesheets():
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
                    SELECT *, ROUND(TIMESTAMPDIFF(SECOND, check_in, check_out) / 3600.0, 2) AS hours_worked FROM tb_timesheets
                """)
                
            else:
                query = text(f"""
                    SELECT *, ROUND(TIMESTAMPDIFF(SECOND, check_in, check_out) / 3600.0, 2) AS hours_worked FROM tb_timesheets WHERE employee_id = {result["employee_id"]}
                """)

            result = connection.execute(query).mappings()
            timesheet = []
            for row in result:
                row_dict = dict(row)
                
                # Chuyển đổi 'days' sang định dạng 'YYYY-MM-DD'
                row_dict['days'] = row_dict['days'].strftime('%Y-%m-%d') if row_dict['days'] else None
                
                # Chuyển đổi 'check_in' và 'check_out' sang định dạng 'YYYY-MM-DD HH:MM:SS'
                row_dict['check_in'] = row_dict['check_in'].strftime('%Y-%m-%d %H:%M:%S') if row_dict['check_in'] else None
                row_dict['check_out'] = row_dict['check_out'].strftime('%Y-%m-%d %H:%M:%S') if row_dict['check_out'] else None
        
                timesheet.append(row_dict)
                
            return jsonify(timesheet),200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_timesheets.route("/timesheets", methods = ["POST"]) # thêm thông tin timesheet
@jwt_required()
def post_timesheets():
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
                employee_id = data.get("employee_id")
                days = data.get("days")
                check_in = data.get("check_in")
                check_out = data.get("check_out")
                # Chuyển đổi 'days' từ chuỗi thành datetime
                days = datetime.strptime(days, '%Y-%m-%d')
                # Chuyển đổi 'check_in' và 'check_out' từ chuỗi thành datetime
                check_in = datetime.strptime(check_in, '%Y-%m-%d %H:%M:%S')
                check_out = datetime.strptime(check_out, '%Y-%m-%d %H:%M:%S')
                query = text(f"""
                INSERT INTO tb_timesheets (employee_id, days, check_in, check_out)
                    VALUES ({employee_id}, '{days}', '{check_in}', '{check_out}')
                """)
                connection.execute(query)
                connection.commit()
                return jsonify({"message": "Timesheet added successfully!"}), 200
            else:
                return jsonify({"error": "You aren't permission !"})
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_timesheets.route("/timesheets/<int:timesheet_id>", methods = ["PUT"]) # cập nhật thông tin timesheet
@jwt_required()
def put_timesheets(timesheet_id):
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
                employee_id = data.get("employee_id")
                days = data.get("days")
                check_in = data.get("check_in")
                check_out = data.get("check_out")

                # Chuyển đổi 'days' từ chuỗi thành datetime
                days = datetime.strptime(days, '%Y-%m-%d')
                # Chuyển đổi 'check_in' và 'check_out' từ chuỗi thành datetime
                check_in = datetime.strptime(check_in, '%Y-%m-%d %H:%M:%S')
                check_out = datetime.strptime(check_out, '%Y-%m-%d %H:%M:%S')
                query = text(f"""
                    UPDATE tb_timesheets
                    SET employee_id = {employee_id}, days = '{days}', check_in = '{check_in}', check_out = '{check_out}'
                    WHERE timesheet_id = {timesheet_id}
                """)
                result = connection.execute(query)
                if result.rowcount:
                    connection.commit()
                    return jsonify({"message": "Timesheet updated successfully!"}), 200
                else:
                    return jsonify({"error": "employee_id invalid !"}), 200
            else: 
                return jsonify({"error": "You aren't permission !"})       

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_timesheets.route("/timesheets/<int:timesheet_id>", methods = ["DELETE"]) # xóa thông tin timesheet
@jwt_required()
def delete_timesheets(timesheet_id):
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
                    DELETE FROM tb_timesheets
                    WHERE timesheet_id = {timesheet_id}
                """)
                result = connection.execute(query)
                if result.rowcount:
                    connection.commit()
                    return jsonify({"message": "Timesheet deleted successfully!"}), 200
                else:
                    return jsonify({"error": "employee_id invalid !"}), 200  
            else:
                return jsonify({"error": "You aren't permission !"})       

    except Exception as e:
        return jsonify({"error": str(e)}), 500
