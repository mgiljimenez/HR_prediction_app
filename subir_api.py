#Importamos la librerías y variables necesarias
import mysql.connector
import pandas as pd
from flask import Flask
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

@app.route('/', methods=['GET'])
def inicio():
    return "funciona"

@app.route('/datos', methods=['GET'])
def devolver_tabla():
    tabla=make_query("SELECT * FROM prueba.employee_raw;")
    return tabla

app.run()