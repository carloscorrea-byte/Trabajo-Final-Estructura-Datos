from fastapi import HTTPException
from src.models.books import Libro
from src.db.db_json import libros_db, guardar_libros

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
