import { useState, useEffect } from 'react'

const categorias = [
  "Desarrollo Web", "Algoritmos", "Programación",
  "SQL", "NoSQL", "Matemáticas", "Física", "Historia", "Filosofía"
]

function LibroFormulario({ libroEditar, onGuardar, onCancelar }) {
  const [form, setForm] = useState({
    id: '',
    titulo: '',
    autor: '',
    categoria: 'Algoritmos',
    anio_publicacion: '',
    total_ejemplares: '',
    ejemplares_disponibles: ''
  })

  const [mensaje, setMensaje] = useState(null)

  useEffect(() => {
    if (libroEditar) {
      setForm(libroEditar)
    } else {
      setForm({
        id: '',
        titulo: '',
        autor: '',
        categoria: 'Algoritmos',
        anio_publicacion: '',
        total_ejemplares: '',
        ejemplares_disponibles: ''
      })
    }
  }, [libroEditar])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!form.id || !form.titulo || !form.autor || !form.anio_publicacion || !form.total_ejemplares || !form.ejemplares_disponibles) {
      setMensaje({ tipo: 'error', texto: 'Todos los campos son obligatorios.' })
      return
    }

    const libro = {
      id: parseInt(form.id),
      titulo: form.titulo,
      autor: form.autor,
      categoria: form.categoria,
      anio_publicacion: parseInt(form.anio_publicacion),
      total_ejemplares: parseInt(form.total_ejemplares),
      ejemplares_disponibles: parseInt(form.ejemplares_disponibles)
    }

    try {
      const url = libroEditar
        ? `http://localhost:8000/libros/${libro.id}`
        : 'http://localhost:8000/libros/'
      const method = libroEditar ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(libro)
      })

      if (!res.ok) {
        const err = await res.json()
        setMensaje({ tipo: 'error', texto: err.detail || 'Error al guardar.' })
        return
      }

      setMensaje({ tipo: 'success', texto: libroEditar ? 'Libro actualizado correctamente.' : 'Libro registrado correctamente.' })
      onGuardar()
    } catch {
      setMensaje({ tipo: 'error', texto: 'No se pudo conectar con el servidor.' })
    }
  }

  return (
    <div className="card">
      <h2>{libroEditar ? 'Editar Libro' : 'Registrar Nuevo Libro'}</h2>

      {mensaje && (
        <div className={`alert alert-${mensaje.tipo === 'error' ? 'error' : 'success'}`}>
          {mensaje.texto}
        </div>
      )}

      <div className="form-grid">
        <div className="form-group">
          <label>ID</label>
          <input name="id" type="number" value={form.id} onChange={handleChange} disabled={!!libroEditar} placeholder="Ej: 26" />
        </div>
        <div className="form-group">
          <label>Título</label>
          <input name="titulo" value={form.titulo} onChange={handleChange} placeholder="Título del libro" />
        </div>
        <div className="form-group">
          <label>Autor</label>
          <input name="autor" value={form.autor} onChange={handleChange} placeholder="Nombre del autor" />
        </div>
        <div className="form-group">
          <label>Categoría</label>
          <select name="categoria" value={form.categoria} onChange={handleChange}>
            {categorias.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Año de publicación</label>
          <input name="anio_publicacion" type="number" value={form.anio_publicacion} onChange={handleChange} placeholder="Ej: 2020" />
        </div>
        <div className="form-group">
          <label>Total ejemplares</label>
          <input name="total_ejemplares" type="number" value={form.total_ejemplares} onChange={handleChange} placeholder="Ej: 5" />
        </div>
        <div className="form-group">
          <label>Ejemplares disponibles</label>
          <input name="ejemplares_disponibles" type="number" value={form.ejemplares_disponibles} onChange={handleChange} placeholder="Ej: 3" />
        </div>
      </div>

      <div className="form-actions">
        <button className="btn" onClick={handleSubmit}>
          {libroEditar ? 'Actualizar' : 'Registrar'}
        </button>
        {libroEditar && (
          <button className="btn btn-danger" onClick={onCancelar}>
            Cancelar
          </button>
        )}
      </div>
    </div>
  )
}

export default LibroFormulario