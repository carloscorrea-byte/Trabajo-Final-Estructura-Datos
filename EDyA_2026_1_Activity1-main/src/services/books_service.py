from fastapi import HTTPException
from src.models.books import Libro
from src.db.db_json import libros_db, guardar_libros

# ─── CRUD básico ───────────────────────────────────────────

def crear_libro(libro: Libro):
    for l in libros_db:
        if l.id == libro.id:
            raise HTTPException(status_code=400, detail="ID de libro ya existe")
    libros_db.append(libro)
    guardar_libros(libros_db)
    return libro

def listar_libros():
    return libros_db

def obtener_libro(libro_id: int):
    for libro in libros_db:
        if libro.id == libro_id:
            return libro
    raise HTTPException(status_code=404, detail="Libro no encontrado")

def actualizar_libro(libro_id: int, libro_actualizado: Libro):
    for idx, libro in enumerate(libros_db):
        if libro.id == libro_id:
            libros_db[idx] = libro_actualizado
            guardar_libros(libros_db)
            return libro_actualizado
    raise HTTPException(status_code=404, detail="Libro no encontrado")

def eliminar_libro(libro_id: int):
    for idx, libro in enumerate(libros_db):
        if libro.id == libro_id:
            del libros_db[idx]
            guardar_libros(libros_db)
            return {"mensaje": "Libro eliminado"}
    raise HTTPException(status_code=404, detail="Libro no encontrado")

def prestar_libro(libro_id: int):
    for libro in libros_db:
        if libro.id == libro_id:
            if libro.ejemplares_disponibles > 0:
                libro.ejemplares_disponibles -= 1
                guardar_libros(libros_db)
                return {"mensaje": "Préstamo realizado"}
            else:
                raise HTTPException(status_code=400, detail="No hay ejemplares disponibles")
    raise HTTPException(status_code=404, detail="Libro no encontrado")

# ─── Búsqueda lineal ───────────────────────────────────────
# Complejidad: O(n) — recorre todos los libros uno por uno

def buscar_libros(texto: str):
    texto = texto.lower()
    resultados = []
    for libro in libros_db:
        if (texto in libro.titulo.lower() or
            texto in libro.autor.lower() or
            texto in libro.categoria.lower() or
            texto in str(libro.id)):
            resultados.append(libro)
    return resultados

# ─── Algoritmos de ordenamiento ────────────────────────────

def obtener_valor(libro: Libro, campo: str):
    valor = getattr(libro, campo, "")
    return valor.lower() if isinstance(valor, str) else valor

# Merge Sort — O(n log n)
def merge_sort(lista, campo):
    if len(lista) <= 1:
        return lista
    medio = len(lista) // 2
    izquierda = merge_sort(lista[:medio], campo)
    derecha = merge_sort(lista[medio:], campo)
    return merge(izquierda, derecha, campo)

def merge(izq, der, campo):
    resultado = []
    i = j = 0
    while i < len(izq) and j < len(der):
        if obtener_valor(izq[i], campo) <= obtener_valor(der[j], campo):
            resultado.append(izq[i])
            i += 1
        else:
            resultado.append(der[j])
            j += 1
    resultado.extend(izq[i:])
    resultado.extend(der[j:])
    return resultado

# Bubble Sort — O(n²)
def bubble_sort(lista, campo):
    lista = lista[:]
    n = len(lista)
    for i in range(n):
        for j in range(0, n - i - 1):
            if obtener_valor(lista[j], campo) > obtener_valor(lista[j + 1], campo):
                lista[j], lista[j + 1] = lista[j + 1], lista[j]
    return lista

# Insertion Sort — O(n²)
def insertion_sort(lista, campo):
    lista = lista[:]
    for i in range(1, len(lista)):
        clave = lista[i]
        j = i - 1
        while j >= 0 and obtener_valor(lista[j], campo) > obtener_valor(clave, campo):
            lista[j + 1] = lista[j]
            j -= 1
        lista[j + 1] = clave
    return lista

def ordenar_libros(campo: str, algoritmo: str):
    campos_validos = ["titulo", "autor", "anio_publicacion", "ejemplares_disponibles"]
    if campo not in campos_validos:
        raise HTTPException(status_code=400, detail=f"Campo inválido. Use: {campos_validos}")
    
    lista = libros_db[:]
    if algoritmo == "merge":
        return merge_sort(lista, campo)
    elif algoritmo == "bubble":
        return bubble_sort(lista, campo)
    elif algoritmo == "insertion":
        return insertion_sort(lista, campo)
    else:
        raise HTTPException(status_code=400, detail="Algoritmo inválido. Use: merge, bubble, insertion")

# ─── Árbol de categorías (recursión) ───────────────────────
# Complejidad: O(n) — visita cada libro una vez para construir el árbol

def construir_arbol(nodo: dict, libros: list, nivel: int):
    """Función recursiva que cuenta libros en cada subcategoría"""
    if not nodo.get("hijos"):
        # Caso base: nodo hoja, contar libros de esta categoría
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

def obtener_arbol_categorias():
    arbol = [
        {
            "nombre": "Ingeniería",
            "hijos": [
                {
                    "nombre": "Programación",
                    "hijos": [
                        {"nombre": "Desarrollo Web", "hijos": []},
                        {"nombre": "Algoritmos", "hijos": []}
                    ]
                },
                {
                    "nombre": "Bases de Datos",
                    "hijos": [
                        {"nombre": "SQL", "hijos": []},
                        {"nombre": "NoSQL", "hijos": []}
                    ]
                }
            ]
        },
        {
            "nombre": "Ciencias",
            "hijos": [
                {"nombre": "Matemáticas", "hijos": []},
                {"nombre": "Física", "hijos": []}
            ]
        },
        {
            "nombre": "Humanidades",
            "hijos": [
                {"nombre": "Historia", "hijos": []},
                {"nombre": "Filosofía", "hijos": []}
            ]
        }
    ]
    for nodo in arbol:
        construir_arbol(nodo, libros_db, 0)
    return arbol