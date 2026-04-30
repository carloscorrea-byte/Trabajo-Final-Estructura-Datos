from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routes import routes_books

app = FastAPI(title="Biblioteca Académica API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes_books.router, prefix="/libros", tags=["Libros"])