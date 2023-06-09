#Importamos la librerías y variables necesarias
import mysql.connector
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import plotly.graph_objects as go
import plotly.express as px
import numpy as np


# Conexión a la Base de Datos
cnx = mysql.connector.connect(
    user="admin",
    password="admin123",
    host="test-db.cze2nnbbx5pc.eu-west-3.rds.amazonaws.com",
    database="prueba"
)
cursor = cnx.cursor()

def make_query(code):
    cnx.close()
    cnx.connect()
    '''
    Función principal de la API que permite
    hacer una query a la BD y devuelve el DF
    resultante para hacer gráficas
    
    La query utiliza como motor MySQL y debe
    seguir la sintaxis de SQL
    '''
    cursor.execute(code)
    results = cursor.fetchall()
    column_names = [desc[0] for desc in cursor.description] 
    df = pd.DataFrame(results, columns=column_names)
    cnx.close()
    
    return df

app = Flask(__name__)
app.config['DEBUG'] = True
CORS(app)

@app.route('/db/graph/pie', methods=['GET'])
def get_graph_pie():
    '''
    Endpoint que devuelve un gráfico de tarta del
    reparto del riesgo general en la empresa
    a partir de una query a la BD y lo devuelve
    en formato json
    '''
    df_risk=make_query("""SELECT risk from replacement""")
    count_values = df_risk.value_counts()

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
        paper_bgcolor='rgba(0,0,0,0)' # Fondo transparente
    )
    graph=fig.to_json()
    return graph

@app.route('/db/graph/bar1', methods=['GET'])
def get_graph_bar1():
    '''
    Endpoint que devuelve un gráfico de barras en función de riesgo
    y rol a partir de una query a la BD y lo devuelve
    en formato json
    '''
    df = make_query("SELECT role, risk FROM replacement")
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

    # Barras agrupadas hasta sumar el total del riesgo (100)
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
        width=600,
        height=400,
        title_x=0.5,
        paper_bgcolor='rgba(0,0,0,0)' # Fondo transparente
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

    # Estética de la gráfica
    colors = {
        "Low": "#0F9D58",
        "Medium": '#FFFF00',
        "High": "#FABC09",
        "Very high": "#DB4437"
    }

    # Barras agrupadas hasta sumar el total del riesgo (100)
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
        paper_bgcolor='rgba(0,0,0,0)' # Fondo transparente
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
    ), xaxis_title="next 24 months", 
    yaxis_title="Nº of attrition", 
    title_x=0.5, 
    title_font={'size': 24},
    width=1000,
    height=600,
    paper_bgcolor='rgba(0,0,0,0)')

    graph = fig.to_json()
    return graph

@app.route('/db/graph/gauge', methods=['GET'])
def get_graph_gauge():
    '''
    Endpoint que devuelve un gauge chart del riesgo de un ID concreto
    partir de una query a la BD y lo devuelve en formato json
    '''
    num_steps = 100 

    df=make_query("SELECT life_balance FROM replacement")

    # Mapeo para poder presentar el riesgo numéricamente
    
    risk_mapping = {'Bad': 13, 'Good': 38, 'Better': 63, 'Best':88}
    df['balance_value'] = df['life_balance'].map(risk_mapping)
    id=int(request.args.get("id"))

    # Generar colores interpolados para los pasos de la escala continua
    colors_interpolated = [f'rgb({int(255*np.sqrt(i/num_steps))}, {int(255*(1-np.sqrt(i/num_steps)))}, 0)' for i in range(num_steps)]
    tick_labels = ['Bad', 'Good', 'Better', 'Best']
    tick_values = [20, 40, 60, 80]

    # Tamaño de figura adaptado a la web
    layout = go.Layout(
    title='Gauge Chart',
    width=500,
    height=300,
    paper_bgcolor='rgba(0,0,0,0)' # Fondo transparente
    )

    fig = go.Figure()
    fig.add_trace(go.Indicator(
        mode='gauge',
        value=df['balance_value'].iloc[id],
        domain={'x': [0, 1], 'y': [0, 1]},
        title={'text': "Work Life Balance"},
        gauge={
            'axis': {'range': [0, 100], 'tickmode': 'array', 'tickvals': tick_values,'ticktext':tick_labels},
            'bar': {'color': 'rgba(0, 0, 0, 0)', 'thickness': 0.75},
            'steps': [{'range': [i, i + 1], 'color': colors_interpolated[i]} for i in range(num_steps)],
            'threshold': {
                'line': {'color': 'black', 'width': 5},
                'thickness': .75,
                'value': df['balance_value'].iloc[id]
            },
            
        }
    ))
    text_value = df['life_balance'].iloc[id]
    fig.add_annotation(
        x=0.5, y=0.2,  # Coordenadas en el gráfico (0-1)
        text=text_value,
        showarrow=False,
        font=dict(size=25)
    )

    fig.update_layout(layout)

    graph = fig.to_json()
    return graph

@app.route('/db/attrition24', methods=['GET'])
def make_query_json():
    cnx.close()
    cnx.connect()
    '''
    Función auxiliar que hace una llamada a la BD
    y devuelve el total de abandonos en 24 meses
    '''

    query = '''SELECT COUNT(months_left) as total_filas
    FROM prueba.replacement
    WHERE months_left < 25
    AND months_left > -1'''
    cursor.execute(query)
    results = cursor.fetchall()
    cnx.close()

    
    return jsonify(results)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
