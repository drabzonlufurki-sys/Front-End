import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const MAX_TEAM = 6

function Teams() {
  const [allPokemons, setAllPokemons] = useState([])
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchAll() {
      try {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
        const data = await res.json()
        const details = await Promise.all(
          data.results.map((p) => fetch(p.url).then((r) => r.json()))
        )
        setAllPokemons(details)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  function addToTeam(pokemon) {
    if (team.length >= MAX_TEAM) return
    if (team.find((p) => p.name === pokemon.name)) return
    setTeam((prev) => [...prev, pokemon])
  }

  function removeFromTeam(name) {
    setTeam((prev) => prev.filter((p) => p.name !== name))
  }

  const typeColors = {
    fire: '#F08030', water: '#6890F0', grass: '#78C850', electric: '#F8D030',
    psychic: '#F85888', ice: '#98D8D8', dragon: '#7038F8', dark: '#705848',
    fairy: '#EE99AC', normal: '#A8A878', fighting: '#C03028', flying: '#A890F0',
    poison: '#A040A0', ground: '#E0C068', rock: '#B8A038', bug: '#A8B820',
    ghost: '#705898', steel: '#B8B8D0',
  }

  const filtered = allPokemons.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page teams-page">
      <h1>🏆 Mijn Team</h1>
      <p>Stel je eigen Pokémon-team samen. Maximaal {MAX_TEAM} Pokémon.</p>

      {/* Team slots */}
      <div className="team-slots">
        {Array.from({ length: MAX_TEAM }).map((_, i) => {
          const member = team[i]
          return member ? (
            <div key={member.name} className="team-slot filled">
              <img src={member.sprites.front_default} alt={member.name} />
              <span className="team-slot-name">{member.name}</span>
              <button
                className="remove-btn"
                onClick={(e) => { e.stopPropagation(); removeFromTeam(member.name) }}
                title="Verwijder uit team"
              >✕</button>
            </div>
          ) : (
            <div key={i} className="team-slot empty">
              <span>?</span>
            </div>
          )
        })}
      </div>

      {/* Pokémon picker */}
      <div className="picker-section">
        <h2>Kies een Pokémon</h2>
        <input
          className="search-input"
          type="text"
          placeholder="Zoek Pokémon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <p className="loading">Pokémon laden... ⏳</p>
        ) : (
          <div className="pokemon-grid">
            {filtered.map((pokemon) => {
              const inTeam = !!team.find((p) => p.name === pokemon.name)
              const teamFull = team.length >= MAX_TEAM
              return (
                <div
                  key={pokemon.name}
                  className={`pokemon-card picker-card ${inTeam ? 'in-team' : ''} ${teamFull && !inTeam ? 'disabled' : ''}`}
                >
                  <img
                    src={pokemon.sprites.front_default}
                    alt={pokemon.name}
                    onClick={() => navigate(`/detail/${pokemon.name}`)}
                    title="Bekijk details"
                    className="picker-img"
                  />
                  <div className="picker-types">
                    {pokemon.types.map((t) => (
                      <span
                        key={t.type.name}
                        className="type-badge small"
                        style={{ background: typeColors[t.type.name] || '#777' }}
                      >
                        {t.type.name}
                      </span>
                    ))}
                  </div>
                  <h3>{pokemon.name}</h3>
                  <button
                    className={`add-btn ${inTeam ? 'added' : ''}`}
                    onClick={() => inTeam ? removeFromTeam(pokemon.name) : addToTeam(pokemon)}
                    disabled={teamFull && !inTeam}
                  >
                    {inTeam ? '✓ In team' : '+ Toevoegen'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Teams
