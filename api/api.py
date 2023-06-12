#Importamos la librerías y variables necesarias
from mysql.connector import pooling
import pandas as pd
from flask import Flask, request, jsonify, abort, make_response
from flask_cors import CORS
import plotly
import plotly.graph_objects as go
import plotly.express as px
from dotenv import load_dotenv
import os
import json

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


def create_graph_line(df):
    '''
    Endpoint que devuelve un gráfico de líneas de evolución temporal
    de las predicciones a partir de una query a la BD y lo devuelve
    en formato json
    '''
    counts = df['months_left'].value_counts().sort_index()
    counts_filtered = counts.loc[counts.index <= 24] # Filtro para 24 meses
    fig = px.line(x=counts_filtered.index, y=counts_filtered.values, title="Prediction attrition for next 24 months") # Gráfica de series de tiempo

    fig.update_traces(line_width=3, mode='lines+markers', hovertemplate='Month: %{x}<br>Nº of attrition: %{y}')  

    fig.update_layout(xaxis=dict(
        tickmode='array',
        tickvals=counts_filtered.index,
        ticktext=counts_filtered.index
    ), xaxis_title="next 24 months", 
    yaxis_title="Nº of attrition", 
    title_x=0.5, 
    title_font={'size': 24},
    width=840,
    height=420,
    paper_bgcolor='rgba(0,0,0,0)',
    font_family="Roboto",
    font_color="#1D3557",
    title_font_family="Roboto",
    title_font_color="#1D3557",
    legend_title_font_color="#1D3557")
    return plotly.io.to_json(fig)


def create_graph_pie(df_graph_pie):
    count_values = df_graph_pie.value_counts()
    # Estética de la gráfica
    colors = {
        "Low": "#0F9D58",
        "Medium": '#FFFF00',
        "High": "#FABC09",
        "Very high": "#DB4437"
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
        width=600,
        height=400,
        title_x=0.5,
        paper_bgcolor='rgba(0,0,0,0)', # Fondo transparente
        font_family="Roboto",
        font_color="#1D3557",
        title_font_family="Roboto",
        title_font_color="#1D3557",
        legend_title_font_color="#1D3557"
    )
    return plotly.io.to_json(fig)


def create_graph_bar1(df):
        df_agg = df.groupby(['role', 'risk']).size().reset_index(name='count')
        df_agg['percentage'] = df_agg.groupby('role')['count'].apply(lambda x: (x / x.sum()) * 100)

        fig = go.Figure()
        # Estética de la gráfica
        colors = {
            "Low": "#0F9D58",
            "Medium": '#FFFF00',
            "High": "#FABC09",
            "Very high": "#DB4437"
        }
        x_order = ["Low", "Medium", "High", "Very high"]
        # Barras agrupadas hasta sumar el total del riesgo (100)
        for risk in x_order:
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
            width=600,
            height=400,
            title_x=0.5,
            paper_bgcolor='rgba(0,0,0,0)', # Fondo transparente
            font_family="Roboto",
            font_color="#1D3557",
            title_font_family="Roboto", 
            title_font_color="#1D3557",
            legend_title_font_color="#1D3557"
        )
        return plotly.io.to_json(fig)

def create_graph_bar2(df):
    '''
    Endpoint que devuelve un gráfico de barras en función de riesgo
    y nivel de trabajo a partir de una query a la BD y lo devuelve
    en formato json
    '''
    df_agg = df.groupby(['job_level', 'risk']).size().reset_index(name='count')
    df_agg['percentage'] = df_agg.groupby('job_level')['count'].apply(lambda x: (x / x.sum()) * 100) # Agrupación para calcular el porcentaje sobre el total

    fig = go.Figure()
    # Estética de la gráfica
    colors = {
        "Low": "#0F9D58",
        "Medium": '#FFFF00',
        "High": "#FABC09",
        "Very high": "#DB4437"
    }
    x_order = ["Low", "Medium", "High", "Very high"]
    # Barras agrupadas hasta sumar el total del riesgo (100)
    for risk in x_order:
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

    # Tamaño de figura adaptado a la web
    fig.update_layout(
        title={
            'text': 'Distribution risk attrition by job level',
            'font': {'size': 24}
        },
        xaxis=dict(title=''),
        yaxis=dict(title='Job Level'),
        barmode='stack',
        autosize=False,
        width=600,
        height=400,
        title_x=0.5,
        paper_bgcolor='rgba(0,0,0,0)', # Fondo transparente
        font_family="Roboto",
        font_color="#1D3557",
        title_font_family="Roboto",
        title_font_color="#1D3557",
        legend_title_font_color="#1D3557"
    )
    return plotly.io.to_json(fig)

connection = get_connection()
cursor = connection.cursor()
cursor.execute("SELECT * from replacement")
resultado = cursor.fetchall()
column_names = [desc[0] for desc in cursor.description] 
df_replacement = pd.DataFrame(resultado, columns=column_names)

#df_graph_pie
df_graph_pie=df_replacement["risk"].copy()
#df_graph_bar1
df_graph_bar1=df_replacement[["role","risk"]].copy()
#df_graph_bar2
df_graph_bar2=df_replacement.copy()
#df_graph_line
df_graph_line=df_replacement[["months_left"]].copy
df_graph_line=df_graph_line()
#df_attrition
df_attrition=df_graph_line.copy()
attrition_24 = len([x for x in df_attrition['months_left'] if -1 < x < 25])

final_graph_line=create_graph_line(df_graph_line)
final_graph_pie=create_graph_pie(df_graph_pie)
final_graph_bar1=create_graph_bar1(df_graph_bar1)
final_graph_bar2=create_graph_bar2(df_graph_bar2)

@app.route('/graphs', methods=['GET'])
def get_all_data():
    ls_all_data=[final_graph_line,final_graph_pie,final_graph_bar1,final_graph_bar2,attrition_24]
    json_data = json.dumps(ls_all_data)
    return jsonify(ls_all_data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
