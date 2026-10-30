import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from '../pages/Home'
import List from '../pages/List'
import Detail from '../pages/Detail'
import Teams from '../pages/Teams'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/list" element={<List />} />
          <Route path="/detail/:name" element={<Detail />} />
          <Route path="/teams" element={<Teams />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App

