import { useState, useEffect } from 'react'
import PokemonCard from '../src/components/PokemonCard'
import { useApp } from '../src/context/AppContext'

function List() {
  const [pokemons, setPokemons] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [onlyFavorites, setOnlyFavorites] = useState(false)

  const { isPokemonFavorite } = useApp()

  useEffect(() => {
    async function fetchPokemons() {
      try {
        // Haal een lijst van Pokémon op (eerste 100 voor een rijke lijst)
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100')
        const data = await res.json()

        // Haal voor elke Pokémon de detaildata op (inclusief afbeelding)
        const details = await Promise.all(
          data.results.map((p) => fetch(p.url).then((r) => r.json()))
        )

        setPokemons(details)
      } catch (err) {
        console.error('Fout bij ophalen Pokémon:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPokemons()
  }, [])

  const filtered = pokemons.filter((pokemon) => {
    const matchesSearch = pokemon.name.toLowerCase().includes(search.toLowerCase())
    const matchesFav = onlyFavorites ? isPokemonFavorite(pokemon.name) : true
    return matchesSearch && matchesFav
  })

  return (
    <div className="page list-page">
      <h1>🎮 Pokémon Lijst</h1>
      <p>Hier zie je alle Pokémon. Klik op het hartje om toe te voegen aan je favorieten of klik op een kaart voor details.</p>

      {/* Filter and Search controls */}
      <div className="list-controls">
        <input
          type="text"
          className="search-input"
          placeholder="Zoek Pokémon op naam..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className={`filter-fav-btn ${onlyFavorites ? 'active' : ''}`}
          onClick={() => setOnlyFavorites((prev) => !prev)}
        >
          {onlyFavorites ? '❤️ Toon alles' : '🤍 Alleen favorieten tonen'}
        </button>
      </div>

      {loading ? (
        <p className="loading">Pokémon laden... ⏳</p>
      ) : filtered.length === 0 ? (
        <div className="no-results-box">
          <p>Geen Pokémon gevonden die voldoen aan je filters.</p>
        </div>
      ) : (
        <div className="pokemon-grid">
          {filtered.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              name={pokemon.name}
              image={pokemon.sprites.front_default}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default List
