# Actividad 1 | Backend con FastAPI

## Integrantes
- Juan Manuel Alvarez Molano

## Descripción
API para la gestión del catálogo de libros de la biblioteca de una universidad. Permite registrar, consultar, actualizar, eliminar y prestar libros. Persistencia en archivo JSON.

## Documentacion
   
4. Accede a la documentación interactiva en [http://localhost:8000/docs](http://localhost:8000/docs)

## Tipo de persistencia
- Archivo JSON (src/db/libros.json)

## Endpoints
| Método | Ruta                  | Descripción                        |
|--------|-----------------------|------------------------------------|
| POST   | /libros               | Crear un libro                     |
| GET    | /libros               | Listar todos los libros (filtros)  |
| GET    | /libros/{id}          | Consultar un libro por id          |
| PUT    | /libros/{id}          | Actualizar un libro existente      |
| DELETE | /libros/{id}          | Eliminar un libro                  |
| POST   | /libros/{id}/prestar  | Registrar el préstamo de un libro  |

### Ejemplo de uso
```json
{
  "id": 1,
  "titulo": "Cien años de soledad",
  "autor": "Gabriel García Márquez",
  "categoria": "Novela",
  "anio_publicacion": 1967,
  "total_ejemplares": 5,
  "ejemplares_disponibles": 5
}
```

## Validaciones
- Título y autor no vacíos
- Año de publicación no mayor al actual
- Total de ejemplares > 0
- Ejemplares disponibles >= 0 y <= total
- No se puede prestar si no hay ejemplares disponibles

---


