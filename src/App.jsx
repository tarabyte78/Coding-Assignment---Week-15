import { useState } from 'react'
import './App.css'
import '../node_modules/bootstrap/dist/css/bootstrap.css'


import MovieApp from './components/movieApp'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <MovieApp />
    </>
  )
}

export default App
