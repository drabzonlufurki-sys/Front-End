import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useApp } from '../src/context/AppContext'

function Detail() {
  const { name } = useParams()
  const navigate = useNavigate()
  const [pokemon, setPokemon] = useState(null)
  const [loading, setLoading] = useState(true)

  const {
    isPokemonFavorite,
    toggleFavoritePokemon,
    activeTeam,
    addPokemonToTeam,
    removePokemonFromTeam
  } = useApp()

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

  const isFav = isPokemonFavorite(pokemon.name)
  const pokemonImage = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default
  const inActiveTeam = activeTeam ? activeTeam.pokemons.some((p) => p.name === pokemon.name) : false
  const activeTeamFull = activeTeam ? activeTeam.pokemons.length >= 6 : true

  return (
    <div className="page detail-page">
      <div className="detail-top-bar">
        <button className="back-btn" onClick={() => navigate(-1)}>← Terug</button>
        <button
          className={`detail-fav-btn ${isFav ? 'is-fav' : ''}`}
          onClick={() => toggleFavoritePokemon({ name: pokemon.name, image: pokemonImage })}
        >
          {isFav ? '❤️ In Favorieten' : '🤍 Voeg toe aan favorieten'}
        </button>
      </div>

      <div className="detail-card">
        <div className="detail-image-wrap">
          <img
            src={pokemonImage}
            alt={pokemon.name}
            className="detail-image"
          />
        </div>

        <div className="detail-info">
          <div className="detail-title-row">
            <h1 className="detail-name">
              #{String(pokemon.id).padStart(3, '0')} {pokemon.name}
            </h1>
          </div>

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

          {/* Quick Team Management in Detail view */}
          {activeTeam && (
            <div className="detail-team-box">
              <span>Actief team: <strong>{activeTeam.name}</strong> ({activeTeam.pokemons.length}/6)</span>
              <button
                className={`detail-team-toggle-btn ${inActiveTeam ? 'in-team' : ''}`}
                onClick={() => {
                  if (inActiveTeam) {
                    removePokemonFromTeam(activeTeam.id, pokemon.name)
                  } else {
                    addPokemonToTeam(activeTeam.id, {
                      name: pokemon.name,
                      sprites: pokemon.sprites,
                      types: pokemon.types
                    })
                  }
                }}
                disabled={activeTeamFull && !inActiveTeam}
              >
                {inActiveTeam ? '✓ Verwijder uit actief team' : '+ Voeg toe aan actief team'}
              </button>
            </div>
          )}

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
