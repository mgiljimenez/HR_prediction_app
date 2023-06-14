#Importamos la librerías y variables necesarias
from mysql.connector import pooling
import pandas as pd
from flask import Flask, request, jsonify, abort, make_response
from flask_cors import CORS
from dotenv import load_dotenv
import os
import pickle
from sklearn.preprocessing import StandardScaler
from datetime import date
import jwt
import requests
import joblib
import numpy as np

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


def load_object(filename):
    loaded = joblib.load(filename)
    return loaded
#Funciones necesarias para ejecutar el retrain y new_prediction
#Funciones individuales que atacan a la base de datos
def tabla_current_employees():
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * from current_employees")
        resultado = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        cursor.close()
        conn.close() 
        X = pd.DataFrame(resultado, columns=column_names)
        return(X)

def borrar_datos_predictions():
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("TRUNCATE TABLE predictions;")
        conn.commit()
        cursor.close()
        conn.close() 
def subir_nuevos_datos_predictions(df_final):
    conn = get_connection()
    cursor = conn.cursor()

    insert_query = "INSERT INTO predictions (id_employee, total_months_in_company) VALUES (%s, %s)"
    values = [(row['id_employee'], row['total_months_in_company']) for _, row in df_final.iterrows()]

    try:
        cursor.executemany(insert_query, values)
        conn.commit()
    except:
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()

def importar_modelo():
    try:
        # Crea un cursor para ejecutar las consultas
        conn = get_connection()
        cursor = conn.cursor()
        # Recupera el modelo serializado desde la base de datos
        consulta = "SELECT modelo FROM modelos WHERE id = (SELECT MAX(id) FROM modelos)"
        cursor.execute(consulta)
        # Obtiene el modelo serializado
        modelo_serializado = cursor.fetchone()[0]
        # Carga el modelo desde los datos serializados
        modelo_cargado = pickle.loads(modelo_serializado)
        return modelo_cargado
    except Exception as e:
        return make_response(jsonify({'Error': e}), 500)
    finally:
        # Cierra la conexión
        cursor.close()
        conn.close()

def importar_scaler():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        # Crea un cursor para ejecutar las consultas
        # Recupera el modelo serializado desde la base de datos
        consulta = "SELECT scaler FROM modelos WHERE id = (SELECT MAX(id) FROM modelos)"
        cursor.execute(consulta)
        # Obtiene el modelo serializado
        scaler_serializado = cursor.fetchone()[0]
        # Carga el modelo desde los datos serializados
        scaler_cargado = pickle.loads(scaler_serializado)
        return scaler_cargado
    except Exception as e:
        print("Error:", e)
    finally:
        # Cierra la conexión
        cursor.close()
        conn.close()

@app.route('/new_prediction', methods=['GET'])
def new_prediction():
    try:
        # token=request.headers.get('token')
        # jwt.decode(token, private_key, algorithms=["HS256"])
        X=tabla_current_employees()
        borrar_datos_predictions()
        try:
            model=importar_modelo()
            scaler=importar_scaler()
        except Exception as e:
            return make_response(jsonify({'Error': e}), 500)

        columns_to_drop = ['id_employee','name', 'involvement', 'performance', 'environment', 'department', 'education', 'education_field',
                'gender', 'role', 'years_curr_manager','total_working_years', 'last_promotion', 'age', 'years_company']
        ids=X["id_employee"].tolist()
        X.drop(columns_to_drop, axis=1, inplace=True)
        X = scaler.transform(X)
        ls_new_value = model.predict(X)
        df_final = pd.DataFrame({'id_employee': ids, 'total_months_in_company': ls_new_value})
        subir_nuevos_datos_predictions(df_final)
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SET SQL_SAFE_UPDATES = 0;")
        conn.commit()
        cursor.close()
        conn.close() 
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("call prueba.actualizacion_predictions();")
        conn.commit()
        cursor.close()
        conn.close() 
        return make_response(jsonify({'status': 'ok'}), 200)
    except Exception as e:
        return make_response(jsonify({'Error': e}), 500)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)