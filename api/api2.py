#Importamos la librerías y variables necesarias
from mysql.connector import pooling
import pandas as pd
from flask import Flask, request, jsonify, abort, make_response
from flask_cors import CORS
from dotenv import load_dotenv
import os
import json
import pickle

load_dotenv()
private_key = os.getenv("private_key")

# Configura el pool de conexiones
dbconfig = {
    "host": "test-db.cze2nnbbx5pc.eu-west-3.rds.amazonaws.com",
    "user": "admin",
    "password": "admin123",
    "database": "prueba"
}
connection_pool = pooling.MySQLConnectionPool(pool_name="mypool", pool_size=7, **dbconfig)
# Función auxiliar para obtener una conexión del pool
def get_connection():
    return connection_pool.get_connection()


app = Flask(__name__)
# app.config['DEBUG'] = True
CORS(app, support_credentials=True)



connection = get_connection()
cursor = connection.cursor()
cursor.execute("SELECT * from current_employees")
resultado = cursor.fetchall()
column_names = [desc[0] for desc in cursor.description] 
X = pd.DataFrame(resultado, columns=column_names)

@app.route('/db/new_prediction', methods=['GET'])
def new_prediction(X):
    model = pickle.load(open('./../Data\Output\Models/Models/JP_12_06_VotingRegressor.pickle.pkl', 'rb'))
    scaler = pickle.load(open('./../Data\Output\Models/Models/scaler.pkl', 'rb'))

    columns_to_drop = ['id_employee','name', 'involvement', 'performance', 'environment', 'department', 'education', 'education_field',
            'gender', 'role', 'years_curr_manager','total_working_years', 'last_promotion', 'age', 'years_company']
    
    X.drop(columns_to_drop, axis=1, inplace=True)
    X = scaler.transform(X)

    new_value = model.predict(X)
    query= f'''_
    UPDATE replacement SET months_left = {new_value} WHERE 1;
    '''
    cursor.execute(query)

# @app.route('/db/retrain', methods=['GET'])
# def retrain():

