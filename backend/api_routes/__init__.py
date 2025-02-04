from flask import Blueprint
from .login import api_login
from .employees import api_employees
from .users import api_users
from .timesheets import api_timesheets
from .report import api_report

api = Blueprint("api", __name__)

# Đăng kí từng nhóm API
api.register_blueprint(api_login)
api.register_blueprint(api_employees)
api.register_blueprint(api_users)
api.register_blueprint(api_timesheets)
api.register_blueprint(api_report)

