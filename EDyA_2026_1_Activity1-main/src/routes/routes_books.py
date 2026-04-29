from fastapi import APIRouter, Query
from src.models.books import Libro
from src.services import books_service

router = APIRouter()

@router.post("/", response_model=Libro)
def registrar_libro(libro: Libro):
    return books_service.crear_libro(libro)

@router.get("/", response_model=list[Libro])
def obtener_libros(
    autor: str = Query(None, description="Filtrar por autor"),
    categoria: str = Query(None, description="Filtrar por categoría")
):
    libros = books_service.listar_libros()
    if autor:
        libros = [l for l in libros if l.autor.lower() == autor.lower()]
    if categoria:
        libros = [l for l in libros if l.categoria.lower() == categoria.lower()]
    return libros

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
