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
    with open(filename ,'rb') as f:
        loaded = pickle.load(f)
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


@app.route('/retrain', methods=['GET'])
def retrain():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * from current_employees")
        resultado = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        cursor.close()
        conn.close() 
        X = pd.DataFrame(resultado, columns=column_names)
        columns_to_drop = ['id_employee','name', 'involvement', 'performance', 'environment', 'department', 'education', 'education_field',
                    'gender', 'role', 'years_curr_manager','total_working_years', 'last_promotion', 'age']
            
        X_retrain = X.copy()
        # Dividimos en features y target, siendo el target x_e_out [-]
        X = X_retrain.drop(['years_company'], axis = 1)
        y = X_retrain['years_company']

        X.drop(columns_to_drop, axis=1, inplace=True)
        # Dividimos entre train y test
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        model = load_object("JP_12_06_VotingRegressor.pkl")
        model.fit(X_scaled, y)

        # # # Exporto a pickle el voting_regressor (con o sin entrenar)
        date_today = date.today()
        nombre_archivo_actual = "JP_12_06_VotingRegressor.pkl"
        nombre_archivo_nuevo = f"model_{date_today}.pkl"
        ruta_archivo_actual = os.path.join(nombre_archivo_actual)
        ruta_archivo_nuevo = os.path.join(nombre_archivo_nuevo)

        # Renombrar el archivo
        os.rename(ruta_archivo_actual, ruta_archivo_nuevo)
        ruta_nuevo_modelo = f'JP_12_06_VotingRegressor.pkl'
        modelo = model
        with open(ruta_nuevo_modelo, 'wb') as archivo:
            pickle.dump(modelo, archivo)
        return make_response(jsonify({'status': 'ok'}), 200)
    except:
        return make_response(jsonify({'status': 'Invalid'}), 401)

@app.route('/new_prediction', methods=['GET'])
def new_prediction():
    try:
        # token=request.headers.get('token')
        # jwt.decode(token, private_key, algorithms=["HS256"])
        X=tabla_current_employees()
        borrar_datos_predictions()
        try:
             model = load_object("../JP_12_06_VotingRegressor.pickle")
        except:
             return make_response(jsonify({'status': os.getcwd()}), 401)
        try:
             scaler = load_object("../scaler.pickle")
        except:
             return make_response(jsonify({'status': "Error scaler"}))
            #  return make_response(jsonify({'status': 'Error al cargar archivos'}), 401)

        # Descargar el archivo JP_12_06_VotingRegressor.pickle desde GitHub


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
        cursor.execute("call prueba.actualizacion_predictions();")
        conn.commit()
        cursor.close()
        conn.close() 
        return make_response(jsonify({'status': 'ok'}), 200)
    except:
        return make_response(jsonify({'status': "error interno"}), 500)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)