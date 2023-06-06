#Importamos la librerías y variables necesarias
import mysql.connector
import pandas as pd
from flask import Flask, jsonify, request
import os
#################################################################################
#################################################################################
"""Definimos las variables generales para atacar la base de datos"""
#Definimos un cursor con el que atacar a la DB
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

os.chdir(os.path.dirname(__file__))

app = Flask(__name__)
app.config['DEBUG'] = True

@app.route('/datos', methods=['GET'])
def devolver_tabla():
    tabla=make_query("SELECT * FROM prueba.employee_raw;")
    return tabla


@app.route('/filtro', methods=['GET'])
def devolver_tabla5():
    params = request.args.to_dict()  # Obtener los parámetros como un diccionario
    # Construir la consulta SQL base
    query = "SELECT * FROM prueba.employee_raw"
    # Construir la cláusula WHERE dinámicamente
    where_clause = ""
    conditions = []
    for column, value in params.items():
        conditions.append(f"{column} = %({column})s")
    if conditions:
        where_clause = "WHERE " + " AND ".join(conditions)
    # Combinar la consulta SQL base y la cláusula WHERE
    query += " " + where_clause
    # Obtener los datos filtrados desde la base de datos
    tabla = make_query((query, params))
    return tabla

@app.route('/grafica2', methods=['GET'])
def devolver_tabla2():
    tabla=make_query("SELECT * FROM usuarios")
    return tabla

@app.route('/grafica3', methods=['GET'])
def devolver_tabla3():
    tabla=make_query("SELECT * FROM usuarios")
    return tabla

app.run()