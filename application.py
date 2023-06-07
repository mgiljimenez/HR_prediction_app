#Importamos la librerías y variables necesarias

import mysql.connector
import pandas as pd
from flask import Flask, jsonify, request
import plotly as plt
import os

import pickle
import plotly.graph_objects as go
import plotly.express as px
import plotly

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
    return df

# os.chdir(os.path.dirname(__file__))
app = Flask(__name__)
app.config['DEBUG'] = True

@app.route('/db', methods=['GET'])
def devolver_tabla():
    tabla=make_query("SELECT * FROM employee_raw")
    
    return tabla

@app.route('/db/query', methods=['GET'])
def get_db():
    
    table = request.args.get("table")
    requested = request.args
    items = requested.items()
    query = [f"SELECT * FROM {table} WHERE "]

    for param, value in items:
        query.append(f"{param} = '{value }'")
    
    result = query[0] + " " + "AND ".join(query[2:])
    db = make_query(result)


    return db


@app.route('/db/graph/pie', methods=['GET'])
def get_graph_pie():

    df=make_query("SELECT months_left FROM replacement")

    # Supongamos que tienes un dataframe llamado "df" con una columna llamada "column_name"
    column_name = df['months_left'].astype(float)
    # Calcula los cuartiles utilizando la función quantile()
    q1 = column_name.quantile(0.25)
    q2 = column_name.quantile(0.5)
    q3 = column_name.quantile(0.75)
    # Cuenta el número de valores en cada cuartil
    count_q1 = column_name[column_name <= q1].count()
    count_q2 = column_name[(column_name > q1) & (column_name <= q2)].count()
    count_q3 = column_name[(column_name > q2) & (column_name <= q3)].count()
    count_q4 = column_name[column_name > q3].count()
    column1=["Very High","High","Medium","Low"]
    column2=[count_q1,count_q2,count_q3,count_q4]
    data = {"risk": column1, "data": column2}
    df = pd.DataFrame(data)
    df['percentage'] = (df['data'] / df['data'].sum()) * 100

    count_values = df.set_index('risk')['data']

    colors = {
        "Low": "#00CC96",
        "Medium": "#B6E880",
        "High": "#FFA15A",
        "Very High": "#EF553B"
    }
    fig = go.Figure(data=[go.Pie(labels=count_values.index, values=count_values.values, hole=0.4, pull=[0.05, 0.05, 0.05, 0.05])])
    fig.update_traces(
        marker=dict(colors=[colors[label] for label in count_values.index]),
        textfont=dict(size=22)  # Aumentar el tamaño de los valores
    )
    fig.update_layout(
        title={"text":"Distribution Risk Attrition",
            "x":0.5},
        title_font=dict(size=24),
        legend=dict(
            orientation="h",
            yanchor="bottom",
            y=1.02,
            xanchor="center",
            x=0.5,
            traceorder='normal'
        )
    )

    graph = fig.to_json()

    return graph

@app.route('/db/graph/bar1', methods=['GET'])
def get_graph_bar1():

    df = make_query("SELECT role, risk FROM replacement")

    df_agg = df.groupby(['role', 'risk']).size().reset_index(name='count')
    df_agg['percentage'] = df_agg.groupby('role')['count'].apply(lambda x: (x / x.sum()) * 100)

    fig = go.Figure()

    colors = {
        "Low": "#00CC96",
        "Medium": "#B6E880",
        "High": "#FFA15A",
        "Very high": "#EF553B"
    }

    for risk in df_agg['risk'].unique():
        df_filtered = df_agg[df_agg['risk'] == risk]
        fig.add_trace(go.Bar(
            x=df_filtered['percentage'],
            y=df_filtered['role'],
            name=risk,
            orientation='h',
            marker=dict(color=colors[risk]),
            text=df_filtered['percentage'].apply(lambda x: f"{x:.2f}%"),
            textposition='auto'
        ))

    fig.update_layout(
        title={
            'text': 'Distribution risk attrition by job role',
            'font': {'size': 24}
        },
        xaxis=dict(title='Porcentaje'),
        yaxis=dict(title='JobRole'),
        barmode='stack',
        autosize=False,
        width=800,
        height=500,
        title_x=0.5,
    )
    
    graph = fig.to_json()
    return graph

@app.route('/db/graph/bar2', methods=['GET'])
def get_graph_bar2():

    grouped_df = make_query("SELECT role, risk FROM replacement")#new_df.groupby(['JobRole', 'RiskAttrition']).size().unstack()
    total_counts = grouped_df.sum(axis=1)
    percentage_df = grouped_df.divide(total_counts, axis=0) * 100

    # Crear la gráfica de barras
    fig = go.Figure()

    # Definir los colores para cada categoría de RiskAttrition
    colors = {
        "Low": "#00CC96",
        "Medium": "#B6E880",
        "High": "#FFA15A",
        "Very High": "#EF553B"
    }

    # Agregar las barras al gráfico
    for risk in df.set_index('risk')['data'].unique():
        fig.add_trace(go.Bar(
        x=percentage_df[risk],
        y=percentage_df.index,
        name=risk,
        orientation='h',
        marker=dict(color=colors[risk]),
        text=percentage_df[risk].round(2).astype(str) + '%',
        textposition='auto'
    ))

# Personalizar el diseño del gráfico
    fig.update_layout(
    title={
        'text': 'Distribution risk attrition by job level',
        'font': {'size': 24}
    },
    xaxis=dict(title=''),
    yaxis=dict(title='Job Level'),
    barmode='stack',
    autosize=False,
    width=800,
    height=500,
    title_x=0.5,
)

    graph = fig.to_json()
    return graph


@app.route('/db/graph/line', methods=['GET'])
def get_graph_line():

    df=make_query("SELECT months_left FROM replacement")

    # Obtener el conteo de valores para cada categoría en Prediction_nº_Months
    counts = df['Prediction_nº_Months'].value_counts().sort_index()

    # Filtrar los valores menores o iguales a 24
    counts_filtered = counts.loc[counts.index <= 24]

    # Crear la gráfica de series de tiempo
    fig = px.line(x=counts_filtered.index, y=counts_filtered.values, title="Prediction attrition for next 24 months")

    fig.update_traces(line_width=3, mode='lines+markers', hovertemplate='Month: %{x}<br>Nº of attrition: %{y}')  # Ajustar el grosor de la línea, agregar marcadores circulares y personalizar etiquetas

    fig.update_layout(xaxis=dict(
        tickmode='array',
        tickvals=counts_filtered.index,
        ticktext=counts_filtered.index
    ), xaxis_title="next 24 months", yaxis_title="Nº of attrition", title_x=0.5, title_font={'size': 24})

    graph = fig.to_json()
    return graph



@app.route('/db/predict', methods=['GET'])
def predict():

    table = "current_employees" # Cambiar por predictions
    # id = request.args.get("id_employee")
    query = f"SELECT * FROM {table}'"

    db = make_query(query)

    model = pickle.load(open('JP_0606_1_Ridge.pickle','rb')) # Cambiar ruta modelo

    colums_to_drop = ["id_employee", "name", "involvement", "performance", "environment", "satisfaction", "life_balance", "attrition", "travel", "department",
                     "education", "education_field", "gender", "role", "marital_status", "hours", "department", "years_company"]

    db.drop(columns=colums_to_drop, inplace=True)
    prediction = model.predict(db)

    return jsonify({'prediction': prediction[0]})

# @app.route('/db/get_prediction', methods=['GET'])
# def get_prediction():

#     table = "predictions"
#     id = request.args.get("id_employee")
#     query = [f"SELECT * FROM {table} WHERE id_employee = '{id}'"]

#     db = make_query(query)


#     return jsonify(db)


app.run()