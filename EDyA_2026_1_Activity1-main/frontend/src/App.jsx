import { useState, useEffect } from 'react'
import { BookMarked } from 'lucide-react'
import './App.css'
import LibrosTabla from './components/LibrosTabla'
import LibroFormulario from './components/LibroFormulario'
import Buscador from './components/Buscador'
import Ordenamiento from './components/Ordenamiento'
import ArbolCategorias from './components/ArbolCategorias'

function App() {
  const [vista, setVista] = useState('catalogo')
  const [libros, setLibros] = useState([])
  const [libroEditar, setLibroEditar] = useState(null)
  const [mensaje, setMensaje] = useState(null)
  const [cargando, setCargando] = useState(true)

  const cargarLibros = async () => {
    setCargando(true)
    try {
      const res = await fetch('http://localhost:8000/libros/')
      const data = await res.json()
      setLibros(data)
    } catch {
      setMensaje({ tipo: 'error', texto: 'No se pudo conectar con el servidor.' })
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarLibros()
  }, [])

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto })
    setTimeout(() => setMensaje(null), 3000)
  }

  const handleEditar = (libro) => {
    setLibroEditar(libro)
    setVista('formulario')
  }

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este libro?')) return
    try {
      const res = await fetch(`http://localhost:8000/libros/${id}`, { method: 'DELETE' })
      if (res.ok) {
        mostrarMensaje('success', 'Libro eliminado correctamente.')
        cargarLibros()
      }
    } catch {
      mostrarMensaje('error', 'Error al eliminar el libro.')
    }
  }

  const handlePrestar = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/libros/${id}/prestar`, { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        mostrarMensaje('success', data.mensaje)
        cargarLibros()
      } else {
        mostrarMensaje('error', data.detail)
      }
    } catch {
      mostrarMensaje('error', 'Error al realizar el préstamo.')
    }
  }

  const handleGuardar = () => {
    mostrarMensaje('success', libroEditar ? 'Libro actualizado.' : 'Libro registrado.')
    setLibroEditar(null)
    setVista('catalogo')
    cargarLibros()
  }

  const handleCancelar = () => {
    setLibroEditar(null)
    setVista('catalogo')
  }

  const navItems = [
    { id: 'catalogo', label: '📚 Catálogo' },
    { id: 'formulario', label: '➕ Registrar' },
    { id: 'buscar', label: '🔍 Buscar' },
    { id: 'ordenar', label: '↕️ Ordenar' },
    { id: 'categorias', label: '🌳 Categorías' },
  ]

  return (
    <div className="app">
      <header className="header">
        <BookMarked size={36} />
        <div>
          <h1>Biblioteca Académica</h1>
          <p>Sistema de Gestión y Consulta — Estructuras de Datos y Algoritmos</p>
        </div>
      </header>

      <nav className="nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={vista === item.id ? 'active' : ''}
            onClick={() => { setVista(item.id); setLibroEditar(null) }}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <main className="main">
        {mensaje && (
          <div className={`alert alert-${mensaje.tipo === 'error' ? 'error' : 'success'}`}>
            {mensaje.texto}
          </div>
        )}

        {vista === 'catalogo' && (
          <div className="card">
            <h2>Catálogo de Libros ({libros.length})</h2>
            {cargando ? (
              <p className="loading">Cargando libros...</p>
            ) : (
              <LibrosTabla
                libros={libros}
                onEditar={handleEditar}
                onEliminar={handleEliminar}
                onPrestar={handlePrestar}
              />
            )}
          </div>
        )}

        {vista === 'formulario' && (
          <LibroFormulario
            libroEditar={libroEditar}
            onGuardar={handleGuardar}
            onCancelar={handleCancelar}
          />
        )}

        {vista === 'buscar' && (
          <Buscador
            onEditar={handleEditar}
            onEliminar={handleEliminar}
            onPrestar={handlePrestar}
          />
        )}

        {vista === 'ordenar' && (
          <Ordenamiento
            onEditar={handleEditar}
            onEliminar={handleEliminar}
            onPrestar={handlePrestar}
          />
        )}

        {vista === 'categorias' && <ArbolCategorias />}
      </main>
    </div>
  )
}

export default App