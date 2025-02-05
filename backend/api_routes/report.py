from flask import Blueprint, jsonify, request
from backend import crypt, database
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import text

api_report = Blueprint("api_report", __name__, url_prefix="/api")

my_sql = database.connecting()

def string_query(employee_id, role,date_value):
    string_result = None
    if role == "admin":
        string_result = f"""
        -- Bước 2: Tính toán số ngày công trong tháng
        WITH MonthlyWorkingDays AS (
            -- Thay '{date_value}' bằng ngày đầu tiên của tháng bạn muốn tính toán
            SELECT 
                DAY(LAST_DAY('{date_value}')) - (
                    SELECT COUNT(*) 
                    FROM (
                        SELECT '{date_value}' + INTERVAL seq DAY AS dt
                        FROM seq_0_to_31  -- Sử dụng bảng seq_0_to_31
                    ) AS dates
                    WHERE DAYOFWEEK(dt) IN (1, 7) AND dt <= LAST_DAY('{date_value}')
                ) AS working_days_in_month
        ),
        -- Bước 3: Tính toán tổng số phút làm việc trong ngày cho mỗi nhân viên
        CalculatedTimesheets AS (
            SELECT 
                employee_id,
                days,
                SUM(TIMESTAMPDIFF(MINUTE, check_in, check_out)) AS total_minutes_per_day
            FROM tb_timesheets
            GROUP BY employee_id, days
            HAVING DAYOFWEEK(days) NOT IN (1, 7) 
        ),
        -- Bước 4: Tính tiền lương trên 1 phút cho mỗi nhân viên
        SalaryPerMinute AS (
            SELECT
                e.employee_id,
                e.base_salary / mwd.working_days_in_month / 8 / 60 AS salary_per_minute
            FROM tb_employees e
            CROSS JOIN MonthlyWorkingDays mwd  -- Kết hợp với số ngày công trong tháng
        )
        -- Bước 5: Tính tổng lương cho mỗi nhân viên
        SELECT 
            cts.employee_id,
            e.name,
            ROUND(SUM(cts.total_minutes_per_day) / 60 / 8,2) as total_working_day,
            ROUND(spm.salary_per_minute * SUM(cts.total_minutes_per_day),2) AS total_salary
        FROM CalculatedTimesheets cts
        JOIN SalaryPerMinute spm ON cts.employee_id = spm.employee_id
        JOIN tb_employees e on cts.employee_id = e.employee_id
        GROUP BY cts.employee_id, spm.salary_per_minute;

        """
    elif role == "employee":
        string_result = f"""
        -- Bước 2: Tính toán số ngày công trong tháng
        WITH MonthlyWorkingDays AS (
            -- Thay '{date_value}' bằng ngày đầu tiên của tháng bạn muốn tính toán
            SELECT 
                DAY(LAST_DAY('{date_value}')) - (
                    SELECT COUNT(*) 
                    FROM (
                        SELECT '{date_value}' + INTERVAL seq DAY AS dt
                        FROM seq_0_to_31  -- Sử dụng bảng seq_0_to_31
                    ) AS dates
                    WHERE DAYOFWEEK(dt) IN (1, 7) AND dt <= LAST_DAY('{date_value}')
                ) AS working_days_in_month
        ),
        -- Bước 3: Tính toán tổng số phút làm việc trong ngày cho mỗi nhân viên
        CalculatedTimesheets AS (
            SELECT 
                employee_id,
                days,
                SUM(TIMESTAMPDIFF(MINUTE, check_in, check_out)) AS total_minutes_per_day
            FROM tb_timesheets
            GROUP BY employee_id, days
            HAVING DAYOFWEEK(days) NOT IN (1, 7) 
        ),
        -- Bước 4: Tính tiền lương trên 1 phút cho mỗi nhân viên
        SalaryPerMinute AS (
            SELECT
                e.employee_id,
                e.base_salary / mwd.working_days_in_month / 8 / 60 AS salary_per_minute
            FROM tb_employees e
            CROSS JOIN MonthlyWorkingDays mwd  -- Kết hợp với số ngày công trong tháng
        )
        -- Bước 5: Tính tổng lương cho mỗi nhân viên
        SELECT 
            cts.employee_id,
            e.name,
            ROUND(SUM(cts.total_minutes_per_day) / 60 / 8,2) as total_working_day,
            ROUND(spm.salary_per_minute * SUM(cts.total_minutes_per_day),2) AS total_salary
        FROM CalculatedTimesheets cts
        JOIN SalaryPerMinute spm ON cts.employee_id = spm.employee_id
        JOIN tb_employees e on cts.employee_id = e.employee_id
        WHERE cts.employee_id = {employee_id}
        GROUP BY cts.employee_id, spm.salary_per_minute;
        """
    return string_result

@api_report.route("/", methods = ["GET"])
@jwt_required()
def live_server():
    try:
        return jsonify({"message": "live server"}),200
    except Exception as e:
        return jsonify({"error": str(e)})
    
@api_report.route("/report", methods = ["POST"])
@jwt_required()
def get_report():
    try:
        jwt_username = get_jwt_identity()
        with my_sql.connect() as connection:
            query = text(f"""
                SELECT * FROM tb_users
                WHERE username = '{jwt_username}' 
            """)
            result = connection.execute(query).mappings().fetchone()
            data = request.get_json()
            month = data.get("month")
            year = data.get("year")
            date_value = f"{year}-{month}-01"
            if result["role"] == "admin": 
                query = text(string_query(result["employee_id"],result["role"], date_value))

                result = connection.execute(query).mappings()
                report = [dict(row) for row in result]
                return jsonify(report),200
            else:
                query = text(string_query(result["employee_id"],result["role"], date_value))

                result = connection.execute(query).mappings()
                report = [dict(row) for row in result]
                return jsonify(report),200

    except Exception as e:
        return jsonify({"error": str(e)})