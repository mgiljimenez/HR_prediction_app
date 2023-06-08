#Importamos la librerías y variables necesarias
import mysql.connector
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS
import pickle
import plotly.graph_objects as go
import plotly.express as px



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
    column_names = [desc[0] for desc in cursor.description] 
    df = pd.DataFrame(results, columns=column_names)  
    return df

app = Flask(__name__)
app.config['DEBUG'] = True
CORS(app)

# Función que devuelve un json a partir de un gráfico de tarta
@app.route('/db/graph/pie', methods=['GET'])
def get_graph_pie():
    df_risk=make_query("""SELECT risk from replacement""")
    count_values = df_risk.value_counts()

    colors = {
        "Low": "#00CC96",
        "Medium": "#B6E880",
        "High": "#FFA15A",
        "Very high": "#EF553B"
    }
    count_values = {
        "High": 951,
        "Very high": 931,
        "Low": 918,
        "Medium": 898
    }
    fig = go.Figure(data=[
        go.Pie(
            labels=list(count_values.keys()),  
            values=list(count_values.values()),  
            hole=0.4,
            pull=[0.05, 0.05, 0.05, 0.05],
            marker=dict(colors=[colors[label] for label in count_values.keys()])
        )
    ])
    fig.update_traces(textfont=dict(size=22))
    fig.update_layout(
        title="Distribution risk attrition",
        title_font=dict(size=24),
        legend=dict(
            orientation="h",
            yanchor="bottom",
            y=1.02,
            xanchor="center",
            x=0.5
        ),
        title_x=0.5
    )
    graph=fig.to_json()
    return graph

# Función que devuelve un json a partir de un gráfico de barras en función del riesgo y rol
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
    '''
    Endpoint que devuelve un gráfico de barras en función de riesgo
    y nivel de trabajo a partir de una query a la BD y lo devuelve
    en formato json
    '''
    df = make_query("SELECT job_level, risk FROM replacement")
    df_agg = df.groupby(['job_level', 'risk']).size().reset_index(name='count')
    df_agg['percentage'] = df_agg.groupby('job_level')['count'].apply(lambda x: (x / x.sum()) * 100) # Agrupación para calcular el porcentaje sobre el total

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
            y=df_filtered['job_level'],
            name=risk,
            orientation='h',
            marker=dict(color=colors[risk]),
            text=df_filtered['percentage'].apply(lambda x: f"{x:.2f}%"),
            textposition='auto'
        ))

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
    '''
    Endpoint que devuelve un gráfico de líneas de evolución temporal
    de las predicciones a partir de una query a la BD y lo devuelve
    en formato json
    '''
    df=make_query("SELECT months_left FROM replacement")

    counts = df['months_left'].value_counts().sort_index()

    counts_filtered = counts.loc[counts.index <= 24] # Filtro para 24 meses

    fig = px.line(x=counts_filtered.index, y=counts_filtered.values, title="Prediction attrition for next 24 months") # Gráfica de series de tiempo

    fig.update_traces(line_width=3, mode='lines+markers', hovertemplate='Month: %{x}<br>Nº of attrition: %{y}')  

    fig.update_layout(xaxis=dict(
        tickmode='array',
        tickvals=counts_filtered.index,
        ticktext=counts_filtered.index
    ), xaxis_title="next 24 months", yaxis_title="Nº of attrition", title_x=0.5, title_font={'size': 24})

    graph = fig.to_json()
    return graph




if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)