import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

const DEFAULT_TEAMS = [
  { id: 'team-1', name: 'Mijn Eerste Team', pokemons: [], isFavorite: false }
]

export function AppProvider({ children }) {
  // ── Teams State & Persistence ──
  const [teams, setTeams] = useState(() => {
    try {
      const saved = localStorage.getItem('pokemon_teams')
      return saved ? JSON.parse(saved) : DEFAULT_TEAMS
    } catch {
      return DEFAULT_TEAMS
    }
  })

  const [activeTeamId, setActiveTeamId] = useState(() => {
    try {
      const savedId = localStorage.getItem('pokemon_active_team_id')
      if (savedId && teams.some(t => t.id === savedId)) return savedId
      return teams[0]?.id || 'team-1'
    } catch {
      return 'team-1'
    }
  })

  // ── Favorites State & Persistence ──
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('pokemon_favorites')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Save teams whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('pokemon_teams', JSON.stringify(teams))
    } catch (e) {
      console.error('Kon teams niet opslaan in localStorage', e)
    }
  }, [teams])

  // Save active team ID
  useEffect(() => {
    try {
      localStorage.setItem('pokemon_active_team_id', activeTeamId)
    } catch (e) {
      console.error('Kon activeTeamId niet opslaan', e)
    }
  }, [activeTeamId])

  // Save favorites whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('pokemon_favorites', JSON.stringify(favorites))
    } catch (e) {
      console.error('Kon favorieten niet opslaan in localStorage', e)
    }
  }, [favorites])

  // Active Team helper
  const activeTeam = teams.find(t => t.id === activeTeamId) || teams[0]

  // ── Teams Management Functions ──
  function createTeam(name) {
    const trimmed = name.trim()
    if (!trimmed) return null
    const newTeam = {
      id: 'team-' + Date.now(),
      name: trimmed,
      pokemons: [],
      isFavorite: false
    }
    setTeams(prev => [...prev, newTeam])
    setActiveTeamId(newTeam.id)
    return newTeam
  }

  function deleteTeam(id) {
    if (teams.length <= 1) {
      alert('Je moet minimaal 1 team behouden!')
      return false
    }
    const filtered = teams.filter(t => t.id !== id)
    setTeams(filtered)
    if (activeTeamId === id) {
      setActiveTeamId(filtered[0].id)
    }
    return true
  }

  function addPokemonToTeam(teamId, pokemon) {
    setTeams(prev => prev.map(t => {
      if (t.id !== teamId) return t
      if (t.pokemons.length >= 6) return t
      if (t.pokemons.some(p => p.name === pokemon.name)) return t
      return { ...t, pokemons: [...t.pokemons, pokemon] }
    }))
  }

  function removePokemonFromTeam(teamId, pokemonName) {
    setTeams(prev => prev.map(t => {
      if (t.id !== teamId) return t
      return { ...t, pokemons: t.pokemons.filter(p => p.name !== pokemonName) }
    }))
  }

  // ── Favorites Management Functions ──
  function toggleFavoritePokemon(pokemon) {
    setFavorites(prev => {
      const exists = prev.some(p => p.name === pokemon.name)
      if (exists) {
        return prev.filter(p => p.name !== pokemon.name)
      } else {
        return [...prev, pokemon]
      }
    })
  }

  function isPokemonFavorite(pokemonName) {
    return favorites.some(p => p.name === pokemonName)
  }

  function toggleFavoriteTeam(teamId) {
    setTeams(prev => prev.map(t => {
      if (t.id !== teamId) return t
      return { ...t, isFavorite: !t.isFavorite }
    }))
  }

  return (
    <AppContext.Provider
      value={{
        teams,
        activeTeamId,
        setActiveTeamId,
        activeTeam,
        createTeam,
        deleteTeam,
        addPokemonToTeam,
        removePokemonFromTeam,
        favorites,
        toggleFavoritePokemon,
        isPokemonFavorite,
        toggleFavoriteTeam
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp moet binnen een AppProvider worden gebruikt')
  }
  return context
}
