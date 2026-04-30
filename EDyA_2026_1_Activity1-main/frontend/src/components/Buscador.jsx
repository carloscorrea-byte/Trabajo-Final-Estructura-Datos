import { useState } from 'react'
import { Search } from 'lucide-react'
import LibrosTabla from './LibrosTabla'

function Buscador({ onEditar, onEliminar, onPrestar }) {
  const [texto, setTexto] = useState('')
  const [resultados, setResultados] = useState([])
  const [buscado, setBuscado] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  const buscar = async () => {
    if (!texto.trim()) return
    setCargando(true)
    setError(null)
    try {
      const res = await fetch(`http://localhost:8000/libros/buscar?texto=${texto}`)
      const data = await res.json()
      setResultados(data)
      setBuscado(true)
    } catch {
      setError('No se pudo conectar con el servidor.')
    } finally {
      setCargando(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') buscar()
  }

  return (
    <div className="card">
      <h2>Buscar Libros</h2>
      <p style={{ marginBottom: '16px', color: '#666' }}>
        Búsqueda lineal por título, autor, categoría o ID — O(n)
      </p>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por título, autor, categoría o ID..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={buscar}>
          <Search size={16} /> Buscar
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {cargando && <p className="loading">Buscando...</p>}

      {buscado && !cargando && (
        <>
          <p style={{ marginBottom: '12px', color: '#555' }}>
            {resultados.length} resultado(s) encontrado(s) para <strong>"{texto}"</strong>
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

export default Buscador