import json
from typing import List
from src.models.books import Libro
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'libros.json')

# Cargar libros desde archivo JSON
def cargar_libros() -> List[Libro]:
	if not os.path.exists(DB_PATH):
		return []
	with open(DB_PATH, 'r', encoding='utf-8') as f:
		data = json.load(f)
		return [Libro(**item) for item in data]

# Guardar libros en archivo JSON
def guardar_libros(libros: List[Libro]):
	with open(DB_PATH, 'w', encoding='utf-8') as f:
		json.dump([libro.dict() for libro in libros], f, ensure_ascii=False, indent=2)

# Inicializar la base de datos en memoria desde el archivo
libros_db: List[Libro] = cargar_libros()
