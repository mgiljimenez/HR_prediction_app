# Documentación de la API

Esta documentación describe una API que proporciona gráficas generadas con Plotly. La API se conecta a una base de datos y recupera automáticamente los datos necesarios para generar las gráficas para su consumo en la interfaz de usuairo (front-end). A continuación se presentan los cinco endpoints disponibles en esta API.

## Base URL

El punto de acceso base para esta API es: `https://api-hr-proyect.onrender.com/`

## Autenticación

La API no requiere autenticación en este momento. Sin embargo, se recomienda implementar mecanismos de autenticación y autorización adecuados si se despliega en un entorno de producción.

## 1. Obtener gráfica de distribución del riesgo de abandono

### Endpoint
```
GET /db/graph/pie
```

Este endpoint devuelve una gráfica de distribución del riesgo de abandono.

### Parámetros
No se requieren parámetros.

### Respuesta exitosa
```json
{
  "data": [{"data":[{"hole":0.4,"labels":["High","Very high","Low","Medium"]...
  }]
  }]
}
```

La respuesta contiene un objeto JSON con los datos de la gráfica en el formato necesario para Plotly.

## 2. Obtener gráfica de usuarios activos diarios

### Endpoint
```
GET /db/graph/pie
```

Este endpoint devuelve una gráfica de usuarios activos diarios.

### Parámetros
No se requieren parámetros.

### Respuesta exitosa
```json
{
  "data": {
    "x": ["2023-06-01", "2023-06-02", "2023-06-03", ...],
    "y": [100, 150, 200, ...],
    "type": "line"
  }
}
```

La respuesta contiene un objeto JSON con los datos de la gráfica en el formato necesario para Plotly.

## 3. Obtener gráfica de productos más vendidos

### Endpoint
```
GET /api/productos-vendidos
```

Este endpoint devuelve una gráfica de los productos más vendidos.

### Parámetros
No se requieren parámetros.

### Respuesta exitosa
```json
{
  "data": {
    "labels": ["Producto A", "Producto B", "Producto C", ...],
    "values": [100, 150, 200, ...],
    "type": "pie"
  }
}
```

La respuesta contiene un objeto JSON con los datos de la gráfica en el formato necesario para Plotly.

## 4. Obtener gráfica de ingresos por categoría

### Endpoint
```
GET /api/ingresos-por-categoria
```

Este endpoint devuelve una gráfica de los ingresos por categoría.

### Parámetros
No se requieren parámetros.

### Respuesta exitosa
```json
{
  "data": {
    "x": ["Categoría 1", "Categoría 2", "Categoría 3", ...],
    "y": [100, 150, 200, ...],
    "type": "bar"
  }
}
```

La respuesta contiene un objeto JSON con los datos de la gráfica en el formato necesario para Plotly.

## 5. Obtener gráfica personalizada

### Endpoint
```
GET /api/grafica-personalizada
```

Este endpoint devuelve una gráfica personalizada basada en los parámetros proporcionados.

### Parámetros
- `data`: Los datos de la gráfica en un formato específico.
- `type`: El tipo de gráfica a generar (por ejemplo, "bar", "line", "scatter", etc.).

### Respuesta exitosa
```json
{
  "data": {
    "x": [...],


    "y": [...],
    "type": "..."
  }
}
```

La respuesta contiene un objeto JSON con los datos de la gráfica en el formato necesario para Plotly.

¡Eso es todo! Estos son los cinco endpoints disponibles en esta API para obtener gráficas generadas con Plotly. Esperamos que esta documentación te ayude a utilizar la API de manera efectiva. Si tienes alguna pregunta adicional, no dudes en contactarnos.

## Consideraciones adicionales

- Asegúrate de enviar solicitudes con el encabezado `Content-Type: application/json` para indicar que los datos se envían en formato JSON.
- Si algún parámetro requerido falta en la solicitud, la API responderá con un código de estado de error apropiado y un mensaje de error descriptivo en el cuerpo de la respuesta.
- Los colores deben proporcionarse en formato hexadecimal válido (#RRGGBB) para cada porción del gráfico o cada barra.
- La API utiliza la biblioteca Plotly para generar los gráficos. Asegúrate de tener las dependencias necesarias y las configuraciones adecuadas para utilizar Plotly en el entorno donde se implemente esta API.

¡Eso es todo! Si tienes alguna otra pregunta, no dudes en preguntar.