from sqlalchemy import create_engine, text

username = "root"
password = "Dung121212"
host = "localhost"
port = 3306
database = "db_database"

str_connect = f"mysql+pymysql://{username}:{password}@{host}:{port}/{database}"

def connecting():

    my_sql = create_engine(str_connect)
    if my_sql: print(f"Connect successfully to database: {database}")
    return my_sql
