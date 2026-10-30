import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Detail() {
  const { name } = useParams()
  const navigate = useNavigate()
  const [pokemon, setPokemon] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
        const data = await res.json()
        setPokemon(data)
      } catch (err) {
        console.error('Fout bij ophalen details:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [name])

  if (loading) return <p className="loading">Laden... ⏳</p>
  if (!pokemon) return <p className="loading">Pokémon niet gevonden.</p>

  const typeColors = {
    fire: '#F08030', water: '#6890F0', grass: '#78C850', electric: '#F8D030',
    psychic: '#F85888', ice: '#98D8D8', dragon: '#7038F8', dark: '#705848',
    fairy: '#EE99AC', normal: '#A8A878', fighting: '#C03028', flying: '#A890F0',
    poison: '#A040A0', ground: '#E0C068', rock: '#B8A038', bug: '#A8B820',
    ghost: '#705898', steel: '#B8B8D0',
  }

  return (
    <div className="page detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Terug</button>

      <div className="detail-card">
        <div className="detail-image-wrap">
          <img
            src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
            alt={pokemon.name}
            className="detail-image"
          />
        </div>

        <div className="detail-info">
          <h1 className="detail-name">
            #{String(pokemon.id).padStart(3, '0')} {pokemon.name}
          </h1>

          <div className="detail-types">
            {pokemon.types.map((t) => (
              <span
                key={t.type.name}
                className="type-badge"
                style={{ background: typeColors[t.type.name] || '#777' }}
              >
                {t.type.name}
              </span>
            ))}
          </div>

          <div className="detail-stats-grid">
            <div className="stat-box">
              <span className="stat-label">Hoogte</span>
              <span className="stat-value">{pokemon.height / 10} m</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Gewicht</span>
              <span className="stat-value">{pokemon.weight / 10} kg</span>
            </div>
          </div>

          <h2 className="stats-title">Stats</h2>
          <div className="stats-list">
            {pokemon.stats.map((s) => (
              <div key={s.stat.name} className="stat-row">
                <span className="stat-name">{s.stat.name}</span>
                <div className="stat-bar-wrap">
                  <div
                    className="stat-bar"
                    style={{ width: `${Math.min((s.base_stat / 255) * 100, 100)}%` }}
                  />
                </div>
                <span className="stat-num">{s.base_stat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Detail
