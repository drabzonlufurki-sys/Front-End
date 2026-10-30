import { useState, useEffect } from 'react'
import PokemonCard from '../src/components/PokemonCard'

function List() {
  const [pokemons, setPokemons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPokemons() {
      try {
        // Haal een lijst van 20 Pokémon op
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20')
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

  if (loading) return <p className="loading">Pokémon laden... ⏳</p>

  return (
    <div className="page">
      <h1>🎮 Pokémon Lijst</h1>
      <p>Hier zie je alle Pokémon, elk weergegeven via een herbruikbare <code>PokemonCard</code> component.</p>
      <div className="pokemon-grid">
        {pokemons.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            name={pokemon.name}
            image={pokemon.sprites.front_default}
          />
        ))}
      </div>
    </div>
  )
}

export default List
