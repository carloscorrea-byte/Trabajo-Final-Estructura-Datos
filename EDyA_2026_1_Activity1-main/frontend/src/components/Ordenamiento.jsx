import { useState } from 'react'
import { ArrowUpDown } from 'lucide-react'
import LibrosTabla from './LibrosTabla'

function Ordenamiento({ onEditar, onEliminar, onPrestar }) {
  const [campo, setCampo] = useState('titulo')
  const [algoritmo, setAlgoritmo] = useState('merge')
  const [resultados, setResultados] = useState([])
  const [ordenado, setOrdenado] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  const ordenar = async () => {
    setCargando(true)
    setError(null)
    try {
      const res = await fetch(`http://localhost:8000/libros/ordenar?campo=${campo}&algoritmo=${algoritmo}`)
      const data = await res.json()
      setResultados(data)
      setOrdenado(true)
    } catch {
      setError('No se pudo conectar con el servidor.')
    } finally {
      setCargando(false)
    }
  }

  const descripcionAlgoritmo = {
    merge: 'Merge Sort — O(n log n): divide la lista en mitades y las combina ordenadas.',
    bubble: 'Bubble Sort — O(n²): compara pares adyacentes y los intercambia repetidamente.',
    insertion: 'Insertion Sort — O(n²): inserta cada elemento en su posición correcta.'
  }

  return (
    <div className="card">
      <h2>Ordenar Libros</h2>

      <div className="sort-controls">
        <div>
          <label style={{ fontWeight: '600', marginRight: '8px' }}>Ordenar por:</label>
          <select value={campo} onChange={(e) => setCampo(e.target.value)}>
            <option value="titulo">Título</option>
            <option value="autor">Autor</option>
            <option value="anio_publicacion">Año de publicación</option>
            <option value="ejemplares_disponibles">Disponibilidad</option>
          </select>
        </div>

        <div>
          <label style={{ fontWeight: '600', marginRight: '8px' }}>Algoritmo:</label>
          <select value={algoritmo} onChange={(e) => setAlgoritmo(e.target.value)}>
            <option value="merge">Merge Sort</option>
            <option value="bubble">Bubble Sort</option>
            <option value="insertion">Insertion Sort</option>
          </select>
        </div>

        <button className="btn" onClick={ordenar}>
          <ArrowUpDown size={16} /> Ordenar
        </button>
      </div>

      <div className="alert alert-success" style={{ marginBottom: '16px' }}>
        {descripcionAlgoritmo[algoritmo]}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {cargando && <p className="loading">Ordenando...</p>}

      {ordenado && !cargando && (
        <>
          <p style={{ marginBottom: '12px', color: '#555' }}>
            {resultados.length} libros ordenados por <strong>{campo}</strong> usando <strong>{algoritmo} sort</strong>
          </p>
          <LibrosTabla
            libros={resultados}
            onEditar={onEditar}
            onEliminar={onEliminar}
            onPrestar={onPrestar}
          />
        </>
      )}
    </div>
  )
}

export default Ordenamiento