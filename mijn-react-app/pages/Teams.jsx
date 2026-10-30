import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../src/context/AppContext'

const MAX_TEAM = 6

function Teams() {
  const {
    teams,
    activeTeamId,
    setActiveTeamId,
    activeTeam,
    createTeam,
    deleteTeam,
    addPokemonToTeam,
    removePokemonFromTeam,
    toggleFavoriteTeam
  } = useApp()

  const [allPokemons, setAllPokemons] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [newTeamName, setNewTeamName] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
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

  function handleCreateTeam(e) {
    e.preventDefault()
    if (!newTeamName.trim()) return
    createTeam(newTeamName)
    setNewTeamName('')
    setShowCreateForm(false)
  }

  function handleDeleteActiveTeam() {
    if (!activeTeam) return
    const confirmed = window.confirm(`Weet je zeker dat je "${activeTeam.name}" wilt verwijderen?`)
    if (confirmed) {
      deleteTeam(activeTeam.id)
    }
  }

  const currentPokemons = activeTeam ? activeTeam.pokemons : []
  const teamFull = currentPokemons.length >= MAX_TEAM

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
      <div className="teams-header">
        <div>
          <h1>🏆 Teams Beheer</h1>
          <p>Maak meerdere teams aan, bewaar ze automatisch en beheer je Pokémon per team (maximaal {MAX_TEAM}).</p>
        </div>
      </div>

      {/* Team Tabs / Selector */}
      <div className="teams-bar">
        <div className="teams-tabs">
          {teams.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTeamId(t.id)}
              className={`team-tab-btn ${t.id === activeTeamId ? 'active' : ''}`}
            >
              {t.isFavorite ? '⭐ ' : ''}{t.name} ({t.pokemons.length}/{MAX_TEAM})
            </button>
          ))}
          <button
            className="new-team-btn"
            onClick={() => setShowCreateForm((prev) => !prev)}
            title="Nieuw team toevoegen"
          >
            {showCreateForm ? 'Annuleren' : '➕ Nieuw Team'}
          </button>
        </div>
      </div>

      {/* Create Team Form Modal/Inline */}
      {showCreateForm && (
        <form className="create-team-form" onSubmit={handleCreateTeam}>
          <input
            type="text"
            className="team-name-input"
            placeholder="Bijv. Vuur Kracht of Kanto Kampioenen..."
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            autoFocus
          />
          <button type="submit" className="save-team-btn" disabled={!newTeamName.trim()}>
            Opslaan
          </button>
        </form>
      )}

      {/* Active Team Box */}
      {activeTeam && (
        <div className="active-team-card">
          <div className="active-team-header">
            <div>
              <h2>
                {activeTeam.name}
                <span className="team-count-badge">
                  {currentPokemons.length} / {MAX_TEAM} Pokémon
                </span>
              </h2>
            </div>
            <div className="active-team-actions">
              <button
                className={`fav-team-btn ${activeTeam.isFavorite ? 'favorited' : ''}`}
                onClick={() => toggleFavoriteTeam(activeTeam.id)}
                title="Markeer team als favoriet"
              >
                {activeTeam.isFavorite ? '⭐ Favoriet team' : '☆ Maak favoriet'}
              </button>
              {teams.length > 1 && (
                <button
                  className="delete-team-btn"
                  onClick={handleDeleteActiveTeam}
                  title="Verwijder dit team"
                >
                  🗑️ Verwijder Team
                </button>
              )}
            </div>
          </div>

          {/* Team slots */}
          <div className="team-slots">
            {Array.from({ length: MAX_TEAM }).map((_, i) => {
              const member = currentPokemons[i]
              return member ? (
                <div key={member.name} className="team-slot filled">
                  <img src={member.sprites?.front_default || member.sprites?.other?.['official-artwork']?.front_default} alt={member.name} />
                  <span className="team-slot-name">{member.name}</span>
                  <button
                    className="remove-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      removePokemonFromTeam(activeTeam.id, member.name)
                    }}
                    title="Verwijder uit team"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div key={i} className="team-slot empty">
                  <span>?</span>
                  <small>Leeg slot</small>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Pokémon picker */}
      <div className="picker-section">
        <h2>Kies Pokémon voor {activeTeam ? `"${activeTeam.name}"` : 'je team'}</h2>
        <input
          className="search-input"
          type="text"
          placeholder="Zoek Pokémon om toe te voegen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <p className="loading">Pokémon laden... ⏳</p>
        ) : (
          <div className="pokemon-grid">
            {filtered.map((pokemon) => {
              const inTeam = !!currentPokemons.find((p) => p.name === pokemon.name)
              return (
                <div
                  key={pokemon.name}
                  className={`pokemon-card picker-card ${inTeam ? 'in-team' : ''} ${teamFull && !inTeam ? 'disabled' : ''}`}
                >
                  <img
                    src={pokemon.sprites.front_default}
                    alt={pokemon.name}
                    onClick={() => navigate(`/detail/${pokemon.name}`)}
                    title="Klik om details te bekijken"
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
                    onClick={() => {
                      if (!activeTeam) return
                      if (inTeam) {
                        removePokemonFromTeam(activeTeam.id, pokemon.name)
                      } else {
                        addPokemonToTeam(activeTeam.id, pokemon)
                      }
                    }}
                    disabled={teamFull && !inTeam}
                  >
                    {inTeam ? '✓ In team (verwijder)' : '+ Toevoegen'}
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
