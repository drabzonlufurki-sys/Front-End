import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

function PokemonCard({ name, image }) {
  const { isPokemonFavorite, toggleFavoritePokemon } = useApp()
  const isFav = isPokemonFavorite(name)

  return (
    <div className="pokemon-card-wrapper">
      <button
        className={`fav-heart-btn ${isFav ? 'is-fav' : ''}`}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          toggleFavoritePokemon({ name, image })
        }}
        title={isFav ? 'Verwijder uit favorieten' : 'Toevoegen aan favorieten'}
      >
        {isFav ? '❤️' : '🤍'}
      </button>
      <Link to={`/detail/${name}`} className="pokemon-card-link">
        <div className="pokemon-card">
          <img src={image} alt={name} />
          <h3>{name}</h3>
        </div>
      </Link>
    </div>
  )
}

export default PokemonCard
