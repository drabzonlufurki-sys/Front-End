import { Link } from 'react-router-dom'

function PokemonCard({ name, image }) {
  return (
    <Link to={`/detail/${name}`} className="pokemon-card-link">
      <div className="pokemon-card">
        <img src={image} alt={name} />
        <h3>{name}</h3>
      </div>
    </Link>
  )
}

export default PokemonCard

