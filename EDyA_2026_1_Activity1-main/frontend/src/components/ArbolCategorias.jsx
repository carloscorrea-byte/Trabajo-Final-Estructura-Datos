import { useState, useEffect } from 'react'
import { ChevronRight, ChevronDown, Folder, FolderOpen } from 'lucide-react'

function NodoArbol({ nodo }) {
  const [expandido, setExpandido] = useState(true)
  const tieneHijos = nodo.hijos && nodo.hijos.length > 0

  return (
    <div className="tree-node">
      <div className="tree-node-label" onClick={() => setExpandido(!expandido)}>
        {tieneHijos ? (
          expandido ? <ChevronDown size={16} /> : <ChevronRight size={16} />
        ) : (
          <span style={{ width: 16 }} />
        )}
        {tieneHijos
          ? (expandido ? <FolderOpen size={16} color="#2d6a9f" /> : <Folder size={16} color="#2d6a9f" />)
          : <Folder size={16} color="#888" />
        }
        <span style={{ fontWeight: tieneHijos ? '600' : '400' }}>{nodo.nombre}</span>
        <span className="tree-badge">{nodo.total_libros} libros</span>
      </div>

      {expandido && tieneHijos && (
        <div>
          {nodo.hijos.map((hijo, idx) => (
            <NodoArbol key={idx} nodo={hijo} />
          ))}
        </div>
      )}
    </div>
  )
}

function ArbolCategorias() {
  const [arbol, setArbol] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cargarArbol = async () => {
      try {
        const res = await fetch('http://localhost:8000/libros/categorias/arbol')
        const data = await res.json()
        setArbol(data)
      } catch {
        setError('No se pudo conectar con el servidor.')
      } finally {
        setCargando(false)
      }
    }
    cargarArbol()
  }, [])

  return (
    <div className="card">
      <h2>Jerarquía de Categorías</h2>
      <p style={{ marginBottom: '16px', color: '#666' }}>
        Árbol construido recursivamente — O(n). Haz clic en una categoría para expandir o colapsar.
      </p>

      {error && <div className="alert alert-error">{error}</div>}
      {cargando && <p className="loading">Cargando árbol...</p>}

      {!cargando && !error && (
        <div>
          {arbol.map((nodo, idx) => (
            <NodoArbol key={idx} nodo={nodo} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ArbolCategorias