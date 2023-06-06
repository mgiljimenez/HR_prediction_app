#Importamos la librerías y variables necesarias

import mysql.connector
import pandas as pd
from flask import Flask, jsonify, request
import os

cnx = mysql.connector.connect(
    user="admin",
    password="admin123",
    host="test-db.cze2nnbbx5pc.eu-west-3.rds.amazonaws.com",
    database="prueba"
)
cursor = cnx.cursor()

#Definimos una función mediante la que ejecutar las querys devolviendo un dataframe
def make_query(code):
    cursor.execute(code)
    results = cursor.fetchall()
    column_names = [desc[0] for desc in cursor.description]  # Obtener los nombres de las columnas
    df = pd.DataFrame(results, columns=column_names)  # Crear el DataFrame
    return df.to_json(orient="split",index=False)

# os.chdir(os.path.dirname(__file__))
app = Flask(__name__)
app.config['DEBUG'] = True

@app.route('/db', methods=['GET'])
def devolver_tabla():
    tabla=make_query("SELECT * FROM employee_raw")
    
    return tabla

@app.route('/db/query', methods=['GET'])
def get_query():
    
    table = request.args.get("table")
    requested = request.args
    items = requested.items()
    query = [f"SELECT * FROM {table} WHERE "]

    for param, value in items:
        query.append(f"{param} = '{value }'")
    
    result = query[0] + " " + "AND ".join(query[2:])
    db = make_query(result)


    return db


@app.route('/db/graph', methods=['GET'])
def get_graph():

    table = request.args.get("table")
    requested = request.args
    items = requested.items()
    query = [f"SELECT * FROM {table} WHERE "]

    for param, value in items:
        query.append(f"{param} = '{value }'")
    
    result = query[0] + " " + "AND ".join(query[2:])
    db = make_query(result)


    return jsonify(db)


app.run()