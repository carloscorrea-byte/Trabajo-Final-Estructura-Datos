from fastapi import FastAPI
from src.routes import routes_books

app = FastAPI()
app.include_router(routes_books.router, prefix="/libros", tags=["Libros"])