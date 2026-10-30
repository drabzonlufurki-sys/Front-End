import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../src/context/AppContext'

function Favorites() {
  const {
    favorites,
    toggleFavoritePokemon,
    teams,
    setActiveTeamId,
    toggleFavoriteTeam
  } = useApp()

  const [activeTab, setActiveTab] = useState('pokemon') // 'pokemon' | 'teams'
  const navigate = useNavigate()

  const favoriteTeams = teams.filter((t) => t.isFavorite)

  return (
    <div className="page favorites-page">
      <h1>❤️ Favorieten Beheren</h1>
      <p>Hier vind je een overzicht van al je opgeslagen favoriete Pokémon en favoriete teams.</p>

      {/* Tabs */}
      <div className="fav-tabs">
        <button
          className={`fav-tab-btn ${activeTab === 'pokemon' ? 'active' : ''}`}
          onClick={() => setActiveTab('pokemon')}
        >
          ❤️ Favoriete Pokémon ({favorites.length})
        </button>
        <button
          className={`fav-tab-btn ${activeTab === 'teams' ? 'active' : ''}`}
          onClick={() => setActiveTab('teams')}
        >
          ⭐ Favoriete Teams ({favoriteTeams.length})
        </button>
      </div>

      {/* Pokémon Tab Content */}
      {activeTab === 'pokemon' && (
        <div className="fav-section">
          {favorites.length === 0 ? (
            <div className="empty-favs">
              <span className="empty-icon">💔</span>
              <h3>Je hebt nog geen favoriete Pokémon!</h3>
              <p>Ga naar de Pokémon-lijst en klik op het hartje om Pokémon aan je favorieten toe te voegen.</p>
              <Link to="/list" className="browse-btn">
                Bekijk Pokémon lijst
              </Link>
            </div>
          ) : (
            <div className="pokemon-grid">
              {favorites.map((pokemon) => (
                <div key={pokemon.name} className="pokemon-card fav-card">
                  <button
                    className="fav-card-btn active"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavoritePokemon(pokemon)
                    }}
                    title="Verwijder uit favorieten"
                  >
                    ❤️
                  </button>
                  <img
                    src={pokemon.image || pokemon.sprites?.front_default}
                    alt={pokemon.name}
                    onClick={() => navigate(`/detail/${pokemon.name}`)}
                    className="fav-img-clickable"
                    title="Bekijk details"
                  />
                  <h3>{pokemon.name}</h3>
                  <Link to={`/detail/${pokemon.name}`} className="details-link-small">
                    Details bekijken →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Teams Tab Content */}
      {activeTab === 'teams' && (
        <div className="fav-section">
          {favoriteTeams.length === 0 ? (
            <div className="empty-favs">
              <span className="empty-icon">⭐</span>
              <h3>Nog geen favoriete teams gemarkeerd!</h3>
              <p>Ga naar de Teams-pagina en klik op "☆ Maak favoriet" bij een van je teams.</p>
              <Link to="/teams" className="browse-btn">
                Ga naar Teams Beheer
              </Link>
            </div>
          ) : (
            <div className="fav-teams-grid">
              {favoriteTeams.map((team) => (
                <div key={team.id} className="fav-team-item">
                  <div className="fav-team-header">
                    <h3>⭐ {team.name}</h3>
                    <div className="fav-team-actions">
                      <button
                        className="unstar-btn"
                        onClick={() => toggleFavoriteTeam(team.id)}
                        title="Verwijder team uit favorieten"
                      >
                        Verwijder favoriet
                      </button>
                      <button
                        className="select-team-btn"
                        onClick={() => {
                          setActiveTeamId(team.id)
                          navigate('/teams')
                        }}
                      >
                        Beheren in Teams →
                      </button>
                    </div>
                  </div>
                  <div className="fav-team-sprites">
                    {team.pokemons.length === 0 ? (
                      <p className="no-members-text">Dit team heeft nog geen Pokémon.</p>
                    ) : (
                      team.pokemons.map((p) => (
                        <div key={p.name} className="fav-team-pokemon">
                          <img
                            src={p.sprites?.front_default || p.image}
                            alt={p.name}
                            title={p.name}
                          />
                          <span>{p.name}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Favorites
