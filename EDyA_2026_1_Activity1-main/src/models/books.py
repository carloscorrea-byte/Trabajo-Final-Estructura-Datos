from pydantic import BaseModel, validator, Field
from datetime import datetime

class Libro(BaseModel):
    id: int
    titulo: str = Field(..., min_length=1, description="Título no puede estar vacío")
    autor: str = Field(..., min_length=1, description="Autor no puede estar vacío")
    categoria: str
    anio_publicacion: int
    total_ejemplares: int = Field(..., gt=0, description="Debe ser mayor a 0")
    ejemplares_disponibles: int = Field(..., ge=0, description="No puede ser negativo")

    @validator('anio_publicacion')
    def validar_anio(cls, v):
        anio_actual = datetime.now().year
        if v > anio_actual:
            raise ValueError(f"El año de publicación no puede ser mayor a {anio_actual}")
        return v

    @validator('ejemplares_disponibles')
    def validar_ejemplares_disponibles(cls, v, values):
        total = values.get('total_ejemplares', None)
        if total is not None and v > total:
            raise ValueError("Ejemplares disponibles no puede ser mayor que el total de ejemplares")
        return v
