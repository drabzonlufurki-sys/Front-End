import { NavLink } from 'react-router-dom'

function Navigation() {
  return (
    <nav className="navbar">
      <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
        Home
      </NavLink>
      <NavLink to="/list" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
        Pokémon
      </NavLink>
      <NavLink to="/teams" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
        🏆 Mijn Team
      </NavLink>
    </nav>
  )
}

export default Navigation

