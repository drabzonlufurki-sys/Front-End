import { Link } from 'react-router-dom'
import { useApp } from '../src/context/AppContext'

function Home() {
  const { teams, activeTeam, favorites } = useApp()

  const favoriteTeamsCount = teams.filter((t) => t.isFavorite).length

  return (
    <div className="page home-page">
      <div className="home-hero">
        <h1>⚡ Pokémon Trainer Hub</h1>
        <p className="home-subtitle">
          Welkom bij jouw centrale plek voor het ontdekken van Pokémon, het samenstellen van krachtige teams en het beheren van je favorieten.
        </p>
      </div>

      {/* Hub Metrics */}
      <div className="home-metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">🏆</div>
          <div className="metric-details">
            <h3>{teams.length}</h3>
            <span>Aangemaakte Teams</span>
          </div>
          <Link to="/teams" className="metric-link">Beheer teams →</Link>
        </div>

        <div className="metric-card">
          <div className="metric-icon">❤️</div>
          <div className="metric-details">
            <h3>{favorites.length}</h3>
            <span>Favoriete Pokémon</span>
          </div>
          <Link to="/favorites" className="metric-link">Bekijk favorieten →</Link>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⭐</div>
          <div className="metric-details">
            <h3>{favoriteTeamsCount}</h3>
            <span>Favoriete Teams</span>
          </div>
          <Link to="/favorites" className="metric-link">Bekijk teams →</Link>
        </div>
      </div>

      {/* Active Team Snapshot */}
      {activeTeam && (
        <div className="home-active-team-preview">
          <div className="preview-header">
            <div>
              <span className="preview-tag">Actief team</span>
              <h2>{activeTeam.name}</h2>
            </div>
            <Link to="/teams" className="manage-active-btn">
              Aanpassen in Team Builder
            </Link>
          </div>

          <div className="preview-slots">
            {activeTeam.pokemons.length === 0 ? (
              <p className="empty-preview-text">
                Je actieve team is nog leeg. Ga naar <Link to="/teams">Teams</Link> of <Link to="/list">Pokémon</Link> om teamleden toe te voegen!
              </p>
            ) : (
              activeTeam.pokemons.map((pokemon) => (
                <div key={pokemon.name} className="preview-slot-item">
                  <img
                    src={pokemon.sprites?.front_default || pokemon.image}
                    alt={pokemon.name}
                  />
                  <span>{pokemon.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Feature Highlights */}
      <div className="home-features-grid">
        <div className="feature-box">
          <h3>🎮 Pokémon Ontdekken</h3>
          <p>Bekijk de lijst met Pokémon, inspecteer eigenschappen, types, gewichten en statistieken in de detailweergave.</p>
          <Link to="/list" className="feature-btn">Naar de lijst</Link>
        </div>

        <div className="feature-box">
          <h3>👥 Meerdere Teams</h3>
          <p>Stel verschillende teams samen voor verschillende strategieën. Voeg Pokémon toe, wissel tussen teams en verwijder teams.</p>
          <Link to="/teams" className="feature-btn">Teams openen</Link>
        </div>

        <div className="feature-box">
          <h3>💖 Favorieten Opslag</h3>
          <p>Markeer je meest geliefde Pokémon en teams met een hartje of ster. Alles wordt automatisch bewaard in localStorage.</p>
          <Link to="/favorites" className="feature-btn">Favorieten openen</Link>
        </div>
      </div>
    </div>
  )
}

export default Home
