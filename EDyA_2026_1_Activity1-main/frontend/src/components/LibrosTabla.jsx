import { Trash2, Edit, BookOpen } from 'lucide-react'

function LibrosTabla({ libros, onEditar, onEliminar, onPrestar }) {
  if (!libros || libros.length === 0) {
    return <p style={{ textAlign: 'center', color: '#888', padding: '30px' }}>No hay libros para mostrar.</p>
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Autor</th>
            <th>Categoría</th>
            <th>Año</th>
            <th>Disponibles</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {libros.map((libro) => (
            <tr key={libro.id}>
              <td>{libro.id}</td>
              <td><strong>{libro.titulo}</strong></td>
              <td>{libro.autor}</td>
              <td>{libro.categoria}</td>
              <td>{libro.anio_publicacion}</td>
              <td>
                <span className={`badge ${libro.ejemplares_disponibles > 0 ? 'badge-green' : 'badge-red'}`}>
                  {libro.ejemplares_disponibles}
                </span>
              </td>
              <td>{libro.total_ejemplares}</td>
              <td style={{ display: 'flex', gap: '6px' }}>
                <button className="btn btn-warning" onClick={() => onEditar(libro)} title="Editar">
                  <Edit size={14} />
                </button>
                <button className="btn btn-success" onClick={() => onPrestar(libro.id)} title="Prestar">
                  <BookOpen size={14} />
                </button>
                <button className="btn btn-danger" onClick={() => onEliminar(libro.id)} title="Eliminar">
                  <Trash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default LibrosTabla