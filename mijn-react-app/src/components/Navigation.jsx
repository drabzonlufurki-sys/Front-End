import { NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext'

function Navigation() {
  const { favorites } = useApp()

  return (
    <nav className="navbar">
      <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
        Home
      </NavLink>
      <NavLink to="/list" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
        Pokémon
      </NavLink>
      <NavLink to="/teams" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
        🏆 Teams
      </NavLink>
      <NavLink to="/favorites" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
        ❤️ Favorieten {favorites.length > 0 && <span className="nav-badge">{favorites.length}</span>}
      </NavLink>
    </nav>
  )
}

export default Navigation
