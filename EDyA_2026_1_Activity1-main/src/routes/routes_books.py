from fastapi import APIRouter, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from src.models.books import Libro
from src.services import books_service

router = APIRouter()

# ─── CRUD básico ───────────────────────────────────────────

@router.post("/", response_model=Libro)
def registrar_libro(libro: Libro):
    return books_service.crear_libro(libro)

@router.get("/", response_model=list[Libro])
def obtener_libros(
    autor: str = Query(None),
    categoria: str = Query(None)
):
    libros = books_service.listar_libros()
    if autor:
        libros = [l for l in libros if l.autor.lower() == autor.lower()]
    if categoria:
        libros = [l for l in libros if l.categoria.lower() == categoria.lower()]
    return libros

@router.get("/buscar", response_model=list[Libro])
def buscar_libros(texto: str = Query(..., description="Texto a buscar")):
    return books_service.buscar_libros(texto)

@router.get("/ordenar", response_model=list[Libro])
def ordenar_libros(
    campo: str = Query("titulo", description="Campo: titulo, autor, anio_publicacion, ejemplares_disponibles"),
    algoritmo: str = Query("merge", description="Algoritmo: merge, bubble, insertion")
):
    return books_service.ordenar_libros(campo, algoritmo)

@router.get("/categorias/arbol")
def obtener_libro_categorias():
    return books_service.obtener_arbol_categorias()

@router.get("/{libro_id}", response_model=Libro)
def obtener_libro_por_id(libro_id: int):
    return books_service.obtener_libro(libro_id)

@router.put("/{libro_id}", response_model=Libro)
def actualizar_libro_por_id(libro_id: int, libro: Libro):
    return books_service.actualizar_libro(libro_id, libro)

@router.delete("/{libro_id}")
def eliminar_libro_por_id(libro_id: int):
    return books_service.eliminar_libro(libro_id)

@router.post("/{libro_id}/prestar")
def prestar_libro_por_id(libro_id: int):
    return books_service.prestar_libro(libro_id)