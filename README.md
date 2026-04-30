# 📚 Sistema de Gestión y Consulta de Biblioteca Académica

Aplicación web completa para registrar, consultar, buscar, ordenar y explorar libros académicos. Desarrollada con **React + Vite** en el frontend y **FastAPI** en el backend, con persistencia en JSON y algoritmos de búsqueda, ordenamiento y recursión implementados explícitamente.

> Proyecto final — Estructuras de Datos y Algoritmos 1 · 2026  
> Modalidad: Grupos de 3 · Tecnologías: React + FastAPI · Soporte: GitHub + demo

---

## 👥 Integrantes del equipo

| Nombre | Codigo |
|--------|--------------|
| Juan Manuel Alvarez Molano | 2238205 |
| Leidy Tatiana Hernandez | 2240682 |
| Carlos Alberto Correa | 2240396 |

---

## 1. Descripción del proyecto

El proyecto consiste en una aplicación web completa para gestionar el catálogo de una biblioteca académica universitaria. Permite registrar, consultar, buscar, ordenar y explorar libros mediante una interfaz gráfica en React conectada a una API REST en FastAPI.

El objetivo principal no es construir una plataforma comercial, sino demostrar el uso correcto de estructuras de datos y algoritmos: búsqueda lineal, algoritmos de ordenamiento propios (Merge Sort, Bubble Sort, Insertion Sort) y una función recursiva para explorar una jerarquía de categorías.

---

## 2. Arquitectura del sistema

### Tecnologías utilizadas

| Capa | Tecnología | Propósito |
|------|-----------|-----------|
| Frontend | React + Vite | Interfaz gráfica de usuario |
| Backend | FastAPI (Python) | API REST con endpoints |
| Persistencia | JSON (`Libros.json`) | Almacenamiento de datos en archivo |
| Validación | Pydantic | Modelos y validaciones del backend |
| Estilos | CSS propio | Diseño visual personalizado |
| Control de versiones | Git + GitHub | Trabajo colaborativo y commits |

### Estructura de carpetas

```
Trabajo-Final-Estructura-Datos/
├── README.md
└── EDyA_2026_1_Activity1-main/
    ├── main.py                        ← Punto de entrada del backend
    ├── requirements.txt
    ├── frontend/                      ← Frontend React
    │   ├── index.html
    │   ├── package.json
    │   ├── vite.config.js
    │   └── src/
    │       ├── App.jsx                ← Componente principal
    │       ├── App.css                ← Estilos globales
    │       ├── main.jsx               ← Punto de entrada de React
    │       ├── index.css
    │       ├── assets/
    │       │   ├── hero.png
    │       │   ├── react.svg
    │       │   └── vite.svg
    │       └── components/
    │           ├── ArbolCategorias.jsx
    │           ├── Buscador.jsx
    │           ├── LibroFormulario.jsx
    │           ├── LibrosTabla.jsx
    │           └── Ordenamiento.jsx
    └── src/                           ← Backend
        ├── db/
        │   ├── db_json.py             ← Lee y escribe el JSON
        │   └── Libros.json            ← Dataset con 26 libros de prueba
        ├── models/
        │   └── books.py               ← Modelo Pydantic del libro
        ├── routes/
        │   └── routes_books.py        ← Definición de endpoints
        └── services/
            └── books_service.py       ← Algoritmos y lógica de negocio
```

---

## 3. Instalación y ejecución

### Requisitos previos

- Python 3.10+
- Node.js 18+

### Backend

```bash
# Desde la carpeta EDyA_2026_1_Activity1-main

# Crear y activar entorno virtual
python -m venv .venv
.venv\Scripts\activate          

# Instalar dependencias
pip install -r requirements.txt

# Iniciar servidor

uvicorn main:app --reload
```

- API disponible en: `http://localhost:8000`
- Documentación interactiva: `http://localhost:8000/docs`

### Frontend

```bash
# Desde la carpeta frontend (en otra terminal)
npm install
npm run dev
```

- Aplicación disponible en: `http://localhost:5173`

---

## 4. Endpoints de la API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/libros/` | Lista todos los libros (filtros opcionales: `?autor=` `?categoria=`) |
| GET | `/libros/{id}` | Obtiene un libro por ID |
| POST | `/libros/` | Registra un nuevo libro |
| PUT | `/libros/{id}` | Actualiza un libro existente |
| DELETE | `/libros/{id}` | Elimina un libro |
| POST | `/libros/{id}/prestar` | Registra préstamo (descuenta un ejemplar disponible) |
| GET | `/libros/buscar?texto=...` | Búsqueda lineal por título, autor, categoría o ID |
| GET | `/libros/ordenar?campo=...&algoritmo=...` | Ordena con el algoritmo elegido |
| GET | `/libros/categorias/arbol` | Retorna árbol jerárquico de categorías con conteo recursivo |

### Ejemplos de uso

```bash
# Buscar por texto libre
GET /libros/buscar?texto=python

# Ordenar por año con Merge Sort
GET /libros/ordenar?campo=anio_publicacion&algoritmo=merge

# Ordenar por título con Bubble Sort
GET /libros/ordenar?campo=titulo&algoritmo=bubble

# Ordenar por autor con Insertion Sort
GET /libros/ordenar?campo=autor&algoritmo=insertion
```

**Campos válidos para ordenar:** `titulo`, `autor`, `anio_publicacion`, `ejemplares_disponibles`  
**Algoritmos válidos:** `merge`, `bubble`, `insertion`

---

## 5. Algoritmos implementados

###  Búsqueda lineal — O(n)

Implementada en `books_service.py`, función `buscar_libros()`.

Recorre todos los libros uno por uno comparando el texto ingresado contra el título, autor, categoría e ID de cada libro.

```python
def buscar_libros(texto: str):
    texto = texto.lower()
    resultados = []
    for libro in libros_db:          # recorre uno por uno → O(n)
        if (texto in libro.titulo.lower() or
            texto in libro.autor.lower() or
            texto in libro.categoria.lower() or
            texto in str(libro.id)):
            resultados.append(libro)
    return resultados
```

**¿Cuándo funciona?** Siempre, sin importar si los datos están ordenados o no.  
**Costo temporal:** O(n) — en el peor caso revisa los n libros completos.  
**¿Por qué no búsqueda binaria?** La búsqueda binaria requiere datos ordenados y solo permite comparación exacta por un campo. La búsqueda lineal es más adecuada aquí porque busca por texto parcial en múltiples campos simultáneamente.

---

###  Merge Sort — O(n log n)

Divide la lista en mitades recursivamente hasta tener sublistas de un elemento, luego las combina en orden. Es el algoritmo más eficiente de los tres implementados.

```python
def merge_sort(lista, campo):
    if len(lista) <= 1:                          # caso base
        return lista
    medio = len(lista) // 2
    izquierda = merge_sort(lista[:medio], campo) # recursión izquierda
    derecha   = merge_sort(lista[medio:], campo) # recursión derecha
    return merge(izquierda, derecha, campo)      # combina ordenando
```

**Complejidad:** O(n log n) en todos los casos.  
**Ventaja:** Rendimiento predecible y consistente sin importar el estado inicial de los datos.  
**Limitación:** Requiere memoria adicional para las sublistas temporales.

---

### 📊 Bubble Sort — O(n²)

Compara pares de elementos adyacentes e intercambia los que estén en orden incorrecto. Repite el proceso hasta que no haya más intercambios.

```python
def bubble_sort(lista, campo):
    lista = lista[:]
    n = len(lista)
    for i in range(n):                    # n pasadas
        for j in range(0, n - i - 1):    # compara adyacentes
            if obtener_valor(lista[j], campo) > obtener_valor(lista[j+1], campo):
                lista[j], lista[j+1] = lista[j+1], lista[j]
    return lista
```

**Complejidad:** O(n²) en el peor y caso promedio.  
**Ventaja:** Simple de entender e implementar.  
**Limitación:** Muy ineficiente para catálogos grandes.

---

### 📊 Insertion Sort — O(n²)

Toma cada elemento y lo inserta en la posición correcta dentro de la parte ya ordenada de la lista.

```python
def insertion_sort(lista, campo):
    lista = lista[:]
    for i in range(1, len(lista)):
        clave = lista[i]
        j = i - 1
        while j >= 0 and obtener_valor(lista[j], campo) > obtener_valor(clave, campo):
            lista[j + 1] = lista[j]    # desplaza a la derecha
            j -= 1
        lista[j + 1] = clave           # inserta en posición correcta
    return lista
```

**Complejidad:** O(n²) en el peor caso, O(n) si la lista ya está casi ordenada.  
**Ventaja sobre Bubble Sort:** Más eficiente cuando los datos están parcialmente ordenados.

---

### Comparación de algoritmos de ordenamiento

| Algoritmo | Mejor caso | Caso promedio | Peor caso | ¿Cuándo usarlo? |
|-----------|-----------|---------------|-----------|-----------------|
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | Siempre eficiente, catálogos grandes |
| Insertion Sort | O(n) | O(n²) | O(n²) | Listas casi ordenadas |
| Bubble Sort | O(n²) | O(n²) | O(n²) | Uso educativo / listas muy pequeñas |

Se eligió **Merge Sort como algoritmo principal** porque garantiza O(n log n) en todos los casos, lo que lo hace el más adecuado para ordenar el catálogo independientemente del estado inicial de los datos.

---

###  Recursión — Árbol de categorías — O(n)

Implementada en `books_service.py`, función `construir_arbol()`. Recorre el árbol de categorías de forma recursiva, contando cuántos libros pertenecen a cada nodo y acumulando el total en los nodos padre.

```python
def construir_arbol(nodo: dict, libros: list, nivel: int):
    if not nodo.get("hijos"):
        # Caso base: nodo hoja → cuenta libros de esta categoría
        nodo["total_libros"] = sum(
            1 for l in libros if l.categoria.lower() == nodo["nombre"].lower()
        )
        return
    # Llamada recursiva para cada hijo
    total = 0
    for hijo in nodo["hijos"]:
        construir_arbol(hijo, libros, nivel + 1)
        total += hijo.get("total_libros", 0)
    nodo["total_libros"] = total
```

**Caso base:** Nodo hoja (sin hijos) — cuenta los libros de esa categoría directamente y retorna.  
**Llamada recursiva:** Para cada hijo del nodo actual, llama a sí misma y acumula el total.  
**Complejidad:** O(n) — visita cada nodo del árbol exactamente una vez.

#### Jerarquía de categorías implementada

```
Ingeniería
├── Programación
│   ├── Desarrollo Web
│   └── Algoritmos
└── Bases de Datos
    ├── SQL
    └── NoSQL

Ciencias
├── Matemáticas
└── Física

Humanidades
├── Historia
└── Filosofía
```

---

## 6. Componentes del frontend

| Componente | Descripción |
|------------|-------------|
| `App.jsx` | Componente raíz que maneja el estado global y coordina la navegación entre módulos |
| `LibrosTabla.jsx` | Muestra el catálogo completo con botones de editar, prestar y eliminar |
| `LibroFormulario.jsx` | Formulario para registrar y editar libros (usa POST o PUT según el caso) |
| `Buscador.jsx` | Barra de búsqueda que llama al endpoint `/buscar` y muestra resultados en tiempo real |
| `Ordenamiento.jsx` | Permite seleccionar campo y algoritmo; muestra la complejidad de cada uno |
| `ArbolCategorias.jsx` | Visualiza el árbol jerárquico de categorías, expandible e interactivo |

---

## 7. Persistencia

Los datos se almacenan en `src/db/Libros.json`. Al iniciar el servidor, los libros se cargan en memoria desde este archivo. Cada operación de escritura (crear, actualizar, eliminar, prestar) persiste los cambios inmediatamente en el JSON.

Se eligió JSON porque el proyecto es un prototipo académico enfocado en demostrar algoritmos, no en infraestructura de datos. Para un sistema en producción, la alternativa natural sería SQLite o PostgreSQL.

---

## 8. Dataset de prueba

El sistema incluye **26 libros precargados** en `Libros.json`, distribuidos así:

| Categoría principal | Subcategorías | Libros |
|---------------------|--------------|--------|
| Ingeniería | Programación, Desarrollo Web, Algoritmos, SQL, NoSQL | 14 |
| Ciencias | Matemáticas, Física | 5 |
| Humanidades | Historia, Filosofía | 7 |

Los datos incluyen variedad de autores, años de publicación y disponibilidad de ejemplares para que la búsqueda y el ordenamiento tengan sentido real.

---

## 9. Historial de commits

Los commits siguen la convención **Conventional Commits**:

| Commit | Descripción |
|--------|-------------|
| `feat: agregar proyecto frontend con React + Vite` | Se creó la base del proyecto de React usando Vite |
| `feat(backend): agregar búsqueda lineal, ordenamiento y árbol recursivo` | Se implementaron los algoritmos principales en `books_service.py` |
| `feat(backend): agregar CORS para conexión con React` | Se configuró el middleware para permitir comunicación entre frontend y backend |
| `data: agregar 25 libros de prueba en Libros.json` | Se cargaron los datos de prueba con categorías variadas |
| `style(frontend): agregar estilos CSS base` | Se diseñó la interfaz con paleta verde y café |
| `feat(frontend): crear componente LibrosTabla` | Tabla de libros con botones de editar, prestar y eliminar |
| `feat(frontend): crear componente LibroFormulario` | Formulario de registro y edición con validaciones |
| `feat(frontend): crear componente Buscador` | Módulo de búsqueda lineal O(n) con resultados en tiempo real |
| `feat(frontend): crear componente Ordenamiento` | Módulo con Merge Sort, Bubble Sort e Insertion Sort |
| `feat(frontend): crear componente ArbolCategorias` | Árbol recursivo jerárquico interactivo de categorías |
| `feat(frontend): integrar App.jsx con todos los componentes` | Se unieron todos los componentes con navegación principal |
| `fix(backend): corregir books_service.py` | Se corrigió el archivo de algoritmos |
| `style(frontend): actualizar diseño con paleta verde y café` | Se mejoró el diseño visual de toda la aplicación |

**Prefijos usados:** `feat` nueva funcionalidad · `fix` corrección de errores · `style` cambios de diseño · `data` archivos de prueba

---