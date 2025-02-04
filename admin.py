from backend import crypt, database
from sqlalchemy import text

my_sql = database.connecting()
username = "it_admin"
password = "admin123"
role = "admin"
employee_id = 1000

crypt_password = crypt.encode(password)
try:
    with my_sql.connect() as connection:
        query = text(f"""
            INSERT INTO tb_users(username, password, role, employee_id)
            VALUES('{username}', '{crypt_password.decode("utf-8")}', '{role}', {employee_id}) 
        """)
        connection.execute(query)
        connection.commit()
        print("ADMIN has created")

except Exception as e:
    print("ADMIN ERROR ! ")