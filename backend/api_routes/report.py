from flask import Blueprint, jsonify, request
from backend import crypt, database
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import text

api_report = Blueprint("api_report", __name__, url_prefix="/api")

my_sql = database.connecting()

@api_report.route("/", methods = ["GET"])
@jwt_required()
def live_server():
    try:
        return jsonify({"message": "live server"}),200
    except Exception as e:
        return jsonify({"error": str(e)})
    
@api_report.route("/report", methods = ["GET"])
def get_report():
    try:
        return jsonify({"message": "live server"}),200
    except Exception as e:
        return jsonify({"error": str(e)})