#Importamos la librerías
from mysql.connector import pooling
import pandas as pd
from flask import Flask, request, jsonify, abort, make_response
from flask_cors import CORS
import os
import pickle
from dotenv import load_dotenv
from sklearn.preprocessing import StandardScaler
import jwt
import numpy as np
from xgboost import XGBRegressor

#Importamos las variables de entorno 
load_dotenv()
private_key = os.getenv("private_key")
db_host=os.getenv("db_host")
db_user=os.getenv("db_user")
db_password=os.getenv("db_password")
db_database=os.getenv("db_database")

# Configuramos el pool de conexiones
dbconfig = {
    "host": db_host,
    "user": db_user,
    "password": db_password,
    "database": db_database
}
connection_pool = pooling.MySQLConnectionPool(pool_name="mypool", pool_size=7, **dbconfig)
# Función auxiliar para obtener una conexión del pool
def get_connection():
    return connection_pool.get_connection()

#Configuarmos Flas y el Cors
app = Flask(__name__)
CORS(app, support_credentials=True)

#Función que devuelve de la base de datos un dataframe con los current_employees
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

#Función que borra los datos de la tabla predictions de la base de datos
def borrar_datos_predictions():
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("TRUNCATE TABLE predictions;")
        conn.commit()
        cursor.close()
        conn.close() 
#Función que sube los nuevos datos de las predicciones a la tabla de predictions
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

#Función que importa de la base de datos el archivo binario del Scaler
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

#Endpoint que calcula de nuevo las predicciones de los empleados y los sube a la base de datos
@app.route('/new_prediction', methods=['GET'])
def new_prediction():
    try:
        #Comprobación que que el token ha sido firmado con la private_key
        token=request.headers.get('token')
        jwt.decode(token, private_key, algorithms=["HS256"])
    except:
        #Si no ha sido firmado aborta
        abort(401)
    try:
        X=tabla_current_employees()
        borrar_datos_predictions()

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
            model = pickle.loads(modelo_serializado)
        except Exception as e:
            return f"Error al cargar el modelo: {e}"
        finally:
            # Cierra la conexión
            cursor.close()
            conn.close()
        try:
            scaler=importar_scaler()
        except Exception as e:
            return f"Error al cargar el scaler: {e}"
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
        #Se desactiva el SAFE MODE de MySQL para poder borrar tablas en un procedimiento
        cursor.execute("SET SQL_SAFE_UPDATES = 0;")
        conn.commit()
        cursor.close()
        conn.close() 
        conn = get_connection()
        cursor = conn.cursor()
        #Se ejecuta el procedimiento que actualiza las tablas a partir de las nuevas predicciones
        cursor.execute("call prueba.actualizacion_predictions();")
        conn.commit()
        cursor.close()
        conn.close() 
        return make_response(jsonify({'message': 'OK'}), 200)
    except Exception as e:
        return f"Error: {e}"

#Ejecuta la app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)